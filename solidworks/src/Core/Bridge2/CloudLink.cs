using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using OpenSketch.Sw.Core;

namespace OpenSketch.Sw.Bridge
{
    /// <summary>This computer's registration (no secrets: the private key stays in the key store).</summary>
    public sealed class DeviceConfig
    {
        public string GatewayUrl;
        public string DeviceId;
        public string DeviceName;
        public string Account;
        public Dictionary<string, object> GatewayJwk;
        public string PairedAt;
        public bool Revoked;

        public bool Paired => !string.IsNullOrEmpty(DeviceId) && GatewayJwk != null && !Revoked;

        public static DeviceConfig Load(string path)
        {
            if (!File.Exists(path)) return new DeviceConfig();
            try
            {
                var o = Json.ParseObject(File.ReadAllText(path));
                return new DeviceConfig
                {
                    GatewayUrl = J.Str(o, "gateway_url"), DeviceId = J.Str(o, "device_id"), DeviceName = J.Str(o, "device_name"),
                    Account = J.Str(o, "account"), GatewayJwk = J.Obj(o, "gateway_jwk"), PairedAt = J.Str(o, "paired_at"),
                    Revoked = J.Bool(o, "revoked")
                };
            }
            catch (Exception)
            {
                return new DeviceConfig();
            }
        }

        public void Save(string path)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            var tmp = path + ".tmp";
            File.WriteAllText(tmp, Json.Write(J.O("gateway_url", GatewayUrl, "device_id", DeviceId, "device_name", DeviceName, "account", Account,
                                                  "gateway_jwk", GatewayJwk, "paired_at", PairedAt, "revoked", Revoked)));
            if (File.Exists(path)) File.Delete(path);
            File.Move(tmp, path);
        }
    }

    public sealed class HttpReply
    {
        public int Status;
        public byte[] Body = new byte[0];
        public Dictionary<string, object> Json;
        public string ErrorCode => J.Str(J.Obj(Json, "error"), "code");
        public string ErrorMessage => J.Str(J.Obj(Json, "error"), "message") ?? J.Str(Json, "error") ?? ("HTTP " + Status);
    }

    /// <summary>
    /// The companion's signed HTTPS link to the KEVOS gateway (devicebridge.py). Every request carries a device proof:
    /// a JWS by this computer's key over the method, path and query, the time, a one-time id and the body's SHA-256,
    /// so no password, token or key is ever sent. The server's clock (KEVOS-Server-Time) corrects ours.
    /// </summary>
    public sealed class CloudLink : IDisposable
    {
        readonly HttpClient http;
        readonly IDeviceKey key;
        readonly Action<string> log;
        public string Gateway { get; }
        public string Kid;
        long offsetMs;

        public CloudLink(string gateway, IDeviceKey key, string kid, Action<string> log, HttpMessageHandler handler = null)
        {
            Gateway = (gateway ?? "").Trim().TrimEnd('/');
            this.key = key;
            Kid = kid;
            this.log = log ?? (_ => { });
            http = new HttpClient(handler ?? BridgeClient.DefaultHandler(), true) { Timeout = Timeout.InfiniteTimeSpan };
            http.DefaultRequestHeaders.UserAgent.ParseAdd("KEVOS-Companion/2");
        }

        public DateTime Now => DateTime.UtcNow.AddMilliseconds(Interlocked.Read(ref offsetMs));

        public string Proof(string method, string pathQs, byte[] body)
        {
            var claims = J.O("htm", method, "htu", pathQs, "iat", Times.UnixSeconds(Now), "jti", B64.Url(B64.Random(16)), "bh", B64.Sha256Hex(body));
            return "KEVOS-Device " + Jws.Sign(key, J.O("alg", "ES256", "typ", "kevos-proof", "kid", Kid), Json.Write(claims));
        }

        public HttpReply Send(string method, string pathQs, byte[] body, string contentType, TimeSpan timeout, CancellationToken stop = default(CancellationToken))
        {
            if (!Gateway.StartsWith("https://", StringComparison.OrdinalIgnoreCase) && !IsLoopback(Gateway))
                throw new IOException("The KEVOS gateway address must start with https:// (plain http only on this computer).");
            body = body ?? new byte[0];
            using (var cts = CancellationTokenSource.CreateLinkedTokenSource(stop))
            using (var req = new HttpRequestMessage(new HttpMethod(method), Gateway + pathQs))
            {
                cts.CancelAfter(timeout);
                req.Headers.TryAddWithoutValidation("Authorization", Proof(method, pathQs, body));
                if (method != "GET")
                {
                    req.Content = new ByteArrayContent(body);
                    req.Content.Headers.TryAddWithoutValidation("Content-Type", contentType ?? "application/json");
                }
                HttpResponseMessage r;
                try
                {
                    r = http.SendAsync(req, HttpCompletionOption.ResponseContentRead, cts.Token).GetAwaiter().GetResult();
                }
                catch (OperationCanceledException) when (!stop.IsCancellationRequested)
                {
                    throw new IOException(method + " " + pathQs.Split('?')[0] + " timed out after " + (int)timeout.TotalSeconds + " s");
                }
                using (r)
                {
                    if (r.Headers.TryGetValues("KEVOS-Server-Time", out var vals))
                        foreach (var v in vals)
                            if (Times.TryParse(v, out var server))
                                Interlocked.Exchange(ref offsetMs, (long)(server - DateTime.UtcNow).TotalMilliseconds);
                    var reply = new HttpReply { Status = (int)r.StatusCode, Body = r.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult() };
                    var ct = r.Content.Headers.ContentType?.MediaType ?? "";
                    if (ct.Contains("json") && reply.Body.Length > 0)
                    {
                        try
                        {
                            reply.Json = Json.ParseObject(Encoding.UTF8.GetString(reply.Body));
                        }
                        catch (Exception)
                        {
                        }
                    }
                    return reply;
                }
            }
        }

        public static bool IsLoopback(string url) =>
            url.StartsWith("http://127.0.0.1", StringComparison.OrdinalIgnoreCase) || url.StartsWith("http://localhost", StringComparison.OrdinalIgnoreCase) ||
            url.StartsWith("http://[::1]", StringComparison.OrdinalIgnoreCase);

        public HttpReply PostJson(string path, Dictionary<string, object> body, int timeoutS = 60, CancellationToken stop = default(CancellationToken)) =>
            Send("POST", path, Encoding.UTF8.GetBytes(Json.Write(body ?? new Dictionary<string, object>())), "application/json", TimeSpan.FromSeconds(timeoutS), stop);

        public HttpReply Get(string pathQs, int timeoutS = 60, CancellationToken stop = default(CancellationToken)) =>
            Send("GET", pathQs, null, null, TimeSpan.FromSeconds(timeoutS), stop);

        /// <summary>Pairing step 1 (no proof needed, but signing it costs nothing).</summary>
        public HttpReply PairStart(string name, string machine, string os, string version) =>
            PostJson("/v2/devices/pair/start", J.O("public_jwk", key.PublicJwk, "name", name, "machine", machine, "os", os, "companion_version", version));

        public void Dispose() => http.Dispose();
    }
}
