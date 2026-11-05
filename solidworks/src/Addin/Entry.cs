using System;
using System.Runtime.InteropServices;
using Microsoft.Win32;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;
using SolidWorks.Interop.swpublished;

namespace OpenSketch.Sw
{
    /// <summary>
    /// The SOLIDWORKS add-in (Tools > Add-Ins > KEVOS), loaded when SOLIDWORKS starts. Adds the KEVOS menu, toolbar and
    /// CommandManager tab, connects to the KEVOS Companion by itself, and (when a key is saved) to the direct link.
    /// </summary>
    [ComVisible(true)]
    [Guid(SwAddin.ClassId)]
    [ProgId(SwAddin.ProgIdName)]
    [ClassInterface(ClassInterfaceType.AutoDispatch)]
    public class SwAddin : ISwAddin
    {
        public const string ClassId = "275256ff-b73a-4e4f-9ea8-842b6626d471";
        public const string ProgIdName = "OpenSketch.Sw.SwAddin";
        public const string Title = "KEVOS";
        public const string Description = "KEVOS Bridge: AI apps (Claude, ChatGPT...) build parts, assemblies and drawings in SOLIDWORKS";

        ISldWorks app;
        int cookie;
        KevosUi ui;
        const string MenuName = "KEVOS";
        static readonly (string name, string callback, string hint)[] Menu =
        {
            ("KEVOS status...", "OsWindow", "Connection, computer, confirmations and activity"),
            ("Connect now", "OsConnect", "Connect this SOLIDWORKS to KEVOS (it also connects by itself)"),
            ("Disconnect", "OsDisconnect", "Stop taking commands from AI apps until Connect"),
            ("Open KEVOS Companion", "OsCompanion", "Pairing, pause, logs"),
        };
        static readonly int[] DocTypes =
        {
            (int)swDocumentTypes_e.swDocNONE, (int)swDocumentTypes_e.swDocPART, (int)swDocumentTypes_e.swDocASSEMBLY,
            (int)swDocumentTypes_e.swDocDRAWING
        };

        public bool ConnectToSW(object ThisSW, int Cookie)
        {
            try
            {
                app = (ISldWorks)ThisSW;
                cookie = Cookie;
                app.SetAddinCallbackInfo2(0, this, cookie);
                foreach (var t in DocTypes)
                    foreach (var (name, cb, hint) in Menu)
                        app.AddMenuItem5(t, cookie, name + "@" + MenuName, -1, cb, "OsEnable", hint, null);
                // the KEVOS Companion link starts here by itself; the direct link only when its key is saved (as before)
                var host = Host.Start(app, "add-in");
                if (Settings.AutoConnect && Settings.Key.StartsWith("oss_") && !host.Running) host.Connect();
                try
                {
                    ui = new KevosUi(app);
                    ui.Install(cookie);
                }
                catch (Exception ex)
                {
                    Log.Write("KEVOS toolbar not made: " + ex.Message);   // the menu still works
                }
                return true;
            }
            catch (Exception ex)
            {
                Log.Write("add-in start failed: " + ex);
                return false;
            }
        }

        public bool DisconnectFromSW()
        {
            try
            {
                try
                {
                    ui?.Remove();
                }
                catch (Exception)
                {
                }
                ui = null;
                foreach (var t in DocTypes)
                    foreach (var (name, _, _) in Menu)
                        app?.RemoveMenu(t, name + "@" + MenuName, "");
                Host.Current?.Stop();
            }
            catch (Exception ex)
            {
                Log.Write("add-in stop: " + ex.Message);
            }
            app = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
            return true;
        }

        // menu and toolbar callbacks (SOLIDWORKS calls them by name, on its own thread)
        public void OsConnect()
        {
            var h = Host.Current ?? Host.Start(app, "add-in");
            Settings.UseCompanion = true;
            h.StartPipe();
            if (Settings.Key.StartsWith("oss_")) h.Connect();
            h.ShowWindow();
        }

        public void OsDisconnect()
        {
            Host.Current?.Disconnect();
            Host.Current?.StopPipe();
        }

        public void OsCompanion()
        {
            try
            {
                if (!CompanionPipe.StartCompanion())
                    System.Windows.Forms.MessageBox.Show("The KEVOS Companion is not installed on this computer. Install KEVOS Bridge.", "KEVOS");
            }
            catch (Exception ex)
            {
                Log.Write("open companion: " + ex.Message);
            }
        }

        public void OsWindow() => (Host.Current ?? Host.Start(app, "add-in")).ShowWindow();

        public int OsEnable() => 1;

        // regasm /codebase (an admin install) writes these; the per-user install (OpenSketchSW.exe) writes its own.
        [ComRegisterFunction]
        public static void Register(Type t)
        {
            try
            {
                using (var k = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\SolidWorks\Addins\{" + ClassId + "}"))
                {
                    k.SetValue(null, 0);
                    k.SetValue("Description", Description);
                    k.SetValue("Title", Title);
                }
            }
            catch (Exception)
            {
            }
            try
            {
                using (var k = Registry.CurrentUser.CreateSubKey(@"Software\SolidWorks\AddInsStartup\{" + ClassId + "}"))
                    k.SetValue(null, 1, RegistryValueKind.DWord);
            }
            catch (Exception)
            {
            }
        }

        [ComUnregisterFunction]
        public static void Unregister(Type t)
        {
            try
            {
                Registry.LocalMachine.DeleteSubKey(@"SOFTWARE\SolidWorks\Addins\{" + ClassId + "}", false);
            }
            catch (Exception)
            {
            }
            try
            {
                Registry.CurrentUser.DeleteSubKey(@"Software\SolidWorks\AddInsStartup\{" + ClassId + "}", false);
            }
            catch (Exception)
            {
            }
        }
    }

    /// <summary>
    /// Starts the same link from a SOLIDWORKS macro, for PCs where add-ins cannot be installed (no admin rights):
    /// the class is registered for this Windows user only, and the macro OpenSketch.swp does
    /// <c>CreateObject("OpenSketch.Sw.Launcher").Start Application.SldWorks</c>. It runs inside SOLIDWORKS like an
    /// add-in and keeps running after the macro ends.
    /// </summary>
    [ComVisible(true)]
    [Guid(Launcher.ClassId)]
    [ProgId(Launcher.ProgIdName)]
    [ClassInterface(ClassInterfaceType.AutoDispatch)]
    public class Launcher
    {
        public const string ClassId = "ed25919a-7e4a-4a08-a2db-4c69ae22b1ea";
        public const string ProgIdName = "OpenSketch.Sw.Launcher";

        public string Start(object sldWorks)
        {
            try
            {
                var app = (ISldWorks)sldWorks;
                if (Host.Current == null)
                {
                    // first ask SOLIDWORKS to load it as a real add-in (menus, starts with SOLIDWORKS); without admin
                    // rights that may be refused, and the link then runs from here, inside SOLIDWORKS all the same
                    try
                    {
                        var dll = typeof(Launcher).Assembly.Location;
                        var r = app.LoadAddIn(dll);
                        Log.Write($"LoadAddIn({dll}) = {(Enum.GetName(typeof(swLoadAddinError_e), r) ?? r.ToString())}");
                    }
                    catch (Exception ex)
                    {
                        Log.Write("LoadAddIn failed: " + ex.Message);
                    }
                }
                var host = Host.Start(app, Host.Current?.Mode ?? "macro");
                if (!host.Running && Settings.Key.StartsWith("oss_")) host.Connect();
                host.ShowWindow();
                return host.State;
            }
            catch (Exception ex)
            {
                Log.Write("launcher: " + ex);
                return "OpenSketch could not start: " + ex.Message;
            }
        }

        public string Status() => Host.Current?.State ?? "Not started";

        public string Version() => Host.Version;
    }
}
