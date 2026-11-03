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
    }
}
