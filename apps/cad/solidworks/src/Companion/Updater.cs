using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Reflection;
using OpenSketch.Sw.Bridge;
using OpenSketch.Sw.Core;

namespace Kevos.Companion
{
    /// <summary>
    /// Updates, never silent and never unverified:
    /// 1. the release manifest comes from the CAD Automation gateway, signed with the gateway key this computer pinned at pairing
    ///    (a manifest from anywhere else does not verify);
    /// 2. the MSI is downloaded over https and must match the manifest's size and SHA-256;
    /// 3. Windows must trust its Authenticode signature, and its signer must be one the manifest names and the same
    ///    publisher as this running companion (an unsigned build never updates itself);
    /// 4. the person is asked; then msiexec installs it (with the usual Windows elevation prompt).
    /// </summary>
    public sealed class Updater
    {
        readonly CompanionEngine engine;
        readonly IDeviceKey key;

        public sealed class Offer
        {
            public string Version;
            public string MsiPath;
            public string Notes;
        }

        public Updater(CompanionEngine engine, IDeviceKey key)
        {
            this.engine = engine;
            this.key = key;
        }

        public static Version Current => Assembly.GetExecutingAssembly().GetName().Version;

        /// <summary>A verified newer release ready to install, or null (with why) when there is none.</summary>
        public Offer Check(out string why)
        {
            var cfg = engine.Config;
            if (!cfg.Paired)
            {
                why = "This computer is not registered yet.";
                return null;
            }
            var mine = Authenticode.Signer(Paths.Exe);
            if (mine == null)
            {
                why = "This build is not signed, so it does not update itself. Install new versions by hand.";
                return null;
            }
            Dictionary<string, object> m;
            using (var c = new CloudLink(cfg.GatewayUrl, key, cfg.DeviceId, Log.Write))
            {
                var r = c.Get("/v2/bridge/update.json", 30);
                if (r.Status == 404)
                {
                    why = "No release is published on this CAD Automation server.";
                    return null;
                }
                if (r.Status != 200)
                {
                    why = "The update check failed: " + r.ErrorMessage;
                    return null;
                }
                using (var v = Jwk.ToVerifier(cfg.GatewayJwk))
                {
                    m = Json.ParseObject(Jws.Verify(J.Str(r.Json, "manifest_jws"), v, out var h));
                    if (J.Str(h, "typ") != "kevos-update") throw new InvalidDataException("not an update manifest");
                }
            }
            if (!System.Version.TryParse(J.Str(m, "version"), out var ver) || ver <= Current)
            {
                why = BrandArt.Package + " " + Current.ToString(3) + " is up to date.";
                return null;
            }
            var url = J.Str(m, "msi_url") ?? "";
            if (!url.StartsWith("https://", StringComparison.OrdinalIgnoreCase)) throw new InvalidDataException("The update address is not https.");
            var signers = J.Strs(m, "signer_thumbprints") ?? new List<string>();
            var dir = Path.Combine(Paths.Data, "updates");
            Directory.CreateDirectory(dir);
            var path = Path.Combine(dir, "BIZOMAT-CAD-Automation-" + ver.ToString(3) + ".msi");
            using (var http = new HttpClient(BridgeClient.DefaultHandler(), true) { Timeout = TimeSpan.FromMinutes(10) })
                File.WriteAllBytes(path, http.GetByteArrayAsync(url).GetAwaiter().GetResult());
            var data = File.ReadAllBytes(path);
            string problem = null;
            if (data.Length != J.Int(m, "size", -1)) problem = "its size is not the published one";
            else if (B64.Sha256Tagged(data) != J.Str(m, "sha256")) problem = "its SHA-256 is not the published one";
            else if (!Authenticode.Trusted(path)) problem = "Windows does not trust its signature";
            else
            {
                var signer = Authenticode.Signer(path);
                if (signer == null || !signers.Contains(signer)) problem = "it is signed by a publisher the release does not name";
                else if (signer != mine) problem = "it is not signed by the same publisher as this installation";
            }
            if (problem != null)
            {
                File.Delete(path);
                Log.Write("REFUSED update " + ver + ": " + problem);
                why = "The update was refused: " + problem + ".";
                return null;
            }
            why = null;
            return new Offer { Version = ver.ToString(3), MsiPath = path, Notes = J.Str(m, "notes") };
        }

        /// <summary>Runs the verified MSI (it keeps settings and this computer's registration).</summary>
        public static void Install(Offer o)
        {
            Log.Write("installing " + BrandArt.Package + " " + o.Version);
            Process.Start(new ProcessStartInfo("msiexec.exe", $"/i \"{o.MsiPath}\" /passive /norestart") { UseShellExecute = true })?.Dispose();
        }
    }
}
