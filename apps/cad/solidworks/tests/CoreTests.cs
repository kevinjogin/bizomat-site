using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using OpenSketch.Sw.Core;
using Xunit;

namespace OpenSketch.Sw.Tests
{
    public class JsonTests
    {
        [Fact]
        public void RoundTrip()
        {
            var text = "{\"a\":[1,2.5,-3e-3,true,null,\"x\\\"y\\n\\u00e9\"],\"b\":{\"c\":{}},\"d\":[]}";
            var o = Json.ParseObject(text);
            var a = J.Arr(o, "a");
            Assert.Equal(1.0, a[0]);
            Assert.Equal(-0.003, (double)a[2], 12);
            Assert.Equal("x\"y\né", a[5]);
            Assert.Equal(text.Replace("\\u00e9", "é").Replace("-3e-3", "-0.003"), Json.Write(o));
        }

        [Fact]
        public void BadJsonSaysWhere()
        {
            var ex = Assert.Throws<FormatException>(() => Json.Parse("{\"a\": [1, 2}"));
            Assert.Contains("at", ex.Message);
        }

        [Fact]
        public void NumbersAreInvariantAndWhole()
        {
            var prev = Thread.CurrentThread.CurrentCulture;
            Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("de-DE"); // a PC with comma decimals
            try
            {
                Assert.Equal("[1.5,2,-0.25,1E-07]", Json.Write(new object[] { 1.5, 2.0, -0.25, 1e-7 }));
                Assert.Equal(1.5, (double)((List<object>)Json.Parse("[1.5]"))[0]);
            }
            finally
            {
                Thread.CurrentThread.CurrentCulture = prev;
            }
        }
    }

    public class GeomTests
    {
        [Theory]
        [InlineData(1, 1, 0, 0, 0, 1, 0, 0, 0, 1)]     // Front: x +X, y +Y, n +Z
        [InlineData(2, 1, 0, 0, 0, 0, -1, 0, 1, 0)]    // Top: x +X, y -Z, n +Y
        [InlineData(3, 0, 0, -1, 0, 1, 0, 1, 0, 0)]    // Right: x -Z, y +Y, n +X
        public void StandardPlanesMatchOpenSketchAndSolidworks(int k, double xx, double xy, double xz, double yx, double yy, double yz, double nx, double ny, double nz)
        {
            var f = SketchFrame.Std(k);
            Assert.Equal(new Vec3(xx, xy, xz).ToString(), f.X.ToString());
            Assert.Equal(new Vec3(yx, yy, yz).ToString(), f.Y.ToString());
            Assert.Equal(new Vec3(nx, ny, nz).ToString(), f.N.ToString());
        }

        [Fact]
        public void EulerIsRzRyRxLikeOpenSketch()
        {
            // assembly.rot_euler([30, 40, 50]) in OpenSketch, row by row
            var p = Pose.FromEuler(new Vec3(1, 2, 3), new Vec3(30, 40, 50));
            var want = new[] { 0.49240388, -0.45682599, 0.74084306, 0.58682409, 0.80287234, 0.10504046, -0.64278761, 0.38302222, 0.66341395 };
            for (var i = 0; i < 9; i++) Assert.Equal(want[i], p.R[i], 6);
            var q = p.Apply(new Vec3(10, 0, 0));
            Assert.Equal(1 + 4.9240388, q.X, 6);
            var back = p.Inverse().Apply(q);
            Assert.Equal(10, back.X, 9);
            Assert.Equal(0, back.Y, 9);
        }

        [Fact]
        public void FrameKeepsXInThePlane()
        {
            var f = new SketchFrame(new Vec3(0, 0, 5), new Vec3(1, 0, 1), new Vec3(0, 0, 1));
            Assert.Equal(0, f.X.Dot(f.N), 12);
            var (u, v) = f.ToLocal(f.ToModel(3, 4));
            Assert.Equal(3, u, 9);
            Assert.Equal(4, v, 9);
        }
    }

    public class SketchPlanTests
    {
        static Dictionary<string, object> Rect() => Json.ParseObject(@"{
          ""id"": ""s1"", ""type"": ""sketch"", ""plane"": {""ref"": ""Front Plane""},
          ""entities"": [
            {""id"": ""p1"", ""type"": ""point"", ""x"": 0, ""y"": 0}, {""id"": ""p2"", ""type"": ""point"", ""x"": 40, ""y"": 0},
            {""id"": ""p3"", ""type"": ""point"", ""x"": 40, ""y"": 20}, {""id"": ""p4"", ""type"": ""point"", ""x"": 0, ""y"": 20},
            {""id"": ""l1"", ""type"": ""line"", ""p1"": ""p1"", ""p2"": ""p2""}, {""id"": ""l2"", ""type"": ""line"", ""p1"": ""p2"", ""p2"": ""p3""},
            {""id"": ""l3"", ""type"": ""line"", ""p1"": ""p3"", ""p2"": ""p4""}, {""id"": ""l4"", ""type"": ""line"", ""p1"": ""p4"", ""p2"": ""p1""},
            {""id"": ""c"", ""type"": ""point"", ""x"": 20, ""y"": 10}, {""id"": ""h"", ""type"": ""circle"", ""center"": ""c"", ""r"": 3},
            {""id"": ""q"", ""type"": ""point"", ""x"": 5, ""y"": 5}
          ],
          ""constraints"": [
            {""id"": ""k0"", ""type"": ""coincident"", ""refs"": [""p1"", ""origin""]},
            {""id"": ""k1"", ""type"": ""horizontal"", ""refs"": [""l1""]}, {""id"": ""k2"", ""type"": ""vertical"", ""refs"": [""l2""]},
            {""id"": ""k3"", ""type"": ""parallel"", ""refs"": [""l1"", ""l3""]}, {""id"": ""k4"", ""type"": ""perpendicular"", ""refs"": [""l1"", ""l4""]},
            {""id"": ""k5"", ""type"": ""horizontal"", ""refs"": [""c"", ""q""]},
            {""id"": ""k6"", ""type"": ""midpoint"", ""refs"": [""l1"", ""q""]},
            {""id"": ""D1"", ""type"": ""distance"", ""refs"": [""l1""], ""value"": 40, ""name"": ""Width""},
            {""id"": ""D2"", ""type"": ""distance"", ""refs"": [""p1"", ""p3""], ""orient"": ""vertical"", ""value"": 20},
            {""id"": ""D3"", ""type"": ""diameter"", ""refs"": [""h""], ""value"": 6, ""eq"": ""hole""},
            {""id"": ""D4"", ""type"": ""angle"", ""refs"": [""l1"", ""l4""], ""value"": 90},
            {""id"": ""bad"", ""type"": ""tangent"", ""refs"": [""l1"", ""nope""]}
          ]}");

        [Fact]
        public void CurvesPointsAndJoins()
        {
            var p = SketchPlan.From(Rect());
            Assert.Equal(new[] { "line", "line", "line", "line", "circle", "point" }, p.Segs.Select(s => s.Kind).ToArray());
            Assert.Equal("q", p.Segs[5].P);            // the lone point is drawn; c is the circle's centre
            Assert.Equal(new[] { "p1", "p2", "p3", "p4" }, p.SharedPoints().OrderBy(x => x).ToArray());
            Assert.Equal(new[] { ("l4"), "l1" }, p.Uses["p1"].Select(u => p.Segs[u.seg].Id).OrderByDescending(x => x).ToArray());
        }

        [Fact]
        public void RelationsBecomeSolidworksRelations()
        {
            var p = SketchPlan.From(Rect());
            var rel = p.Rels.ToDictionary(r => r.Source, r => r);
            Assert.Equal("sgCOINCIDENT", rel["k0"].Sg);
            Assert.Equal("origin", rel["k0"].Refs[1].Kind);
            Assert.Equal("sgHORIZONTAL2D", rel["k1"].Sg);
            Assert.Equal("sgVERTICAL2D", rel["k2"].Sg);
            Assert.Equal("sgPARALLEL", rel["k3"].Sg);
            Assert.Equal("sgHORIZONTALPOINTS2D", rel["k5"].Sg);
            Assert.Equal("sgATMIDDLE", rel["k6"].Sg);
            Assert.Equal("pt", rel["k6"].Refs[0].Kind);   // point first, then the line
            Assert.Contains(p.Notes, n => n.Contains("bad") && n.Contains("nope"));
        }

        [Fact]
        public void DimensionsKeepNamesEquationsAndPutAnglesInside()
        {
            var p = SketchPlan.From(Rect());
            var d = p.Dims.ToDictionary(x => x.Source, x => x);
            Assert.Equal("aligned", d["D1"].How);
            Assert.Equal("Width", d["D1"].Name);
            Assert.Equal("vertical", d["D2"].How);
            Assert.Equal("diameter", d["D3"].How);
            Assert.Equal("hole", d["D3"].Eq);
            // the angle between l1 (along +x from the origin) and l4 (up the y axis) is labelled inside the corner
            Assert.True(d["D4"].LabelU > 0 && d["D4"].LabelV > 0, $"{d["D4"].LabelU}, {d["D4"].LabelV}");
            // a line's own length is labelled beside it, not on it
            Assert.True(Math.Abs(d["D1"].LabelV) > 1);
        }

        [Fact]
        public void LinesFromTheOriginAreTiedToIt()
        {
            var s = Json.ParseObject(@"{""id"": ""s"", ""type"": ""sketch"", ""entities"": [
               {""id"": ""a"", ""type"": ""point"", ""x"": 10, ""y"": 0}, {""id"": ""l"", ""type"": ""line"", ""p1"": ""origin"", ""p2"": ""a""}],
               ""constraints"": []}");
            var p = SketchPlan.From(s);
            Assert.Single(p.Rels);
            Assert.Equal("pt", p.Rels[0].Refs[0].Kind);
            Assert.Equal("origin", p.Rels[0].Refs[0].Id);
            Assert.Equal("origin", p.Rels[0].Refs[1].Kind);
        }

        [Fact]
        public void HiddenEdgeReferencesAreNotDrawn()
        {
            var s = Json.ParseObject(@"{""id"": ""s"", ""type"": ""sketch"", ""entities"": [
               {""id"": ""r1"", ""type"": ""point"", ""x"": 0, ""y"": 0, ""ref"": ""edge""}, {""id"": ""r2"", ""type"": ""point"", ""x"": 50, ""y"": 0, ""ref"": ""edge""},
               {""id"": ""re"", ""type"": ""line"", ""p1"": ""r1"", ""p2"": ""r2"", ""ref"": ""edge"", ""construction"": true},
               {""id"": ""a"", ""type"": ""point"", ""x"": 10, ""y"": 0}, {""id"": ""b"", ""type"": ""point"", ""x"": 10, ""y"": 8},
               {""id"": ""l"", ""type"": ""line"", ""p1"": ""a"", ""p2"": ""b""}],
               ""constraints"": [{""id"": ""f1"", ""type"": ""fix"", ""refs"": [""r1""]}, {""id"": ""on"", ""type"": ""coincident"", ""refs"": [""a"", ""re""]}]}");
            var p = SketchPlan.From(s);
            Assert.Single(p.Segs);
            Assert.Single(p.Rels);                                  // the fix on a reference means nothing in SOLIDWORKS
            Assert.Equal("edge", p.Rels[0].Refs[1].Kind);           // On Edge: the model edge itself
        }

        [Fact]
        public void ArcsSampleCounterClockwise()
        {
            var s = Json.ParseObject(@"{""id"": ""s"", ""type"": ""sketch"", ""entities"": [
               {""id"": ""c"", ""type"": ""point"", ""x"": 0, ""y"": 0}, {""id"": ""a"", ""type"": ""point"", ""x"": 10, ""y"": 0},
               {""id"": ""b"", ""type"": ""point"", ""x"": 0, ""y"": 10}, {""id"": ""arc"", ""type"": ""arc"", ""center"": ""c"", ""start"": ""a"", ""end"": ""b""}],
               ""constraints"": []}");
            var pts = SketchPlan.From(s).ProfileSamples(4);
            Assert.True(pts.All(q => q.u >= -1e-9 && q.v >= -1e-9));   // the quarter in +x +y, not the other three
        }

        [Fact]
        public void UnsupportedEntitiesSaySo()
        {
            var s = Json.ParseObject(@"{""id"": ""s"", ""type"": ""sketch"", ""entities"": [
               {""id"": ""c"", ""type"": ""point"", ""x"": 0, ""y"": 0}, {""id"": ""e"", ""type"": ""ellipse"", ""center"": ""c"", ""rx"": 5, ""ry"": 2}]}");
            var ex = Assert.Throws<ArgumentException>(() => SketchPlan.From(s));
            Assert.Contains("ellipse", ex.Message);
        }
    }

    public class BridgeClientTests
    {
        /// <summary>A fake OpenSketch server: hello, two commands, then a "replaced" stop.</summary>
        sealed class FakeServer : HttpMessageHandler
        {
            public readonly List<string> Posted = new List<string>();
            public readonly Dictionary<string, byte[]> Files = new Dictionary<string, byte[]>();
            readonly Queue<string> commands = new Queue<string>(new[]
            {
                "{\"id\":\"c1\",\"op\":\"ping\",\"args\":{}}",
                "{\"id\":\"c2\",\"op\":\"export\",\"args\":{\"format\":\"step\"},\"blobs\":{\"file\":\"/mcp/sw/blob/b1\"}}",
                "{\"id\":\"c3\",\"op\":\"boom\",\"args\":{}}"
            });
            public string Auth;

            protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage req, CancellationToken ct)
            {
                Auth = req.Headers.Authorization?.ToString();
                var path = req.RequestUri.AbsolutePath;
                if (path == "/mcp/sw/hello")
                    return Json("{\"session\":\"s1\",\"wait\":1}");
                if (path == "/mcp/sw/next")
                {
                    if (commands.Count > 0) return Json(commands.Dequeue());
                    return new HttpResponseMessage(HttpStatusCode.Conflict)
                    {
                        Content = new StringContent("{\"error\":\"Another SOLIDWORKS connected with this key, so this one stopped.\",\"reason\":\"replaced\"}")
                    };
                }
                if (path == "/mcp/sw/file")
                {
                    var raw = await req.Content.ReadAsByteArrayAsync();
                    var q = System.Web.HttpUtility.ParseQueryString(req.RequestUri.Query);
                    using (var z = new System.IO.Compression.GZipStream(new System.IO.MemoryStream(raw), System.IO.Compression.CompressionMode.Decompress))
                    using (var ms = new System.IO.MemoryStream())
                    {
                        z.CopyTo(ms);
                        Files[q["name"]] = ms.ToArray();
                    }
                    return Json("{}");
                }
                if (path == "/mcp/sw/blob/b1") return new HttpResponseMessage(HttpStatusCode.OK) { Content = new ByteArrayContent(Encoding.ASCII.GetBytes("ISO-10303-21;")) };
                if (path == "/mcp/sw/result")
                {
                    Posted.Add(await req.Content.ReadAsStringAsync());
                    return Json("{\"ok\":true}");
                }
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }

            static HttpResponseMessage Json(string s) => new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(s, Encoding.UTF8, "application/json") };
        }

        [Fact]
        public void RunsCommandsAndStopsWhenReplaced()
        {
            var fake = new FakeServer();
            var seen = new List<string>();
            var c = new BridgeClient("https://example.test/", "oss_abc", J.O("client", "test", "version", "0.1.0"), (op, args, io) =>
            {
                seen.Add(op);
                if (op == "ping") return J.O("pong", true);
                if (op == "export")
                {
                    var blob = io.Download("file");
                    io.Upload("part.step", blob);
                    return J.O("file", "part.step");
                }
                throw new UserError("no such thing", J.O("made", 2));
            }, _ => { }, fake);
            c.Run(CancellationToken.None);
            Assert.Equal(new[] { "ping", "export", "boom" }, seen.ToArray());
            Assert.Equal("Bearer oss_abc", fake.Auth);
            Assert.Equal("ISO-10303-21;", Encoding.ASCII.GetString(fake.Files["part.step"]));
            var r = fake.Posted.Select(Json.ParseObject).ToList();
            Assert.True(J.Bool(r[0], "ok"));
            Assert.Equal("c2", J.Str(r[1], "id"));
            Assert.False(J.Bool(r[2], "ok"));
            Assert.Equal("no such thing", J.Str(r[2], "error"));
            Assert.Equal(2.0, J.Num(J.Obj(r[2], "result"), "made"));   // what was made before it stopped still reaches Claude
            Assert.False(c.Connected);
            Assert.Contains("Another SOLIDWORKS", c.State);
        }

        [Fact]
        public void RefusesBadSettingsWithoutCallingOut()
        {
            var fake = new FakeServer();
            var c = new BridgeClient("opensketch-yz.fly.dev", "oss_abc", J.O(), (o, a, i) => null, _ => { }, fake);
            c.Run(CancellationToken.None);
            Assert.Contains("https://", c.State);
            c = new BridgeClient("https://x.test", "abc", J.O(), (o, a, i) => null, _ => { }, fake);
            c.Run(CancellationToken.None);
            Assert.Contains("oss_", c.State);
            Assert.Null(fake.Auth);
        }
    }

    /// <summary>The BIZOMAT names and logo the add-in and the Companion show (Core/BrandArt.cs).</summary>
    public class BrandArtTests
    {
        [Fact]
        public void TheLogoPathsAreClosedPolygonsInsideTheirBoxes()
        {
            var word = BrandArt.Polygons(BrandArt.WordmarkPath);
            var b = BrandArt.Polygons(BrandArt.BPath);
            var bar = BrandArt.Polygons(BrandArt.BarPath);
            Assert.Equal(2, b.Count);            // the B and its lower counter
            Assert.Single(bar);                  // the connector bar
            Assert.True(word.Count > 8);         // B, I, Z, O and its counter, M, A and its bar, T
            foreach (var poly in word)
            {
                Assert.True(poly.Length % 2 == 0 && poly.Length >= 6);
                for (var i = 0; i < poly.Length; i += 2)
                {
                    Assert.InRange(poly[i], 0f, BrandArt.WordmarkWidth);
                    Assert.InRange(poly[i + 1], 0f, BrandArt.Height);
                }
            }
            Assert.Equal(b[0], word[0]);         // the wordmark starts with the same B
        }

        [Fact]
        public void OnlyStraightLinesAreDrawn()
        {
            Assert.Throws<FormatException>(() => BrandArt.Polygons("M0 0C1 1 2 2 3 3Z"));
            Assert.Throws<FormatException>(() => BrandArt.Polygons("M0 0L"));
        }

        [Fact]
        public void TheTabIsBizomatAndTheOldTabsGo()
        {
            Assert.Equal("BIZOMAT", BrandArt.TabName);
            Assert.Equal(new[] { "KEVOS", "CADOS", "BIZOMAT" }, BrandArt.TabsToReplace());
            Assert.Equal("BIZOMAT CAD Automation", BrandArt.Product);
            Assert.Equal("BIZOMAT Companion", BrandArt.Companion);
            Assert.DoesNotContain("KEVOS", BrandArt.Package + BrandArt.Product + BrandArt.Companion);
        }
    }
}
