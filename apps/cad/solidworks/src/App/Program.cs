using System;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using Microsoft.Win32;
using SolidWorks.Interop.sldworks;
using Environment = System.Environment;

namespace OpenSketch.Sw.App
{
    /// <summary>
    /// OpenSketchSW.exe. Double-click: a small window to install the link for this Windows user (no admin rights) and,
    /// if SOLIDWORKS cannot load add-ins on this PC, to connect to the open SOLIDWORKS from outside.
    /// Command line: --install, --uninstall, --attach.
    /// </summary>
    static class Program
    {
        [STAThread]
        static int Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            var a = args.Length > 0 ? args[0].ToLowerInvariant() : "";
            try
            {
                switch (a)
                {
                    case "--install":
                        Console.WriteLine(Installer.Install());
                        return 0;
                    case "--uninstall":
                        Console.WriteLine(Installer.Uninstall());
                        return 0;
                    case "--attach":
                        return Attach.Run(true) ? 0 : 1;
                    default:
                        Application.Run(new MainForm());
                        return 0;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "BIZOMAT CAD Automation for SOLIDWORKS", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return 1;
            }
        }
    }

    /// <summary>Registers the add-in and the launcher for this Windows user only (HKEY_CURRENT_USER): no admin rights.</summary>
    static class Installer
    {
        const string NetCategory = "{62C8FE65-4EBB-45E7-B440-6E39B2CDBF29}";

        public static string Folder => Path.GetDirectoryName(typeof(Installer).Assembly.Location);
        public static string Dll => Path.Combine(Folder, "OpenSketch.Sw.dll");

        static RegistryKey Hkcu() => RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Registry64);

        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern bool DeleteFile(string name);

        /// <summary>Files from a download carry a "came from the internet" mark that stops .NET loading them.</summary>
        static void Unblock()
        {
            foreach (var f in Directory.GetFiles(Folder))
                DeleteFile(f + ":Zone.Identifier");
        }

        static void RegisterClass(RegistryKey classes, Type t, string guid, string progId)
        {
            var asm = t.Assembly;
            var codeBase = new Uri(Dll).AbsoluteUri;
            var ver = asm.GetName().Version.ToString();
            using (var k = classes.CreateSubKey(@"CLSID\{" + guid + "}"))
            {
                k.SetValue(null, t.FullName);
                using (var s = k.CreateSubKey("InprocServer32"))
                {
                    s.SetValue(null, "mscoree.dll");
                    s.SetValue("ThreadingModel", "Both");
                    s.SetValue("Class", t.FullName);
                    s.SetValue("Assembly", asm.FullName);
                    s.SetValue("RuntimeVersion", "v4.0.30319");
                    s.SetValue("CodeBase", codeBase);
                    using (var v = s.CreateSubKey(ver))
                    {
                        v.SetValue("Class", t.FullName);
                        v.SetValue("Assembly", asm.FullName);
                        v.SetValue("RuntimeVersion", "v4.0.30319");
                        v.SetValue("CodeBase", codeBase);
                    }
                }
                using (var p = k.CreateSubKey("ProgId")) p.SetValue(null, progId);
                k.CreateSubKey(@"Implemented Categories\" + NetCategory).Dispose();
            }
            using (var k = classes.CreateSubKey(progId))
            {
                k.SetValue(null, t.FullName);
                using (var c = k.CreateSubKey("CLSID")) c.SetValue(null, "{" + guid + "}");
            }
        }

        public static string Install()
        {
            if (!File.Exists(Dll)) throw new FileNotFoundException("OpenSketch.Sw.dll is not next to this program. Unzip the whole folder first.");
            Unblock();
            using (var hk = Hkcu())
            using (var classes = hk.CreateSubKey(@"Software\Classes"))
            {
                RegisterClass(classes, typeof(SwAddin), SwAddin.ClassId, SwAddin.ProgIdName);
                RegisterClass(classes, typeof(Launcher), Launcher.ClassId, Launcher.ProgIdName);
                using (var k = hk.CreateSubKey(@"Software\SolidWorks\AddIns\{" + SwAddin.ClassId + "}"))
                {
                    k.SetValue(null, 1, RegistryValueKind.DWord);
                    k.SetValue("Title", SwAddin.Title);
                    k.SetValue("Description", SwAddin.Description);
                    var icon = Path.Combine(Folder, "BIZOMAT.bmp");   // the BIZOMAT mark in Tools > Add-Ins
                    if (File.Exists(icon)) k.SetValue("Icon Path", icon);
                }
                using (var k = hk.CreateSubKey(@"Software\SolidWorks\AddInsStartup\{" + SwAddin.ClassId + "}"))
                    k.SetValue(null, 1, RegistryValueKind.DWord);
            }
            var listed = TryMachineAddInKey();
            var macro = WriteMacro();
            Log.Write($"installed for {Environment.UserName} from {Folder}; add-in list (needs admin): {(listed ? "yes" : "no")}; macro {macro}");
            return "Installed for " + Environment.UserName + ".\r\n\r\n" +
                   (listed
                       ? "Restart SOLIDWORKS: BIZOMAT CAD Automation is in Tools > Add-Ins, on the BIZOMAT menu and the BIZOMAT tab.\r\n"
                       : "Without admin rights SOLIDWORKS may not list the add-in. Then start it with the launcher macro (no admin needed):\r\n" +
                         "Tools > Macro > Run > " + macro + "\r\n(or Tools > Customize > Commands > Macro to give it a button).\r\n") +
                   "\r\nThe launcher macro only starts the add-in inside SOLIDWORKS. Paste your add-in key in the window it opens.";
        }

        /// <summary>The add-in list SOLIDWORKS shows is under HKEY_LOCAL_MACHINE: written only if this account may.</summary>
        static bool TryMachineAddInKey()
        {
            try
            {
                using (var hk = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64))
                using (var k = hk.CreateSubKey(@"SOFTWARE\SolidWorks\Addins\{" + SwAddin.ClassId + "}"))
                {
                    k.SetValue(null, 1, RegistryValueKind.DWord);
                    k.SetValue("Title", SwAddin.Title);
                    k.SetValue("Description", SwAddin.Description);
                    var icon = Path.Combine(Folder, "BIZOMAT.bmp");   // the BIZOMAT mark in Tools > Add-Ins
                    if (File.Exists(icon)) k.SetValue("Icon Path", icon);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public const string MacroText =
            "' BIZOMAT CAD Automation for SOLIDWORKS: starts the add-in inside SOLIDWORKS (it is not the add-in itself).\r\n" +
            "' Tools > Macro > Run this file, or give it a button (Tools > Customize > Commands > Macro).\r\n" +
            "' It needs OpenSketchSW.exe > Install for me once (no admin rights).\r\n" +
            "Dim gOpenSketch As Object\r\n" +
            "\r\n" +
            "Sub main()\r\n" +
            "    On Error GoTo failed\r\n" +
            "    Set gOpenSketch = CreateObject(\"OpenSketch.Sw.Launcher\")\r\n" +
            "    gOpenSketch.Start Application.SldWorks\r\n" +
            "    Exit Sub\r\n" +
            "failed:\r\n" +
            "    MsgBox \"BIZOMAT CAD Automation is not installed for this Windows user. Install BIZOMAT CAD Automation for SOLIDWORKS, or run OpenSketchSW.exe and click Install for me.\" & vbCrLf & Err.Description, vbExclamation, \"BIZOMAT CAD Automation\"\r\n" +
            "End Sub\r\n";

        /// <summary>The launcher macro as text (.swb runs from Tools > Macro > Run like a .swp) in Documents\OpenSketch.</summary>
        static string WriteMacro()
        {
            var d = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "OpenSketch");
            Directory.CreateDirectory(d);
            var p = Path.Combine(d, "OpenSketch.swb");
            var shipped = Path.Combine(Folder, "OpenSketch.swb");
            File.WriteAllText(p, File.Exists(shipped) ? File.ReadAllText(shipped) : MacroText);
            File.WriteAllText(Path.Combine(d, "OpenSketch macro (paste into a new macro).txt"), MacroText);
            return p;
        }

        public static string Uninstall()
        {
            using (var hk = Hkcu())
            {
                foreach (var (g, p) in new[] { (SwAddin.ClassId, SwAddin.ProgIdName), (Launcher.ClassId, Launcher.ProgIdName) })
                {
                    hk.DeleteSubKeyTree(@"Software\Classes\CLSID\{" + g + "}", false);
                    hk.DeleteSubKeyTree(@"Software\Classes\" + p, false);
                }
                hk.DeleteSubKeyTree(@"Software\SolidWorks\AddIns\{" + SwAddin.ClassId + "}", false);
                hk.DeleteSubKeyTree(@"Software\SolidWorks\AddInsStartup\{" + SwAddin.ClassId + "}", false);
            }
            try
            {
                using (var hk = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64))
                    hk.DeleteSubKeyTree(@"SOFTWARE\SolidWorks\Addins\{" + SwAddin.ClassId + "}", false);
            }
            catch (Exception)
            {
            }
            return "Removed for " + Environment.UserName + ". Your key stays saved; delete HKEY_CURRENT_USER\\Software\\OpenSketch to forget it.";
        }

        public static bool Installed
        {
            get
            {
                using (var hk = Hkcu())
                using (var k = hk.OpenSubKey(@"Software\Classes\CLSID\{" + Launcher.ClassId + @"}\InprocServer32"))
                {
                    var cb = k?.GetValue("CodeBase") as string;
                    return cb != null && string.Equals(cb, new Uri(Dll).AbsoluteUri, StringComparison.OrdinalIgnoreCase);
                }
            }
        }
    }

    /// <summary>The fallback: drive the open SOLIDWORKS from this program (out of process).</summary>
    static class Attach
    {
        public static ISldWorks Find()
        {
            try
            {
                return Marshal.GetActiveObject("SldWorks.Application") as ISldWorks;
            }
            catch (COMException)
            {
                return null;
            }
        }

        public static bool Run(bool standalone)
        {
            var sw = Find();
            if (sw == null)
            {
                MessageBox.Show("Open SOLIDWORKS first, then connect.", "BIZOMAT CAD Automation for SOLIDWORKS", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return false;
            }
            MessageFilter.Register();
            var host = Host.Start(sw, "program");
            if (Settings.Key.StartsWith("oss_")) host.Connect();
            host.ShowWindow();
            // started on its own (--attach): the program ends when its window is closed, and the link with it
            if (standalone)
            {
                if (host.Window != null) Application.Run(host.Window);
                host.Stop();
            }
            return true;
        }
    }

    /// <summary>Retries calls SOLIDWORKS turns away while it is busy (out of process only).</summary>
    [ComImport, Guid("00000016-0000-0000-C000-000000000046"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IOleMessageFilter
    {
        [PreserveSig] int HandleInComingCall(int dwCallType, IntPtr hTaskCaller, int dwTickCount, IntPtr lpInterfaceInfo);
        [PreserveSig] int RetryRejectedCall(IntPtr hTaskCallee, int dwTickCount, int dwRejectType);
        [PreserveSig] int MessagePending(IntPtr hTaskCallee, int dwTickCount, int dwPendingType);
    }

    sealed class MessageFilter : IOleMessageFilter
    {
        [DllImport("Ole32.dll")]
        static extern int CoRegisterMessageFilter(IOleMessageFilter newFilter, out IOleMessageFilter oldFilter);

        static bool done;

        public static void Register()
        {
            if (done) return;
            CoRegisterMessageFilter(new MessageFilter(), out _);
            done = true;
        }

        public int HandleInComingCall(int dwCallType, IntPtr hTaskCaller, int dwTickCount, IntPtr lpInterfaceInfo) => 0;

        public int RetryRejectedCall(IntPtr hTaskCallee, int dwTickCount, int dwRejectType) =>
            dwRejectType == 2 && dwTickCount < 600000 ? 200 : -1;   // SERVERCALL_RETRYLATER: try again in 200 ms, for up to 10 min

        public int MessagePending(IntPtr hTaskCallee, int dwTickCount, int dwPendingType) => 2;
    }

    sealed class MainForm : Form
    {
        readonly Label state = new Label();

        public MainForm()
        {
            Text = "BIZOMAT CAD Automation for SOLIDWORKS " + Host.Version + " (manual installation)";
            Font = new Font("Segoe UI", 9f);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            ClientSize = new Size(520, 330);
            BackColor = Color.White;
            StartPosition = FormStartPosition.CenterScreen;
            var title = new Label { Text = "BIZOMAT CAD Automation, for this Windows user", Font = new Font("Segoe UI Semibold", 12f), AutoSize = true, Location = new Point(16, 14) };
            var l1 = new Label
            {
                Text = "1. Install for me: sets up the add-in and the launcher macro for this Windows user (no admin rights).",
                Location = new Point(16, 50), Size = new Size(488, 34)
            };
            var install = new Button { Text = "Install for me", Bounds = new Rectangle(16, 86, 140, 30) };
            var remove = new Button { Text = "Remove", Bounds = new Rectangle(164, 86, 90, 30) };
            var l2 = new Label
            {
                Text = "2. In SOLIDWORKS: BIZOMAT > Status (the add-in), or start it with Tools > Macro > Run > Documents\\OpenSketch\\OpenSketch.swb. Paste your add-in key from your CAD Automation dashboard.",
                Location = new Point(16, 128), Size = new Size(488, 50)
            };
            var copy = new Button { Text = "Copy the macro text", Bounds = new Rectangle(16, 180, 160, 30) };
            var l3 = new Label
            {
                Text = "3. If neither shows up (IT locked SOLIDWORKS down), connect from this program instead: it drives the open SOLIDWORKS from outside.",
                Location = new Point(16, 222), Size = new Size(488, 34)
            };
            var attach = new Button { Text = "Connect to the open SOLIDWORKS", Bounds = new Rectangle(16, 258, 230, 30) };
            state.SetBounds(16, 296, 488, 24);
            state.ForeColor = Color.DimGray;
            Controls.AddRange(new Control[] { title, l1, install, remove, l2, copy, l3, attach, state });
            install.Click += (s, e) => Do(() => MessageBox.Show(Installer.Install(), "Installed", MessageBoxButtons.OK, MessageBoxIcon.Information));
            remove.Click += (s, e) => Do(() => MessageBox.Show(Installer.Uninstall(), "Removed"));
            copy.Click += (s, e) => Do(() =>
            {
                Clipboard.SetText(Installer.MacroText);
                state.Text = "Copied. In SOLIDWORKS: Tools > Macro > New, save it, paste over everything, then Run.";
            });
            attach.Click += (s, e) => Do(() =>
            {
                if (Attach.Run(false)) state.Text = "Connected from outside SOLIDWORKS. Keep this program open while your AI assistant works.";
            });
            Refresh2();
        }

        void Do(Action a)
        {
            try
            {
                a();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "BIZOMAT CAD Automation for SOLIDWORKS", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            Refresh2();
        }

        void Refresh2()
        {
            if (string.IsNullOrEmpty(state.Text) || state.Text.StartsWith("Installed") || state.Text.StartsWith("Not installed"))
                state.Text = Installer.Installed ? "Installed for " + Environment.UserName + " from this folder." : "Not installed yet.";
        }
    }
}
