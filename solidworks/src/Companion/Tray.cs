using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;
using OpenSketch.Sw.Bridge;
using OpenSketch.Sw.Core;

namespace Kevos.Companion
{
    /// <summary>The tray icon and everything behind it: the engine, pairing, pause, start with Windows, updates,
    /// SOLIDWORKS detection and the add-in fallback. Runs on the UI thread; the engine's work is on its own threads.</summary>
    sealed class TrayApp : ApplicationContext
    {
        readonly NotifyIcon icon = new NotifyIcon();
        readonly ContextMenuStrip menu = new ContextMenuStrip();
        readonly ToolStripMenuItem header = new ToolStripMenuItem { Enabled = false };
        readonly ToolStripMenuItem pairItem = new ToolStripMenuItem("Pair this computer...");
        readonly ToolStripMenuItem pauseItem = new ToolStripMenuItem("Pause KEVOS");
        readonly ToolStripMenuItem startupItem = new ToolStripMenuItem("Start with Windows");
        readonly System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer { Interval = 3000 };
        readonly SynchronizationContext ui;
        readonly string sid;
        readonly Icon on, off, warn;
        CngDeviceKey key;
        CompanionEngine engine;
        StatusForm status;
        PairForm pairing;
        string lastTip;
        bool toldToPair;
        DateTime swSince = DateTime.MaxValue;
        bool attachTried;
        EventWaitHandle showEvent, exitEvent;

        public TrayApp(string sid, bool background, bool pair, bool diagnose)
        {
            this.sid = sid;
            ui = SynchronizationContext.Current ?? new WindowsFormsSynchronizationContext();
            on = MakeIcon(Color.FromArgb(76, 183, 130));
            off = MakeIcon(Color.FromArgb(140, 140, 150));
            warn = MakeIcon(Color.FromArgb(242, 201, 76));
            try
            {
                key = CngDeviceKey.OpenOrCreate();
                Log.Write("device key in " + key.Provider);
                StartEngine();
            }
            catch (Exception ex)
            {
                Log.Write("could not start: " + ex);
                MessageBox.Show("KEVOS could not start: " + ex.Message, "KEVOS", MessageBoxButtons.OK, MessageBoxIcon.Error);
                ExitThread();
                return;
            }
            if (background && !Config.Flag("Autostart", true))
            {
                Log.Write("started at logon, but this user turned Start with Windows off: exiting");
                Quit();
                return;
            }
            if (diagnose)
            {
                Thread.Sleep(3000);
                var f = Path.Combine(Paths.Data, "diagnostics.txt");
                File.WriteAllText(f, Diagnostics.Report(engine, key));
                Process.Start("notepad.exe", "\"" + f + "\"")?.Dispose();
                Quit();
                return;
            }
            BuildMenu();
            icon.Icon = off;
            icon.Text = "KEVOS";
            icon.Visible = true;
            icon.DoubleClick += (s, e) => ShowStatus();
            icon.BalloonTipClicked += (s, e) =>
            {
                if (!engine.Config.Paired) ShowPairing();
                else ShowStatus();
            };
            timer.Tick += (s, e) => Tick();
            timer.Start();
            // first run: start with Windows for this user, and SOLIDWORKS loads the add-in for this user
            if (!Config.Flag("StartupSet", false))
            {
                Startup.Set(true);
                Config.SetFlag("StartupSet", true);
            }
            Startup.EnsureAddinStartsOnce();
            Startup.RemoveOldUserRegistration();
            NetworkChange.NetworkAvailabilityChanged += (s, e) => engine?.Kick();
            NetworkChange.NetworkAddressChanged += (s, e) => engine?.Kick();
            SystemEvents.PowerModeChanged += OnPower;
            SystemEvents.SessionSwitch += OnSession;
            showEvent = new EventWaitHandle(false, EventResetMode.AutoReset, "Local\\KEVOS.Companion.Show." + sid);
            exitEvent = new EventWaitHandle(false, EventResetMode.AutoReset, "Local\\KEVOS.Companion.Exit." + sid);
            new Thread(() =>
            {
                while (true)
                {
                    var i = WaitHandle.WaitAny(new WaitHandle[] { showEvent, exitEvent });
                    ui.Post(_ =>
                    {
                        if (i == 0) ShowStatus();
                        else Quit();
                    }, null);
                    if (i == 1) return;
                }
            }) { IsBackground = true, Name = "KEVOS show" }.Start();
            if (pair || (!engine.Config.Paired && !background)) ShowPairing();
            Tick();
        }

        void StartEngine()
        {
            engine = new CompanionEngine(new CompanionOptions
            {
                DataDir = Paths.Data, GatewayUrl = Config.GatewayUrl, Version = Updater.Current.ToString(3), OsName = Diagnostics.OsName(),
                Installations = SolidWorks.Installations, VerifyPeer = PeerCheck.Verify, SolidWorksProcesses = SolidWorks.Running,
                StartSolidWorks = Config.StartSolidWorksOnDemand ? (Func<bool>)SolidWorks.Start : null, ConfirmDestructive = Config.ConfirmDestructive,
            }, key, new WindowsPipeListener(), Log.Write);
            engine.Changed += () => ui.Post(_ => Tick(), null);
            engine.Start();
        }

        /// <summary>A new key and a fresh engine, for pairing again (the old registration cannot be reused).</summary>
        public void Renew()
        {
            engine.Stop();
            engine.Dispose();
            key.Dispose();
            key = CngDeviceKey.Renew();
            Log.Write("made a new device key for pairing again");
            StartEngine();
        }

        public CompanionEngine Engine => engine;

        void OnPower(object s, PowerModeChangedEventArgs e)
        {
            if (e.Mode == PowerModes.Resume)
            {
                Log.Write("resumed from sleep: reconnecting");
                engine?.Kick();
            }
        }

        void OnSession(object s, SessionSwitchEventArgs e)
        {
            if (e.Reason == SessionSwitchReason.SessionUnlock) engine?.Kick();
        }

        void BuildMenu()
        {
            var statusItem = new ToolStripMenuItem("Status...", null, (s, e) => ShowStatus()) { Font = new Font(SystemFonts.MenuFont, FontStyle.Bold) };
            pairItem.Click += (s, e) => ShowPairing();
            pauseItem.Click += (s, e) => engine.SetPaused(!engine.Paused);
            startupItem.Click += (s, e) =>
            {
                Startup.Set(!Startup.Enabled);
                Tick();
            };
            var update = new ToolStripMenuItem("Check for updates", null, (s, e) => CheckUpdates(true));
            var logs = new ToolStripMenuItem("Open log folder", null, (s, e) => Process.Start("explorer.exe", "\"" + Paths.Logs + "\"")?.Dispose());
            var diag = new ToolStripMenuItem("Copy diagnostics", null, (s, e) =>
            {
                Clipboard.SetText(Diagnostics.Report(engine, key));
                icon.ShowBalloonTip(3000, "KEVOS", "Diagnostics copied. Paste them into your support request.", ToolTipIcon.Info);
            });
            var exit = new ToolStripMenuItem("Exit", null, (s, e) =>
            {
                if (MessageBox.Show("Stop KEVOS? AI apps cannot reach SOLIDWORKS on this computer until it starts again (next sign-in, or from the Start menu).",
                                    "KEVOS", MessageBoxButtons.OKCancel, MessageBoxIcon.Question) == DialogResult.OK) Quit();
            });
            menu.Items.AddRange(new ToolStripItem[] { header, new ToolStripSeparator(), statusItem, pairItem, pauseItem, new ToolStripSeparator(), startupItem, update, logs, diag, new ToolStripSeparator(), exit });
            icon.ContextMenuStrip = menu;
        }

        void Tick()
        {
            if (engine == null) return;
            var st = engine.Status();
            var name = st.DeviceName ?? "this computer";
            string line;
            Icon ic;
            if (!st.Paired)
            {
                line = "Not registered: pair " + name;
                ic = warn;
                if (!toldToPair)
                {
                    toldToPair = true;
                    icon.ShowBalloonTip(8000, "KEVOS", "Pair this computer with your KEVOS account to use it from AI apps. Click here.", ToolTipIcon.Info);
                }
            }
            else if (st.Paused)
            {
                line = name + ": paused";
                ic = warn;
            }
            else if (!st.CloudConnected)
            {
                line = name + ": " + st.Cloud;
                ic = off;
            }
            else if (st.Instances.Count > 0)
            {
                line = name + ": connected, SOLIDWORKS ready" + (st.Busy ? " (working)" : "");
                ic = on;
            }
            else
            {
                line = name + ": connected" + (st.SolidWorksProcesses > 0 ? ", waiting for the KEVOS add-in" : ", SOLIDWORKS closed");
                ic = on;
            }
            header.Text = line.Length > 60 ? line.Substring(0, 60) : line;
            var tip = "KEVOS: " + line;
            if (tip.Length > 63) tip = tip.Substring(0, 63);
            if (tip != lastTip)
            {
                lastTip = tip;
                icon.Text = tip;
                icon.Icon = ic;
            }
            pairItem.Text = st.Paired ? "Pair again..." : "Pair this computer...";
            pauseItem.Text = st.Paused ? "Resume KEVOS" : "Pause KEVOS";
            pauseItem.Enabled = st.Paired;
            startupItem.Checked = Startup.Enabled;
            FallbackAttach(st);
            status?.Refresh2();
        }

        /// <summary>SOLIDWORKS runs but its KEVOS add-in did not connect within 30 s (some per-user installs): ask that
        /// SOLIDWORKS once to load it. Turn off with AutoLoadAddin=0.</summary>
        void FallbackAttach(CompanionStatus st)
        {
            if (st.SolidWorksProcesses == 0)
            {
                swSince = DateTime.MaxValue;
                attachTried = false;
                return;
            }
            if (swSince == DateTime.MaxValue) swSince = DateTime.UtcNow;
            if (st.Instances.Count > 0 || attachTried || !Config.AutoLoadAddin || DateTime.UtcNow - swSince < TimeSpan.FromSeconds(30)) return;
            attachTried = true;
            var dll = Paths.AddinDll;
            if (!File.Exists(dll)) return;
            ThreadPool.QueueUserWorkItem(_ =>
            {
                try
                {
                    Log.Write("SOLIDWORKS runs without the KEVOS add-in: asking it to load " + dll + ": " + SolidWorks.LoadAddin());
                }
                catch (Exception ex)
                {
                    Log.Write("could not ask SOLIDWORKS to load the add-in: " + ex.Message);
                }
            });
        }

        public void ShowStatus()
        {
            if (status == null || status.IsDisposed) status = new StatusForm(this);
            status.Show();
            status.Activate();
        }

        public void ShowPairing()
        {
            if (pairing == null || pairing.IsDisposed) pairing = new PairForm(this);
            pairing.Show();
            pairing.Activate();
        }

        void CheckUpdates(bool asked)
        {
            ThreadPool.QueueUserWorkItem(_ =>
            {
                Updater.Offer offer;
                string why;
                try
                {
                    offer = new Updater(engine, key).Check(out why);
                }
                catch (Exception ex)
                {
                    offer = null;
                    why = "The update check failed: " + ex.Message;
                }
                ui.Post(__ =>
                {
                    if (offer == null)
                    {
                        if (asked) MessageBox.Show(why, "KEVOS updates", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        return;
                    }
                    var q = $"KEVOS Bridge {offer.Version} is ready (verified: signed by the same publisher, hash checked).\r\n\r\n{offer.Notes}\r\n\r\n" +
                            "Install it now? Save your work in SOLIDWORKS first: it restarts SOLIDWORKS' add-in at its next start.";
                    if (MessageBox.Show(q, "KEVOS update", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes) Updater.Install(offer);
                }, null);
            });
        }

        public void Quit()
        {
            timer.Stop();
            try
            {
                engine?.Stop();
            }
            catch (Exception)
            {
            }
            icon.Visible = false;
            icon.Dispose();
            SystemEvents.PowerModeChanged -= OnPower;
            SystemEvents.SessionSwitch -= OnSession;
            Log.Write("companion exits");
            ExitThread();
        }

        static Icon MakeIcon(Color dot)
        {
            using (var bmp = new Bitmap(32, 32))
            using (var g = Graphics.FromImage(bmp))
            {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                using (var bg = new LinearGradientBrush(new Rectangle(0, 0, 32, 32), Color.FromArgb(74, 81, 194), Color.FromArgb(192, 86, 156), 45f))
                    g.FillEllipse(bg, 1, 1, 30, 30);
                using (var f = new Font("Segoe UI", 15f, FontStyle.Bold, GraphicsUnit.Pixel))
                using (var w = new SolidBrush(Color.White))
                using (var fmt = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                    g.DrawString("K", f, w, new RectangleF(0, 0, 32, 32), fmt);
                using (var d = new SolidBrush(dot))
                using (var edge = new Pen(Color.White, 2))
                {
                    g.FillEllipse(d, 20, 20, 11, 11);
                    g.DrawEllipse(edge, 20, 20, 11, 11);
                }
                return Icon.FromHandle(bmp.GetHicon());
            }
        }
    }

    /// <summary>Pairing: the person signs in on the KEVOS site and approves the short code shown here.</summary>
    sealed class PairForm : Form
    {
        readonly TrayApp app;
        readonly TextBox gateway = new TextBox();
        readonly TextBox name = new TextBox();
        readonly Label code = new Label();
        readonly Label info = new Label();
        readonly Button go = new Button { Text = "Pair" };
        readonly LinkLabel open = new LinkLabel { Text = "Open the KEVOS website", Visible = false };
        CancellationTokenSource cts;
        string url;

        public PairForm(TrayApp app)
        {
            this.app = app;
            Text = "KEVOS: pair this computer";
            Font = new Font("Segoe UI", 9.5f);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            StartPosition = FormStartPosition.CenterScreen;
            ClientSize = new Size(480, 330);
            BackColor = Color.White;
            var title = new Label { Text = "Add this computer to your KEVOS account", Font = new Font("Segoe UI Semibold", 12f), AutoSize = true, Location = new Point(16, 14) };
            var l1 = new Label { Text = "KEVOS server address", AutoSize = true, Location = new Point(16, 54) };
            gateway.SetBounds(16, 74, 448, 26);
            var l2 = new Label { Text = "Name for this computer", AutoSize = true, Location = new Point(16, 108) };
            name.SetBounds(16, 128, 300, 26);
            go.SetBounds(324, 126, 140, 30);
            code.SetBounds(16, 172, 448, 50);
            code.Font = new Font("Consolas", 26f, FontStyle.Bold);
            code.TextAlign = ContentAlignment.MiddleCenter;
            info.SetBounds(16, 226, 448, 60);
            open.SetBounds(16, 292, 300, 22);
            open.LinkClicked += (s, e) => Browse();
            Controls.AddRange(new Control[] { title, l1, gateway, l2, name, go, code, info, open });
            var cfg = app.Engine.Config;
            gateway.Text = cfg.GatewayUrl ?? Config.GatewayUrl ?? "https://";
            name.Text = cfg.DeviceName ?? Environment.MachineName;
            info.Text = cfg.Paired ? $"This computer is {cfg.DeviceName} on {cfg.Account}. Pairing again gives it a new identity; the old one stops working." :
                        "You will sign in on the KEVOS website and confirm the code shown here. No password is stored on this computer.";
            go.Click += (s, e) => Start();
            FormClosed += (s, e) => cts?.Cancel();
        }

        void Browse()
        {
            try
            {
                if (url != null) Process.Start(new ProcessStartInfo(url) { UseShellExecute = true })?.Dispose();
            }
            catch (Exception)
            {
            }
        }

        void Start()
        {
            var g = gateway.Text.Trim().TrimEnd('/');
            if (!g.StartsWith("https://", StringComparison.OrdinalIgnoreCase) && !CloudLink.IsLoopback(g))
            {
                info.Text = "The address must start with https:// (for example https://bridge.example.com).";
                return;
            }
            go.Enabled = false;
            info.Text = "Contacting " + g + "...";
            var n = name.Text.Trim();
            cts = new CancellationTokenSource();
            var token = cts.Token;
            ThreadPool.QueueUserWorkItem(_ =>
            {
                try
                {
                    if (app.Engine.Config.DeviceId != null) Invoke((MethodInvoker)app.Renew);   // a new key: the old identity is not reused
                    var t = app.Engine.BeginPairing(g, n);
                    Config.GatewayUrl = g;
                    url = t.Url;
                    BeginInvoke((MethodInvoker)(() =>
                    {
                        code.Text = t.UserCode;
                        info.Text = "Your browser opens the KEVOS website. Sign in and check that it shows this code, then click Add this computer. This window waits.";
                        open.Visible = true;
                        Browse();
                    }));
                    var ok = app.Engine.WaitForPairing(t, token);
                    BeginInvoke((MethodInvoker)(() =>
                    {
                        if (ok)
                        {
                            code.Text = "Done";
                            info.Text = $"This computer is {app.Engine.Config.DeviceName} on {app.Engine.Config.Account}. KEVOS connects by itself from now on; open SOLIDWORKS and ask your AI app.";
                            open.Visible = false;
                        }
                        else
                        {
                            info.Text = "The code expired. Click Pair to get a new one.";
                            go.Enabled = true;
                        }
                    }));
                }
                catch (Exception ex)
                {
                    Log.Write("pairing: " + ex.Message);
                    try
                    {
                        BeginInvoke((MethodInvoker)(() =>
                        {
                            info.Text = "Pairing did not work: " + ex.Message;
                            go.Enabled = true;
                        }));
                    }
                    catch (Exception)
                    {
                    }
                }
            });
        }
    }

    sealed class StatusForm : Form
    {
        readonly TrayApp app;
        readonly Label body = new Label();
        readonly ListBox activity = new ListBox();
        readonly Button pause = new Button();

        public StatusForm(TrayApp app)
        {
            this.app = app;
            Text = "KEVOS";
            Font = new Font("Segoe UI", 9.5f);
            StartPosition = FormStartPosition.CenterScreen;
            ClientSize = new Size(560, 470);
            MinimumSize = new Size(480, 400);
            BackColor = Color.White;
            var title = new Label { Text = "KEVOS Bridge", Font = new Font("Segoe UI Semibold", 13f), AutoSize = true, Location = new Point(16, 12) };
            body.SetBounds(16, 46, 528, 170);
            body.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            pause.SetBounds(16, 222, 120, 30);
            pause.Click += (s, e) => app.Engine.SetPaused(!app.Engine.Paused);
            var pair = new Button { Text = "Pair...", Bounds = new Rectangle(144, 222, 100, 30) };
            pair.Click += (s, e) => app.ShowPairing();
            var logs = new Button { Text = "Log folder", Bounds = new Rectangle(252, 222, 100, 30) };
            logs.Click += (s, e) => Process.Start("explorer.exe", "\"" + Paths.Logs + "\"")?.Dispose();
            var diag = new Button { Text = "Copy diagnostics", Bounds = new Rectangle(360, 222, 140, 30) };
            diag.Click += (s, e) => Clipboard.SetText(Diagnostics.Report(app.Engine, null));
            activity.SetBounds(16, 262, 528, 192);
            activity.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            activity.Font = new Font("Consolas", 8.25f);
            activity.HorizontalScrollbar = true;
            Controls.AddRange(new Control[] { title, body, pause, pair, logs, diag, activity });
            foreach (var l in Log.Last(80)) activity.Items.Add(l);
            if (activity.Items.Count > 0) activity.TopIndex = activity.Items.Count - 1;
            Log.Line += OnLine;
            FormClosed += (s, e) => Log.Line -= OnLine;
            Refresh2();
        }

        void OnLine(string line)
        {
            if (IsDisposed || !IsHandleCreated) return;
            try
            {
                BeginInvoke((MethodInvoker)(() =>
                {
                    activity.Items.Add(line);
                    while (activity.Items.Count > 400) activity.Items.RemoveAt(0);
                    activity.TopIndex = activity.Items.Count - 1;
                }));
            }
            catch (Exception)
            {
            }
        }

        public void Refresh2()
        {
            if (IsDisposed) return;
            var st = app.Engine.Status();
            var sb = new StringBuilder();
            sb.AppendLine(st.Paired ? $"Computer: {st.DeviceName}   Account: {st.Account}" : "Computer: not registered yet (Pair...)");
            sb.AppendLine("Server: " + (st.Gateway ?? "(none)"));
            sb.AppendLine("Link: " + st.Cloud + (st.Paused ? "   PAUSED: commands are refused" : ""));
            sb.AppendLine($"SOLIDWORKS running: {st.SolidWorksProcesses}   with the KEVOS add-in: {st.Instances.Count}");
            foreach (var i in st.Instances)
                sb.AppendLine($"  SOLIDWORKS {J.Str(i, "sw_revision")} (pid {J.Num(i, "pid")}), add-in {J.Str(i, "addin_version")}, {J.Num(i, "docs")} documents" +
                              (J.Str(i, "active") != null ? ", active " + J.Str(i, "active") : "") +
                              (J.Str(i, "busy") != null ? ", WORKING" : J.Bool(i, "modal_dialog") ? ", a dialog is open" : J.Bool(i, "ready") ? ", ready" : ""));
            sb.AppendLine($"Commands run: {st.CommandsRun}" + (st.LastCommand != null ? "   last: " + st.LastCommand : ""));
            if (!string.IsNullOrEmpty(st.LastError)) sb.AppendLine("Last problem: " + st.LastError);
            body.Text = sb.ToString();
            pause.Text = st.Paused ? "Resume" : "Pause";
            pause.Enabled = st.Paired;
        }
    }

    static class Diagnostics
    {
        public static string OsName()
        {
            try
            {
                using (var k = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion"))
                    return $"{k?.GetValue("ProductName")} {k?.GetValue("DisplayVersion")} (build {k?.GetValue("CurrentBuild")})";
            }
            catch (Exception)
            {
                return Environment.OSVersion.VersionString;
            }
        }

        static string Reg(RegistryHive hive, string path, string name = null)
        {
            try
            {
                using (var b = RegistryKey.OpenBaseKey(hive, RegistryView.Registry64))
                using (var k = b.OpenSubKey(path))
                    return k == null ? "(missing)" : (k.GetValue(name)?.ToString() ?? "(no value)");
            }
            catch (Exception ex)
            {
                return "(" + ex.Message + ")";
            }
        }

        /// <summary>Everything support needs, nothing secret: there is no password or token to include, and the device
        /// key is not exportable.</summary>
        public static string Report(CompanionEngine engine, CngDeviceKey key)
        {
            var st = engine.Status();
            var cfg = engine.Config;
            var clsid = Startup.AddinClsid;
            var sb = new StringBuilder();
            sb.AppendLine("KEVOS Bridge diagnostics " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            sb.AppendLine("Companion " + Updater.Current + " at " + Paths.Exe + (Authenticode.Signer(Paths.Exe) is string s ? " (signed " + s + ")" : " (unsigned build)"));
            sb.AppendLine("Windows: " + OsName() + "; .NET " + Environment.Version + "; user " + Environment.UserName + "; machine " + Environment.MachineName);
            sb.AppendLine("Registered: " + (cfg.Paired ? $"{cfg.DeviceName} ({cfg.DeviceId}) on {cfg.Account}, since {cfg.PairedAt}" : cfg.Revoked ? "removed from the account" : "no"));
            sb.AppendLine("Server: " + cfg.GatewayUrl + "; gateway key " + J.Str(cfg.GatewayJwk, "kid"));
            sb.AppendLine("Device key: " + (key?.Provider ?? "(in use by the companion)") + " (not exportable)");
            sb.AppendLine("Link: " + st.Cloud + (st.Paused ? " [paused]" : ""));
            sb.AppendLine("SOLIDWORKS installed: " + string.Join("; ", SolidWorks.Installations().Select(i => $"{J.Num(J.Obj(i), "year")} {J.Str(J.Obj(i), "revision")} {J.Str(J.Obj(i), "path")}")));
            sb.AppendLine($"SOLIDWORKS running: {st.SolidWorksProcesses}; with the add-in: {st.Instances.Count}");
            foreach (var i in st.Instances) sb.AppendLine("  " + Json.Write(i));
            sb.AppendLine("Add-in DLL next to the companion: " + (File.Exists(Paths.AddinDll) ? Paths.AddinDll + " " + FileVersionInfo.GetVersionInfo(Paths.AddinDll).FileVersion : "missing"));
            sb.AppendLine("Add-in COM (HKLM): " + Reg(RegistryHive.LocalMachine, @"SOFTWARE\Classes\CLSID\" + clsid + @"\InprocServer32", "CodeBase"));
            sb.AppendLine("Add-in COM (HKCU): " + Reg(RegistryHive.CurrentUser, @"Software\Classes\CLSID\" + clsid + @"\InprocServer32", "CodeBase"));
            sb.AppendLine("SOLIDWORKS add-in list (HKLM): " + Reg(RegistryHive.LocalMachine, @"SOFTWARE\SolidWorks\Addins\" + clsid, "Title"));
            sb.AppendLine("Load at start-up (HKCU): " + Reg(RegistryHive.CurrentUser, @"Software\SolidWorks\AddInsStartup\" + clsid, ""));
            sb.AppendLine("Start with Windows: " + Startup.Enabled);
            sb.AppendLine("Settings: confirm destructive " + Config.ConfirmDestructive + "; auto-load add-in " + Config.AutoLoadAddin + "; start SOLIDWORKS on demand " + Config.StartSolidWorksOnDemand);
            sb.AppendLine();
            sb.AppendLine("Last log lines:");
            foreach (var l in Log.Last(150)) sb.AppendLine(l);
            return sb.ToString();
        }
    }
}
