using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using OpenSketch.Sw.Core;

namespace OpenSketch.Sw.Bridge
{
    /// <summary>What one command knows while it runs: its id, who asked, and whether it should stop.</summary>
    public sealed class CommandContext
    {
        public readonly string CommandId;
        public readonly string Op;
        public readonly Dictionary<string, object> Command;
        volatile bool cancel;
        internal Action<int, int, string> OnProgress;

        public CommandContext(string id, string op, Dictionary<string, object> command)
        {
            CommandId = id;
            Op = op;
            Command = command ?? new Dictionary<string, object>();
        }

        /// <summary>The command running in SOLIDWORKS now (set on SOLIDWORKS' thread around each command).</summary>
        public static volatile CommandContext Current;

        public bool CancelRequested => cancel;

        public void Cancel() => cancel = true;

        /// <summary>Long handlers call this between steps (Batch, AddFeatures, EditDrawing): a cancel stops them there,
        /// and Batch rolls back what it made.</summary>
        public static void ThrowIfCancelled()
        {
            var c = Current;
            if (c != null && c.cancel) throw new UserError("Cancelled at the AI app's request.", "CANCELLED");
        }

        public static void Progress(int step, int of, string note)
        {
            try
            {
                Current?.OnProgress?.Invoke(step, of, note);
            }
            catch (Exception)
            {
            }
        }

        /// <summary>Who asked, for the confirmation shown in SOLIDWORKS ("Claude wants to ...").</summary>
        public string ClientName => J.Str(J.Obj(J.Obj(Command, "issued_by"), "client"), "name") ?? "The AI app";
    }

    /// <summary>What the add-in gives the pipe link. Everything here must be safe to call from the link's threads:
    /// Execute marshals to SOLIDWORKS' UI thread itself; Probe and State read values the UI thread keeps up to date.</summary>
    public interface IAddinHost
    {
        /// <summary>pid, process_started_at, sw_revision, install_path, addin_version, capabilities.</summary>
        Dictionary<string, object> Hello();

        Dictionary<string, object> Execute(string op, Dictionary<string, object> args, ICommandIO io, CommandContext ctx);

        /// <summary>{ui_responsive, modal_dialog, ui_last_ok_at}: quick, never blocks on SOLIDWORKS.</summary>
        Dictionary<string, object> Probe();

        /// <summary>{docs, user_sketch_open, modal_dialog}: the add-in's last snapshot.</summary>
        Dictionary<string, object> State();

        /// <summary>The companion has not answered for a while: start it (the add-in knows where it is installed).</summary>
        void CompanionMissing();
    }

    /// <summary>
    /// The add-in's side of the local link to the KEVOS Companion (named pipe, protocol 2). Connects by itself and
    /// again after the companion restarts; never blocks SOLIDWORKS: a reader thread answers pings and cancels while a
    /// worker thread hands one command at a time to the host (which runs it on SOLIDWORKS' UI thread). Results made
    /// while the pipe is down wait in an outbox and go out after the next hello.
    /// </summary>
    public sealed class PipeLink
    {
        readonly Func<CancellationToken, Stream> connect;
        readonly IAddinHost host;
        readonly Action<string> log;
        readonly string spoolRoot;
        readonly object writeLock = new object();
        readonly object jobsLock = new object();
        readonly List<Job> jobs = new List<Job>();
        readonly AutoResetEvent jobReady = new AutoResetEvent(false);
        readonly Queue<Dictionary<string, object>> outbox = new Queue<Dictionary<string, object>>();
        readonly Dictionary<string, Dictionary<string, object>> recent = new Dictionary<string, Dictionary<string, object>>();
        readonly List<string> recentOrder = new List<string>();
        readonly ReplayGuard seen = new ReplayGuard();
        Stream stream;
        Job running;
        Thread worker;
        DateTime lastHeard;
        DateTime missingSince = DateTime.MaxValue;
        DateTime lastMissingCall = DateTime.MinValue;

        public string State { get; private set; } = "Not started";
        public bool Connected { get; private set; }
        public string InstanceId { get; private set; }
        /// <summary>The companion's last word on the device: device_id, device_name, cloud, gateway, paused.</summary>
        public Dictionary<string, object> Companion { get; private set; } = new Dictionary<string, object>();
        public int CommandsRun { get; private set; }
        public string RunningOp => running?.Ctx.Op;
        public event Action Changed;
        public static readonly TimeSpan[] Backoff = { TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(2), TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(10) };

        sealed class Job
        {
            public Dictionary<string, object> Cmd;
            public Dictionary<string, object> Local;
            public CommandContext Ctx;
        }

        public PipeLink(Func<CancellationToken, Stream> connect, IAddinHost host, Action<string> log, string spoolRoot = null)
        {
            this.connect = connect;
            this.host = host;
            this.log = log ?? (_ => { });
            this.spoolRoot = spoolRoot;
        }

        void Set(string state, bool connected)
        {
            State = state;
            Connected = connected;
            try
            {
                Changed?.Invoke();
            }
            catch (Exception)
            {
            }
        }

        /// <summary>Runs until stopped. Never throws: it runs inside SOLIDWORKS, where an unhandled exception on any
        /// thread would close SOLIDWORKS.</summary>
        public void Run(CancellationToken stop)
        {
            try
            {
                RunLoop(stop);
            }
            catch (Exception ex)
            {
                if (!stop.IsCancellationRequested) log("pipe link stopped unexpectedly: " + ex);
            }
        }

        void RunLoop(CancellationToken stop)
        {
            worker = new Thread(() =>
            {
                try
                {
                    Work(stop);
                }
                catch (Exception ex)
                {
                    if (!stop.IsCancellationRequested) log("command worker stopped unexpectedly: " + ex);
                }
            }) { IsBackground = true, Name = "KEVOS commands" };
            worker.Start();
            var attempt = 0;
            while (!stop.IsCancellationRequested)
            {
                Stream s;
                try
                {
                    Set(attempt == 0 ? "Connecting to the KEVOS Companion" : "Waiting for the KEVOS Companion", false);
                    s = connect(stop);
                }
                catch (Exception ex)
                {
                    if (stop.IsCancellationRequested) break;
                    if (missingSince == DateTime.MaxValue) missingSince = DateTime.UtcNow;
                    if (DateTime.UtcNow - missingSince > TimeSpan.FromSeconds(5) && DateTime.UtcNow - lastMissingCall > TimeSpan.FromSeconds(60))
                    {
                        lastMissingCall = DateTime.UtcNow;
                        log("companion not running (" + ex.Message + "); starting it");
                        try
                        {
                            host.CompanionMissing();
                        }
                        catch (Exception e2)
                        {
                            log("could not start the companion: " + e2.Message);
                        }
                    }
                    Set("KEVOS Companion not running", false);
                    stop.WaitHandle.WaitOne(Backoff[Math.Min(attempt++, Backoff.Length - 1)]);
                    continue;
                }
                if (stop.IsCancellationRequested) break;
                missingSince = DateTime.MaxValue;
                attempt = 0;
                try
                {
                    Session(s, stop);
                }
                catch (Exception ex)
                {
                    if (!stop.IsCancellationRequested) log("pipe: " + ex.Message);
                }
                finally
                {
                    lock (writeLock)
                    {
                        stream = null;
                    }
                    try
                    {
                        s.Dispose();
                    }
                    catch (Exception)
                    {
                    }
                    Set("KEVOS Companion disconnected", false);
                }
                if (!stop.IsCancellationRequested) stop.WaitHandle.WaitOne(Backoff[0]);
            }
            jobReady.Set();
            Set("Stopped", false);
        }

        void Session(Stream s, CancellationToken stop)
        {
            var hello = host.Hello() ?? new Dictionary<string, object>();
            var msg = Msg.New("pipe.hello");
            foreach (var kv in hello) msg[kv.Key] = kv.Value;
            msg["protocol"] = J.O("min", Protocol.Version, "max", Protocol.Version);
            lock (outbox) msg["recent"] = outbox.Select(r => (object)J.O("command_id", J.Str(r, "command_id"), "status", J.Str(r, "status"), "result_in_outbox", true)).ToList();
            Frames.Write(s, msg);
            var welcome = Frames.Read(s);
            if (welcome == null || J.Str(welcome, "type") != "pipe.welcome")
                throw new IOException("The companion did not welcome this add-in (" + (J.Str(welcome, "type") ?? "closed") + ").");
            InstanceId = J.Str(welcome, "instance_id");
            Companion = welcome;
            lock (writeLock) stream = s;
            lastHeard = DateTime.UtcNow;
            Set("Connected to the KEVOS Companion", true);
            log("pipe connected, instance " + InstanceId);
            // results that waited while the pipe was down
            while (true)
            {
                Dictionary<string, object> r;
                lock (outbox)
                {
                    if (outbox.Count == 0) break;
                    r = outbox.Dequeue();
                }
                if (!Send(r)) return;
            }
            Send(StateMessage());
            var limit = TimeSpan.FromMilliseconds(Protocol.PingMs * Protocol.MissedPings);
            using (var watchdog = new Timer(_ =>
                   {
                       if (DateTime.UtcNow - lastHeard > limit)
                       {
                           log("companion silent for " + (int)limit.TotalSeconds + " s: reconnecting");
                           try
                           {
                               s.Dispose();
                           }
                           catch (Exception)
                           {
                           }
                       }
                   }, null, 1000, 1000))
            {
                while (!stop.IsCancellationRequested)
                {
                    var m = Frames.Read(s);
                    if (m == null) return;
                    lastHeard = DateTime.UtcNow;
                    Handle(m);
                }
            }
        }

        bool Send(Dictionary<string, object> m)
        {
            lock (writeLock)
            {
                if (stream == null)
                {
                    if (J.Str(m, "type") == "command.result")
                        lock (outbox) outbox.Enqueue(m);
                    return false;
                }
                try
                {
                    if (J.Str(m, "type") != "pipe.pong" && J.Str(m, "type") != "pipe.hello") m["pipe_session"] = J.Str(Companion, "pipe_session");
                    Frames.Write(stream, m);
                    return true;
                }
                catch (Exception ex)
                {
                    log("pipe write: " + ex.Message);
                    if (J.Str(m, "type") == "command.result")
                        lock (outbox) outbox.Enqueue(m);
                    try
                    {
                        stream.Dispose();
                    }
                    catch (Exception)
                    {
                    }
                    stream = null;
                    return false;
                }
            }
        }

        Dictionary<string, object> StateMessage()
        {
            var m = Msg.New("addin.state");
            var st = host.State() ?? new Dictionary<string, object>();
            foreach (var kv in st) m[kv.Key] = kv.Value;
            m["busy"] = running?.Ctx.CommandId;
            return m;
        }

        /// <summary>Tells the companion what SOLIDWORKS has open now (after document events).</summary>
        public void PushState() => Send(StateMessage());

        /// <summary>A document event for the companion's log and routing.</summary>
        public void Event(string ev, Dictionary<string, object> doc = null)
        {
            var m = Msg.New("addin.event", "event", ev);
            if (doc != null) m["doc"] = doc;
            Send(m);
        }

        void Handle(Dictionary<string, object> m)
        {
            switch (J.Str(m, "type"))
            {
                case "pipe.ping":
                    var pong = Msg.New("pipe.pong", "pipe_session", J.Str(Companion, "pipe_session"), "seq", J.Num(m, "seq"));
                    var probe = host.Probe() ?? new Dictionary<string, object>();
                    foreach (var kv in probe) pong[kv.Key] = kv.Value;
                    pong["busy"] = running?.Ctx.CommandId;
                    Send(pong);
                    break;
                case "companion.state":
                    var c = new Dictionary<string, object>(Companion);
                    foreach (var kv in m) c[kv.Key] = kv.Value;
                    Companion = c;
                    Set(State, Connected);
                    break;
                case "command.deliver":
                    Deliver(m);
                    break;
                case "command.cancel":
                    CancelCommand(J.Str(m, "command_id"), J.Str(m, "reason") ?? "client_cancelled");
                    break;
                case "pipe.bye":
                    log("companion said bye: " + J.Str(m, "reason"));
                    lock (writeLock)
                    {
                        try
                        {
                            stream?.Dispose();
                        }
                        catch (Exception)
                        {
                        }
                    }
                    break;
            }
        }

        void Ack(string cid, string ack, Dictionary<string, object> error = null, int queue = -1, string status = null)
        {
            var a = Msg.New("command.ack", "command_id", cid, "device_id", J.Str(Companion, "device_id") ?? "", "attempt", 1.0, "hop", "addin", "ack", ack);
            if (InstanceId != null) a["instance_id"] = InstanceId;
            if (error != null) a["error"] = error;
            if (queue >= 0) a["queue_position"] = (double)queue;
            if (status != null) a["status"] = status;
            Send(a);
        }

        void Deliver(Dictionary<string, object> m)
        {
            Dictionary<string, object> cmd;
            try
            {
                Jws.Parse(J.Str(m, "jws"), out var header, out var payload);
                if (J.Str(header, "typ") != "kevos-command") throw new FormatException("not a command");
                cmd = Json.ParseObject(payload);
            }
            catch (Exception ex)
            {
                log("bad command from the companion: " + ex.Message);
                return;
            }
            var cid = J.Str(cmd, "command_id");
            var op = J.Str(cmd, "op");
            if (!Ids.Valid(cid, "cmd"))
            {
                log("command without a valid id");
                return;
            }
            Dictionary<string, object> stored;
            lock (recent) recent.TryGetValue(cid, out stored);
            if (seen.Seen(cid))
            {
                Ack(cid, "duplicate", status: stored != null ? J.Str(stored, "status") : "running");
                if (stored != null) Send(new Dictionary<string, object>(stored));
                return;
            }
            Dictionary<string, object> problem = null;
            if (!Protocol.Ops.Contains(op))
                problem = Msg.Error("UNKNOWN_OP", "input", $"This add-in does not know the command '{op}'. Update CADOS for SOLIDWORKS on this computer.", false, "addin");
            else if (!Times.TryParse(J.Str(cmd, "expires_at"), out var exp) || exp.AddSeconds(300) < DateTime.UtcNow)
                problem = Msg.Error("EXPIRED", "transport", "The command expired before it reached SOLIDWORKS.", false, "addin");
            else if (J.Obj(cmd, "params") == null)
                problem = Msg.Error("INPUT_INVALID", "input", "The command has no parameters object.", false, "addin");
            if (problem != null)
            {
                Ack(cid, "rejected", problem);
                return;
            }
            Times.TryParse(J.Str(cmd, "expires_at"), out var expires);
            seen.Add(cid, expires);
            var job = new Job { Cmd = cmd, Local = J.Obj(m, "local") ?? new Dictionary<string, object>(), Ctx = new CommandContext(cid, op, cmd) };
            int pos;
            lock (jobsLock)
            {
                jobs.Add(job);
                pos = jobs.Count - 1 + (running != null ? 1 : 0);
            }
            Ack(cid, "accepted", queue: pos);
            jobReady.Set();
        }

        void CancelCommand(string cid, string reason)
        {
            Job queued;
            lock (jobsLock)
            {
                queued = jobs.FirstOrDefault(j => j.Ctx.CommandId == cid);
                if (queued != null) jobs.Remove(queued);
            }
            if (queued != null)
            {
                Finish(queued, "cancelled", null, Msg.Error("CANCELLED", "transport", "Cancelled before it started (" + reason + ").", false, "addin"),
                       new List<object>(), DateTime.UtcNow);
                return;
            }
            var r = running;
            if (r != null && r.Ctx.CommandId == cid)
            {
                r.Ctx.Cancel();
                var st = Msg.New("command.status", "command_id", cid, "device_id", J.Str(r.Cmd, "device_id"), "status", "running", "at", Times.Now(),
                                 "cancel_requested", true);
                Send(st);
            }
        }

        void Work(CancellationToken stop)
        {
            while (!stop.IsCancellationRequested)
            {
                Job job = null;
                lock (jobsLock)
                {
                    if (jobs.Count > 0)
                    {
                        job = jobs[0];
                        jobs.RemoveAt(0);
                        running = job;
                    }
                }
                if (job == null)
                {
                    jobReady.WaitOne(1000);
                    continue;
                }
                try
                {
                    RunJob(job);
                }
                catch (Exception ex)
                {
                    log("command " + job.Ctx.CommandId + " could not finish: " + ex.Message);
                }
                finally
                {
                    running = null;
                    Send(StateMessage());
                }
            }
        }

        sealed class SpoolIO : ICommandIO
        {
            readonly string dir;
            readonly Dictionary<string, object> filesIn;
            public readonly List<object> FilesOut = new List<object>();
            public string CommandId { get; }

            public SpoolIO(string id, string dir, Dictionary<string, object> filesIn)
            {
                CommandId = id;
                this.dir = dir;
                this.filesIn = filesIn ?? new Dictionary<string, object>();
            }

            public void Upload(string name, byte[] data)
            {
                if (string.IsNullOrEmpty(name) || name.IndexOfAny(new[] { '/', '\\', ':' }) >= 0 || name == "." || name == "..")
                    throw new UserError("Bad file name " + name + ".");
                if (dir == null) throw new UserError("No spool folder for files (update the KEVOS Companion).");
                Directory.CreateDirectory(dir);
                var path = Path.Combine(dir, name);
                File.WriteAllBytes(path, data);
                FilesOut.Add(J.O("name", name, "path", path, "size", (double)data.Length, "sha256", B64.Sha256Tagged(data)));
            }

            public byte[] Download(string blobName)
            {
                var path = J.Str(filesIn, blobName);
                if (path == null) throw new ArgumentException("No file " + blobName + " came with this command.");
                if (dir != null && !Path.GetFullPath(path).StartsWith(Path.GetFullPath(dir), StringComparison.OrdinalIgnoreCase))
                    throw new UserError("A file for this command is outside its spool folder; refused.");
                return File.ReadAllBytes(path);
            }
        }

        void RunJob(Job job)
        {
            var cid = job.Ctx.CommandId;
            var started = DateTime.UtcNow;
            var dir = J.Str(job.Local, "spool_dir");
            if (dir != null && spoolRoot != null && !Path.GetFullPath(dir).StartsWith(Path.GetFullPath(spoolRoot), StringComparison.OrdinalIgnoreCase))
            {
                Finish(job, "rejected", null, Msg.Error("INPUT_INVALID", "input", "The spool folder is not the companion's.", false, "addin"), new List<object>(), started);
                return;
            }
            var io = new SpoolIO(cid, dir, J.Obj(job.Local, "files_in"));
            job.Ctx.OnProgress = (step, of, note) =>
            {
                var p = Msg.New("command.status", "command_id", cid, "device_id", J.Str(job.Cmd, "device_id"), "status", "running", "at", Times.Now(),
                                "progress", J.O("step", (double)step, "of", (double)Math.Max(1, of), "note", note ?? ""));
                Send(p);
            };
            Send(Msg.New("command.status", "command_id", cid, "device_id", J.Str(job.Cmd, "device_id"), "status", "running", "at", Times.Now()));
            Dictionary<string, object> res = null;
            Dictionary<string, object> error = null;
            var status = "succeeded";
            try
            {
                if (job.Ctx.CancelRequested) throw new UserError("Cancelled before it started.", "CANCELLED");
                res = host.Execute(J.Str(job.Cmd, "op"), J.Obj(job.Cmd, "params"), io, job.Ctx) ?? new Dictionary<string, object>();
            }
            catch (Exception ex)
            {
                var e = ex;
                while (e is System.Reflection.TargetInvocationException && e.InnerException != null) e = e.InnerException;
                if (e is UserError ue)
                {
                    var code = ue.Code ?? "SW_REFUSED";
                    status = code == "CANCELLED" ? "cancelled" : "failed";
                    var cat = code == "CANCELLED" ? "transport" : code == "APPROVAL_DENIED" || code == "PAUSED" ? "policy" : code == "UNKNOWN_OP" ? "input" : "solidworks";
                    error = Msg.Error(code, cat, ue.Message, code == "SW_BUSY_DIALOG" || code == "USER_EDITING", "addin", null, ue.Detail != null);
                    res = ue.Detail;
                }
                else
                {
                    status = "failed";
                    error = Msg.Error("SW_EXCEPTION", "solidworks", BridgeClient.Describe(ex), false, "addin");
                }
                log($"!! {cid} {job.Ctx.Op}: {ex.Message}");
            }
            CommandsRun++;
            Finish(job, status, res, error, io.FilesOut, started);
        }

        void Finish(Job job, string status, Dictionary<string, object> res, Dictionary<string, object> error, List<object> filesOut, DateTime started)
        {
            var cid = job.Ctx.CommandId;
            var hello = host.Hello() ?? new Dictionary<string, object>();
            var r = Msg.New("command.result", "command_id", cid, "device_id", J.Str(job.Cmd, "device_id"), "status", status,
                            "params_sha256", J.Str(job.Cmd, "params_sha256"), "started_at", Times.Iso(started), "finished_at", Times.Now(),
                            "duration_ms", (double)(int)(DateTime.UtcNow - started).TotalMilliseconds, "result", status == "succeeded" ? res ?? new Dictionary<string, object>() : res,
                            "error", error, "files_out", filesOut,
                            "executor", J.O("addin_version", J.Str(hello, "addin_version") ?? "0.0.0", "sw_revision", J.Str(hello, "sw_revision") ?? "", "pid", J.Num(hello, "pid")));
            if (InstanceId != null) r["instance_id"] = InstanceId;
            if (job.Ctx.CancelRequested && status == "succeeded") r["cancel_ignored"] = true;
            lock (recent)
            {
                recent[cid] = r;
                recentOrder.Add(cid);
                while (recentOrder.Count > 50)
                {
                    recent.Remove(recentOrder[0]);
                    recentOrder.RemoveAt(0);
                }
            }
            log($"<< {cid} {job.Ctx.Op} {status} in {(DateTime.UtcNow - started).TotalSeconds:0.0} s");
            Send(r);
        }
    }
}
