using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Pipes;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using OpenSketch.Sw.Bridge;
using OpenSketch.Sw.Core;

// args: gateway-url data-dir step-file [pair]
// Prints "PAIR <code>" when it needs approving, "PAIRED <device_id>", "READY", and one log line per event.
var gateway = args[0];
var dataDir = args[1];
var step = File.ReadAllBytes(args[2]);
Directory.CreateDirectory(dataDir);
var keyFile = Path.Combine(dataDir, "test-device-key.pem");   // tests only: the Windows companion keeps its key in CNG
ECDsa ec;
if (File.Exists(keyFile))
{
    ec = ECDsa.Create();
    ec.ImportFromPem(File.ReadAllText(keyFile));
}
else
{
    ec = ECDsa.Create(ECCurve.NamedCurves.nistP256);
    File.WriteAllText(keyFile, ec.ExportECPrivateKeyPem());
}
var key = new SoftwareKey(ec);
var pipe = "kevos-probe-" + Guid.NewGuid().ToString("N").Substring(0, 10);
void Log(string s) => Console.WriteLine("log " + s.Replace("\n", " "));

var engine = new CompanionEngine(new CompanionOptions
{
    DataDir = dataDir, GatewayUrl = gateway, Version = "1.0.0", OsName = "Linux test",
    Installations = () => J.L(J.O("year", 2022.0, "revision", "30.5.0", "path", "C:\\Program Files\\SOLIDWORKS Corp\\SOLIDWORKS")),
    SolidWorksProcesses = () => 1,
}, key, new ProbeListener(pipe), Log);
if (!engine.Config.Paired)
{
    var t = engine.BeginPairing(gateway, "PROBE-PC");
    Console.WriteLine("PAIR " + t.UserCode);
    if (!engine.WaitForPairing(t, CancellationToken.None)) { Console.WriteLine("PAIRING FAILED"); return 1; }
    Console.WriteLine("PAIRED " + engine.Config.DeviceId);
}
engine.Start();

var stamp = 7;
var host = new ProbeHost((op, a, io, ctx) =>
{
    switch (op)
    {
        case "status":
            return J.O("sw_version", "30.5.0", "docs", J.L(J.O("doc", "C:\\OS\\Box.SLDPRT", "title", "Box", "kind", "part", "active", true)));
        case "geometry":
            var k = "C:\\OS\\Box.SLDPRT";
            var have = J.Obj(a, "have");
            var part = J.O("stamp", (double)stamp, "title", "Box");
            if (!(have != null && have.TryGetValue(k, out var h) && h is double hv && (int)hv == stamp))
            {
                io.Upload("Box.step", step);
                part["file"] = "Box.step";
            }
            return J.O("kind", "part", "title", "Box", "key", k, "parts", J.O(k, part));
        case "export":
            io.Upload("Box.step", step);
            return J.O("file", "Box.step", "title", "Box", "format", J.Str(a, "format"));
        case "import":
            var raw = io.Download("file");
            return J.O("doc", "C:\\OS\\imported.SLDPRT", "bytes", (double)raw.Length, "head", Encoding.ASCII.GetString(raw, 0, Math.Min(12, raw.Length)));
        case "add_features":
            var rows = new List<object>();
            foreach (var o in J.Arr(a, "features") ?? new List<object>())
            {
                CommandContext.ThrowIfCancelled();
                var f = J.Obj(o);
                rows.Add(J.O("id", J.Str(f, "id"), "name", J.Str(f, "name") ?? "Feature", "state", "ok", "had_expect", J.Has(f, "expect")));
            }
            stamp++;
            return J.O("features", rows);
        case "delete":
            if (J.Bool(a, "dry_run")) return J.O("dry_run", true, "would_delete", J.Arr(a, "features"));
            throw new UserError("You declined in SOLIDWORKS: delete Boss-Extrude1 (asked by " + ctx.ClientName + ").", "APPROVAL_DENIED");
        case "batch":
            for (var i = 0; i < 200; i++) { CommandContext.ThrowIfCancelled(); Thread.Sleep(50); }
            return J.O("ok", true);
        default:
            return J.O("op", op, "echo", a);
    }
});
var stop = new CancellationTokenSource();
var link = new PipeLink(t =>
{
    var c = new NamedPipeClientStream(".", pipe, PipeDirection.InOut, PipeOptions.Asynchronous);
    c.Connect(1000);
    return c;
}, host, Log, engine.SpoolRoot);
new Thread(() => link.Run(stop.Token)) { IsBackground = true }.Start();
for (var i = 0; i < 200 && !(engine.Status().CloudConnected && engine.Status().Instances.Count == 1); i++) Thread.Sleep(50);
Console.WriteLine("READY " + engine.Config.DeviceId + " " + link.State);
// runs until killed; "quit" on stdin stops cleanly
string line;
while ((line = Console.ReadLine()) != null)
{
    if (line == "quit") break;
    if (line == "status") Console.WriteLine("STATUS " + engine.Status().Cloud + " instances=" + engine.Status().Instances.Count + " paused=" + engine.Paused);
    if (line == "pause") engine.SetPaused(true);
    if (line == "resume") engine.SetPaused(false);
}
stop.Cancel();
engine.Stop();
Console.WriteLine("STOPPED");
return 0;

sealed class ProbeListener : IPipeListener
{
    readonly string name;
    public ProbeListener(string name) => this.name = name;

    public Stream Accept(CancellationToken stop, out PeerInfo peer)
    {
        var s = new NamedPipeServerStream(name, PipeDirection.InOut, 8, PipeTransmissionMode.Byte, PipeOptions.Asynchronous);
        try
        {
            s.WaitForConnectionAsync(stop).GetAwaiter().GetResult();
        }
        catch (OperationCanceledException)
        {
            s.Dispose();
            peer = null;
            return null;
        }
        peer = new PeerInfo { Pid = 0, Image = "probe" };
        return s;
    }

    public void Dispose()
    {
    }
}

sealed class ProbeHost : IAddinHost
{
    readonly Func<string, Dictionary<string, object>, ICommandIO, CommandContext, Dictionary<string, object>> run;
    public ProbeHost(Func<string, Dictionary<string, object>, ICommandIO, CommandContext, Dictionary<string, object>> run) => this.run = run;

    public Dictionary<string, object> Hello() => J.O("pid", (double)Environment.ProcessId, "process_started_at", "2026-11-05T08:00:00.000Z",
                                                     "sw_revision", "30.5.0", "addin_version", "0.11.0", "capabilities", J.O("ops", J.O("read", 1.0)));

    public Dictionary<string, object> Execute(string op, Dictionary<string, object> args, ICommandIO io, CommandContext ctx)
    {
        Console.WriteLine("op " + op);
        CommandContext.Current = ctx;
        try
        {
            return run(op, args, io, ctx);
        }
        finally
        {
            CommandContext.Current = null;
        }
    }

    public Dictionary<string, object> Probe() => J.O("ui_responsive", true, "modal_dialog", false);
    public Dictionary<string, object> State() => J.O("docs", J.L(J.O("title", "Box.SLDPRT", "path", "C:\\OS\\Box.SLDPRT", "kind", "part", "active", true, "unsaved", false)));
    public void CompanionMissing() { }
}
