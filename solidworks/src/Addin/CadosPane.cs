using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Windows.Forms;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;

namespace OpenSketch.Sw
{
    /// <summary>
    /// The CADOS task pane in SOLIDWORKS (a tab in the Task Pane, next to Design Library and File Explorer): the
    /// connection state (KEVOS Companion, this computer, the direct link), Connect / Disconnect, the prompts to give the
    /// AI assistant, the confirmation setting, live activity, and links to the dashboard, documentation and logs.
    /// CADOS runs no AI of its own: the assistant (Claude, ChatGPT...) does the work and this pane shows what happens.
    /// Made and used only on SOLIDWORKS' UI thread; every event from other threads comes in through BeginInvoke, and no
    /// exception leaves a handler (it would close SOLIDWORKS).
    /// </summary>
    public sealed class CadosPane
    {
        readonly ISldWorks app;
        TaskpaneView view;
        CadosPaneControl control;

        public CadosPane(ISldWorks app)
        {
            this.app = app;
        }

        public void Install(Host host)
        {
            control = new CadosPaneControl(host);
            control.CreateControl();
            view = null;
            try
            {
                view = app.CreateTaskpaneView3(KevosUi.MainIcons(), "CADOS by KEVOS") as TaskpaneView;   // SOLIDWORKS 2017 and later
            }
            catch (Exception ex)
            {
                Log.Write("task pane (icon list): " + ex.Message);
            }
            if (view == null) view = app.CreateTaskpaneView2(KevosUi.MainIcons()[0], "CADOS by KEVOS") as TaskpaneView;
            if (view == null) throw new InvalidOperationException("SOLIDWORKS did not make the task pane");
            if (!view.DisplayWindowFromHandlex64(control.Handle.ToInt64()))
                Log.Write("task pane: SOLIDWORKS did not take the CADOS panel");
        }

        public void Show()
        {
            try
            {
                view?.ShowView();
            }
            catch (Exception ex)
            {
                Log.Write("task pane show: " + ex.Message);
            }
        }

        public void Remove()
        {
            try
            {
                view?.DeleteView();
            }
            catch (Exception)
            {
            }
            view = null;
            try
            {
                control?.Dispose();
            }
            catch (Exception)
            {
            }
            control = null;
        }
    }

    /// <summary>The panel itself (WinForms), in the KEVOS look: white, charcoal text, KEVOS orange for the one action.</summary>
    public sealed class CadosPaneControl : UserControl
    {
        public const string DefaultGateway = "https://cados.kevos.com";
        public const string VerifyPrompt = "Check the CADOS connection to SOLIDWORKS.";
        public const string SelfTestPrompt = "Run the SOLIDWORKS self test, all three stages.";

        static readonly Color Ink = Color.FromArgb(22, 24, 29);
        static readonly Color Ink2 = Color.FromArgb(74, 79, 89);
        static readonly Color Ink3 = Color.FromArgb(107, 113, 124);
        static readonly Color Line = Color.FromArgb(233, 229, 223);
        static readonly Color Warm = Color.FromArgb(250, 248, 245);
        static readonly Color Orange = Color.FromArgb(244, 123, 32);
        static readonly Color OrangeButton = Color.FromArgb(191, 85, 11);
        static readonly Color Ok = Color.FromArgb(21, 128, 61);
        static readonly Color Idle = Color.FromArgb(138, 144, 154);

        readonly Host host;
        readonly Label stateTitle = new Label();
        readonly Label stateDetail = new Label();
        readonly Dot dot = new Dot();
        readonly Button connect = new Button();
        readonly Button disconnect = new Button();
        readonly CheckBox confirm = new CheckBox();
        readonly ListBox activity = new ListBox();
        readonly Timer timer = new Timer { Interval = 2000 };

        public CadosPaneControl(Host host)
        {
            this.host = host;
            BackColor = Color.White;
            Font = new Font("Segoe UI", 9f);
            AutoScroll = true;
            Padding = new Padding(12, 10, 12, 12);

            var col = new TableLayoutPanel { Dock = DockStyle.Top, AutoSize = true, ColumnCount = 1, BackColor = Color.White };
            col.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
            void Add(Control c, int top = 0, int bottom = 0)
            {
                c.Margin = new Padding(0, top, 0, bottom);
                c.Anchor = AnchorStyles.Left | AnchorStyles.Right;
                col.Controls.Add(c);
            }

            Add(new Brand(), 0, 6);
            Add(new Rule(), 0, 10);

            var state = new Panel { Height = 64, BackColor = Warm };
            dot.SetBounds(12, 15, 10, 10);
            stateTitle.SetBounds(30, 9, 200, 20);
            stateTitle.Font = new Font("Segoe UI Semibold", 10f);
            stateTitle.ForeColor = Ink;
            stateTitle.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Top;
            stateDetail.SetBounds(30, 29, 200, 32);
            stateDetail.ForeColor = Ink3;
            stateDetail.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Top;
            state.Controls.AddRange(new Control[] { dot, stateTitle, stateDetail });
            state.Resize += (s, e) => { stateTitle.Width = stateDetail.Width = Math.Max(60, state.Width - 40); };
            Add(state, 0, 8);

            var buttons = new TableLayoutPanel { ColumnCount = 2, Height = 34, BackColor = Color.White };
            buttons.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50));
            buttons.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50));
            Style(connect, true, "Connect");
            Style(disconnect, false, "Disconnect");
            connect.Margin = new Padding(0, 0, 4, 0);
            disconnect.Margin = new Padding(4, 0, 0, 0);
            connect.Click += (s, e) => Safe(DoConnect);
            disconnect.Click += (s, e) => Safe(() => { host.Disconnect(); host.StopPipe(); Refresh2(); });
            buttons.Controls.Add(connect, 0, 0);
            buttons.Controls.Add(disconnect, 1, 0);
            Add(buttons, 0, 14);

            Add(Section("Ask your AI assistant"), 0, 4);
            Add(Hint("Copy a prompt, then paste it into Claude, ChatGPT or another assistant connected to CADOS."), 0, 6);
            Add(PromptButton("Check the connection", VerifyPrompt), 0, 4);
            Add(PromptButton("Run the self test", SelfTestPrompt), 0, 14);

            Add(Section("Safety"), 0, 4);
            confirm.Text = "Ask me before destructive changes";
            confirm.AutoSize = true;
            confirm.ForeColor = Ink2;
            confirm.Checked = Settings.ConfirmDestructive;
            confirm.CheckedChanged += (s, e) => Safe(() =>
            {
                Settings.ConfirmDestructive = confirm.Checked;   // only the person here changes it, never a command
                Log.Write("confirm destructive changes: " + (confirm.Checked ? "on" : "off"));
            });
            Add(confirm, 0, 14);

            Add(Section("Activity"), 0, 4);
            activity.Height = 170;
            activity.Font = new Font("Consolas", 8f);
            activity.ForeColor = Ink2;
            activity.BorderStyle = BorderStyle.FixedSingle;
            activity.HorizontalScrollbar = true;
            activity.IntegralHeight = false;
            Add(activity, 0, 14);

            Add(Section("Help"), 0, 2);
            Add(Link("Open your CADOS dashboard", () => Open(Gateway() + "/dashboard")));
            Add(Link("Documentation", () => Open(Gateway() + "/docs")));
            Add(Link("Troubleshooting", () => Open(Gateway() + "/docs#troubleshooting")));
            Add(Link("Connection details and direct link", () => host.ShowWindow()));
            Add(Link("Open the KEVOS Companion", () =>
            {
                if (!CompanionPipe.StartCompanion())
                    MessageBox.Show("The KEVOS Companion is not installed on this computer. Install CADOS for SOLIDWORKS.", "CADOS");
            }));
            Add(Link("Copy the add-in log", () => Clipboard.SetText(File.Exists(Log.FilePath) ? File.ReadAllText(Log.FilePath) : "(no log yet)")), 0, 12);
            Add(new Label { Text = "CADOS for SOLIDWORKS " + Host.Version + "  ·  A product from KEVOS", ForeColor = Ink3, AutoSize = true });
            Add(Link("kevos.com", () => Open("https://kevos.com/")));

            Controls.Add(col);
            foreach (var line in Log.Last(40)) activity.Items.Add(line);
            ScrollDown();
            Log.Line += OnLine;
            host.StateChanged += OnState;
            timer.Tick += (s, e) => Safe(Refresh2);
            timer.Start();
            Refresh2();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Log.Line -= OnLine;
                host.StateChanged -= OnState;
                timer.Stop();
                timer.Dispose();
            }
            base.Dispose(disposing);
        }

        void DoConnect()
        {
            Settings.UseCompanion = true;
            host.StartPipe();
            if (Settings.Key.StartsWith("oss_")) host.Connect();
            Refresh2();
        }

        /// <summary>The CADOS address this computer uses: the Companion's (from pairing), the direct link's, or the default.</summary>
        string Gateway()
        {
            var g = J.Str(host.CompanionState, "gateway");
            if (string.IsNullOrEmpty(g) && Settings.Server.StartsWith("https://", StringComparison.OrdinalIgnoreCase)) g = Settings.Server;
            return (string.IsNullOrEmpty(g) ? DefaultGateway : g).TrimEnd('/');
        }

        void Refresh2()
        {
            if (IsDisposed) return;
            var c = host.CompanionState;
            var device = J.Str(c, "device_name");
            string title, detail;
            if (host.PipeConnected && device != null)
            {
                var cloud = J.Bool(c, "cloud_connected");
                title = J.Bool(c, "paused") ? "Paused" : cloud ? "Connected" : "Connecting";
                detail = $"{device}: {J.Str(c, "cloud") ?? "connecting"}. {host.CompanionCommands} commands run.";
            }
            else if (host.PipeConnected)
            {
                title = "Pair this computer";
                detail = "Open the KEVOS Companion and pair this computer with your CADOS account.";
            }
            else if (host.Connected)
            {
                title = "Connected";
                detail = "Direct link: " + host.State;
            }
            else
            {
                title = "Not connected";
                detail = "KEVOS Companion: " + host.PipeState + ". Direct link: " + host.State + ".";
            }
            stateTitle.Text = title;
            stateDetail.Text = detail;
            dot.Color = title == "Connected" ? Ok : title == "Paused" || title == "Pair this computer" ? Orange : Idle;
            dot.Invalidate();
            connect.Text = host.Connected ? "Reconnect" : "Connect";
        }

        void OnLine(string line)
        {
            if (IsDisposed || !IsHandleCreated) return;
            try
            {
                BeginInvoke((MethodInvoker)(() => Safe(() =>
                {
                    activity.Items.Add(line);
                    while (activity.Items.Count > 300) activity.Items.RemoveAt(0);
                    ScrollDown();
                })));
            }
            catch (Exception)
            {
            }
        }

        void OnState()
        {
            if (IsDisposed || !IsHandleCreated) return;
            try
            {
                BeginInvoke((MethodInvoker)(() => Safe(Refresh2)));
            }
            catch (Exception)
            {
            }
        }

        void ScrollDown()
        {
            if (activity.Items.Count > 0) activity.TopIndex = activity.Items.Count - 1;
        }

        static void Safe(Action a)
        {
            try
            {
                a();
            }
            catch (Exception ex)
            {
                Log.Write("CADOS panel: " + ex.Message);
            }
        }

        static void Open(string url)
        {
            Process.Start(new ProcessStartInfo(url) { UseShellExecute = true })?.Dispose();
        }

        static void Style(Button b, bool primary, string text)
        {
            b.Text = text;
            b.Height = 30;
            b.Dock = DockStyle.Fill;
            b.FlatStyle = FlatStyle.Flat;
            b.Font = new Font("Segoe UI Semibold", 9f);
            b.Cursor = Cursors.Hand;
            b.BackColor = primary ? OrangeButton : Color.White;
            b.ForeColor = primary ? Color.White : Ink;
            b.FlatAppearance.BorderColor = primary ? OrangeButton : Color.FromArgb(217, 212, 204);
            b.FlatAppearance.MouseOverBackColor = primary ? Color.FromArgb(169, 73, 10) : Warm;
        }

        static Label Section(string text) => new Label
        {
            Text = text.ToUpperInvariant(), AutoSize = true, ForeColor = Ink3, Font = new Font("Segoe UI Semibold", 7.75f)
        };

        static Label Hint(string text) => new Label { Text = text, AutoSize = true, MaximumSize = new Size(260, 0), ForeColor = Ink3 };

        Button PromptButton(string label, string prompt)
        {
            var b = new Button();
            Style(b, false, "Copy prompt: " + label);
            b.Dock = DockStyle.None;
            b.TextAlign = ContentAlignment.MiddleLeft;
            b.Padding = new Padding(6, 0, 0, 0);
            b.Click += (s, e) => Safe(() =>
            {
                Clipboard.SetText(prompt);
                var was = b.Text;
                b.Text = "Copied. Paste it into your assistant.";
                var t = new Timer { Interval = 1600 };
                t.Tick += (s2, e2) => Safe(() => { t.Stop(); t.Dispose(); if (!b.IsDisposed) b.Text = was; });
                t.Start();
            });
            return b;
        }

        static LinkLabel Link(string text, Action go)
        {
            var l = new LinkLabel { Text = text, AutoSize = true, LinkColor = Color.FromArgb(180, 79, 10), ActiveLinkColor = Ink, LinkBehavior = LinkBehavior.HoverUnderline };
            l.LinkClicked += (s, e) => Safe(go);
            return l;
        }

        /// <summary>"CADOS" and "by KEVOS", drawn (no image files to ship).</summary>
        sealed class Brand : Control
        {
            public Brand()
            {
                Height = 30;
                DoubleBuffered = true;
            }

            protected override void OnPaint(PaintEventArgs e)
            {
                try
                {
                    var g = e.Graphics;
                    g.Clear(Color.White);
                    g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;
                    using (var f = new Font("Segoe UI", 15f, FontStyle.Bold, GraphicsUnit.Pixel))
                    using (var by = new Font("Segoe UI", 11f, GraphicsUnit.Pixel))
                    using (var ink = new SolidBrush(Ink))
                    using (var grey = new SolidBrush(Ink3))
                    using (var orange = new SolidBrush(Orange))
                    {
                        var w = g.MeasureString("CADOS", f).Width;
                        g.DrawString("CADOS", f, ink, 0, 4);
                        var x = w + 6;
                        g.DrawString("by", by, grey, x, 8);
                        using (var bold = new Font(by, FontStyle.Bold))
                            g.DrawString("KEVOS", bold, orange, x + g.MeasureString("by", by).Width - 2, 8);
                    }
                }
                catch (Exception)
                {
                }
            }
        }

        sealed class Rule : Control
        {
            public Rule()
            {
                Height = 1;
                BackColor = Line;
            }
        }

        sealed class Dot : Control
        {
            public Color Color = Color.Gray;

            public Dot()
            {
                DoubleBuffered = true;
                BackColor = Color.FromArgb(250, 248, 245);
            }

            protected override void OnPaint(PaintEventArgs e)
            {
                try
                {
                    e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                    using (var b = new SolidBrush(Color)) e.Graphics.FillEllipse(b, 0, 0, Width - 1, Height - 1);
                }
                catch (Exception)
                {
                }
            }
        }
    }
}
