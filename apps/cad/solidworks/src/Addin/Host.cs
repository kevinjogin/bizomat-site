using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;
using OpenSketch.Sw.Bridge;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;
using Environment = System.Environment;

namespace OpenSketch.Sw
{
    /// <summary>
    /// One running link per SOLIDWORKS: the add-in, the launcher macro and the stand-alone program all start it here.
    /// Two ways in, both optional and both ending in the same place:
    /// - the KEVOS Companion on this computer, over the local pipe (PipeLink), started automatically;
    /// - the direct link to an OpenSketch server (BridgeClient, the v1 address and key), when one is saved.
    /// The network and pipe run on their own threads; every command is handed to SOLIDWORKS' own thread (through a
    /// hidden window) because SOLIDWORKS may only be called from there. Nothing here blocks SOLIDWORKS while waiting
    /// for the network: the link threads read a snapshot the UI thread keeps up to date.
    /// </summary>
    public sealed class Host : IAddinHost
    {
        public static Host Current { get; private set; }

        public readonly ISldWorks App;
        public readonly string Mode;          // add-in, macro, program
        readonly Control marshal;
        readonly Commands commands;
        BridgeClient client;
        Thread thread;
        CancellationTokenSource cts;
        ConnectForm form;
        // the KEVOS Companion link
        PipeLink pipe;
        CancellationTokenSource pipeCts;
        readonly System.Windows.Forms.Timer uiTimer;
        readonly long frameHwnd;
        readonly string swRevision;
        readonly string processStarted;
        readonly string installPath;
        volatile Dictionary<string, object> snapshot = J.O("docs", new List<object>());
        string snapshotJson = "";
        long lastUiTick = DateTime.UtcNow.Ticks;
        SldWorks events;

        public string State => client?.State ?? "Not connected";
        public bool Connected => (client?.Connected ?? false) || (pipe?.Connected ?? false);
        /// <summary>The direct link thread runs (connected, or trying to).</summary>
        public bool Running => cts != null;
        public event Action StateChanged;

        public string PipeState => pipe?.State ?? (Settings.UseCompanion ? "Starting" : "Off");
        public bool PipeConnected => pipe?.Connected ?? false;
        public Dictionary<string, object> CompanionState => pipe?.Companion ?? new Dictionary<string, object>();
        public int CompanionCommands => pipe?.CommandsRun ?? 0;

        public static string Version => Assembly.GetExecutingAssembly().GetName().Version.ToString(3);

        [DllImport("user32.dll")]
        static extern bool IsWindowEnabled(IntPtr hWnd);

        static string SafeLocation()
        {
            try
            {
                return Assembly.GetExecutingAssembly().Location;
            }
            catch (Exception)
            {
                return null;
            }
        }

        Host(ISldWorks app, string mode)
        {
            App = app;
            Mode = mode;
            marshal = new Control();
            marshal.CreateControl();
            var _ = marshal.Handle; // the window on this (SOLIDWORKS') thread
            commands = new Commands(app);
            // read once here, on SOLIDWORKS' thread: the link threads must not call SOLIDWORKS
            swRevision = SafeRevision(app);
            try
            {
                frameHwnd = ((Frame)app.Frame())?.GetHWndx64() ?? 0;
            }
            catch (Exception)
            {
            }
            try
            {
                using (var p = Process.GetCurrentProcess())
                {
                    processStarted = Times.Iso(p.StartTime.ToUniversalTime());
                    installPath = Path.GetDirectoryName(p.MainModule?.FileName ?? "");
                }
            }
            catch (Exception)
            {
                processStarted = Times.Now();
            }
            uiTimer = new System.Windows.Forms.Timer { Interval = 2000 };
            uiTimer.Tick += (s, e) => Snapshot();
            uiTimer.Start();
            Subscribe();
        }

        /// <summary>Called on SOLIDWORKS' thread (ConnectToSW, the macro, or the program's main thread).</summary>
        public static Host Start(ISldWorks app, string mode)
        {
            if (Current != null)
            {
                if (ReferenceEquals(Current.App, app) || Current.Mode == mode) return Current;
                Current.Stop();
            }
            Current = new Host(app, mode);
            Log.Write($"CADOS for SOLIDWORKS {Version} started as {mode} from {SafeLocation()}; SOLIDWORKS {Current.swRevision}");
            if (mode != "program" && Settings.UseCompanion) Current.StartPipe();
            return Current;
        }

        public static string SafeRevision(ISldWorks app)
        {
            try
            {
                return app.RevisionNumber();
            }
            catch (Exception)
            {
                return "?";
            }
        }

        // ----------------------------------------------------------------- the KEVOS Companion link

        public void StartPipe()
        {
            if (pipe != null) return;
            pipeCts = new CancellationTokenSource();
            pipe = new PipeLink(CompanionPipe.Connect, this, Log.Write, SpoolRoot());
            pipe.Changed += Changed;
            var t = pipeCts.Token;
            var p = pipe;
            new Thread(() => p.Run(t)) { IsBackground = true, Name = "KEVOS pipe" }.Start();
            Changed();
        }

        public void StopPipe()
        {
            pipeCts?.Cancel();
            pipeCts = null;
            pipe = null;
            Changed();
        }

        static string SpoolRoot() =>
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "KEVOS", "Bridge", "spool");

        // IAddinHost: called on the pipe link's threads

        Dictionary<string, object> IAddinHost.Hello()
        {
            int pid;
            using (var p = Process.GetCurrentProcess()) pid = p.Id;
            return J.O("pid", (double)pid, "process_started_at", processStarted, "sw_revision", swRevision, "install_path", installPath,
                       "addin_version", Version, "capabilities", Capabilities());
        }

        static Dictionary<string, object> Capabilities()
        {
            var ops = new Dictionary<string, object>();
            foreach (var op in Protocol.Ops) ops[op] = 1.0;
            ops["create_drawing"] = 2.0;   // the 0.9.1 layout, centre marks, notes, overwrite
            return J.O("ops", ops,
                       "feature_types", J.L("sketch", "plane", "extrude", "revolve", "sweep", "loft", "hole", "fillet", "chamfer", "shell", "draft", "mirror", "linear_pattern", "circular_pattern"),
                       "mate_types", J.L("coincident", "concentric", "parallel", "perpendicular", "distance", "angle", "lock", "hinge", "limit_distance", "limit_angle"),
                       "drawing_actions", J.L("view", "projected", "section", "detail", "move", "scale", "display", "delete", "rename", "dimensions", "arrange_dimensions", "centre_marks", "note", "properties", "sheet", "bom"),
                       "export_formats", J.L("step", "stl", "x_t", "igs", "sldprt", "sldasm", "slddrw", "pdf", "dwg", "dxf"),
                       "confirms_destructive", Settings.ConfirmDestructive);
        }

        Dictionary<string, object> IAddinHost.Execute(string op, Dictionary<string, object> args, ICommandIO io, CommandContext ctx) => RunOnSolidWorks(op, args, io, ctx);

        Dictionary<string, object> IAddinHost.Probe()
        {
            var lastOk = new DateTime(Interlocked.Read(ref lastUiTick), DateTimeKind.Utc);
            return J.O("ui_responsive", DateTime.UtcNow - lastOk < TimeSpan.FromSeconds(6), "modal_dialog", ModalOpen(), "ui_last_ok_at", Times.Iso(lastOk));
        }

        Dictionary<string, object> IAddinHost.State() => new Dictionary<string, object>(snapshot);

        void IAddinHost.CompanionMissing()
        {
            if (!CompanionPipe.StartCompanion()) Log.Write("the KEVOS Companion is not installed next to the add-in; only the direct link can be used");
        }

        /// <summary>A modal dialog in SOLIDWORKS disables its main window: no command may run inside it. Win32 only, no COM,
        /// so it is safe from any thread.</summary>
        bool ModalOpen()
        {
            try
            {
                return frameHwnd != 0 && !IsWindowEnabled(new IntPtr(frameHwnd));
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>On SOLIDWORKS' thread (timer, events): what is open, for routing and status. Sent when it changes.</summary>
        void Snapshot()
        {
            Interlocked.Exchange(ref lastUiTick, DateTime.UtcNow.Ticks);
            try
            {
                var docs = new List<object>();
                var active = App.ActiveDoc as IModelDoc2;
                if (App.GetDocuments() is object[] all)
                    foreach (var o in all)
                    {
                        if (!(o is IModelDoc2 m) || !m.Visible) continue;
                        var kind = m.GetType() == (int)swDocumentTypes_e.swDocPART ? "part" : m.GetType() == (int)swDocumentTypes_e.swDocASSEMBLY ? "assembly"
                                 : m.GetType() == (int)swDocumentTypes_e.swDocDRAWING ? "drawing" : "other";
                        var path = m.GetPathName();
                        docs.Add(J.O("title", m.GetTitle(), "path", string.IsNullOrEmpty(path) ? null : path, "kind", kind, "active", ReferenceEquals(m, active),
                                     "unsaved", m.GetSaveFlag()));
                    }
                var sketch = false;
                try
                {
                    sketch = active != null && active.GetType() != (int)swDocumentTypes_e.swDocDRAWING && active.SketchManager?.ActiveSketch != null;
                }
                catch (Exception)
                {
                }
                var s = J.O("docs", docs, "user_sketch_open", sketch, "modal_dialog", ModalOpen());
                var json = Json.Write(s);
                snapshot = s;
                if (json != snapshotJson)
                {
                    snapshotJson = json;
                    var p = pipe;
                    if (p != null) ThreadPool.QueueUserWorkItem(_ => p.PushState());   // never write to the pipe from SOLIDWORKS' thread
                }
            }
            catch (Exception ex)
            {
                Log.Write("snapshot: " + ex.Message);
            }
        }

        // ----------------------------------------------------------------- document lifecycle events

        void Subscribe()
        {
            try
            {
                events = App as SldWorks;
                if (events == null) return;
                events.ActiveModelDocChangeNotify += OnActiveChanged;
                events.FileOpenPostNotify += OnOpened;
                events.FileNewNotify2 += OnNew;
                events.FileCloseNotify += OnClosed;
            }
            catch (Exception ex)
            {
                Log.Write("document events not available: " + ex.Message);
                events = null;
            }
        }

        void Unsubscribe()
        {
            if (events == null) return;
            try
            {
                events.ActiveModelDocChangeNotify -= OnActiveChanged;
                events.FileOpenPostNotify -= OnOpened;
                events.FileNewNotify2 -= OnNew;
                events.FileCloseNotify -= OnClosed;
            }
            catch (Exception)
            {
            }
            events = null;
        }

        int OnActiveChanged()
        {
            Later("doc_activated", null);
            return 0;
        }

        int OnOpened(string fileName)
        {
            Later("doc_opened", fileName);
            return 0;
        }

        int OnNew(object doc, int type, string template)
        {
            Later("doc_opened", null);
            return 0;
        }

        int OnClosed(string fileName, int reason)
        {
            Later("doc_closed", fileName);
            return 0;
        }

        /// <summary>After an event SOLIDWORKS is mid-change: refresh the snapshot once it settles, and tell the companion.</summary>
        void Later(string ev, string path)
        {
            try
            {
                marshal.BeginInvoke((MethodInvoker)Snapshot);
                var p = pipe;
                if (p != null)
                    ThreadPool.QueueUserWorkItem(_ => p.Event(ev, path == null ? null : J.O("path", path, "title", Path.GetFileName(path))));
            }
            catch (Exception)
            {
            }
        }

        // ----------------------------------------------------------------- the direct link (v1)

        public void Connect()
        {
            Disconnect();
            var server = Settings.Server;
            var key = Settings.Key;
            var hello = new Dictionary<string, object>
            {
                ["client"] = Mode, ["version"] = Version, ["sw_version"] = swRevision, ["machine"] = Environment.MachineName,
                ["user"] = Environment.UserName, ["protocol"] = 1,
                ["path"] = SafeLocation()   // which OpenSketch.Sw.dll SOLIDWORKS loaded (an old copy is the usual update problem)
            };
            client = new BridgeClient(server, key, hello, (op, a, io) => RunOnSolidWorks(op, a, io, null), Log.Write);
            client.StateChanged += (s, c) => Changed();
            cts = new CancellationTokenSource();
            var token = cts.Token;
            var c2 = client;
            thread = new Thread(() =>
            {
                try
                {
                    c2.Run(token);
                }
                catch (Exception ex)
                {
                    Log.Write("link thread ended: " + ex);
                }
            }) { IsBackground = true, Name = "OpenSketch link" };
            thread.Start();
            Changed();
        }

        public void Disconnect()
        {
            if (cts == null) return;
            cts.Cancel();
            cts = null;
            client = null;
            thread = null;
            Changed();
        }

        public void Stop()
        {
            Disconnect();
            StopPipe();
            try
            {
                uiTimer.Stop();
                uiTimer.Dispose();
            }
            catch (Exception)
            {
            }
            Unsubscribe();
            try
            {
                if (form != null && !form.IsDisposed) form.Close();
            }
            catch (Exception)
            {
            }
            if (ReferenceEquals(Current, this)) Current = null;
        }

        void Changed()
        {
            try
            {
                StateChanged?.Invoke();
            }
            catch (Exception)
            {
            }
        }

        /// <summary>One command at a time: an old link thread still finishing a command after a reconnect waits here
        /// instead of running its command inside the other's (SOLIDWORKS pumps messages while it works). Commands from
        /// the companion and from the direct link share it, so they never run at the same time.</summary>
        static readonly SemaphoreSlim One = new SemaphoreSlim(1, 1);

        /// <summary>Runs a command on SOLIDWORKS' thread and waits for it (the link threads call this).</summary>
        Dictionary<string, object> RunOnSolidWorks(string op, Dictionary<string, object> args, ICommandIO io, CommandContext ctx)
        {
            if (!marshal.InvokeRequired) return RunHere(op, args, io, ctx);
            One.Wait();
            try
            {
                return RunHere(op, args, io, ctx);
            }
            finally
            {
                One.Release();
            }
        }

        Dictionary<string, object> RunHere(string op, Dictionary<string, object> args, ICommandIO io, CommandContext ctx)
        {
            Dictionary<string, object> result = null;
            Exception error = null;
            void work()
            {
                CommandContext.Current = ctx;
                try
                {
                    if (ModalOpen())
                        throw new UserError("SOLIDWORKS has a dialog box open. Close it in SOLIDWORKS, then ask again.", "SW_BUSY_DIALOG");
                    var what = Settings.ConfirmDestructive ? Safety.Describe(op, args) : null;
                    if (what != null)
                    {
                        var doc = J.Str(args, "doc");
                        try
                        {
                            if (string.IsNullOrEmpty(doc)) doc = (App.ActiveDoc as IModelDoc2)?.GetTitle();
                        }
                        catch (Exception)
                        {
                        }
                        Log.Write($"asking before {op}: {what}");
                        if (!Safety.Ask(OwnerWindow(), ctx?.ClientName ?? "The AI app", what, doc))
                            throw new UserError($"The person at this computer declined in SOLIDWORKS: {what} Nothing was changed.", "APPROVAL_DENIED");
                        Log.Write("allowed by the user: " + op);
                    }
                    result = commands.Run(op, args, io);
                }
                catch (Exception ex)
                {
                    error = ex;
                }
                finally
                {
                    CommandContext.Current = null;
                }
            }
            if (marshal.InvokeRequired) marshal.Invoke((MethodInvoker)work);
            else work();
            if (error != null) System.Runtime.ExceptionServices.ExceptionDispatchInfo.Capture(error).Throw();
            return result;
        }

        IWin32Window OwnerWindow() => frameHwnd != 0 ? new Owner(new IntPtr(frameHwnd)) : null;

        sealed class Owner : IWin32Window
        {
            public Owner(IntPtr h) => Handle = h;
            public IntPtr Handle { get; }
        }

        /// <summary>The CADOS status window, once shown.</summary>
        public Form Window => form;

        public void ShowWindow()
        {
            if (form == null || form.IsDisposed) form = new ConnectForm(this);
            form.ShowNear(App);
        }
    }
}
