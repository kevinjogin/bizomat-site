using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.IO.Pipes;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Security.Principal;
using System.Threading;
using Microsoft.Win32;
using Microsoft.Win32.SafeHandles;
using OpenSketch.Sw.Bridge;
using OpenSketch.Sw.Core;

namespace Kevos.Companion
{
    /// <summary>Where the companion keeps its files: %LOCALAPPDATA%\KEVOS\Bridge (this Windows user only).</summary>
    static class Paths
    {
        public static string Data => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "KEVOS", "Bridge");
        public static string Logs => Path.Combine(Data, "logs");
        public static string Exe => Assembly.GetExecutingAssembly().Location;
        public static string Folder => Path.GetDirectoryName(Exe);
        public static string AddinDll => Path.Combine(Folder, "OpenSketch.Sw.dll");
    }

    /// <summary>A plain daily log in %LOCALAPPDATA%\KEVOS\Bridge\logs (14 days kept). Commands are logged by id and op;
    /// no key, token or password exists to be logged (the device key never leaves the key store).</summary>
    static class Log
    {
        static readonly object Gate = new object();
        public static event Action<string> Line;
        public static string FilePath => Path.Combine(Paths.Logs, "companion-" + DateTime.Now.ToString("yyyyMMdd") + ".log");

        public static void Write(string s)
        {
            var line = DateTime.Now.ToString("HH:mm:ss ") + s;
            lock (Gate)
            {
                try
                {
                    Directory.CreateDirectory(Paths.Logs);
                    File.AppendAllText(FilePath, line + Environment.NewLine);
                    foreach (var old in Directory.GetFiles(Paths.Logs, "companion-*.log").Where(f => File.GetLastWriteTime(f) < DateTime.Now.AddDays(-14)))
                        File.Delete(old);
                }
                catch (Exception)
                {
                }
            }
            try
            {
                Line?.Invoke(line);
            }
            catch (Exception)
            {
            }
        }

        public static IEnumerable<string> Last(int n)
        {
            try
            {
                return File.Exists(FilePath) ? File.ReadLines(FilePath).Reverse().Take(n).Reverse().ToList() : new List<string>();
            }
            catch (Exception)
            {
                return new List<string>();
            }
        }
    }

    /// <summary>KEVOS settings: per user (HKCU\Software\KEVOS\Bridge) over the installer's (HKLM\SOFTWARE\KEVOS\Bridge).</summary>
    static class Config
    {
        const string Path_ = @"SOFTWARE\KEVOS\Bridge";

        /// <summary>The address the pairing window suggests when neither the installer (GATEWAY_URL) nor the person set one.</summary>
        public const string DefaultGateway = "https://cados.kevos.com";

        static object Read(string name)
        {
            foreach (var hive in new[] { RegistryHive.CurrentUser, RegistryHive.LocalMachine })
            {
                try
                {
                    using (var b = RegistryKey.OpenBaseKey(hive, RegistryView.Registry64))
                    using (var k = b.OpenSubKey(Path_))
                    {
                        var v = k?.GetValue(name);
                        if (v != null) return v;
                    }
                }
                catch (Exception)
                {
                }
            }
            return null;
        }

        static void Write(string name, object v, RegistryValueKind kind)
        {
            using (var k = Registry.CurrentUser.CreateSubKey(Path_)) k.SetValue(name, v, kind);
        }

        public static string GatewayUrl
        {
            get => Read("GatewayUrl") as string;
            set => Write("GatewayUrl", value ?? "", RegistryValueKind.String);
        }

        public static bool Flag(string name, bool dflt) => (Read(name) as int? ?? (dflt ? 1 : 0)) != 0;
        public static void SetFlag(string name, bool v) => Write(name, v ? 1 : 0, RegistryValueKind.DWord);
        public static string Text(string name) => Read(name) as string;

        public static bool StartSolidWorksOnDemand => Flag("StartSolidWorksOnDemand", false);
        public static bool AutoLoadAddin => Flag("AutoLoadAddin", true);
        public static bool ConfirmDestructive => Flag("ConfirmDestructive", true);
    }

    /// <summary>
    /// The local pipe, Windows: \\.\pipe\KEVOS.Bridge.&lt;user SID&gt;. Made with CreateNamedPipe so that
    /// - the first instance has FILE_FLAG_FIRST_PIPE_INSTANCE: if another process already holds the name, we refuse to
    ///   run rather than share it (pipe squatting);
    /// - the DACL is protected and allows only this Windows user, and denies network logons;
    /// - PIPE_REJECT_REMOTE_CLIENTS refuses connections from other computers.
    /// Each client's process id comes from GetNamedPipeClientProcessId; CompanionEngine then asks VerifyPeer.
    /// </summary>
    sealed class WindowsPipeListener : IPipeListener
    {
        const uint PIPE_ACCESS_DUPLEX = 0x3, FILE_FLAG_OVERLAPPED = 0x40000000, FILE_FLAG_FIRST_PIPE_INSTANCE = 0x00080000;
        const uint PIPE_TYPE_BYTE = 0, PIPE_READMODE_BYTE = 0, PIPE_WAIT = 0, PIPE_REJECT_REMOTE_CLIENTS = 0x8;
        const int MaxInstances = 8;

        [StructLayout(LayoutKind.Sequential)]
        struct SECURITY_ATTRIBUTES
        {
            public int nLength;
            public IntPtr lpSecurityDescriptor;
            public bool bInheritHandle;
        }

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        static extern SafePipeHandle CreateNamedPipe(string name, uint openMode, uint pipeMode, uint maxInstances, uint outBuf, uint inBuf, uint timeout, ref SECURITY_ATTRIBUTES sa);

        [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        static extern bool ConvertStringSecurityDescriptorToSecurityDescriptor(string sddl, uint revision, out IntPtr sd, out uint size);

        [DllImport("kernel32.dll")]
        static extern IntPtr LocalFree(IntPtr mem);

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern bool GetNamedPipeClientProcessId(IntPtr pipe, out uint pid);

        readonly string name;
        readonly string sddl;
        bool first = true;

        public WindowsPipeListener()
        {
            using (var id = WindowsIdentity.GetCurrent())
            {
                var sid = id.User.Value;
                name = Protocol.PipeName(sid);
                // protected DACL: this user full control; network logons denied
                sddl = $"D:P(A;;GA;;;{sid})(D;;GA;;;NU)";
            }
        }

        public string Name => name;

        SafePipeHandle Create()
        {
            if (!ConvertStringSecurityDescriptorToSecurityDescriptor(sddl, 1, out var sd, out _)) throw new Win32Exception();
            try
            {
                var sa = new SECURITY_ATTRIBUTES { nLength = Marshal.SizeOf(typeof(SECURITY_ATTRIBUTES)), lpSecurityDescriptor = sd, bInheritHandle = false };
                var mode = PIPE_ACCESS_DUPLEX | FILE_FLAG_OVERLAPPED | (first ? FILE_FLAG_FIRST_PIPE_INSTANCE : 0);
                var h = CreateNamedPipe(@"\\.\pipe\" + name, mode, PIPE_TYPE_BYTE | PIPE_READMODE_BYTE | PIPE_WAIT | PIPE_REJECT_REMOTE_CLIENTS,
                                        MaxInstances, 65536, 65536, 0, ref sa);
                if (h.IsInvalid)
                {
                    var err = Marshal.GetLastWin32Error();
                    if (first && (err == 5 || err == 231))
                        throw new UnauthorizedAccessException($"Another process already holds the Companion's pipe {name} (error {err}). The BIZOMAT Companion will not share it. Restart Windows; if this stays, check for malware.");
                    throw new Win32Exception(err);
                }
                first = false;
                return h;
            }
            finally
            {
                LocalFree(sd);
            }
        }

        public Stream Accept(CancellationToken stop, out PeerInfo peer)
        {
            peer = null;
            var s = new NamedPipeServerStream(PipeDirection.InOut, true, false, Create());
            try
            {
                var ar = s.BeginWaitForConnection(null, null);
                WaitHandle.WaitAny(new[] { ar.AsyncWaitHandle, stop.WaitHandle });
                if (stop.IsCancellationRequested)
                {
                    s.Dispose();
                    return null;
                }
                s.EndWaitForConnection(ar);
                if (!GetNamedPipeClientProcessId(s.SafePipeHandle.DangerousGetHandle(), out var pid)) throw new Win32Exception();
                string image = null;
                try
                {
                    using (var p = Process.GetProcessById((int)pid)) image = p.MainModule?.FileName;
                }
                catch (Exception)
                {
                }
                peer = new PeerInfo { Pid = (int)pid, Image = image };
                return s;
            }
            catch
            {
                s.Dispose();
                throw;
            }
        }

        public void Dispose()
        {
        }
    }

    /// <summary>Is this pipe client SOLIDWORKS with the add-in loaded (from our install, signed like us)?</summary>
    static class PeerCheck
    {
        public static string Verify(PeerInfo p)
        {
            if (p == null || string.IsNullOrEmpty(p.Image)) return "unknown process";
            if (!string.Equals(Path.GetFileName(p.Image), "SLDWORKS.exe", StringComparison.OrdinalIgnoreCase)) return p.Image + " is not SOLIDWORKS";
            var installs = SolidWorks.Installations().Select(i => J.Str(J.Obj(i), "path")).Where(x => x != null).ToList();
            if (installs.Count > 0 && !installs.Any(d => p.Image.StartsWith(d.TrimEnd('\\') + "\\", StringComparison.OrdinalIgnoreCase)))
                return p.Image + " is not in a registered SOLIDWORKS installation";
            try
            {
                using (var proc = Process.GetProcessById(p.Pid))
                {
                    var addin = proc.Modules.Cast<ProcessModule>().FirstOrDefault(m => string.Equals(Path.GetFileName(m.FileName), "OpenSketch.Sw.dll", StringComparison.OrdinalIgnoreCase));
                    if (addin == null) return "the add-in is not loaded in that SOLIDWORKS";
                    if (!string.Equals(Path.GetFullPath(addin.FileName), Path.GetFullPath(Paths.AddinDll), StringComparison.OrdinalIgnoreCase))
                        return "it loaded the add-in from " + addin.FileName + ", not from this installation (" + Paths.AddinDll + ")";
                    var mine = Authenticode.Signer(Paths.Exe);
                    if (mine != null && mine != Authenticode.Signer(addin.FileName)) return "its add-in is not signed by the same publisher";
                }
            }
            catch (Exception ex)
            {
                return "cannot inspect that process (" + ex.Message + ")";
            }
            return null;
        }
    }

    static class Authenticode
    {
        [DllImport("wintrust.dll", CharSet = CharSet.Unicode)]
        static extern int WinVerifyTrust(IntPtr hwnd, [MarshalAs(UnmanagedType.LPStruct)] Guid action, ref WINTRUST_DATA data);

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
        struct WINTRUST_FILE_INFO
        {
            public int cbStruct;
            public string pcwszFilePath;
            public IntPtr hFile;
            public IntPtr pgKnownSubject;
        }

        [StructLayout(LayoutKind.Sequential)]
        struct WINTRUST_DATA
        {
            public int cbStruct;
            public IntPtr pPolicyCallbackData, pSIPClientData;
            public int dwUIChoice, fdwRevocationChecks, dwUnionChoice;
            public IntPtr pFile;
            public int dwStateAction;
            public IntPtr hWVTStateData, pwszURLReference;
            public int dwProvFlags, dwUIContext;
            public IntPtr pSignatureSettings;
        }

        static readonly Guid GenericVerifyV2 = new Guid("00AAC56B-CD44-11d0-8CC2-00C04FC295EE");

        /// <summary>Windows trusts the file's signature (chain to a trusted root, not revoked, not changed since signed).</summary>
        public static bool Trusted(string path)
        {
            var fi = new WINTRUST_FILE_INFO { cbStruct = Marshal.SizeOf(typeof(WINTRUST_FILE_INFO)), pcwszFilePath = path };
            var pFile = Marshal.AllocHGlobal(Marshal.SizeOf(fi));
            try
            {
                Marshal.StructureToPtr(fi, pFile, false);
                var d = new WINTRUST_DATA
                {
                    cbStruct = Marshal.SizeOf(typeof(WINTRUST_DATA)), dwUIChoice = 2 /* none */, fdwRevocationChecks = 1 /* whole chain */,
                    dwUnionChoice = 1 /* file */, pFile = pFile, dwStateAction = 0, dwProvFlags = 0x80 /* revocation check chain */
                };
                return WinVerifyTrust(IntPtr.Zero, GenericVerifyV2, ref d) == 0;
            }
            finally
            {
                Marshal.FreeHGlobal(pFile);
            }
        }

        public static string Signer(string path)
        {
            try
            {
                using (var c = new X509Certificate2(X509Certificate.CreateFromSignedFile(path))) return c.Thumbprint;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }

    /// <summary>
    /// This computer's identity: an EC P-256 key made here, in Windows' key store for this user, not exportable (on the
    /// TPM when the Platform Crypto Provider is there). It cannot be copied to another computer: a replacement laptop
    /// pairs with a key of its own.
    /// </summary>
    sealed class CngDeviceKey : IDeviceKey, IDisposable
    {
        public const string KeyName = "KEVOS.Bridge.Device.v1";
        readonly CngKey key;
        readonly ECDsaCng ec;
        public string Provider { get; }

        CngDeviceKey(CngKey k)
        {
            key = k;
            ec = new ECDsaCng(k) { HashAlgorithm = CngAlgorithm.Sha256 };
            Provider = k.Provider?.Provider;
        }

        public static CngDeviceKey OpenOrCreate()
        {
            foreach (var prov in Providers())
            {
                try
                {
                    if (CngKey.Exists(KeyName, prov)) return new CngDeviceKey(CngKey.Open(KeyName, prov));
                }
                catch (Exception)
                {
                }
            }
            foreach (var prov in Providers())
            {
                try
                {
                    var p = new CngKeyCreationParameters
                    {
                        Provider = prov, ExportPolicy = CngExportPolicies.None, KeyUsage = CngKeyUsages.Signing,
                        KeyCreationOptions = CngKeyCreationOptions.None
                    };
                    return new CngDeviceKey(CngKey.Create(CngAlgorithm.ECDsaP256, KeyName, p));
                }
                catch (Exception ex)
                {
                    Log.Write("key store " + prov.Provider + " not used: " + ex.Message);
                }
            }
            throw new CryptographicException("Could not make this computer's key in Windows' key store.");
        }

        static IEnumerable<CngProvider> Providers()
        {
            yield return new CngProvider("Microsoft Platform Crypto Provider");   // TPM
            yield return CngProvider.MicrosoftSoftwareKeyStorageProvider;
        }

        /// <summary>Deletes this computer's key from every key store (unpairing).</summary>
        public static void Delete()
        {
            foreach (var prov in Providers())
            {
                try
                {
                    if (CngKey.Exists(KeyName, prov))
                        using (var k = CngKey.Open(KeyName, prov)) k.Delete();
                }
                catch (Exception)
                {
                }
            }
        }

        /// <summary>A new key for pairing again (re-pair, or after the account removed this computer).</summary>
        public static CngDeviceKey Renew()
        {
            foreach (var prov in Providers())
            {
                try
                {
                    if (CngKey.Exists(KeyName, prov))
                        using (var k = CngKey.Open(KeyName, prov)) k.Delete();
                }
                catch (Exception)
                {
                }
            }
            return OpenOrCreate();
        }

        public Dictionary<string, object> PublicJwk
        {
            get
            {
                // BCRYPT_ECCKEY_BLOB: magic, cbKey, then X and Y
                var blob = key.Export(CngKeyBlobFormat.EccPublicBlob);
                var n = BitConverter.ToInt32(blob, 4);
                var x = new byte[n];
                var y = new byte[n];
                Buffer.BlockCopy(blob, 8, x, 0, n);
                Buffer.BlockCopy(blob, 8 + n, y, 0, n);
                return J.O("kty", "EC", "crv", "P-256", "x", B64.Url(x), "y", B64.Url(y));
            }
        }

        public byte[] Sign(byte[] data) => ec.SignData(data);

        public void Dispose()
        {
            ec.Dispose();
            key.Dispose();
        }
    }

    /// <summary>SOLIDWORKS on this computer: the installed versions, whether it runs, and (fallback) loading the add-in.</summary>
    static class SolidWorks
    {
        public static List<object> Installations()
        {
            var o = new List<object>();
            try
            {
                using (var b = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64))
                using (var root = b.OpenSubKey(@"SOFTWARE\SolidWorks"))
                {
                    if (root == null) return o;
                    foreach (var name in root.GetSubKeyNames().Where(n => n.StartsWith("SOLIDWORKS 20", StringComparison.OrdinalIgnoreCase)))
                    {
                        using (var setup = root.OpenSubKey(name + @"\Setup"))
                        {
                            var folder = setup?.GetValue("SolidWorks Folder") as string;
                            if (string.IsNullOrEmpty(folder)) continue;
                            var exe = Path.Combine(folder, "SLDWORKS.exe");
                            if (!File.Exists(exe)) continue;
                            int.TryParse(name.Substring(name.Length - 4), out var year);
                            var rev = FileVersionInfo.GetVersionInfo(exe).FileVersion ?? "";
                            o.Add(J.O("year", (double)year, "revision", rev, "path", folder.TrimEnd('\\')));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Log.Write("SOLIDWORKS versions: " + ex.Message);
            }
            return o;
        }

        public static int Running()
        {
            var ps = Process.GetProcessesByName("SLDWORKS");
            foreach (var p in ps) p.Dispose();
            return ps.Length;
        }

        /// <summary>Starts the newest installed SOLIDWORKS (only when the person turned "start SOLIDWORKS for commands" on).</summary>
        public static bool Start()
        {
            var newest = Installations().Select(J.Obj).OrderByDescending(i => J.Num(i, "year")).FirstOrDefault();
            if (newest == null) return false;
            Process.Start(new ProcessStartInfo(Path.Combine(J.Str(newest, "path"), "SLDWORKS.exe")) { UseShellExecute = true })?.Dispose();
            return true;
        }

        /// <summary>
        /// Fallback for SOLIDWORKS that does not load the add-in by itself (some per-user installs): ask the running
        /// SOLIDWORKS, once, to load it. One call in this user's own session (never from a service); the add-in then
        /// runs inside SOLIDWORKS as usual. Same as the old launcher macro, without the macro.
        /// </summary>
        public static string LoadAddin()
        {
            object sw;
            try
            {
                sw = Marshal.GetActiveObject("SldWorks.Application");
            }
            catch (COMException)
            {
                return "SOLIDWORKS is not in the running-object table yet (still starting, or run as administrator)";
            }
            try
            {
                var r = sw.GetType().InvokeMember("LoadAddIn", BindingFlags.InvokeMethod, null, sw, new object[] { Paths.AddinDll });
                return "LoadAddIn returned " + r;
            }
            finally
            {
                Marshal.ReleaseComObject(sw);
            }
        }
    }

    /// <summary>Start with Windows (HKCU Run, this user only) and the add-in's start-up flag for this user.</summary>
    static class Startup
    {
        const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run";
        const string RunName = "KEVOS Companion";
        public const string AddinClsid = "{275256ff-b73a-4e4f-9ea8-842b6626d471}";

        /// <summary>The installer starts the companion for every user (HKLM Run). A user who turns "Start with Windows" off
        /// gets Autostart=0 in HKCU, and a companion started at logon then exits at once. Without the installer (a
        /// developer copy) the HKCU Run value does it.</summary>
        public static bool MachineWide
        {
            get
            {
                using (var b = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64))
                using (var k = b.OpenSubKey(RunKey)) return k?.GetValue(RunName) is string;
            }
        }

        public static bool Enabled
        {
            get
            {
                if (!Config.Flag("Autostart", true)) return false;
                if (MachineWide) return true;
                using (var k = Registry.CurrentUser.OpenSubKey(RunKey)) return k?.GetValue(RunName) is string;
            }
        }

        public static void Set(bool on)
        {
            Config.SetFlag("Autostart", on);
            using (var k = Registry.CurrentUser.CreateSubKey(RunKey))
            {
                if (on && !MachineWide) k.SetValue(RunName, "\"" + Paths.Exe + "\" --background");
                else k.DeleteValue(RunName, false);
            }
        }

        /// <summary>
        /// Migration from the per-user OpenSketch install (OpenSketchSW.exe > Install for me): its HKCU COM registration
        /// would win over the machine-wide one and make SOLIDWORKS load the old DLL from the old folder. When this
        /// companion is the installed one (HKLM), the per-user registration of the same add-in is removed.
        /// </summary>
        public static void RemoveOldUserRegistration()
        {
            try
            {
                using (var hk = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64))
                using (var mk = hk.OpenSubKey(@"SOFTWARE\Classes\CLSID\" + AddinClsid + @"\InprocServer32"))
                    if (mk == null) return;   // not a machine-wide install: the per-user registration is the only one
                foreach (var (clsid, progid) in new[] { (AddinClsid, "OpenSketch.Sw.SwAddin"), ("{ed25919a-7e4a-4a08-a2db-4c69ae22b1ea}", "OpenSketch.Sw.Launcher") })
                {
                    using (var k = Registry.CurrentUser.OpenSubKey(@"Software\Classes\CLSID\" + clsid + @"\InprocServer32"))
                    {
                        var cb = k?.GetValue("CodeBase") as string;
                        if (cb == null) continue;
                        Log.Write("removing the old per-user registration of " + progid + " (" + cb + ") so SOLIDWORKS loads the installed add-in");
                    }
                    Registry.CurrentUser.DeleteSubKeyTree(@"Software\Classes\CLSID\" + clsid, false);
                    Registry.CurrentUser.DeleteSubKeyTree(@"Software\Classes\" + progid, false);
                }
            }
            catch (Exception ex)
            {
                Log.Write("old registration: " + ex.Message);
            }
        }

        /// <summary>Once per user: SOLIDWORKS loads the add-in at start-up (the per-machine installer cannot write
        /// this for every user). Afterwards the person's own choice in Tools > Add-Ins wins.</summary>
        public static void EnsureAddinStartsOnce()
        {
            if (Config.Flag("AddinStartupSet", false)) return;
            try
            {
                using (var k = Registry.CurrentUser.CreateSubKey(@"Software\SolidWorks\AddInsStartup\" + AddinClsid))
                    k.SetValue(null, 1, RegistryValueKind.DWord);
                Config.SetFlag("AddinStartupSet", true);
                Log.Write("SOLIDWORKS will load the add-in at start-up for this user");
            }
            catch (Exception ex)
            {
                Log.Write("add-in start-up flag: " + ex.Message);
            }
        }
    }
}
