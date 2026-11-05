using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OpenSketch.Sw.Core;

namespace OpenSketch.Sw.Bridge
{
    /// <summary>Command ids already accepted, kept until a day after they expire, so a command (or a captured copy of
    /// it) never runs twice. The companion keeps it on disk across restarts; the add-in keeps it in memory.</summary>
    public sealed class ReplayGuard
    {
        readonly string file;
        readonly Dictionary<string, long> seen = new Dictionary<string, long>();
        readonly object gate = new object();

        public ReplayGuard(string file = null)
        {
            this.file = file;
            if (file == null || !File.Exists(file)) return;
            try
            {
                var o = Json.ParseObject(File.ReadAllText(file));
                foreach (var kv in o)
                    if (kv.Value is double d) seen[kv.Key] = (long)d;
            }
            catch (Exception)
            {
                // a damaged file is replaced; commands still need a valid signature and expiry
            }
        }

        public bool Seen(string id)
        {
            lock (gate) return id != null && seen.ContainsKey(id);
        }

        /// <summary>False when the id was already there (a replay or a re-delivery).</summary>
        public bool Add(string id, DateTime expiresUtc)
        {
            lock (gate)
            {
                if (id == null || seen.ContainsKey(id)) return false;
                var now = Times.UnixSeconds(DateTime.UtcNow);
                foreach (var k in seen.Where(kv => kv.Value < now).Select(kv => kv.Key).ToList()) seen.Remove(k);
                seen[id] = Times.UnixSeconds(expiresUtc) + 86400;
                Save();
                return true;
            }
        }

        public int Count
        {
            get
            {
                lock (gate) return seen.Count;
            }
        }

        void Save()
        {
            if (file == null) return;
            try
            {
                var tmp = file + ".tmp";
                File.WriteAllText(tmp, Json.Write(seen.ToDictionary(kv => kv.Key, kv => (object)kv.Value)));
                if (File.Exists(file)) File.Delete(file);
                File.Move(tmp, file);
            }
            catch (Exception)
            {
            }
        }
    }
}
