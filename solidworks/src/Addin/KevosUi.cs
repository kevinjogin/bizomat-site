using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.IO;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;
using Environment = System.Environment;

namespace OpenSketch.Sw
{
    /// <summary>
    /// The CADOS command group (a toolbar and a "CADOS" tab on the CommandManager for parts, assemblies and drawings):
    /// CADOS panel, Status, Connect, Disconnect, Companion. Buttons call the add-in's public callbacks by name
    /// (SwAddin.Os*), on SOLIDWORKS' own thread. Icons (KEVOS orange) are drawn once into %LOCALAPPDATA%\KEVOS\icons in
    /// every size SOLIDWORKS asks for.
    /// </summary>
    public sealed class KevosUi
    {
        public const int GroupId = 0x4B45;   // "KE": stable, so SOLIDWORKS keeps the user's toolbar placement
        public const string TabName = "CADOS";
        const string OldTabName = "KEVOS";   // 0.11 and earlier: removed when found
        static readonly int[] Sizes = { 20, 32, 40, 64, 96, 128 };
        static readonly (string name, string tip, string glyph, string callback)[] Buttons =
        {
            ("CADOS panel", "CADOS: status, prompts for your AI assistant, activity and help", "C", "OsPanel"),
            ("Status", "Connection details, the direct link and the log", "i", "OsWindow"),
            ("Connect", "Connect this SOLIDWORKS to CADOS now", "+", "OsConnect"),
            ("Disconnect", "Stop taking commands from your AI assistant", "\u2013", "OsDisconnect"),
            ("KEVOS Companion", "Open the KEVOS Companion (pairing, pause, logs)", "K", "OsCompanion"),
        };
        static readonly int[] DocTypes = { (int)swDocumentTypes_e.swDocPART, (int)swDocumentTypes_e.swDocASSEMBLY, (int)swDocumentTypes_e.swDocDRAWING };

        readonly ISldWorks app;
        ICommandManager mgr;

        public KevosUi(ISldWorks app)
        {
            this.app = app;
        }

        public void Install(int cookie)
        {
            mgr = app.GetCommandManager(cookie) as ICommandManager;
            if (mgr == null) return;
            var err = 0;
            var group = mgr.CreateCommandGroup2(GroupId, "CADOS", "CADOS by KEVOS: your AI assistant working in SOLIDWORKS", "CADOS by KEVOS", -1, true, ref err) as ICommandGroup;
            if (group == null)
            {
                Log.Write("CommandManager group not made (error " + err + ")");
                return;
            }
            try
            {
                group.IconList = Strips(false);
                group.MainIconList = Strips(true);
            }
            catch (Exception ex)
            {
                Log.Write("icons: " + ex.Message);
            }
            var index = new int[Buttons.Length];
            for (var i = 0; i < Buttons.Length; i++)
            {
                var b = Buttons[i];
                index[i] = group.AddCommandItem2(b.name, -1, b.tip, b.tip, i, b.callback, "OsEnable", i + 1,
                                                 (int)(swCommandItemType_e.swMenuItem | swCommandItemType_e.swToolbarItem));
            }
            group.HasToolbar = true;
            group.HasMenu = true;
            group.Activate();
            var ids = new int[Buttons.Length];
            var text = new int[Buttons.Length];
            for (var i = 0; i < Buttons.Length; i++)
            {
                ids[i] = group.get_CommandID(index[i]);
                text[i] = (int)swCommandTabButtonTextDisplay_e.swCommandTabButton_TextBelow;
            }
            foreach (var t in DocTypes)
            {
                try
                {
                    foreach (var name in new[] { OldTabName, TabName })
                    {
                        var old = mgr.GetCommandTab(t, name) as ICommandTab;
                        if (old != null) mgr.RemoveCommandTab((CommandTab)old);
                    }
                    var tab = mgr.AddCommandTab(t, TabName) as ICommandTab;
                    var box = tab?.AddCommandTabBox() as ICommandTabBox;
                    box?.AddCommands(ids, text);
                }
                catch (Exception ex)
                {
                    Log.Write("command tab: " + ex.Message);
                }
            }
        }

        public void Remove()
        {
            if (mgr == null) return;
            foreach (var t in DocTypes)
            {
                try
                {
                    var tab = mgr.GetCommandTab(t, TabName) as ICommandTab;
                    if (tab != null) mgr.RemoveCommandTab((CommandTab)tab);
                }
                catch (Exception)
                {
                }
            }
            try
            {
                mgr.RemoveCommandGroup2(GroupId, true);
            }
            catch (Exception)
            {
            }
            mgr = null;
        }

        static string IconDir
        {
            get
            {
                var d = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "KEVOS", "icons", Host.Version);
                Directory.CreateDirectory(d);
                return d;
            }
        }

        /// <summary>The CADOS icon in every size (the group's icon, and the task pane tab's).</summary>
        public static string[] MainIcons() => Strips(true);

        /// <summary>One PNG strip per size: every button's icon side by side (or the group's own icon).</summary>
        static string[] Strips(bool main)
        {
            var o = new string[Sizes.Length];
            for (var k = 0; k < Sizes.Length; k++)
            {
                var s = Sizes[k];
                var path = Path.Combine(IconDir, (main ? "cados2_main_" : "cados2_buttons_") + s + ".png");
                if (!File.Exists(path))
                {
                    var glyphs = main ? new[] { "C" } : Array.ConvertAll(Buttons, b => b.glyph);
                    using (var bmp = new Bitmap(s * glyphs.Length, s, PixelFormat.Format32bppArgb))
                    using (var g = Graphics.FromImage(bmp))
                    {
                        g.SmoothingMode = SmoothingMode.AntiAlias;
                        g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
                        g.Clear(Color.Transparent);
                        for (var i = 0; i < glyphs.Length; i++)
                        {
                            var r = new RectangleF(i * s + s * 0.06f, s * 0.06f, s * 0.88f, s * 0.88f);
                            using (var bg = new SolidBrush(Color.FromArgb(194, 65, 12)))   // KEVOS accent #c2410c (white glyphs readable on it)
                            using (var path2 = Rounded(r, s * 0.2f))
                                g.FillPath(bg, path2);
                            using (var f = new Font("Segoe UI", s * 0.5f, FontStyle.Bold, GraphicsUnit.Pixel))
                            using (var white = new SolidBrush(Color.White))
                            using (var fmt = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                                g.DrawString(glyphs[i], f, white, r, fmt);
                        }
                        bmp.Save(path, ImageFormat.Png);
                    }
                }
                o[k] = path;
            }
            return o;
        }

        static GraphicsPath Rounded(RectangleF r, float rad)
        {
            var p = new GraphicsPath();
            var d = rad * 2;
            p.AddArc(r.X, r.Y, d, d, 180, 90);
            p.AddArc(r.Right - d, r.Y, d, d, 270, 90);
            p.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90);
            p.AddArc(r.X, r.Bottom - d, d, d, 90, 90);
            p.CloseFigure();
            return p;
        }
    }
}
