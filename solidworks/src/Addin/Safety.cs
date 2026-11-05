using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using OpenSketch.Sw.Core;

namespace OpenSketch.Sw
{
    /// <summary>
    /// Destructive commands are confirmed by the person at this computer before they run: deleting features,
    /// components or mates; undo; Save As (which may replace a file); remaking a drawing over an existing one (an open
    /// copy is closed without saving); removing a global variable; deleting drawing views. The question names the AI
    /// app that asked and exactly what will happen; Deny is the default and the answer after two minutes. Only the
    /// person can switch this off (KEVOS window), never a command.
    /// </summary>
    public static class Safety
    {
        /// <summary>What the command would destroy or replace (Bridge.Destructive), or null.</summary>
        public static string Describe(string op, Dictionary<string, object> a) => Bridge.Destructive.Describe(op, a);

        /// <summary>Asks on SOLIDWORKS' thread; true only when the person clicks Allow.</summary>
        public static bool Ask(IWin32Window owner, string client, string what, string doc, int timeoutS = 120)
        {
            using (var f = new ConfirmForm(client, what, doc, timeoutS))
            {
                var r = owner != null ? f.ShowDialog(owner) : f.ShowDialog();
                return r == DialogResult.Yes;
            }
        }

        sealed class ConfirmForm : Form
        {
            readonly Timer timer = new Timer { Interval = 1000 };
            readonly Label countdown = new Label();
            int left;

            public ConfirmForm(string client, string what, string doc, int timeoutS)
            {
                left = timeoutS;
                Text = "CADOS: confirm";
                Font = new Font("Segoe UI", 9.5f);
                FormBorderStyle = FormBorderStyle.FixedDialog;
                MaximizeBox = MinimizeBox = false;
                ShowInTaskbar = false;
                TopMost = true;
                StartPosition = FormStartPosition.CenterParent;
                ClientSize = new Size(500, 210);
                BackColor = Color.White;
                var head = new Label { Text = (string.IsNullOrEmpty(client) ? "An AI app" : client) + " wants to change your model", Font = new Font("Segoe UI Semibold", 11f),
                                       AutoSize = false, Bounds = new Rectangle(16, 14, 468, 24) };
                var body = new Label { Text = what + (string.IsNullOrEmpty(doc) ? "" : "\r\nIn: " + doc), AutoSize = false, Bounds = new Rectangle(16, 46, 468, 84) };
                countdown.SetBounds(16, 138, 468, 20);
                countdown.ForeColor = Color.FromArgb(110, 110, 110);
                var allow = new Button { Text = "Allow once", DialogResult = DialogResult.Yes, Bounds = new Rectangle(270, 166, 104, 30) };
                var deny = new Button { Text = "Deny", DialogResult = DialogResult.No, Bounds = new Rectangle(380, 166, 104, 30) };
                Controls.AddRange(new Control[] { head, body, countdown, allow, deny });
                AcceptButton = deny;   // Enter never allows by accident
                CancelButton = deny;
                ActiveControl = deny;
                Tick();
                timer.Tick += (s, e) => Tick();
                Shown += (s, e) => timer.Start();
                FormClosed += (s, e) => timer.Dispose();
            }

            void Tick()
            {
                if (left <= 0)
                {
                    DialogResult = DialogResult.No;
                    Close();
                    return;
                }
                countdown.Text = $"Denied by itself in {left} s if nobody answers.";
                left--;
            }
        }
    }
}
