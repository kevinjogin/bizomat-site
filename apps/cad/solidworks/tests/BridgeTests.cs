using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.IO.Pipes;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using OpenSketch.Sw.Bridge;
using OpenSketch.Sw.Core;
using Xunit;

namespace OpenSketch.Sw.Tests
{
    public class WireTests
    {
        [Fact]
        public void IdsAreUniqueSortableAndValid()
        {
            var a = Ids.New("cmd");
            Thread.Sleep(2);
            var b = Ids.New("cmd");
            Assert.True(Ids.Valid(a, "cmd") && Ids.Valid(b, "cmd"));
            Assert.Equal(30, a.Length);
            Assert.True(string.CompareOrdinal(a, b) < 0);
            Assert.False(Ids.Valid("cmd_IL0", "cmd"));
            Assert.False(Ids.Valid(a, "dev"));
        }

        [Fact]
        public void TimesRoundTrip()
        {
            var t = new DateTime(2026, 11, 5, 10, 14, 2, 123, DateTimeKind.Utc);
            Assert.Equal("2026-11-05T10:14:02.123Z", Times.Iso(t));
            Assert.Equal(t, Times.Parse("2026-11-05T10:14:02.123Z"));
            Assert.Equal(t, Times.Parse("2026-11-05T10:14:02.123456Z"));
            Assert.False(Times.TryParse("yesterday", out _));
        }

        [Fact]
        public void FramesRoundTripAndRefuseOversize()
        {
            var ms = new MemoryStream();
            Frames.Write(ms, J.O("type", "pipe.ping", "seq", 3.0, "text", "é\n\"x\""));
            Frames.Write(ms, J.O("type", "two"));
            ms.Position = 0;
            Assert.Equal("é\n\"x\"", J.Str(Frames.Read(ms), "text"));
            Assert.Equal("two", J.Str(Frames.Read(ms), "type"));
            Assert.Null(Frames.Read(ms));
            var bad = new MemoryStream(BitConverter.GetBytes(Protocol.MaxFrame + 1));
            Assert.Throws<InvalidDataException>(() => Frames.Read(bad));
            Assert.Throws<InvalidDataException>(() => Frames.Write(new MemoryStream(), J.O("big", new string('x', Protocol.MaxFrame))));
        }

        [Fact]
        public void JwsSignVerifyAndTamper()
        {
            using (var k = new SoftwareKey())
            {
                var jws = Jws.Sign(k, J.O("alg", "ES256", "typ", "kevos-command", "kid", "k1"), Json.Write(J.O("op", "read", "n", 1.0)));
                using (var v = Jwk.ToVerifier(k.PublicJwk))
                {
                    Assert.Contains("\"op\":\"read\"", Jws.Verify(jws, v, out var h));
                    Assert.Equal("kevos-command", J.Str(h, "typ"));
                    var parts = jws.Split('.');
                    var forged = parts[0] + "." + B64.Url(Encoding.UTF8.GetBytes(Json.Write(J.O("op", "delete", "n", 1.0)))) + "." + parts[2];
                    Assert.Throws<CryptographicException>(() => Jws.Verify(forged, v, out _));
                }
                using (var other = new SoftwareKey())
                using (var v2 = Jwk.ToVerifier(other.PublicJwk))
                    Assert.Throws<CryptographicException>(() => Jws.Verify(jws, v2, out _));
                Assert.Equal(43, Jwk.Thumbprint(k.PublicJwk).Length);
            }
            Assert.ThrowsAny<CryptographicException>(() => Jwk.ToVerifier(J.O("kty", "RSA")));
        }

        [Fact]
        public void ReplayGuardRemembersAcrossRestarts()
        {
            var f = Path.Combine(Path.GetTempPath(), "kevos-seen-" + Guid.NewGuid().ToString("N") + ".json");
            try
            {
                var g = new ReplayGuard(f);
                Assert.True(g.Add("cmd_1", DateTime.UtcNow.AddMinutes(5)));
                Assert.False(g.Add("cmd_1", DateTime.UtcNow.AddMinutes(5)));
                Assert.True(new ReplayGuard(f).Seen("cmd_1"));
            }
            finally
            {
                File.Delete(f);
            }
        }
    }

    /// <summary>The gateway, scripted: answers the device API from queues and records what the companion sends.</summary>
    sealed class FakeGateway : HttpMessageHandler
    {
        public readonly SoftwareKey Key = new SoftwareKey();
        public readonly ConcurrentQueue<Dictionary<string, object>> ToSend = new ConcurrentQueue<Dictionary<string, object>>();
        public readonly ConcurrentQueue<(string path, Dictionary<string, object> body, byte[] raw, string auth)> Got = new ConcurrentQueue<(string, Dictionary<string, object>, byte[], string)>();
        public readonly Dictionary<string, byte[]> Blobs = new Dictionary<string, byte[]>();
        public string Kid => Jwk.Thumbprint(Key.PublicJwk);
        public Dictionary<string, object> Jwk_ => new Dictionary<string, object>(Key.PublicJwk) { ["kid"] = Kid };

        public IEnumerable<Dictionary<string, object>> Posts(string path) => Got.Where(g => g.path.StartsWith(path)).Select(g => g.body);

        protected override void Dispose(bool disposing)
        {
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage req, CancellationToken ct)
        {
            var path = req.RequestUri.PathAndQuery;
            var raw = req.Content != null ? await req.Content.ReadAsByteArrayAsync() : new byte[0];
            Dictionary<string, object> body = null;
            try
            {
                if (raw.Length > 0 && raw[0] == (byte)'{') body = Json.ParseObject(Encoding.UTF8.GetString(raw));
            }
            catch (Exception)
            {
            }
            var auth = req.Headers.Authorization?.ToString() ?? string.Join("", req.Headers.GetValues("Authorization"));
            Got.Enqueue((path, body, raw, auth));
            HttpResponseMessage Json_(object o, HttpStatusCode code = HttpStatusCode.OK)
            {
                var r = new HttpResponseMessage(code) { Content = new StringContent(Json.Write(o), Encoding.UTF8, "application/json") };
                r.Headers.TryAddWithoutValidation("KEVOS-Server-Time", Times.Now());
                return r;
            }
            if (path.StartsWith("/v2/device/hello"))
                return Json_(J.O("type", "device.welcome", "session_id", "ses_" + new string('A', 26), "keys", J.O("command_kids", J.L(Kid)), "device_name", "TESTPC", "reconcile", J.L()));
            if (path.StartsWith("/v2/device/next"))
            {
                for (var i = 0; i < 20; i++)
                {
                    if (ToSend.TryDequeue(out var m)) return Json_(J.O("type", "gateway.messages", "messages", J.L(m)));
                    await Task.Delay(25, ct);
                }
                return new HttpResponseMessage(HttpStatusCode.NoContent);
            }
            if (path.StartsWith("/v2/device/blob/"))
            {
                var id = path.Substring("/v2/device/blob/".Length);
                return Blobs.TryGetValue(id, out var b) ? new HttpResponseMessage(HttpStatusCode.OK) { Content = new ByteArrayContent(b) } : new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            return Json_(J.O("ok", true));
        }

        public Dictionary<string, object> Command(string deviceId, string op, Dictionary<string, object> args, double expiresInS = 60, string cid = null,
                                                  List<object> filesIn = null, SoftwareKey signer = null, string typ = "kevos-command")
        {
            cid = cid ?? Ids.New("cmd");
            var now = DateTime.UtcNow;
            var cmd = J.O("v", "2.0", "type", "command", "command_id", cid, "device_id", deviceId, "instance", J.O("mode", "auto"),
                          "issued_by", J.O("user_id", "usr_000000000000", "grant_id", "private_address", "client", J.O("name", "Claude"), "auth", "oauth"),
                          "tool", "sw_" + op, "op", op, "op_version", 1.0, "params", args, "params_sha256", "sha256:" + new string('a', 64), "effect", "read", "risk", "low",
                          "files_in", filesIn ?? new List<object>(), "created_at", Times.Iso(now), "expires_at", Times.Iso(now.AddSeconds(expiresInS)),
                          "run_timeout_ms", 60000.0, "correlation_id", Ids.New("cor"), "nonce", B64.Url(B64.Random(16)));
            var jws = Jws.Sign(signer ?? Key, J.O("alg", "ES256", "typ", typ, "kid", Kid), Json.Write(cmd));
            return J.O("v", "2.0", "type", "command.deliver", "msg_id", Ids.New("msg"), "attempt", 1.0, "command_id", cid, "jws", jws);
        }
    }

    sealed class TestListener : IPipeListener
    {
        readonly string name;
        public int Pid;
        public TestListener(string name) => this.name = name;

        public Stream Accept(CancellationToken stop, out PeerInfo peer)
        {
            var s = new NamedPipeServerStream(name, PipeDirection.InOut, 8, PipeTransmissionMode.Byte, PipeOptions.Asynchronous);
            try
            {
                s.WaitForConnectionAsync(stop).GetAwaiter().GetResult();
            }
            catch (OperationCanceledException)
            {
                s.Dispose();
                peer = null;
                return null;
            }
            peer = new PeerInfo { Pid = Pid, Image = "SLDWORKS.exe" };
            return s;
        }

        public void Dispose()
        {
        }
    }

    /// <summary>An add-in stand-in: answers ops from a function, like Commands.Run would.</summary>
    sealed class TestHost : IAddinHost
    {
        public Func<string, Dictionary<string, object>, ICommandIO, CommandContext, Dictionary<string, object>> Run =
            (op, a, io, ctx) => J.O("op", op, "echo", a);
        public readonly List<string> Ops = new List<string>();
        public int Pid = 4242;

        public Dictionary<string, object> Hello() => J.O("pid", (double)Pid, "process_started_at", "2026-11-05T08:00:00.000Z", "sw_revision", "30.5.0",
                                                         "addin_version", "0.11.0", "capabilities", J.O("ops", J.O("read", 1.0)));

        public Dictionary<string, object> Execute(string op, Dictionary<string, object> args, ICommandIO io, CommandContext ctx)
        {
            lock (Ops) Ops.Add(op);
            CommandContext.Current = ctx;
            try
            {
                return Run(op, args, io, ctx);
            }
            finally
            {
                CommandContext.Current = null;
            }
        }

        public Dictionary<string, object> Probe() => J.O("ui_responsive", true, "modal_dialog", false);
        public Dictionary<string, object> State() => J.O("docs", J.L(J.O("title", "Box.SLDPRT", "path", "C:\\OS\\Box.SLDPRT", "kind", "part", "active", true, "unsaved", false)));
        public int Missing;
        public void CompanionMissing() => Missing++;
    }

    public sealed class LocalPathTests : IDisposable
    {
        readonly string dir = Path.Combine(Path.GetTempPath(), "kevos-test-" + Guid.NewGuid().ToString("N"));
        readonly string pipe = "kevos-test-" + Guid.NewGuid().ToString("N").Substring(0, 12);
        readonly FakeGateway gw = new FakeGateway();
        readonly SoftwareKey device = new SoftwareKey();
        readonly CancellationTokenSource stop = new CancellationTokenSource();
        readonly List<string> logs = new List<string>();
        CompanionEngine engine;
        PipeLink link;
        TestHost host;
        Stream client;
        const string DeviceId = "dev_01JD0000000000000000000000";

        void Log(string s)
        {
            lock (logs) logs.Add(s);
        }

        CompanionEngine StartEngine(Func<PeerInfo, string> verify = null, bool addin = true, Func<int, bool> alive = null)
        {
            Directory.CreateDirectory(dir);
            new DeviceConfig { GatewayUrl = "http://127.0.0.1:9", DeviceId = DeviceId, DeviceName = "TESTPC", GatewayJwk = gw.Jwk_ }.Save(Path.Combine(dir, "device.json"));
            var opts = new CompanionOptions { DataDir = dir, GatewayUrl = "http://127.0.0.1:9", HttpHandler = () => gw, VerifyPeer = verify ?? (_ => null) };
            if (alive != null) opts.ProcessAlive = alive;
            engine = new CompanionEngine(opts, device, new TestListener(pipe) { Pid = 4242 }, Log);
            engine.Start();
            Assert.True(Until(() => engine.Status().CloudConnected), "cloud: " + engine.Status().Cloud);
            if (addin) StartAddin();
            return engine;
        }

        void StartAddin()
        {
            host = new TestHost();
            link = new PipeLink(t =>
            {
                var c = new NamedPipeClientStream(".", pipe, PipeDirection.InOut, PipeOptions.Asynchronous);
                c.Connect(500);
                client = c;
                return c;
            }, host, Log, engine.SpoolRoot);
            new Thread(() => link.Run(stop.Token)) { IsBackground = true }.Start();
            Assert.True(Until(() => engine.Status().Instances.Count == 1), "add-in did not connect");
        }

        static bool Until(Func<bool> f, int ms = 8000)
        {
            var end = DateTime.UtcNow.AddMilliseconds(ms);
            while (DateTime.UtcNow < end)
            {
                if (f()) return true;
                Thread.Sleep(20);
            }
            return f();
        }

        Dictionary<string, object> ResultFor(string cid) => gw.Posts("/v2/device/result").FirstOrDefault(b => J.Str(b, "command_id") == cid);

        Dictionary<string, object> AckFor(string cid, string ack) =>
            gw.Posts("/v2/device/ack").FirstOrDefault(b => J.Str(b, "command_id") == cid && J.Str(b, "ack") == ack);

        public void Dispose()
        {
            stop.Cancel();
            engine?.Dispose();
            try
            {
                Directory.Delete(dir, true);
            }
            catch (Exception)
            {
            }
        }

        [Fact]
        public void ACommandRunsInSolidWorksAndItsResultAndFilesGoBack()
        {
            StartEngine();
            host.Run = (op, a, io, ctx) =>
            {
                CommandContext.Progress(1, 2, "half");
                io.Upload("Box.step", Encoding.ASCII.GetBytes("ISO-10303-21;"));
                var input = io.Download("file");
                return J.O("op", op, "in", Encoding.ASCII.GetString(input), "who", ctx.ClientName);
            };
            gw.Blobs["blb_1"] = Encoding.ASCII.GetBytes("STEP DATA");
            var files = J.L(J.O("name", "file", "blob_id", "blb_1", "size", 9.0, "sha256", B64.Sha256Tagged(gw.Blobs["blb_1"]), "filename", "in.step"));
            var m = gw.Command(DeviceId, "export", J.O("format", "step"), filesIn: files);
            var cid = J.Str(m, "command_id");
            gw.ToSend.Enqueue(m);
            Assert.True(Until(() => ResultFor(cid) != null), string.Join("\n", logs));
            var r = ResultFor(cid);
            Assert.Equal("succeeded", J.Str(r, "status"));
            Assert.Equal("STEP DATA", J.Str(J.Obj(r, "result"), "in"));
            Assert.Equal("Claude", J.Str(J.Obj(r, "result"), "who"));
            Assert.NotNull(AckFor(cid, "accepted"));
            Assert.Contains(gw.Posts("/v2/device/progress"), p => J.Str(p, "command_id") == cid && J.Str(J.Obj(p, "progress"), "note") == "half");
            var fo = J.Obj(J.Arr(r, "files_out")[0]);
            Assert.Equal("Box.step", J.Str(fo, "name"));
            Assert.Null(J.Str(fo, "path"));                    // local paths never leave the computer
            var upload = gw.Got.First(g => g.path.StartsWith("/v2/device/file") && g.path.Contains(cid));
            Assert.Equal("ISO-10303-21;", Encoding.ASCII.GetString(upload.raw));
            Assert.StartsWith("KEVOS-Device ", upload.auth);   // every request is signed by the device key
            Assert.True(Until(() => !Directory.GetFiles(Path.Combine(dir, "outbox")).Any()));   // stored, then forgotten
            // the device proof is checkable with the device's public key and binds the body
            Jws.Parse(upload.auth.Substring("KEVOS-Device ".Length), out var ph, out var pp);
            using (var v = Jwk.ToVerifier(device.PublicJwk)) Jws.Verify(upload.auth.Substring("KEVOS-Device ".Length), v, out _);
            Assert.Equal(B64.Sha256Hex(upload.raw), J.Str(Json.ParseObject(pp), "bh"));
            Assert.Equal(DeviceId, J.Str(ph, "kid"));
        }

        [Fact]
        public void ForgedWrongDeviceExpiredAndReplayedCommandsNeverRun()
        {
            StartEngine();
            using (var mallory = new SoftwareKey())
            {
                var forged = gw.Command(DeviceId, "delete", J.O("features", J.L("Boss-Extrude1")), signer: mallory);
                var other = gw.Command("dev_01JD9999999999999999999999", "delete", J.O());
                var old = gw.Command(DeviceId, "delete", J.O(), expiresInS: -30);
                var notCmd = gw.Command(DeviceId, "delete", J.O(), typ: "kevos-cancel");
                foreach (var m in new[] { forged, other, old, notCmd }) gw.ToSend.Enqueue(m);
                Assert.True(Until(() => AckFor(J.Str(forged, "command_id"), "rejected") != null && AckFor(J.Str(other, "command_id"), "rejected") != null &&
                                        AckFor(J.Str(old, "command_id"), "rejected") != null && AckFor(J.Str(notCmd, "command_id"), "rejected") != null));
                Assert.Equal("SIGNATURE_INVALID", J.Str(J.Obj(AckFor(J.Str(forged, "command_id"), "rejected"), "error"), "code"));
                Assert.Equal("WRONG_DEVICE", J.Str(J.Obj(AckFor(J.Str(other, "command_id"), "rejected"), "error"), "code"));
                Assert.Equal("EXPIRED", J.Str(J.Obj(AckFor(J.Str(old, "command_id"), "rejected"), "error"), "code"));
                Assert.Equal("SIGNATURE_INVALID", J.Str(J.Obj(AckFor(J.Str(notCmd, "command_id"), "rejected"), "error"), "code"));
            }
            var good = gw.Command(DeviceId, "read", J.O("doc", "Box"));
            gw.ToSend.Enqueue(good);
            gw.ToSend.Enqueue(good);   // a replay of the same signed command
            Assert.True(Until(() => ResultFor(J.Str(good, "command_id")) != null && AckFor(J.Str(good, "command_id"), "duplicate") != null));
            Thread.Sleep(200);
            Assert.Equal(new[] { "read" }, host.Ops.ToArray());   // ran once; none of the bad ones ran
        }

        [Fact]
        public void PausedOrNoSolidWorksIsRefusedWithAReason()
        {
            StartEngine(addin: false);
            var m = gw.Command(DeviceId, "read", J.O());
            gw.ToSend.Enqueue(m);
            Assert.True(Until(() => AckFor(J.Str(m, "command_id"), "rejected") != null));
            Assert.Equal("INSTANCE_NOT_RUNNING", J.Str(J.Obj(AckFor(J.Str(m, "command_id"), "rejected"), "error"), "code"));
            StartAddin();
            engine.SetPaused(true);
            var p = gw.Command(DeviceId, "read", J.O());
            gw.ToSend.Enqueue(p);
            Assert.True(Until(() => AckFor(J.Str(p, "command_id"), "rejected") != null));
            Assert.Equal("PAUSED", J.Str(J.Obj(AckFor(J.Str(p, "command_id"), "rejected"), "error"), "code"));
            Assert.True(Until(() => J.Bool(link.Companion, "paused")));   // the add-in shows it
            engine.SetPaused(false);
            var q = gw.Command(DeviceId, "read", J.O());
            gw.ToSend.Enqueue(q);
            Assert.True(Until(() => ResultFor(J.Str(q, "command_id")) != null));
        }

        [Fact]
        public void CancelStopsAQueuedCommandAndARunningOneAtItsNextStep()
        {
            StartEngine();
            var release = new ManualResetEventSlim(false);
            host.Run = (op, a, io, ctx) =>
            {
                if (op == "batch")
                {
                    for (var i = 0; i < 100; i++)
                    {
                        CommandContext.ThrowIfCancelled();
                        if (release.Wait(50)) break;
                    }
                }
                return J.O("op", op);
            };
            var running = gw.Command(DeviceId, "batch", J.O());
            var queued = gw.Command(DeviceId, "read", J.O());
            gw.ToSend.Enqueue(running);
            Assert.True(Until(() => host.Ops.Contains("batch")));
            gw.ToSend.Enqueue(queued);
            Assert.True(Until(() => gw.Posts("/v2/device/progress").Any(p => J.Str(p, "command_id") == J.Str(queued, "command_id") && J.Str(p, "status") == "accepted")));
            foreach (var cid in new[] { J.Str(queued, "command_id"), J.Str(running, "command_id") })
            {
                var cancel = J.O("v", "2.0", "type", "command.cancel", "command_id", cid, "device_id", DeviceId, "reason", "user_request", "origin", "gateway", "nonce", B64.Url(B64.Random(16)));
                gw.ToSend.Enqueue(J.O("type", "command.cancel", "command_id", cid, "jws", Jws.Sign(gw.Key, J.O("alg", "ES256", "typ", "kevos-cancel", "kid", gw.Kid), Json.Write(cancel))));
            }
            Assert.True(Until(() => ResultFor(J.Str(queued, "command_id")) != null && ResultFor(J.Str(running, "command_id")) != null), string.Join("\n", logs));
            Assert.Equal("cancelled", J.Str(ResultFor(J.Str(queued, "command_id")), "status"));
            Assert.Equal("cancelled", J.Str(ResultFor(J.Str(running, "command_id")), "status"));
            Assert.DoesNotContain("read", host.Ops);
        }

        [Fact]
        public void AnUnverifiedPipeClientIsTurnedAway()
        {
            StartEngine(verify: p => "not SLDWORKS.exe", addin: false);
            using (var c = new NamedPipeClientStream(".", pipe, PipeDirection.InOut))
            {
                c.Connect(2000);
                var bye = Frames.Read(c);
                Assert.Equal("pipe.bye", J.Str(bye, "type"));
                Assert.Equal("peer_rejected", J.Str(bye, "reason"));
            }
            Assert.Empty(engine.Status().Instances);
            Assert.Contains(logs, l => l.Contains("REFUSED a pipe client"));
        }

        [Fact]
        public void SolidWorksClosingMidCommandFailsItAsLost()
        {
            var alive = true;
            StartEngine(alive: pid => alive);
            var gate = new ManualResetEventSlim(false);
            host.Run = (op, a, io, ctx) =>
            {
                gate.Wait(20000);
                return J.O("op", op);
            };
            var m = gw.Command(DeviceId, "add_features", J.O());
            gw.ToSend.Enqueue(m);
            Assert.True(Until(() => host.Ops.Contains("add_features")));
            alive = false;   // SOLIDWORKS crashed: its pipe goes, its process is gone
            stop.Cancel();
            client.Dispose();
            Assert.True(Until(() => ResultFor(J.Str(m, "command_id")) != null, 15000), string.Join("\n", logs));
            Assert.Equal("RESULT_LOST", J.Str(J.Obj(ResultFor(J.Str(m, "command_id")), "error"), "code"));
            gate.Set();
        }
    }
}

namespace OpenSketch.Sw.Tests
{
    public class DestructiveTests
    {
        [Fact]
        public void TheCommandsThatDestroyOrReplaceAreNamedPlainly()
        {
            Assert.StartsWith("Delete features Boss-Extrude1, Fillet1", Destructive.Describe("delete", J.O("features", J.L("Boss-Extrude1", "Fillet1"))));
            Assert.Null(Destructive.Describe("delete", J.O("features", J.L("Boss-Extrude1"), "dry_run", true)));
            Assert.Equal("Undo the last 3 changes.", Destructive.Describe("undo", J.O("steps", 3.0)));
            var here = Path.GetTempFileName();
            try
            {
                Assert.Contains("replacing the file", Destructive.Describe("save", J.O("path", here)));
            }
            finally
            {
                File.Delete(here);
            }
            Assert.Null(Destructive.Describe("save", J.O()));
            Assert.Contains("replacing an existing drawing", Destructive.Describe("create_drawing", J.O("overwrite", true)));
            Assert.Null(Destructive.Describe("create_drawing", J.O()));
            Assert.Contains("global variable wall", Destructive.Describe("set_parameter", J.O("name", "wall", "remove", true)));
            Assert.Contains("Drawing View3", Destructive.Describe("edit_drawing", J.O("actions", J.L(J.O("do", "note"), J.O("do", "delete", "view", "Drawing View3")))));
            foreach (var op in new[] { "read", "add_features", "batch", "export", "import", "status", "geometry" }) Assert.Null(Destructive.Describe(op, J.O()));
        }
    }
}
