using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using OpenSketch.Sw.Core;

namespace OpenSketch.Sw.Bridge
{
    /// <summary>base64url without padding (RFC 7515), SHA-256 and random bytes, the same on .NET Framework 4.8 and .NET 8.</summary>
    public static class B64
    {
        public static string Url(byte[] data) => Convert.ToBase64String(data).TrimEnd('=').Replace('+', '-').Replace('/', '_');

        public static byte[] UrlDecode(string s)
        {
            if (s == null) throw new FormatException("no base64url");
            foreach (var c in s)
                if (!(c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z' || c >= '0' && c <= '9' || c == '-' || c == '_'))
                    throw new FormatException("not base64url");
            var t = s.Replace('-', '+').Replace('_', '/');
            switch (t.Length % 4)
            {
                case 2: t += "=="; break;
                case 3: t += "="; break;
                case 1: throw new FormatException("bad base64url length");
            }
            return Convert.FromBase64String(t);
        }

        public static string Sha256Hex(byte[] data)
        {
            using (var h = SHA256.Create())
            {
                var d = h.ComputeHash(data ?? new byte[0]);
                var sb = new StringBuilder(64);
                foreach (var b in d) sb.Append(b.ToString("x2"));
                return sb.ToString();
            }
        }

        public static string Sha256Tagged(byte[] data) => "sha256:" + Sha256Hex(data);

        public static byte[] Random(int n)
        {
            var b = new byte[n];
            using (var r = RandomNumberGenerator.Create()) r.GetBytes(b);
            return b;
        }
    }

    /// <summary>A computer's own key: signs device proofs. The private key never leaves the computer (on Windows it is a
    /// non-exportable CNG key, see the companion); tests use <see cref="SoftwareKey"/>.</summary>
    public interface IDeviceKey
    {
        Dictionary<string, object> PublicJwk { get; }
        /// <summary>ES256 signature (IEEE P1363 r||s, 64 bytes) over data.</summary>
        byte[] Sign(byte[] data);
    }

    /// <summary>An in-memory P-256 key (tests, and the signature checks).</summary>
    public sealed class SoftwareKey : IDeviceKey, IDisposable
    {
        readonly ECDsa key;

        public SoftwareKey()
        {
            key = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        }

        public SoftwareKey(ECDsa existing)
        {
            key = existing;
        }

        public Dictionary<string, object> PublicJwk => Jwk.FromParameters(key.ExportParameters(false));

        public byte[] Sign(byte[] data) => key.SignData(data, HashAlgorithmName.SHA256);

        public void Dispose() => key.Dispose();
    }

    public static class Jwk
    {
        public static Dictionary<string, object> FromParameters(ECParameters p) =>
            J.O("kty", "EC", "crv", "P-256", "x", B64.Url(Pad32(p.Q.X)), "y", B64.Url(Pad32(p.Q.Y)));

        static byte[] Pad32(byte[] v)
        {
            if (v.Length == 32) return v;
            var o = new byte[32];
            Buffer.BlockCopy(v, 0, o, 32 - v.Length, v.Length);
            return o;
        }

        /// <summary>A verifier for an EC P-256 public JWK; refuses anything else.</summary>
        public static ECDsa ToVerifier(Dictionary<string, object> jwk)
        {
            if (J.Str(jwk, "kty") != "EC" || J.Str(jwk, "crv") != "P-256") throw new CryptographicException("The key must be an EC P-256 JWK.");
            var x = B64.UrlDecode(J.Str(jwk, "x"));
            var y = B64.UrlDecode(J.Str(jwk, "y"));
            if (x.Length != 32 || y.Length != 32) throw new CryptographicException("The key's x and y must be 32 bytes.");
            var p = new ECParameters { Curve = ECCurve.NamedCurves.nistP256, Q = new ECPoint { X = x, Y = y } };
            p.Validate();
            return ECDsa.Create(p);
        }

        /// <summary>RFC 7638 thumbprint.</summary>
        public static string Thumbprint(Dictionary<string, object> jwk)
        {
            var canon = "{\"crv\":\"" + J.Str(jwk, "crv") + "\",\"kty\":\"" + J.Str(jwk, "kty") + "\",\"x\":\"" + J.Str(jwk, "x") +
                        "\",\"y\":\"" + J.Str(jwk, "y") + "\"}";
            using (var h = SHA256.Create()) return B64.Url(h.ComputeHash(Encoding.UTF8.GetBytes(canon)));
        }
    }

    /// <summary>Compact JWS with ES256 only (RFC 7515/7518).</summary>
    public static class Jws
    {
        public static string Sign(IDeviceKey key, Dictionary<string, object> header, string payloadJson)
        {
            var input = B64.Url(Encoding.UTF8.GetBytes(Json.Write(header))) + "." + B64.Url(Encoding.UTF8.GetBytes(payloadJson));
            return input + "." + B64.Url(key.Sign(Encoding.ASCII.GetBytes(input)));
        }

        /// <summary>Header and payload of a compact JWS, without checking the signature.</summary>
        public static void Parse(string compact, out Dictionary<string, object> header, out string payloadJson)
        {
            if (compact == null || compact.Length > 8 * 1024 * 1024) throw new FormatException("not a JWS");
            var parts = compact.Split('.');
            if (parts.Length != 3) throw new FormatException("not a compact JWS");
            header = Json.ParseObject(Encoding.UTF8.GetString(B64.UrlDecode(parts[0])));
            payloadJson = Encoding.UTF8.GetString(B64.UrlDecode(parts[1]));
        }

        /// <summary>Checks an ES256 signature; returns the payload JSON or throws CryptographicException.</summary>
        public static string Verify(string compact, ECDsa verifier, out Dictionary<string, object> header)
        {
            Parse(compact, out header, out var payload);
            if (J.Str(header, "alg") != "ES256") throw new CryptographicException("Only ES256 is accepted.");
            var parts = compact.Split('.');
            var sig = B64.UrlDecode(parts[2]);
            if (sig.Length != 64) throw new CryptographicException("Bad signature length.");
            var input = Encoding.ASCII.GetBytes(parts[0] + "." + parts[1]);
            if (!verifier.VerifyData(input, sig, HashAlgorithmName.SHA256)) throw new CryptographicException("The signature does not verify.");
            return payload;
        }
    }
}
