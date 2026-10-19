using System;
using System.IO;
using System.Threading;
using OpenSketch.Sw.Core;

// args: server key step-file
var server = args[0];
var key = args[1];
var step = File.ReadAllBytes(args[2]);
var stamp = 7;
var c = new BridgeClient(server, key, J.O("client", "probe", "version", "0.1.0", "sw_version", "30.5.0", "machine", "PROBE"), (op, a, io) =>
{
    Console.WriteLine("op " + op + " " + Json.Write(a).Length);
    switch (op)
    {
        case "status":
            return J.O("docs", J.L(J.O("doc", "C:\\OS\\Box.SLDPRT", "title", "Box", "kind", "part", "active", true)));
        case "geometry":
            var key2 = "C:\\OS\\Box.SLDPRT";
            var have = J.Obj(a, "have");
            var part = J.O("stamp", (double)stamp, "title", "Box");
            if (!(have != null && have.TryGetValue(key2, out var h) && h is double hv && (int)hv == stamp))
            {
                io.Upload("p1.step", step);
                part["file"] = "p1.step";
            }
            return J.O("kind", "part", "title", "Box", "key", key2, "parts", J.O(key2, part));
        case "add_features":
            var feats = J.Arr(a, "features");
            var rows = new System.Collections.Generic.List<object>();
            foreach (var o in feats)
            {
                var f = J.Obj(o);
                rows.Add(J.O("id", J.Str(f, "id"), "state", "ok", "had_expect", J.Has(f, "expect"), "expect", J.Obj(f, "expect")));
            }
            stamp++;
            return J.O("features", rows);
        case "import":
            var raw = io.Download("file");
            return J.O("doc", "C:\\OS\\imported.SLDPRT", "bytes", raw.Length);
        default:
            throw new UserError("probe has no " + op);
    }
}, Console.WriteLine);
c.Run(CancellationToken.None);
Console.WriteLine("ended: " + c.State);
