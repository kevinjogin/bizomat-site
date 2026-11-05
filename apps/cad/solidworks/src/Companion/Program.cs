using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Windows.Forms;
using OpenSketch.Sw.Core;

namespace Kevos.Companion
{
    /// <summary>
    /// KEVOS.Companion.exe, the BIZOMAT Companion. Normally started by Windows at logon ("--background": tray icon only). One per Windows user:
    /// a second start brings the first one's window up instead. Command line (installer and support):
    ///   --background   start quietly (no window unless the computer still needs pairing)
    ///   --pair         open the pairing window
    ///   --diagnose     write a diagnostics report and open it
    ///   --startup on|off   start with Windows for this user
    ///   --unpair       remove this computer from the account and delete its key (Start menu, before reinstalling)
    ///   --exit         stop a running companion
    /// </summary>
    static class Program
    {
        static string Sid()
        {
            using (var id = WindowsIdentity.GetCurrent()) return id.User?.Value ?? "user";
        }

        [STAThread]
        static int Main(string[] args)
        {
            var a = args.Select(x => x.ToLowerInvariant()).ToList();
            var sid = Sid();
            if (a.Contains("--startup"))
            {
                var on = a.IndexOf("--startup") + 1 < a.Count ? a[a.IndexOf("--startup") + 1] != "off" : true;
                Startup.Set(on);
                return 0;
            }
            if (a.Contains("--exit"))
            {
                using (var ev = OpenEvent("Local\\KEVOS.Companion.Exit." + sid)) ev?.Set();
                return 0;
            }
            if (a.Contains("--unpair")) return Unpair(sid, a.Contains("--quiet"));
            using (var mutex = new Mutex(false, "Local\\KEVOS.Companion." + sid, out var mine))
            {
                if (!mine)
                {
                    // already running for this user: show it (unless Windows is just starting it again)
                    if (!a.Contains("--background"))
                        using (var ev = OpenEvent("Local\\KEVOS.Companion.Show." + sid)) ev?.Set();
                    return 0;
                }
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
                Application.ThreadException += (s, e) => Fatal(e.Exception, args);
                AppDomain.CurrentDomain.UnhandledException += (s, e) => Fatal(e.ExceptionObject as Exception, args);
                Log.Write($"BIZOMAT Companion {Updater.Current.ToString(3)} starting ({string.Join(" ", args)}) from {Paths.Exe}");
                if (a.Contains("--diagnose"))
                {
                    Application.Run(new TrayApp(sid, background: true, pair: false, diagnose: true));
                    return 0;
                }
                Application.Run(new TrayApp(sid, background: a.Contains("--background"), pair: a.Contains("--pair"), diagnose: false));
            }
            return 0;
        }

        /// <summary>Removes this computer from the account (the server stops accepting its key at once) and deletes the key,
        /// so the identity cannot be reused or copied. Pairing again makes a new one.</summary>
        static int Unpair(string sid, bool quiet)
        {
            using (var ev = OpenEvent("Local\\KEVOS.Companion.Exit." + sid)) ev?.Set();
            Thread.Sleep(1500);
            try
            {
                using (var key = CngDeviceKey.OpenOrCreate())
                {
                    var engine = new OpenSketch.Sw.Bridge.CompanionEngine(new OpenSketch.Sw.Bridge.CompanionOptions { DataDir = Paths.Data, GatewayUrl = Config.GatewayUrl }, key, null, Log.Write);
                    var name = engine.Config.DeviceName;
                    engine.Unpair();
                    Log.Write("unpaired " + name + " from the command line");
                }
                CngDeviceKey.Delete();
                if (!quiet) MessageBox.Show("This computer was removed from CAD Automation and its key was deleted. To use it again, open the BIZOMAT Companion and pair it.", BrandArt.Companion);
                return 0;
            }
            catch (Exception ex)
            {
                Log.Write("unpair: " + ex);
                if (!quiet) MessageBox.Show("Could not remove this computer: " + ex.Message, BrandArt.Companion, MessageBoxButtons.OK, MessageBoxIcon.Error);
                return 1;
            }
        }

        static EventWaitHandle OpenEvent(string name)
        {
            try
            {
                return EventWaitHandle.OpenExisting(name);
            }
            catch (Exception)
            {
                return null;
            }
        }

        static int fatal;

        /// <summary>Startup recovery: an unexpected crash is logged and the companion starts again by itself (at most once
        /// a minute, so a crash loop cannot spin).</summary>
        static void Fatal(Exception ex, string[] args)
        {
            if (Interlocked.Exchange(ref fatal, 1) == 1) return;
            Log.Write("FATAL: " + ex);
            try
            {
                var stamp = Path.Combine(Paths.Data, "last-crash.txt");
                var recent = File.Exists(stamp) && DateTime.UtcNow - File.GetLastWriteTimeUtc(stamp) < TimeSpan.FromMinutes(1);
                File.WriteAllText(stamp, DateTime.UtcNow.ToString("o") + " " + ex?.Message);
                if (!recent)
                {
                    Log.Write("restarting the companion in 10 s");
                    Process.Start(new ProcessStartInfo("cmd.exe", $"/c timeout /t 10 /nobreak >nul & start \"\" \"{Paths.Exe}\" --background")
                                  { CreateNoWindow = true, UseShellExecute = false, WindowStyle = ProcessWindowStyle.Hidden })?.Dispose();
                }
            }
            catch (Exception)
            {
            }
            Environment.Exit(1);
        }
    }
}
