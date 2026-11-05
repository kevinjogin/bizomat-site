using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Win32;

namespace OpenSketch.Sw
{
    /// <summary>The add-in's settings for this Windows user (HKCU\Software\OpenSketch\SolidWorks): the OpenSketch
    /// address, the SOLIDWORKS key (encrypted for this Windows account with DPAPI) and whether to connect when
    /// SOLIDWORKS starts. No admin rights needed.</summary>
    public static class Settings
    {
        const string KeyPath = @"Software\OpenSketch\SolidWorks";
        public const string DefaultServer = "http://127.0.0.1:8000"; // the server on this PC (windows/start.ps1)

        static RegistryKey Open(bool write) =>
            write ? Registry.CurrentUser.CreateSubKey(KeyPath) : Registry.CurrentUser.OpenSubKey(KeyPath);

        public static string Server
        {
            get
            {
                using (var k = Open(false)) return (k?.GetValue("Server") as string) ?? DefaultServer;
            }
            set
            {
                using (var k = Open(true)) k.SetValue("Server", (value ?? "").Trim());
            }
        }

        public static string Key
        {
            get
            {
                try
                {
                    using (var k = Open(false))
                    {
                        if (!(k?.GetValue("Key") is byte[] enc)) return "";
                        return Encoding.UTF8.GetString(ProtectedData.Unprotect(enc, Entropy, DataProtectionScope.CurrentUser));
                    }
                }
                catch (Exception)
                {
                    return "";
                }
            }
            set
            {
                using (var k = Open(true))
                {
                    if (string.IsNullOrWhiteSpace(value))
                    {
                        k.DeleteValue("Key", false);
                        return;
                    }
                    var enc = ProtectedData.Protect(Encoding.UTF8.GetBytes(value.Trim()), Entropy, DataProtectionScope.CurrentUser);
                    k.SetValue("Key", enc, RegistryValueKind.Binary);
                }
            }
        }

        public static bool AutoConnect
        {
            get
            {
                using (var k = Open(false)) return (k?.GetValue("AutoConnect") as int? ?? 1) != 0;
            }
            set
            {
                using (var k = Open(true)) k.SetValue("AutoConnect", value ? 1 : 0, RegistryValueKind.DWord);
            }
        }

        static readonly byte[] Entropy = Encoding.UTF8.GetBytes("OpenSketch SOLIDWORKS key v1");

        // ----------------------------------------------------------------- KEVOS Bridge (HKCU\Software\KEVOS\Bridge)

        const string KevosPath = @"Software\KEVOS\Bridge";

        static int KevosInt(string name, int dflt)
        {
            try
            {
                using (var k = Registry.CurrentUser.OpenSubKey(KevosPath)) return k?.GetValue(name) as int? ?? dflt;
            }
            catch (Exception)
            {
                return dflt;
            }
        }

        static void SetKevosInt(string name, int v)
        {
            using (var k = Registry.CurrentUser.CreateSubKey(KevosPath)) k.SetValue(name, v, RegistryValueKind.DWord);
        }

        /// <summary>Ask the person before destructive commands (Safety). On unless they turn it off here.</summary>
        public static bool ConfirmDestructive
        {
            get => KevosInt("ConfirmDestructive", 1) != 0;
            set => SetKevosInt("ConfirmDestructive", value ? 1 : 0);
        }

        /// <summary>Take commands from the BIZOMAT Companion on this computer (the default; the direct link above is the fallback).</summary>
        public static bool UseCompanion
        {
            get => KevosInt("UseCompanion", 1) != 0;
            set => SetKevosInt("UseCompanion", value ? 1 : 0);
        }

        /// <summary>Where the installer put the add-in and the Companion (HKLM for everyone, else HKCU; the key keeps the
        /// KEVOS Bridge name).</summary>
        public static string InstallDir
        {
            get
            {
                foreach (var root in new[] { Registry.LocalMachine, Registry.CurrentUser })
                {
                    try
                    {
                        using (var hk = RegistryKey.OpenBaseKey(root == Registry.LocalMachine ? RegistryHive.LocalMachine : RegistryHive.CurrentUser, RegistryView.Registry64))
                        using (var k = hk.OpenSubKey(@"SOFTWARE\KEVOS\Bridge"))
                            if (k?.GetValue("InstallDir") is string d && d.Length > 0) return d;
                    }
                    catch (Exception)
                    {
                    }
                }
                return null;
            }
        }
    }
}
