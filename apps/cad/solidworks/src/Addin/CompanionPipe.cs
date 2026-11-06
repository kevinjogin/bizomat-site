using System;
using System.Diagnostics;
using System.IO;
using System.IO.Pipes;
using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;
using System.Security.Principal;
using System.Threading;
using OpenSketch.Sw.Bridge;

namespace OpenSketch.Sw
{
    /// <summary>
    /// The add-in's end of the local pipe to the BIZOMAT Companion (KEVOS.Companion.exe). The pipe is per Windows user
    /// (\\.\pipe\KEVOS.Bridge.&lt;SID&gt;, the companion creates it with an ACL for this user only and refuses remote
    /// clients). Before anything is sent, the server end is checked: it must be KEVOS.Companion.exe from the KEVOS
    /// install folder (or this add-in's own folder), and when this add-in is signed, signed by the same publisher. A
    /// process squatting on the pipe name gets nothing.
    /// </summary>
    public static class CompanionPipe
    {
        public const string ExeName = "KEVOS.Companion.exe";

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern bool GetNamedPipeServerProcessId(IntPtr pipe, out uint serverProcessId);

        public static string PipeName
        {
            get
            {
                using (var id = WindowsIdentity.GetCurrent()) return Protocol.PipeName(id.User?.Value);
            }
        }

        static string AddinFolder => Path.GetDirectoryName(typeof(CompanionPipe).Assembly.Location);

        /// <summary>The companion this add-in trusts: in the install folder, else next to the add-in.</summary>
        public static string CompanionPath
        {
            get
            {
                foreach (var d in new[] { Settings.InstallDir, AddinFolder })
                {
                    if (string.IsNullOrEmpty(d)) continue;
                    var p = Path.Combine(d, ExeName);
                    if (File.Exists(p)) return p;
                }
                return null;
            }
        }

        public static Stream Connect(CancellationToken stop)
        {
            var c = new NamedPipeClientStream(".", PipeName, PipeDirection.InOut, PipeOptions.Asynchronous);
            try
            {
                c.Connect(1000);
                var why = CheckServer(c);
                if (why != null) throw new IOException("Refused the pipe's owner: " + why);
                return c;
            }
            catch
            {
                c.Dispose();
                throw;
            }
        }

        static string CheckServer(NamedPipeClientStream c)
        {
            if (!GetNamedPipeServerProcessId(c.SafePipeHandle.DangerousGetHandle(), out var pid)) return "cannot tell which process owns the pipe";
            string image;
            try
            {
                using (var p = Process.GetProcessById((int)pid)) image = p.MainModule?.FileName;
            }
            catch (Exception ex)
            {
                return "cannot read the pipe owner (" + ex.Message + ")";
            }
            if (image == null || !string.Equals(Path.GetFileName(image), ExeName, StringComparison.OrdinalIgnoreCase)) return "it is " + image + ", not " + ExeName;
            var trusted = CompanionPath;
            if (trusted == null || !string.Equals(Path.GetFullPath(image), Path.GetFullPath(trusted), StringComparison.OrdinalIgnoreCase))
                return image + " is not the installed BIZOMAT Companion (" + (trusted ?? "none found") + ")";
            var mine = Signer(typeof(CompanionPipe).Assembly.Location);
            if (mine != null && mine != Signer(image)) return "it is not signed by the same publisher as this add-in";
            return null;
        }

        /// <summary>The Authenticode signer's thumbprint of a file, or null when it is not signed.</summary>
        public static string Signer(string path)
        {
            try
            {
                using (var cert = new X509Certificate2(X509Certificate.CreateFromSignedFile(path))) return cert.Thumbprint;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>Starts the companion when it is not running (it keeps itself to one per Windows user).</summary>
        public static bool StartCompanion()
        {
            var p = CompanionPath;
            if (p == null) return false;
            Process.Start(new ProcessStartInfo(p, "--background") { UseShellExecute = false, WorkingDirectory = Path.GetDirectoryName(p) })?.Dispose();
            return true;
        }
    }
}
