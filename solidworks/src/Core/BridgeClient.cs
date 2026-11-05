using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;

namespace OpenSketch.Sw.Core
{
    /// <summary>What a command can do besides returning its result: send files up, fetch files down.</summary>
    public interface ICommandIO
    {
        void Upload(string name, byte[] data);
        byte[] Download(string blobName);
        string CommandId { get; }
    }

    /// <summary>
    /// The add-in's side of the link (swbridge.py on the server): hello with the key, then long-poll for commands,
    /// run each one through <see cref="Execute"/> (the host makes that run on SOLIDWORKS' own thread) and post the
    /// result. Only outgoing HTTPS, through the system proxy, so it works behind a company firewall.
    /// </summary>
    public sealed class BridgeClient
    {
        public delegate Dictionary<string, object> Executor(string op, Dictionary<string, object> args, ICommandIO io);

        readonly string server;
        readonly string key;
        readonly HttpClient http;
        readonly Executor execute;
        readonly Action<string> log;
        readonly Dictionary<string, object> hello;
        string session;
        int wait = 25;

        public string State { get; private set; } = "Not connected";
        public bool Connected { get; private set; }
        public event Action<string, bool> StateChanged;
        public int Commands { get; private set; }

        public BridgeClient(string server, string key, Dictionary<string, object> hello, Executor execute, Action<string> log,
                            HttpMessageHandler handler = null)
        {
            this.server = (server ?? "").Trim().TrimEnd('/');
            this.key = (key ?? "").Trim();
            this.hello = hello;
            this.execute = execute;
            this.log = log ?? (_ => { });
            http = new HttpClient(handler ?? DefaultHandler(), true) { Timeout = TimeSpan.FromSeconds(120) };
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", this.key);
            http.DefaultRequestHeaders.UserAgent.ParseAdd("OpenSketch-SOLIDWORKS/" + (J.Str(hello, "version") ?? "0"));
        }

        public static HttpMessageHandler DefaultHandler()
        {
            var h = new HttpClientHandler();
            try
            {
                // the company proxy (and its sign-in) the way Windows web browsers use it
                h.Proxy = WebRequest.GetSystemWebProxy();
                if (h.Proxy != null) h.Proxy.Credentials = CredentialCache.DefaultCredentials;
                h.UseProxy = true;
                h.DefaultProxyCredentials = CredentialCache.DefaultCredentials;
            }
            catch (Exception)
            {
            }
            h.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
            return h;
        }

        void Set(string state, bool connected)
        {
            State = state;
            Connected = connected;
            try
            {
                StateChanged?.Invoke(state, connected);
            }
            catch (Exception)
            {
            }
        }

        /// <summary>Runs until cancelled or until the key is refused or another SOLIDWORKS takes over.</summary>
        public void Run(CancellationToken stop)
        {
            if (!server.StartsWith("http://", StringComparison.OrdinalIgnoreCase) && !server.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            {
                Set("The server address must start with https://", false);
                return;
            }
            if (!key.StartsWith("oss_"))
            {
                Set("The key must start with oss_ (copy it from the OpenSketch home page).", false);
                return;
            }
            var backoff = 2;
            while (!stop.IsCancellationRequested)
            {
                try
                {
                    Hello();
                    backoff = 2;
                    Set("Connected to " + server, true);
                    log("connected, session " + session);
                    var end = Poll(stop);
                    if (end != null)
                    {
                        Set(end, false);
                        log("stopped: " + end);
                        return;
                    }
                }
                catch (Fatal f)
                {
                    Set(f.Message, false);
                    log("stopped: " + f.Message);
                    return;
                }
                catch (Exception ex) when (!stop.IsCancellationRequested)
                {
                    Set("Connection lost (" + Short(ex) + "). Trying again in " + backoff + " s...", false);
                    log("network: " + ex);
                    stop.WaitHandle.WaitOne(TimeSpan.FromSeconds(backoff));
                    backoff = Math.Min(backoff * 2, 30);
                }
            }
            Set("Disconnected", false);
        }

        static string Short(Exception ex)
        {
            var e = ex;
            while (e.InnerException != null) e = e.InnerException;
            return e.Message;
        }

        sealed class Fatal : Exception
        {
            public Fatal(string m) : base(m) { }
        }

        void Hello()
        {
            var body = new StringContent(Json.Write(hello), Encoding.UTF8, "application/json");
            using (var r = http.PostAsync(server + "/mcp/sw/hello", body).GetAwaiter().GetResult())
            {
                var text = r.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                if (r.StatusCode == HttpStatusCode.Unauthorized)
                    throw new Fatal(J.Str(SafeParse(text), "detail") ?? "The server did not accept this key. Copy it again from the OpenSketch home page.");
                if (r.StatusCode == HttpStatusCode.NotFound)
                    throw new Fatal("This server has no SOLIDWORKS link. Check the address (it is the CADOS site, e.g. https://cados.kevos.com).");
                if (!r.IsSuccessStatusCode) throw new IOException("hello: HTTP " + (int)r.StatusCode + " " + Trim(text));
                var d = Json.ParseObject(text);
                session = J.Str(d, "session");
                wait = Math.Max(5, Math.Min(55, J.Int(d, "wait", 25)));
                if (string.IsNullOrEmpty(session)) throw new IOException("hello: no session");
            }
        }

        static string Trim(string s) => s == null ? "" : s.Length > 300 ? s.Substring(0, 300) : s;

        /// <summary>Returns why it stopped for good, or null to say hello again (server restarted).</summary>
        string Poll(CancellationToken stop)
        {
            while (!stop.IsCancellationRequested)
            {
                HttpResponseMessage r;
                try
                {
                    var t = http.GetAsync(server + "/mcp/sw/next?session=" + Uri.EscapeDataString(session) + "&wait=" + wait, stop);
                    r = t.GetAwaiter().GetResult();
                }
                catch (OperationCanceledException) when (stop.IsCancellationRequested)
                {
                    return "Disconnected";
                }
                using (r)
                {
                    if (r.StatusCode == HttpStatusCode.NoContent) continue;
                    var text = r.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    if (r.StatusCode == HttpStatusCode.Conflict)
                    {
                        var d = SafeParse(text);
                        if (J.Str(d, "reason") == "restarted")
                        {
                            log("server restarted; saying hello again");
                            return null;
                        }
                        return J.Str(d, "error") ?? "The server ended this connection.";
                    }
                    if (r.StatusCode == HttpStatusCode.Unauthorized)
                        return J.Str(SafeParse(text), "detail") ?? "The server no longer accepts this key (a new key was made). Paste the new key.";
                    if (!r.IsSuccessStatusCode) throw new IOException("next: HTTP " + (int)r.StatusCode + " " + Trim(text));
                    Handle(Json.ParseObject(text));
                }
            }
            return "Disconnected";
        }

        static Dictionary<string, object> SafeParse(string text)
        {
            try
            {
                return Json.ParseObject(text);
            }
            catch (Exception)
            {
                return new Dictionary<string, object>();
            }
        }

        sealed class IO : ICommandIO
        {
            readonly BridgeClient c;
            readonly Dictionary<string, object> blobs;
            public string CommandId { get; }

            public IO(BridgeClient c, string id, Dictionary<string, object> blobs)
            {
                this.c = c;
                CommandId = id;
                this.blobs = blobs;
            }

            public void Upload(string name, byte[] data)
            {
                byte[] gz;
                using (var ms = new MemoryStream())
                {
                    using (var z = new GZipStream(ms, CompressionLevel.Fastest, true)) z.Write(data, 0, data.Length);
                    gz = ms.ToArray();
                }
                var content = new ByteArrayContent(gz);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                var url = c.server + "/mcp/sw/file?session=" + Uri.EscapeDataString(c.session) + "&id=" + Uri.EscapeDataString(CommandId) +
                          "&name=" + Uri.EscapeDataString(name);
                using (var req = new HttpRequestMessage(HttpMethod.Post, url) { Content = content })
                {
                    req.Headers.Add("X-OpenSketch-Gzip", "1");
                    using (var r = c.http.SendAsync(req).GetAwaiter().GetResult())
                    {
                        if (!r.IsSuccessStatusCode)
                            throw new IOException("Could not send " + name + " to OpenSketch: HTTP " + (int)r.StatusCode + " " +
                                                  Trim(r.Content.ReadAsStringAsync().GetAwaiter().GetResult()));
                    }
                }
                c.log($"sent {name} ({data.Length} bytes, {gz.Length} gzipped)");
            }

            public byte[] Download(string blobName)
            {
                var path = J.Str(blobs, blobName);
                if (path == null) throw new ArgumentException("No file " + blobName + " came with this command.");
                using (var r = c.http.GetAsync(c.server + path).GetAwaiter().GetResult())
                {
                    if (!r.IsSuccessStatusCode) throw new IOException("Could not fetch " + blobName + ": HTTP " + (int)r.StatusCode);
                    return r.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult();
                }
            }
        }

        void Handle(Dictionary<string, object> cmd)
        {
            var id = J.Str(cmd, "id");
            var op = J.Str(cmd, "op");
            var args = J.Obj(cmd, "args") ?? new Dictionary<string, object>();
            Commands++;
            log($">> {id} {op}");
            var started = DateTime.UtcNow;
            Dictionary<string, object> res = null;
            string error = null;
            try
            {
                res = execute(op, args, new IO(this, id, J.Obj(cmd, "blobs")));
            }
            catch (Exception ex)
            {
                error = Describe(ex);
                var inner = ex;
                while (inner is System.Reflection.TargetInvocationException && inner.InnerException != null) inner = inner.InnerException;
                if (inner is UserError ue && ue.Detail != null) res = ue.Detail;  // what was made before it stopped
                log($"!! {id} {op}: {ex}");
            }
            var body = new Dictionary<string, object>
            {
                ["session"] = session, ["id"] = id, ["ok"] = error == null, ["result"] = res ?? new Dictionary<string, object>(),
                ["ms"] = (int)(DateTime.UtcNow - started).TotalMilliseconds
            };
            if (error != null) body["error"] = error;
            string json;
            try
            {
                json = Json.Write(body);
            }
            catch (Exception ex)
            {
                json = Json.Write(new Dictionary<string, object> { ["session"] = session, ["id"] = id, ["ok"] = false, ["error"] = "Result could not be sent: " + ex.Message });
            }
            for (var attempt = 0; ; attempt++)
            {
                try
                {
                    using (var r = http.PostAsync(server + "/mcp/sw/result", new StringContent(json, Encoding.UTF8, "application/json")).GetAwaiter().GetResult())
                    {
                        log($"<< {id} {op} {(error == null ? "ok" : "error")} in {(DateTime.UtcNow - started).TotalSeconds:0.0} s (HTTP {(int)r.StatusCode})");
                        return;
                    }
                }
                catch (Exception) when (attempt < 3)
                {
                    Thread.Sleep(1000 * (attempt + 1));
                }
            }
        }

        /// <summary>An exception as a sentence for Claude: the message of the innermost cause, and where.</summary>
        public static string Describe(Exception ex)
        {
            var e = ex;
            while (e is System.Reflection.TargetInvocationException && e.InnerException != null) e = e.InnerException;
            if (e is UserError) return e.Message;
            var where = e.TargetSite != null ? " (in " + e.TargetSite.Name + ")" : "";
            return e.GetType().Name + ": " + e.Message + where;
        }
    }

    /// <summary>A refusal with a plain message for Claude (bad input, nothing open, a face not found...).</summary>
    public sealed class UserError : Exception
    {
        public Dictionary<string, object> Detail;
        /// <summary>Optional machine-readable reason (protocol 2 error codes, e.g. USER_EDITING, APPROVAL_DENIED).</summary>
        public string Code;

        public UserError(string message, Dictionary<string, object> detail = null) : base(message)
        {
            Detail = detail;
        }

        public UserError(string message, string code, Dictionary<string, object> detail = null) : base(message)
        {
            Detail = detail;
            Code = code;
        }
    }
}
