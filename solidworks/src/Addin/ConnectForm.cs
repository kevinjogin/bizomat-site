using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using SolidWorks.Interop.sldworks;

namespace OpenSketch.Sw
{
    /// <summary>The small window: OpenSketch address, SOLIDWORKS key, Connect / Disconnect, and what is happening.</summary>
    public sealed class ConnectForm : Form
    {
        readonly Host host;
        readonly TextBox server = new TextBox();
        readonly TextBox key = new TextBox();
        readonly CheckBox auto = new CheckBox();
        readonly Label status = new Label();
        readonly Panel dot = new Panel();
        readonly Button connect = new Button();
        readonly Button disconnect = new Button();
        readonly ListBox activity = new ListBox();

        public ConnectForm(Host host)
        {
            this.host = host;
            Text = "OpenSketch for SOLIDWORKS";
            Font = new Font("Segoe UI", 9f);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            ShowInTaskbar = host.Mode == "program";
            StartPosition = FormStartPosition.CenterParent;
            ClientSize = new Size(520, 430);
            BackColor = Color.White;

            var title = new Label { Text = "Claude builds in this SOLIDWORKS", Font = new Font("Segoe UI Semibold", 12f), AutoSize = true, Location = new Point(16, 14) };
            dot.SetBounds(18, 50, 10, 10);
            status.SetBounds(34, 45, 470, 34);
            var l1 = new Label { Text = "OpenSketch address", AutoSize = true, Location = new Point(16, 88) };
            server.SetBounds(16, 106, 488, 24);
            var l2 = new Label { Text = "SOLIDWORKS key (OpenSketch > Connect AI > SOLIDWORKS > Copy)", AutoSize = true, Location = new Point(16, 138) };
            key.SetBounds(16, 156, 400, 24);
            key.UseSystemPasswordChar = true;
            var paste = new Button { Text = "Paste", Bounds = new Rectangle(424, 155, 80, 26) };
            paste.Click += (s, e) =>
            {
                try
                {
                    if (Clipboard.ContainsText()) key.Text = Clipboard.GetText().Trim();
                }
                catch (Exception)
                {
                }
            };
            auto.Text = "Connect when SOLIDWORKS starts";
            auto.SetBounds(16, 188, 300, 22);
            connect.Text = "Connect";
            connect.SetBounds(16, 218, 110, 30);
            connect.Click += (s, e) => DoConnect();
            disconnect.Text = "Disconnect";
            disconnect.SetBounds(134, 218, 110, 30);
            disconnect.Click += (s, e) => host.Disconnect();
            var copy = new Button { Text = "Copy log", Bounds = new Rectangle(310, 218, 94, 30) };
            copy.Click += (s, e) =>
            {
                try
                {
                    Clipboard.SetText(File.Exists(Log.FilePath) ? File.ReadAllText(Log.FilePath) : "(no log yet)");
                }
                catch (Exception)
                {
                }
            };
            var folder = new Button { Text = "Log folder", Bounds = new Rectangle(410, 218, 94, 30) };
            folder.Click += (s, e) =>
            {
                try
                {
                    Process.Start("explorer.exe", Log.Folder);
                }
                catch (Exception)
                {
                }
            };
            var l3 = new Label { Text = "Activity", AutoSize = true, Location = new Point(16, 258) };
            activity.SetBounds(16, 276, 488, 138);
            activity.Font = new Font("Consolas", 8.25f);
            activity.HorizontalScrollbar = true;
            Controls.AddRange(new Control[] { title, dot, status, l1, server, l2, key, paste, auto, connect, disconnect, copy, folder, l3, activity });

            server.Text = Settings.Server;
            key.Text = Settings.Key;
            auto.Checked = Settings.AutoConnect;
            foreach (var line in Log.Last(60)) activity.Items.Add(line);
            ScrollDown();
            Log.Line += OnLine;
            host.StateChanged += OnState;
            FormClosed += (s, e) =>
            {
                Log.Line -= OnLine;
                host.StateChanged -= OnState;
            };
            Refresh2();
        }

        void DoConnect()
        {
            Settings.Server = server.Text.Trim();
            Settings.Key = key.Text.Trim();
            Settings.AutoConnect = auto.Checked;
            host.Connect();
        }

        void OnLine(string line)
        {
            if (IsDisposed) return;
            try
            {
                BeginInvoke((MethodInvoker)(() =>
                {
                    activity.Items.Add(line);
                    while (activity.Items.Count > 300) activity.Items.RemoveAt(0);
                    ScrollDown();
                }));
            }
            catch (Exception)
            {
            }
        }

        void ScrollDown()
        {
            if (activity.Items.Count > 0) activity.TopIndex = activity.Items.Count - 1;
        }

        void OnState()
        {
            if (IsDisposed) return;
            try
            {
                BeginInvoke((MethodInvoker)Refresh2);
            }
            catch (Exception)
            {
            }
        }

        void Refresh2()
        {
            status.Text = host.State;
            dot.BackColor = host.Connected ? Color.FromArgb(34, 160, 90) : Color.FromArgb(200, 200, 200);
            connect.Text = host.Connected ? "Reconnect" : "Connect";
        }

        /// <summary>Shows the window over SOLIDWORKS' main window.</summary>
        public void ShowNear(ISldWorks app)
        {
            if (Visible)
            {
                Activate();
                return;
            }
            IWin32Window owner = null;
            try
            {
                var frame = (Frame)app.Frame();
                var hwnd = frame?.GetHWndx64() ?? 0;
                if (hwnd != 0) owner = new OwnerWindow(new IntPtr(hwnd));
            }
            catch (Exception)
            {
            }
            if (owner != null) Show(owner);
            else Show();
        }

        sealed class OwnerWindow : IWin32Window
        {
            public OwnerWindow(IntPtr h)
            {
                Handle = h;
            }

            public IntPtr Handle { get; }
        }
    }
}
