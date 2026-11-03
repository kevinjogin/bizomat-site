using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using Environment = System.Environment;

namespace OpenSketch.Sw
{
    /// <summary>
    /// One running link per SOLIDWORKS: the add-in, the launcher macro and the stand-alone program all start it here.
    /// The network runs on its own thread; every command is handed to SOLIDWORKS' own thread (through a hidden
    /// window) because SOLIDWORKS may only be called from there.
    /// </summary>
    public sealed class Host
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

        public string State => client?.State ?? "Not connected";
        public bool Connected => client?.Connected ?? false;
        /// <summary>The link thread runs (connected, or trying to).</summary>
        public bool Running => cts != null;
        public event Action StateChanged;

        public static string Version => Assembly.GetExecutingAssembly().GetName().Version.ToString(3);

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
            Log.Write($"OpenSketch for SOLIDWORKS {Version} started as {mode} from {SafeLocation()}; SOLIDWORKS {SafeRevision(app)}");
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

        public void Connect()
        {
            Disconnect();
            var server = Settings.Server;
            var key = Settings.Key;
            var hello = new Dictionary<string, object>
            {
                ["client"] = Mode, ["version"] = Version, ["sw_version"] = SafeRevision(App), ["machine"] = Environment.MachineName,
                ["user"] = Environment.UserName, ["protocol"] = 1,
                ["path"] = SafeLocation()   // which OpenSketch.Sw.dll SOLIDWORKS loaded (an old copy is the usual update problem)
            };
            client = new BridgeClient(server, key, hello, RunOnSolidWorks, Log.Write);
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
        /// instead of running its command inside the other's (SOLIDWORKS pumps messages while it works).</summary>
        static readonly SemaphoreSlim One = new SemaphoreSlim(1, 1);

        /// <summary>Runs a command on SOLIDWORKS' thread and waits for it (the link thread calls this).</summary>
        Dictionary<string, object> RunOnSolidWorks(string op, Dictionary<string, object> args, ICommandIO io)
        {
            if (!marshal.InvokeRequired) return RunHere(op, args, io);
            One.Wait();
            try
            {
                return RunHere(op, args, io);
            }
            finally
            {
                One.Release();
            }
        }

        Dictionary<string, object> RunHere(string op, Dictionary<string, object> args, ICommandIO io)
        {
            Dictionary<string, object> result = null;
            Exception error = null;
            void work()
            {
                try
                {
                    result = commands.Run(op, args, io);
                }
                catch (Exception ex)
                {
                    error = ex;
                }
            }
            if (marshal.InvokeRequired) marshal.Invoke((MethodInvoker)work);
            else work();
            if (error != null) System.Runtime.ExceptionServices.ExceptionDispatchInfo.Capture(error).Throw();
            return result;
        }

        /// <summary>The OpenSketch window, once shown.</summary>
        public Form Window => form;

        public void ShowWindow()
        {
            if (form == null || form.IsDisposed) form = new ConnectForm(this);
            form.ShowNear(App);
        }
    }
}
