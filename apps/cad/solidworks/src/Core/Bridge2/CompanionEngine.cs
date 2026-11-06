using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using OpenSketch.Sw.Core;

namespace OpenSketch.Sw.Bridge
{
    /// <summary>The process at the other end of a pipe connection (filled by the platform's listener).</summary>
    public sealed class PeerInfo
    {
        public int Pid;
        public string Image;
    }

    /// <summary>Accepts add-in connections. Windows: a per-user named pipe with an ACL and peer checks (KEVOS.Companion);
    /// tests: a plain named pipe.</summary>
    public interface IPipeListener : IDisposable
    {
        /// <summary>The next connected client, or null when stopped.</summary>
        Stream Accept(CancellationToken stop, out PeerInfo peer);
    }

    public sealed class CompanionOptions
    {
        public string DataDir;
        public string GatewayUrl;
        public string Version = "1.0.0";
        public string OsName = Environment.OSVersion.VersionString;
        public string MachineName = Environment.MachineName;
        /// <summary>Installed SOLIDWORKS versions: [{year, revision, path}].</summary>
        public Func<List<object>> Installations = () => new List<object>();
        /// <summary>Null when the peer may connect, else why not (the Windows companion checks the process is
        /// SLDWORKS.exe with the signed add-in loaded).</summary>
        public Func<PeerInfo, string> VerifyPeer = _ => null;
        /// <summary>Is a SOLIDWORKS process running at all (with or without the add-in).</summary>
        public Func<int> SolidWorksProcesses = () => 0;
        /// <summary>Starts SOLIDWORKS when a command arrives and none runs; null = never (the default).</summary>
        public Func<bool> StartSolidWorks;
        public bool ConfirmDestructive = true;
        /// <summary>Tests: the HTTP handler for the gateway link (default: the system proxy handler).</summary>
        public Func<System.Net.Http.HttpMessageHandler> HttpHandler;
        public Func<int, bool> ProcessAlive = pid =>
        {
            try
            {
                using (var p = Process.GetProcessById(pid)) return !p.HasExited;
            }
            catch (Exception)
            {
                return false;
            }
        };
    }

    /// <summary>One SOLIDWORKS with the add-in, connected over the pipe.</summary>
    public sealed class SwInstance
    {
        public string Id;
        public int Pid;
        public string ProcessStarted;
        public Dictionary<string, object> Hello = new Dictionary<string, object>();
        public List<object> Docs = new List<object>();
        public string Busy;
        public DateTime BusySince;
        public bool UiResponsive = true;
        public bool Modal;
        public bool UserSketch;
        public DateTime LastActive = DateTime.MinValue;
        public DateTime LastPong = DateTime.UtcNow;
        public string PipeSession;
        internal Stream Stream;
        internal readonly object WriteLock = new object();
        public bool Connected => Stream != null;

        public string SwRevision => J.Str(Hello, "sw_revision") ?? "";
        public string AddinVersion => J.Str(Hello, "addin_version") ?? "0.0.0";

        public bool HasDoc(string doc)
        {
            if (string.IsNullOrEmpty(doc)) return false;
            var stem = Stem(doc);
            foreach (var o in Docs)
            {
                var d = J.Obj(o);
                if (d == null) continue;
                if (string.Equals(J.Str(d, "path"), doc, StringComparison.OrdinalIgnoreCase) || string.Equals(J.Str(d, "title"), doc, StringComparison.OrdinalIgnoreCase) ||
                    Stem(J.Str(d, "title")) == stem || Stem(J.Str(d, "path")) == stem)
                    return true;
            }
            return false;
        }

        static string Stem(string s)
        {
            var n = Path.GetFileName(s ?? "");
            var dot = n.LastIndexOf('.');
            return (dot > 0 ? n.Substring(0, dot) : n).ToLowerInvariant();
        }

        public Dictionary<string, object> ForGateway()
        {
            var caps = J.Obj(Hello, "capabilities") ?? new Dictionary<string, object>();
            return J.O("instance_id", Id, "pid", (double)Pid, "sw_revision", SwRevision, "addin_version", AddinVersion,
                       "capabilities_sha256", B64.Sha256Tagged(Encoding.UTF8.GetBytes(Json.Write(caps))),
                       "ui_responsive", UiResponsive, "modal_dialog", Modal,
                       "busy", Busy == null ? null : J.O("command_id", Busy, "since", Times.Iso(BusySince)), "docs", Docs);
        }
    }

    /// <summary>What the tray shows.</summary>
    public sealed class CompanionStatus
    {
        public bool Paired;
        public string DeviceName;
        public string DeviceId;
        public string Account;
        public string Gateway;
        public string Cloud = "Starting";
        public bool CloudConnected;
        public bool Paused;
        public int SolidWorksProcesses;
        public List<Dictionary<string, object>> Instances = new List<Dictionary<string, object>>();
        public int CommandsRun;
        public string LastCommand;
        public string LastError;

        public bool AddinLoaded => Instances.Count > 0;
        public bool Busy => Instances.Any(i => J.Str(i, "busy") != null);
    }

    /// <summary>
    /// The BIZOMAT Companion's core (KEVOS.Companion.exe): holds the computer's registration, keeps the signed long poll to the gateway alive
    /// (heartbeat, backoff, reconnect), accepts SOLIDWORKS add-ins on the local pipe, and moves each command from the
    /// gateway to the right SOLIDWORKS and its acknowledgment, progress and result back. Every command is checked
    /// here before it reaches SOLIDWORKS: the gateway's signature (key pinned at pairing), that it is for this
    /// computer, not expired, not seen before, and a known op. SOLIDWORKS API calls are never made here.
    /// </summary>
    public sealed class CompanionEngine : IDisposable
    {
        readonly CompanionOptions o;
        readonly IDeviceKey key;
        readonly IPipeListener listener;
        readonly Action<string> log;
        readonly object gate = new object();
        readonly Dictionary<string, SwInstance> instances = new Dictionary<string, SwInstance>();
        readonly Dictionary<string, Inflight> inflight = new Dictionary<string, Inflight>();
        readonly ReplayGuard seen;
        readonly AutoResetEvent kick = new AutoResetEvent(false);
        readonly string cfgPath, outboxDir, spoolDir;
        CancellationTokenSource cts;
        CloudLink cloud;
        ECDsa gatewayVerifier;
        string gatewayKid;
        string session;
        volatile bool statusDirty = true;
        DateTime lastStatusPost = DateTime.MinValue;
        int commandsRun;
        string lastCommand, lastError;
        string cloudState = "Starting";
        bool cloudConnected;
        public DeviceConfig Config { get; private set; }
        public bool Paused { get; private set; }
        public event Action Changed;

        sealed class Inflight
        {
            public string Id;
            public string InstanceId;
            public string DeviceId;
            public string ParamsSha;
            public string Op;
            public string Jws;
            public string Spool;
            public DateTime Started = DateTime.UtcNow;
        }

        public CompanionEngine(CompanionOptions options, IDeviceKey key, IPipeListener listener, Action<string> log)
        {
            o = options;
            this.key = key;
            this.listener = listener;
            this.log = log ?? (_ => { });
            Directory.CreateDirectory(o.DataDir);
            cfgPath = Path.Combine(o.DataDir, "device.json");
            outboxDir = Path.Combine(o.DataDir, "outbox");
            spoolDir = Path.Combine(o.DataDir, "spool");
            Directory.CreateDirectory(outboxDir);
            Directory.CreateDirectory(spoolDir);
            seen = new ReplayGuard(Path.Combine(o.DataDir, "seen.json"));
            Config = DeviceConfig.Load(cfgPath);
            if (string.IsNullOrEmpty(Config.GatewayUrl)) Config.GatewayUrl = o.GatewayUrl;
            CleanSpool();
        }

        public string SpoolRoot => spoolDir;

        // ----------------------------------------------------------------- lifecycle

        public void Start()
        {
            cts = new CancellationTokenSource();
            var t = cts.Token;
            Loop("KEVOS pipe", AcceptLoop, t);
            Loop("KEVOS cloud", CloudLoop, t);
            Loop("KEVOS heartbeat", PingLoop, t);
            log("companion started; data in " + o.DataDir);
        }

        /// <summary>A background loop that never takes the process down: an unexpected exception is logged and the loop
        /// starts again (startup recovery); a stop ends it quietly.</summary>
        void Loop(string name, Action<CancellationToken> f, CancellationToken t)
        {
            new Thread(() =>
            {
                while (!t.IsCancellationRequested)
                {
                    try
                    {
                        f(t);
                        return;
                    }
                    catch (Exception) when (t.IsCancellationRequested)
                    {
                        return;
                    }
                    catch (Exception ex)
                    {
                        log(name + " failed, restarting in 5 s: " + ex);
                        t.WaitHandle.WaitOne(5000);
                    }
                }
            }) { IsBackground = true, Name = name }.Start();
        }

        void Start(string name, ThreadStart f) => new Thread(() => Safe(name, () => f())) { IsBackground = true, Name = name }.Start();

        void Safe(string what, Action f)
        {
            try
            {
                f();
            }
            catch (Exception ex)
            {
                if (cts == null || !cts.IsCancellationRequested) log(what + ": " + ex);
            }
        }

        void Later(string what, Action f) => ThreadPool.QueueUserWorkItem(_ => Safe(what, f));

        public void Stop()
        {
            if (cts == null) return;
            cts.Cancel();
            kick.Set();
            lock (gate)
            {
                foreach (var i in instances.Values.ToList())
                {
                    try
                    {
                        Send(i, Msg.New("pipe.bye", "pipe_session", i.PipeSession, "reason", "companion_exiting"));
                        i.Stream?.Dispose();
                    }
                    catch (Exception)
                    {
                    }
                }
            }
            try
            {
                listener?.Dispose();
            }
            catch (Exception)
            {
            }
            log("companion stopped");
        }

        public void Dispose()
        {
            Stop();
            cloud?.Dispose();
        }

        /// <summary>Retry the cloud link now (network came back, the PC woke up).</summary>
        public void Kick() => kick.Set();

        public void SetPaused(bool paused)
        {
            Paused = paused;
            statusDirty = true;
            BroadcastState();
            Changed?.Invoke();
            kick.Set();
            log(paused ? "paused by the user" : "resumed by the user");
        }

        void Fire()
        {
            try
            {
                Changed?.Invoke();
            }
            catch (Exception)
            {
            }
        }

        public CompanionStatus Status()
        {
            var s = new CompanionStatus
            {
                Paired = Config.Paired, DeviceName = Config.DeviceName, DeviceId = Config.DeviceId, Account = Config.Account, Gateway = Config.GatewayUrl,
                Cloud = cloudState, CloudConnected = cloudConnected, Paused = Paused, CommandsRun = commandsRun, LastCommand = lastCommand, LastError = lastError
            };
            try
            {
                s.SolidWorksProcesses = o.SolidWorksProcesses();
            }
            catch (Exception)
            {
            }
            lock (gate)
                foreach (var i in instances.Values.Where(x => x.Connected))
                {
                    var active = i.Docs.Select(J.Obj).FirstOrDefault(d => d != null && J.Bool(d, "active"));
                    s.Instances.Add(J.O("instance_id", i.Id, "pid", (double)i.Pid, "sw_revision", i.SwRevision, "addin_version", i.AddinVersion,
                                        "docs", (double)i.Docs.Count, "active", J.Str(active, "title"), "busy", i.Busy,
                                        "ready", i.UiResponsive && !i.Modal && i.Busy == null, "modal_dialog", i.Modal));
                }
            return s;
        }

        // ----------------------------------------------------------------- pairing

        public sealed class PairingTicket
        {
            public string PairId;
            public string UserCode;
            public string Url;
            public int Interval = 3;
            public DateTime Expires;
        }

        public PairingTicket BeginPairing(string gateway, string name)
        {
            gateway = (gateway ?? Config.GatewayUrl ?? "").Trim().TrimEnd('/');
            using (var c = new CloudLink(gateway, key, "pairing", log, o.HttpHandler?.Invoke()))
            {
                var r = c.PairStart(name, o.MachineName, o.OsName, o.Version);
                if (r.Status != 200) throw new IOException("The CAD Automation server refused pairing: " + r.ErrorMessage);
                var t = new PairingTicket
                {
                    PairId = J.Str(r.Json, "pair_id"), UserCode = J.Str(r.Json, "user_code"), Url = J.Str(r.Json, "verification_uri_complete"),
                    Interval = Math.Max(1, J.Int(r.Json, "interval", 3)), Expires = DateTime.UtcNow.AddSeconds(J.Int(r.Json, "expires_in", 600))
                };
                Config.GatewayUrl = gateway;
                return t;
            }
        }

        /// <summary>Waits until the person approves the code on the website. True when paired.</summary>
        public bool WaitForPairing(PairingTicket t, CancellationToken stop)
        {
            using (var c = new CloudLink(Config.GatewayUrl, key, t.PairId, log, o.HttpHandler?.Invoke()))
            {
                while (!stop.IsCancellationRequested && DateTime.UtcNow < t.Expires)
                {
                    HttpReply r;
                    try
                    {
                        r = c.PostJson("/v2/devices/pair/poll", J.O(), 30, stop);
                    }
                    catch (Exception ex) when (!stop.IsCancellationRequested)
                    {
                        log("pairing poll: " + ex.Message);
                        stop.WaitHandle.WaitOne(TimeSpan.FromSeconds(t.Interval));
                        continue;
                    }
                    var st = J.Str(r.Json, "status");
                    if (st == "approved")
                    {
                        Accept(r.Json);
                        return true;
                    }
                    if (st != "pending") throw new IOException("Pairing " + (st ?? "failed") + ". Start again.");
                    stop.WaitHandle.WaitOne(TimeSpan.FromSeconds(t.Interval));
                }
            }
            return false;
        }

        /// <summary>Pairs with the person's own email and password instead of the browser (POST /v2/devices/pair/password,
        /// signed with the pairing key). The password is sent once over HTTPS and kept nowhere, not even in the log.</summary>
        public void PairWithPassword(PairingTicket t, string email, string password)
        {
            using (var c = new CloudLink(Config.GatewayUrl, key, t.PairId, log, o.HttpHandler?.Invoke()))
            {
                var r = c.PostJson("/v2/devices/pair/password", J.O("email", email ?? "", "password", password ?? ""), 30);
                if (r.Status != 200 || J.Str(r.Json, "status") != "approved")
                    throw new IOException(r.Status == 200 ? "Pairing was not approved. Start again." : r.ErrorMessage);
                Accept(r.Json);
            }
        }

        void Accept(Dictionary<string, object> approved)
        {
            var jwk = J.Obj(approved, "gateway_jwk");
            Jwk.ToVerifier(jwk).Dispose(); // valid key
            Config.DeviceId = J.Str(approved, "device_id");
            Config.DeviceName = J.Str(approved, "device_name");
            Config.Account = J.Str(approved, "account");
            Config.GatewayJwk = jwk;
            Config.PairedAt = Times.Now();
            Config.Revoked = false;
            Config.Save(cfgPath);
            log("paired as " + Config.DeviceName + " (" + Config.DeviceId + ")");
            statusDirty = true;
            kick.Set();
            Fire();
        }

        /// <summary>Forgets the registration here and tells the server (best effort). The key stays: the caller
        /// makes a new one before pairing again.</summary>
        public void Unpair()
        {
            try
            {
                if (Config.Paired) MakeCloud().PostJson("/v2/device/unpair", J.O(), 15);
            }
            catch (Exception ex)
            {
                log("unpair: " + ex.Message);
            }
            Config = new DeviceConfig { GatewayUrl = Config.GatewayUrl };
            Config.Save(cfgPath);
            cloud?.Dispose();
            cloud = null;
            session = null;
            kick.Set();
            Fire();
        }

        CloudLink MakeCloud()
        {
            if (cloud == null || cloud.Gateway != (Config.GatewayUrl ?? "").TrimEnd('/') || cloud.Kid != Config.DeviceId)
            {
                cloud?.Dispose();
                cloud = new CloudLink(Config.GatewayUrl, key, Config.DeviceId, log, o.HttpHandler?.Invoke());
                gatewayVerifier?.Dispose();
                gatewayVerifier = Jwk.ToVerifier(Config.GatewayJwk);
                gatewayKid = J.Str(Config.GatewayJwk, "kid") ?? Jwk.Thumbprint(Config.GatewayJwk);
            }
            return cloud;
        }

        // ----------------------------------------------------------------- cloud loop

        void SetCloud(string state, bool connected)
        {
            if (cloudState == state && cloudConnected == connected) return;
            cloudState = state;
            cloudConnected = connected;
            log("cloud: " + state);
            BroadcastState();
            Fire();
        }

        void CloudLoop(CancellationToken stop)
        {
            var backoff = 1.0;
            var rnd = new Random();
            while (!stop.IsCancellationRequested)
            {
                if (!Config.Paired)
                {
                    SetCloud(Config.Revoked ? "Removed from your CAD Automation account: pair again" : "Not registered: pair this computer", false);
                    kick.WaitOne(TimeSpan.FromSeconds(5));
                    continue;
                }
                try
                {
                    var c = MakeCloud();
                    Hello(c, stop);
                    backoff = 1.0;
                    SetCloud("Connected to " + c.Gateway, true);
                    FlushOutbox(c, stop);
                    while (!stop.IsCancellationRequested && session != null)
                    {
                        if (statusDirty || DateTime.UtcNow - lastStatusPost > TimeSpan.FromSeconds(60)) PostStatus(c, stop);
                        var r = c.Get($"/v2/device/next?session={Uri.EscapeDataString(session)}&wait=25", 40, stop);
                        if (r.Status == 204) continue;
                        if (r.Status == 200)
                        {
                            foreach (var m in J.Arr(r.Json, "messages") ?? new List<object>()) OnGatewayMessage(J.Obj(m));
                            continue;
                        }
                        if (r.Status == 409)
                        {
                            var reason = J.Str(r.Json, "reason");
                            log("session ended: " + reason + " " + J.Str(J.Obj(r.Json, "error"), "message"));
                            session = null;
                            if (reason == "revoked") Revoked();
                            break;
                        }
                        if (r.Status == 401) throw new UnauthorizedAccessException(r.ErrorCode + ": " + r.ErrorMessage);
                        throw new IOException("next: HTTP " + r.Status + " " + r.ErrorMessage);
                    }
                }
                catch (UnauthorizedAccessException ex)
                {
                    log("cloud refused this computer: " + ex.Message);
                    if (ex.Message.StartsWith("DEVICE_REVOKED") || ex.Message.StartsWith("DEVICE_UNKNOWN")) Revoked();
                    else
                    {
                        SetCloud("Signed request refused (" + ex.Message + "); retrying", false);
                        kick.WaitOne(TimeSpan.FromSeconds(30));
                    }
                }
                catch (Exception ex) when (!stop.IsCancellationRequested)
                {
                    session = null;
                    lastError = ex.Message;
                    var wait = backoff * (0.5 + rnd.NextDouble());   // jitter, so many PCs do not retry in step
                    SetCloud($"Offline ({Short(ex)}); retrying in {(int)Math.Ceiling(wait)} s", false);
                    kick.WaitOne(TimeSpan.FromSeconds(wait));
                    backoff = Math.Min(backoff * 2, 60);
                }
            }
        }

        static string Short(Exception ex)
        {
            while (ex.InnerException != null) ex = ex.InnerException;
            return ex.Message;
        }

        void Revoked()
        {
            Config.Revoked = true;
            Config.Save(cfgPath);
            session = null;
            SetCloud("Removed from your CAD Automation account: pair again", false);
        }

        void Hello(CloudLink c, CancellationToken stop)
        {
            List<object> inst;
            lock (gate) inst = instances.Values.Where(i => i.Connected).Select(i => (object)i.ForGateway()).ToList();
            var infl = new List<object>();
            lock (gate)
                foreach (var f in inflight.Values)
                    infl.Add(J.O("command_id", f.Id, "status", "running", "result_in_outbox", false));
            foreach (var f in Directory.GetFiles(outboxDir, "*.json"))
                infl.Add(J.O("command_id", Path.GetFileNameWithoutExtension(f), "status", "succeeded", "result_in_outbox", true));
            var hello = Msg.New("device.hello", "device_id", Config.DeviceId, "companion_version", o.Version, "protocol", J.O("min", Protocol.Version, "max", Protocol.Version),
                                "os", o.OsName, "installations", o.Installations(), "instances", inst, "paused", Paused, "inflight", infl);
            var r = c.PostJson("/v2/device/hello", hello, 30, stop);
            if (r.Status == 401) throw new UnauthorizedAccessException(r.ErrorCode + ": " + r.ErrorMessage);
            if (r.Status == 426) throw new IOException("This BIZOMAT Companion is too old for the server: update " + BrandArt.Package + ".");
            if (r.Status != 200) throw new IOException("hello: HTTP " + r.Status + " " + r.ErrorMessage);
            var kids = J.Strs(J.Obj(r.Json, "keys"), "command_kids") ?? new List<string>();
            if (!kids.Contains(gatewayKid))
                throw new UnauthorizedAccessException("GATEWAY_KEY_CHANGED: the server's command key is not the one pinned at pairing. Pair this computer again.");
            session = J.Str(r.Json, "session_id");
            var name = J.Str(r.Json, "device_name");
            if (!string.IsNullOrEmpty(name) && name != Config.DeviceName)
            {
                Config.DeviceName = name;
                Config.Save(cfgPath);
            }
            statusDirty = true;
            foreach (var a in J.Arr(r.Json, "reconcile") ?? new List<object>())
            {
                var d = J.Obj(a);
                if (J.Str(d, "action") == "forget")
                {
                    var p = Path.Combine(outboxDir, J.Str(d, "command_id") + ".json");
                    if (File.Exists(p)) File.Delete(p);
                }
            }
        }

        void PostStatus(CloudLink c, CancellationToken stop)
        {
            statusDirty = false;
            lastStatusPost = DateTime.UtcNow;
            List<object> inst;
            lock (gate) inst = instances.Values.Where(i => i.Connected).Select(i => (object)i.ForGateway()).ToList();
            try
            {
                var r = c.PostJson("/v2/device/status", Msg.New("device.status", "device_id", Config.DeviceId, "session_id", session, "instances", inst, "paused", Paused), 20, stop);
                if (r.Status == 409) session = null;
            }
            catch (Exception ex) when (!stop.IsCancellationRequested)
            {
                statusDirty = true;
                log("status: " + ex.Message);
            }
        }

        /// <summary>Posts a status change from another thread (instances came or went), without waiting for the poll.</summary>
        void PushStatusSoon()
        {
            statusDirty = true;
            var c = cloud;
            var s = session;
            if (c == null || s == null) return;
            Later("status", () =>
            {
                Thread.Sleep(300);   // events come in bursts (a document opens: several)
                if (!statusDirty) return;
                PostStatus(c, cts?.Token ?? CancellationToken.None);
            });
        }

        // ----------------------------------------------------------------- commands from the gateway

        void OnGatewayMessage(Dictionary<string, object> m)
        {
            if (m == null) return;
            switch (J.Str(m, "type"))
            {
                case "command.deliver":
                    Later("deliver", () => Deliver(m));
                    break;
                case "command.cancel":
                    try
                    {
                        var payload = Json.ParseObject(Jws.Verify(J.Str(m, "jws"), gatewayVerifier, out var h));
                        if (J.Str(h, "typ") != "kevos-cancel" || J.Str(payload, "device_id") != Config.DeviceId) throw new CryptographicException("not a cancel for this computer");
                        var cid = J.Str(payload, "command_id");
                        Inflight f;
                        lock (gate) inflight.TryGetValue(cid ?? "", out f);
                        SwInstance inst = null;
                        if (f != null)
                            lock (gate) instances.TryGetValue(f.InstanceId, out inst);
                        if (inst != null) Send(inst, Msg.New("command.cancel", "pipe_session", inst.PipeSession, "command_id", cid, "reason", J.Str(payload, "reason") ?? "client_cancelled"));
                        log("cancel " + cid + " (" + J.Str(payload, "reason") + ")");
                    }
                    catch (Exception ex)
                    {
                        log("refused a cancel: " + ex.Message);
                    }
                    break;
            }
        }

        void Ack(string cid, string ack, Dictionary<string, object> error = null, string hop = "companion", string status = null)
        {
            var a = Msg.New("command.ack", "command_id", cid, "device_id", Config.DeviceId, "attempt", 1.0, "hop", hop, "ack", ack);
            if (error != null) a["error"] = error;
            if (status != null) a["status"] = status;
            try
            {
                cloud?.PostJson("/v2/device/ack", a, 30);
            }
            catch (Exception ex)
            {
                log("ack: " + ex.Message);
            }
        }

        void Reject(string cid, string code, string message, string category = "device")
        {
            log($"rejected {cid}: {code} {message}");
            Ack(cid, "rejected", Msg.Error(code, category, message, false, "companion"));
        }

        void Deliver(Dictionary<string, object> m)
        {
            var jws = J.Str(m, "jws");
            Dictionary<string, object> cmd;
            try
            {
                cmd = Json.ParseObject(Jws.Verify(jws, gatewayVerifier, out var header));
                if (J.Str(header, "typ") != "kevos-command") throw new CryptographicException("not a command");
                if (J.Str(header, "kid") != gatewayKid) throw new CryptographicException("signed by another key");
            }
            catch (Exception ex)
            {
                // nothing about it can be trusted, not even its id: logged, never run
                log("REFUSED a command whose signature does not verify: " + ex.Message);
                var cidGuess = J.Str(m, "command_id");
                if (Ids.Valid(cidGuess, "cmd")) Reject(cidGuess, "SIGNATURE_INVALID", "The command's signature does not verify; it was not run.", "auth");
                return;
            }
            var cid = J.Str(cmd, "command_id");
            var op = J.Str(cmd, "op");
            if (!Ids.Valid(cid, "cmd"))
            {
                log("command without a valid id");
                return;
            }
            if (J.Str(cmd, "device_id") != Config.DeviceId)
            {
                Reject(cid, "WRONG_DEVICE", "This command is for another computer; it was not run.", "auth");
                return;
            }
            if (!Times.TryParse(J.Str(cmd, "expires_at"), out var expires) || expires < cloud.Now)
            {
                Reject(cid, "EXPIRED", "The command expired before it reached this computer.", "transport");
                return;
            }
            if (!seen.Add(cid, expires))
            {
                Inflight known;
                lock (gate) inflight.TryGetValue(cid, out known);
                var inOutbox = File.Exists(Path.Combine(outboxDir, cid + ".json"));
                log("duplicate delivery of " + cid);
                Ack(cid, "duplicate", status: known != null ? "running" : inOutbox ? "succeeded" : "running");
                if (inOutbox) Later("results", () => FlushOutbox(cloud, CancellationToken.None));
                return;
            }
            if (!Protocol.Ops.Contains(op))
            {
                Reject(cid, "UNKNOWN_OP", $"This computer does not know the operation '{op}'. Update {BrandArt.Package}.", "input");
                return;
            }
            if (J.Obj(cmd, "params") == null)
            {
                Reject(cid, "INPUT_INVALID", "The command has no parameters.", "input");
                return;
            }
            if (Paused)
            {
                Reject(cid, "PAUSED", $"CAD Automation is paused on {Config.DeviceName} by the person at that computer.", "policy");
                return;
            }
            var inst = Choose(cmd);
            if (inst == null && o.StartSolidWorks != null && o.SolidWorksProcesses() == 0)
            {
                log("no SOLIDWORKS running: starting it for " + cid);
                if (o.StartSolidWorks())
                {
                    var until = DateTime.UtcNow.AddSeconds(150);
                    while (inst == null && DateTime.UtcNow < until && DateTime.UtcNow < expires)
                    {
                        Thread.Sleep(1000);
                        inst = Choose(cmd);
                    }
                }
            }
            if (inst == null)
            {
                var running = o.SolidWorksProcesses() > 0;
                Reject(cid, "INSTANCE_NOT_RUNNING", running
                           ? $"SOLIDWORKS is running on {Config.DeviceName} but the add-in is not loaded. In SOLIDWORKS: Tools > Add-Ins, tick {BrandArt.Product} (Active and Start Up)."
                           : $"SOLIDWORKS is not running on {Config.DeviceName}. Open SOLIDWORKS there; CAD Automation connects by itself.");
                return;
            }
            Ack(cid, "accepted");
            // files for SOLIDWORKS: fetched, checked against the signed size and hash, kept in this command's spool folder
            var spool = Path.Combine(spoolDir, cid);
            Directory.CreateDirectory(spool);
            var local = new Dictionary<string, object>();
            foreach (var fo in J.Arr(cmd, "files_in") ?? new List<object>())
            {
                var f = J.Obj(fo);
                var name = J.Str(f, "name");
                var r = cloud.Get("/v2/device/blob/" + Uri.EscapeDataString(J.Str(f, "blob_id") ?? ""), 600);
                if (r.Status != 200 || B64.Sha256Tagged(r.Body) != J.Str(f, "sha256") || r.Body.Length != J.Int(f, "size"))
                {
                    Ack(cid, "rejected", Msg.Error("RESULT_LOST", "transport", "A file for this command did not arrive intact.", true, "companion"));
                    return;
                }
                var safe = SafeName(J.Str(f, "filename") ?? name);
                var path = Path.Combine(spool, "in_" + safe);
                File.WriteAllBytes(path, r.Body);
                local[name] = path;
            }
            var fl = new Inflight
            {
                Id = cid, InstanceId = inst.Id, DeviceId = Config.DeviceId, ParamsSha = J.Str(cmd, "params_sha256"), Op = op, Jws = jws, Spool = spool
            };
            lock (gate) inflight[cid] = fl;
            lastCommand = op + " (" + Times.Now() + ")";
            log($">> {cid} {op} -> SOLIDWORKS pid {inst.Pid}");
            if (!Send(inst, Msg.New("command.deliver", "pipe_session", inst.PipeSession, "attempt", J.Num(m, "attempt", 1), "command_id", cid, "jws", jws,
                                    "local", J.O("pipe_session", inst.PipeSession, "instance_id", inst.Id, "spool_dir", spool, "files_in", local))))
            {
                lock (gate) inflight.Remove(cid);
                Ack(cid, "rejected", Msg.Error("INSTANCE_NOT_RUNNING", "device", "SOLIDWORKS closed the link just now. Try again.", true, "companion"));
                return;
            }
            Fire();
        }

        static string SafeName(string s)
        {
            var bad = Path.GetInvalidFileNameChars();
            var n = new string((s ?? "file").Select(c => bad.Contains(c) ? '_' : c).ToArray()).Trim();
            return string.IsNullOrEmpty(n) || n == "." || n == ".." ? "file" : n;
        }

        /// <summary>The SOLIDWORKS a command goes to: the one with its document open, else the one used last.</summary>
        SwInstance Choose(Dictionary<string, object> cmd)
        {
            var doc = J.Str(J.Obj(cmd, "instance"), "doc") ?? J.Str(J.Obj(cmd, "params"), "doc");
            var wantId = J.Str(J.Obj(cmd, "instance"), "instance_id");
            lock (gate)
            {
                var live = instances.Values.Where(i => i.Connected).ToList();
                if (live.Count == 0) return null;
                if (wantId != null) return live.FirstOrDefault(i => i.Id == wantId);
                var withDoc = live.Where(i => i.HasDoc(doc)).ToList();
                if (withDoc.Count > 0) return withDoc.OrderByDescending(i => i.LastActive).First();
                return live.OrderByDescending(i => i.LastActive).ThenBy(i => i.Busy != null).First();
            }
        }

        // ----------------------------------------------------------------- results back to the gateway

        void OnResult(SwInstance inst, Dictionary<string, object> r)
        {
            var cid = J.Str(r, "command_id");
            Inflight f;
            lock (gate)
            {
                inflight.TryGetValue(cid ?? "", out f);
                inflight.Remove(cid ?? "");
            }
            if (f == null)
            {
                log("result for an unknown command " + cid + " (already sent?)");
                return;
            }
            commandsRun++;
            // the files SOLIDWORKS made must be inside this command's spool folder
            var files = new List<object>();
            foreach (var fo in J.Arr(r, "files_out") ?? new List<object>())
            {
                var x = J.Obj(fo);
                var p = J.Str(x, "path");
                if (p == null || !Path.GetFullPath(p).StartsWith(Path.GetFullPath(f.Spool), StringComparison.OrdinalIgnoreCase) || !File.Exists(p))
                {
                    log("dropped a result file outside the spool: " + p);
                    continue;
                }
                files.Add(J.O("name", J.Str(x, "name"), "path", p, "size", (double)new FileInfo(p).Length, "sha256", J.Str(x, "sha256")));
            }
            var body = Msg.New("command.result", "command_id", cid, "device_id", Config.DeviceId, "instance_id", inst?.Id, "status", J.Str(r, "status") ?? "failed",
                               "params_sha256", f.ParamsSha, "started_at", J.Str(r, "started_at"), "finished_at", J.Str(r, "finished_at") ?? Times.Now(),
                               "duration_ms", J.Num(r, "duration_ms"), "result", r.ContainsKey("result") ? r["result"] : null, "error", r.ContainsKey("error") ? r["error"] : null,
                               "files_out", files, "executor", J.Obj(r, "executor") ?? J.O("addin_version", "0.0.0", "sw_revision", ""));
            if (J.Bool(r, "cancel_ignored")) body["cancel_ignored"] = true;
            var entry = Path.Combine(outboxDir, cid + ".json");
            File.WriteAllText(entry, Json.Write(J.O("spool", f.Spool, "body", body)));
            lastError = J.Str(J.Obj(r, "error"), "message");
            Fire();
            Later("results", () => FlushOutbox(cloud, CancellationToken.None));
        }

        readonly object flushGate = new object();

        /// <summary>Sends every stored result (files first, in chunks); each is deleted once the gateway has it.</summary>
        void FlushOutbox(CloudLink c, CancellationToken stop)
        {
            if (c == null) return;
            lock (flushGate)
            {
                foreach (var entryPath in Directory.GetFiles(outboxDir, "*.json").OrderBy(File.GetLastWriteTimeUtc))
                {
                    if (stop.IsCancellationRequested) return;
                    Dictionary<string, object> entry;
                    try
                    {
                        entry = Json.ParseObject(File.ReadAllText(entryPath));
                    }
                    catch (Exception)
                    {
                        File.Delete(entryPath);
                        continue;
                    }
                    var body = J.Obj(entry, "body");
                    var cid = J.Str(body, "command_id");
                    try
                    {
                        var chunk = 32 * 1024 * 1024;
                        var outFiles = new List<object>();
                        foreach (var fo in J.Arr(body, "files_out") ?? new List<object>())
                        {
                            var x = J.Obj(fo);
                            var data = File.ReadAllBytes(J.Str(x, "path"));
                            var parts = Math.Max(1, (data.Length + chunk - 1) / chunk);
                            for (var i = 0; i < parts; i++)
                            {
                                var len = Math.Min(chunk, data.Length - i * chunk);
                                var part = new byte[Math.Max(0, len)];
                                Buffer.BlockCopy(data, i * chunk, part, 0, part.Length);
                                var path = $"/v2/device/file?command={Uri.EscapeDataString(cid)}&name={Uri.EscapeDataString(J.Str(x, "name"))}&part={i}&parts={parts}";
                                var r = c.Send("POST", path, part, "application/octet-stream", TimeSpan.FromSeconds(600), stop);
                                if (r.Status == 404 || r.Status == 401 && r.ErrorCode == "UNAUTHENTICATED") throw new InvalidOperationException("gone");
                                if (r.Status != 200) throw new IOException("file: HTTP " + r.Status + " " + r.ErrorMessage);
                            }
                            outFiles.Add(J.O("name", J.Str(x, "name"), "size", (double)data.Length, "sha256", B64.Sha256Tagged(data)));
                        }
                        var send = new Dictionary<string, object>(body) { ["files_out"] = outFiles };
                        var res = c.PostJson("/v2/device/result", send, 120, stop);
                        if (res.Status == 200 || res.Status == 404)
                        {
                            log($"<< {cid} {J.Str(body, "status")} stored by the gateway" + (res.Status == 404 ? " (it no longer knew it)" : ""));
                            Done(entryPath, J.Str(entry, "spool"));
                        }
                        else if (res.Status == 400)
                        {
                            log("gateway refused the result of " + cid + ": " + res.ErrorMessage);
                            Done(entryPath, J.Str(entry, "spool"));
                        }
                        else throw new IOException("result: HTTP " + res.Status);
                    }
                    catch (InvalidOperationException)
                    {
                        // the command is no longer open at the gateway (it gave up): the result without files still counts
                        try
                        {
                            var send = new Dictionary<string, object>(body) { ["files_out"] = new List<object>() };
                            c.PostJson("/v2/device/result", send, 60, stop);
                        }
                        catch (Exception)
                        {
                        }
                        Done(entryPath, J.Str(entry, "spool"));
                    }
                    catch (Exception ex) when (!stop.IsCancellationRequested)
                    {
                        log("result " + cid + " kept for later: " + ex.Message);
                        return;
                    }
                }
            }
        }

        void Done(string entryPath, string spool)
        {
            try
            {
                File.Delete(entryPath);
                if (spool != null && Directory.Exists(spool)) Directory.Delete(spool, true);
            }
            catch (Exception)
            {
            }
        }

        void CleanSpool()
        {
            try
            {
                foreach (var d in Directory.GetDirectories(spoolDir))
                    if (Directory.GetLastWriteTimeUtc(d) < DateTime.UtcNow.AddDays(-1) && !File.Exists(Path.Combine(outboxDir, Path.GetFileName(d) + ".json")))
                        Directory.Delete(d, true);
            }
            catch (Exception)
            {
            }
        }

        // ----------------------------------------------------------------- the pipe: SOLIDWORKS add-ins

        void AcceptLoop(CancellationToken stop)
        {
            while (!stop.IsCancellationRequested)
            {
                Stream s;
                PeerInfo peer;
                try
                {
                    s = listener.Accept(stop, out peer);
                }
                catch (Exception ex) when (!stop.IsCancellationRequested)
                {
                    log("pipe accept: " + ex.Message);
                    stop.WaitHandle.WaitOne(1000);
                    continue;
                }
                if (s == null) continue;
                var why = peer == null ? "no peer information" : o.VerifyPeer(peer);
                if (why != null)
                {
                    log("REFUSED a pipe client (pid " + peer?.Pid + ", " + peer?.Image + "): " + why);
                    try
                    {
                        Frames.Write(s, Msg.New("pipe.bye", "pipe_session", "pip_" + new string('0', 26), "reason", "peer_rejected"));
                    }
                    catch (Exception)
                    {
                    }
                    s.Dispose();
                    continue;
                }
                var stream = s;
                Start("KEVOS add-in " + peer.Pid, () => Serve(stream, peer, stop));
            }
        }

        void Serve(Stream s, PeerInfo peer, CancellationToken stop)
        {
            SwInstance inst = null;
            try
            {
                var hello = Frames.Read(s);
                if (hello == null || J.Str(hello, "type") != "pipe.hello") throw new IOException("the add-in did not say hello");
                var pid = J.Int(hello, "pid");
                if (peer.Pid > 0 && pid != peer.Pid) throw new IOException($"the add-in says pid {pid} but the pipe client is {peer.Pid}");
                var started = J.Str(hello, "process_started_at");
                lock (gate)
                {
                    inst = instances.Values.FirstOrDefault(i => i.Pid == pid && i.ProcessStarted == started);
                    if (inst == null)
                    {
                        inst = new SwInstance { Id = Ids.New("swi"), Pid = pid, ProcessStarted = started };
                        instances[inst.Id] = inst;
                    }
                    if (inst.Stream != null)
                        try
                        {
                            inst.Stream.Dispose();
                        }
                        catch (Exception)
                        {
                        }
                    inst.Hello = hello;
                    inst.PipeSession = Ids.New("pip");
                    inst.LastPong = DateTime.UtcNow;
                    inst.LastActive = DateTime.UtcNow;
                    inst.Stream = s;
                }
                var w = Msg.New("pipe.welcome", "pipe_session", inst.PipeSession, "instance_id", inst.Id, "companion_version", o.Version, "protocol", Protocol.Version,
                                "device_id", Config.Paired ? Config.DeviceId : null, "heartbeat", J.O("interval_ms", (double)Protocol.PingMs, "missed_limit", (double)Protocol.MissedPings, "ui_probe_ms", (double)Protocol.UiProbeMs),
                                "paused", Paused, "confirm_destructive", o.ConfirmDestructive);
                foreach (var kv in CompanionStateFields()) w[kv.Key] = kv.Value;
                Send(inst, w);
                log($"SOLIDWORKS {inst.SwRevision} (pid {pid}, add-in {inst.AddinVersion}) connected as {inst.Id}");
                PushStatusSoon();
                Fire();
                while (!stop.IsCancellationRequested)
                {
                    var m = Frames.Read(s);
                    if (m == null) break;
                    OnAddin(inst, m);
                }
            }
            catch (Exception ex) when (!stop.IsCancellationRequested)
            {
                log("add-in link: " + ex.Message);
            }
            finally
            {
                try
                {
                    s.Dispose();
                }
                catch (Exception)
                {
                }
                if (inst != null)
                {
                    lock (gate)
                    {
                        if (ReferenceEquals(inst.Stream, s)) inst.Stream = null;
                    }
                    log("SOLIDWORKS pid " + inst.Pid + " disconnected");
                    Later("disconnect", () => AfterDisconnect(inst));
                    PushStatusSoon();
                    Fire();
                }
            }
        }

        /// <summary>A command whose SOLIDWORKS went away (closed or crashed) fails after a short grace, during which a
        /// mere pipe reconnect would bring its result.</summary>
        void AfterDisconnect(SwInstance inst)
        {
            Thread.Sleep(5000);
            lock (gate)
                if (inst.Connected)
                    return;
            if (o.ProcessAlive(inst.Pid)) return;   // the add-in will reconnect and send what it finished
            List<Inflight> lost;
            lock (gate)
            {
                lost = inflight.Values.Where(f => f.InstanceId == inst.Id).ToList();
                instances.Remove(inst.Id);
            }
            foreach (var f in lost)
                OnResult(null, J.O("command_id", f.Id, "status", "failed", "error",
                                   Msg.Error("RESULT_LOST", "solidworks", "SOLIDWORKS closed (or stopped responding) while it worked on this. Open it again and read the document to see what was done.", false, "companion")));
            PushStatusSoon();
            Fire();
        }

        Dictionary<string, object> CompanionStateFields() =>
            J.O("device_name", Config.DeviceName, "device_id", Config.Paired ? Config.DeviceId : null, "account", Config.Account, "gateway", Config.GatewayUrl,
                "cloud", cloudState, "cloud_connected", cloudConnected, "paused", Paused);

        void BroadcastState()
        {
            List<SwInstance> live;
            lock (gate) live = instances.Values.Where(i => i.Connected).ToList();
            foreach (var i in live)
            {
                var m = Msg.New("companion.state", "pipe_session", i.PipeSession);
                foreach (var kv in CompanionStateFields()) m[kv.Key] = kv.Value;
                Send(i, m);
            }
        }

        bool Send(SwInstance i, Dictionary<string, object> m)
        {
            lock (i.WriteLock)
            {
                var s = i.Stream;
                if (s == null) return false;
                try
                {
                    Frames.Write(s, m);
                    return true;
                }
                catch (Exception ex)
                {
                    log("pipe write: " + ex.Message);
                    try
                    {
                        s.Dispose();
                    }
                    catch (Exception)
                    {
                    }
                    return false;
                }
            }
        }

        void OnAddin(SwInstance inst, Dictionary<string, object> m)
        {
            var cid = J.Str(m, "command_id");
            switch (J.Str(m, "type"))
            {
                case "pipe.pong":
                    inst.LastPong = DateTime.UtcNow;
                    var changed = inst.UiResponsive != J.Bool(m, "ui_responsive", true) || inst.Modal != J.Bool(m, "modal_dialog");
                    inst.UiResponsive = J.Bool(m, "ui_responsive", true);
                    inst.Modal = J.Bool(m, "modal_dialog");
                    if (changed)
                    {
                        PushStatusSoon();
                        Fire();
                    }
                    break;
                case "addin.state":
                    inst.Docs = J.Arr(m, "docs") ?? new List<object>();
                    inst.UserSketch = J.Bool(m, "user_sketch_open");
                    var busy = J.Str(m, "busy");
                    if (busy != inst.Busy) inst.BusySince = DateTime.UtcNow;
                    inst.Busy = busy;
                    if (m.ContainsKey("modal_dialog")) inst.Modal = J.Bool(m, "modal_dialog");
                    PushStatusSoon();
                    Fire();
                    break;
                case "addin.event":
                    if (J.Str(m, "event") == "doc_activated") inst.LastActive = DateTime.UtcNow;
                    break;
                case "command.ack":
                    var ack = J.Str(m, "ack");
                    if (ack == "accepted")
                        PostProgress(Msg.New("command.status", "command_id", cid, "device_id", Config.DeviceId, "instance_id", inst.Id, "status", "accepted", "at", Times.Now()));
                    else if (ack == "rejected")
                    {
                        lock (gate) inflight.Remove(cid ?? "");
                        Ack(cid, "rejected", J.Obj(m, "error") ?? Msg.Error("SW_REFUSED", "solidworks", "The add-in refused the command.", false, "addin"), "addin");
                    }
                    break;
                case "command.status":
                    inst.LastActive = DateTime.UtcNow;
                    var st = new Dictionary<string, object>(m) { ["device_id"] = Config.DeviceId, ["instance_id"] = inst.Id };
                    st.Remove("pipe_session");
                    PostProgress(st);
                    break;
                case "command.result":
                    OnResult(inst, m);
                    break;
            }
        }

        void PostProgress(Dictionary<string, object> body)
        {
            Later("progress", () => cloud?.PostJson("/v2/device/progress", body, 30));
        }

        void PingLoop(CancellationToken stop)
        {
            long seq = 0;
            while (!stop.WaitHandle.WaitOne(Protocol.PingMs))
            {
                List<SwInstance> live;
                lock (gate) live = instances.Values.Where(i => i.Connected).ToList();
                foreach (var i in live)
                {
                    if (DateTime.UtcNow - i.LastPong > TimeSpan.FromMilliseconds(Protocol.PingMs * Protocol.MissedPings + 2000))
                    {
                        log("SOLIDWORKS pid " + i.Pid + " missed " + Protocol.MissedPings + " heartbeats: closing its link");
                        try
                        {
                            i.Stream?.Dispose();
                        }
                        catch (Exception)
                        {
                        }
                        continue;
                    }
                    Send(i, Msg.New("pipe.ping", "pipe_session", i.PipeSession, "seq", (double)seq++));
                }
            }
        }
    }
}
