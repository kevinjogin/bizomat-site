using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using OpenSketch.Sw.Core;

namespace OpenSketch.Sw.Bridge
{
    /// <summary>Bridge protocol 2 constants (docs/BRIDGE-PROTOCOL.md). The KEVOS names in it are the protocol's own ids.</summary>
    public static class Protocol
    {
        public const string Version = "2.0";
        public const int MaxFrame = 4 * 1024 * 1024;
        public const int PingMs = 10000;
        public const int MissedPings = 3;
        public const int UiProbeMs = 2000;

        /// <summary>The pipe a Windows user's companion listens on: one per user, so two users on one PC never meet.</summary>
        public static string PipeName(string userSid) => "KEVOS.Bridge." + (userSid ?? "user");

        /// <summary>The 21 add-in ops a command may name (exactly the v1 ops; Commands.Run handles each).</summary>
        public static readonly HashSet<string> Ops = new HashSet<string>
        {
            "ping", "status", "read", "read_drawing", "geometry", "screenshot", "export", "open_document", "create_document",
            "save", "import", "add_features", "batch", "insert_component", "add_mate", "set_parameter", "set_equation",
            "delete", "undo", "create_drawing", "edit_drawing"
        };
    }

    /// <summary>Sortable unique ids: prefix + 26 Crockford base32 characters (48-bit time in ms + 80 random bits).</summary>
    public static class Ids
    {
        const string Crockford = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

        public static string New(string prefix)
        {
            var ms = (ulong)DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var rnd = B64.Random(10);
            // 128 bits: 48 time + 80 random, written as 26 base32 digits (the top 2 bits are zero)
            var bits = new byte[16];
            for (var i = 0; i < 6; i++) bits[i] = (byte)(ms >> (8 * (5 - i)));
            Buffer.BlockCopy(rnd, 0, bits, 6, 10);
            var sb = new StringBuilder(prefix.Length + 27).Append(prefix).Append('_');
            for (var k = 25; k >= 0; k--)
            {
                // the 5-bit group k counted from the least significant end
                var bitIndex = k * 5;
                var v = 0;
                for (var b = 0; b < 5; b++)
                {
                    var bi = bitIndex + 4 - b;          // most significant bit of the group first
                    if (bi >= 128) continue;
                    var byteIdx = 15 - bi / 8;
                    var bit = (bits[byteIdx] >> (bi % 8)) & 1;
                    v = (v << 1) | bit;
                }
                sb.Append(Crockford[v]);
            }
            return sb.ToString();
        }

        public static bool Valid(string id, string prefix)
        {
            if (id == null || !id.StartsWith(prefix + "_") || id.Length != prefix.Length + 27) return false;
            for (var i = prefix.Length + 1; i < id.Length; i++)
                if (Crockford.IndexOf(id[i]) < 0) return false;
            return true;
        }
    }

    public static class Times
    {
        const string Format = "yyyy-MM-dd'T'HH:mm:ss.fff'Z'";

        public static string Iso(DateTime utc) => utc.ToUniversalTime().ToString(Format, CultureInfo.InvariantCulture);

        public static string Now() => Iso(DateTime.UtcNow);

        public static DateTime Parse(string s)
        {
            if (s == null) throw new FormatException("no time");
            var t = s.Replace("Z", "");
            var dot = t.IndexOf('.');
            if (dot > 0 && t.Length - dot - 1 > 3) t = t.Substring(0, dot + 4);   // keep milliseconds
            return DateTime.SpecifyKind(DateTime.Parse(t, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal), DateTimeKind.Utc);
        }

        public static bool TryParse(string s, out DateTime utc)
        {
            try
            {
                utc = Parse(s);
                return true;
            }
            catch (FormatException)
            {
                utc = default(DateTime);
                return false;
            }
        }

        public static long UnixSeconds(DateTime utc) => (long)(utc - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds;
    }

    /// <summary>Pipe frames: a 4-byte little-endian length, then that many bytes of UTF-8 JSON (at most 4 MiB).</summary>
    public static class Frames
    {
        public static void Write(Stream s, Dictionary<string, object> msg)
        {
            var body = Encoding.UTF8.GetBytes(Json.Write(msg));
            if (body.Length > Protocol.MaxFrame) throw new InvalidDataException("A message is too big for the pipe (4 MiB at most).");
            var head = BitConverter.GetBytes(body.Length);
            if (!BitConverter.IsLittleEndian) Array.Reverse(head);
            var all = new byte[4 + body.Length];
            Buffer.BlockCopy(head, 0, all, 0, 4);
            Buffer.BlockCopy(body, 0, all, 4, body.Length);
            s.Write(all, 0, all.Length);
            s.Flush();
        }

        /// <summary>The next message, or null at the end of the stream. Throws InvalidDataException for a bad frame.</summary>
        public static Dictionary<string, object> Read(Stream s)
        {
            var head = new byte[4];
            if (!ReadAll(s, head, 4, true)) return null;
            if (!BitConverter.IsLittleEndian) Array.Reverse(head);
            var n = BitConverter.ToInt32(head, 0);
            if (n <= 0 || n > Protocol.MaxFrame) throw new InvalidDataException("Bad frame length " + n + ".");
            var body = new byte[n];
            if (!ReadAll(s, body, n, false)) throw new EndOfStreamException("The pipe closed inside a message.");
            var o = Json.ParseObject(Encoding.UTF8.GetString(body));
            if (o == null) throw new InvalidDataException("A frame must hold a JSON object.");
            return o;
        }

        static bool ReadAll(Stream s, byte[] buf, int n, bool eofOk)
        {
            var got = 0;
            while (got < n)
            {
                var k = s.Read(buf, got, n - got);
                if (k <= 0)
                {
                    if (got == 0 && eofOk) return false;
                    return false;
                }
                got += k;
            }
            return true;
        }
    }

    /// <summary>Message helpers: every message carries v, type, msg_id and sent_at.</summary>
    public static class Msg
    {
        public static Dictionary<string, object> New(string type, params object[] kv)
        {
            var o = J.O(kv);
            o["v"] = Protocol.Version;
            o["type"] = type;
            o["msg_id"] = Ids.New("msg");
            o["sent_at"] = Times.Now();
            return o;
        }

        public static Dictionary<string, object> Error(string code, string category, string message, bool retryable, string hop,
                                                       Dictionary<string, object> detail = null, bool partial = false)
        {
            var e = J.O("code", code, "category", category, "message", message ?? "", "retryable", retryable, "hop", hop);
            if (detail != null) e["detail"] = detail;
            if (partial) e["partial"] = true;
            return e;
        }
    }
}
