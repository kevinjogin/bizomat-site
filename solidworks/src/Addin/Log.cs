using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace OpenSketch.Sw
{
    /// <summary>The add-in's log: %LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt (kept under 2 MB, the previous one
    /// as log.old.txt), and the last lines in memory for the window. YZ sends this file back after a first run.</summary>
    public static class Log
    {
        static readonly object Gate = new object();
        static readonly LinkedList<string> Recent = new LinkedList<string>();
        public static event Action<string> Line;

        public static string Folder
        {
            get
            {
                var d = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "OpenSketch", "SolidWorks");
                try
                {
                    Directory.CreateDirectory(d);
                }
                catch (Exception)
                {
                    d = Path.GetTempPath();
                }
                return d;
            }
        }

        public static string FilePath => Path.Combine(Folder, "log.txt");

        public static void Write(string msg)
        {
            var line = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "  " + msg;
            lock (Gate)
            {
                Recent.AddLast(line);
                while (Recent.Count > 400) Recent.RemoveFirst();
                try
                {
                    var p = FilePath;
                    var fi = new FileInfo(p);
                    if (fi.Exists && fi.Length > 2_000_000)
                    {
                        var old = Path.Combine(Folder, "log.old.txt");
                        if (File.Exists(old)) File.Delete(old);
                        File.Move(p, old);
                    }
                    File.AppendAllText(p, line + Environment.NewLine, Encoding.UTF8);
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

        public static string[] Last(int n)
        {
            lock (Gate)
            {
                var a = new List<string>(Recent);
                return a.GetRange(Math.Max(0, a.Count - n), Math.Min(n, a.Count)).ToArray();
            }
        }
    }
}
