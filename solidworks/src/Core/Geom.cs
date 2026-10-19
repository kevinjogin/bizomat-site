using System;
using System.Collections.Generic;

namespace OpenSketch.Sw.Core
{
    public struct Vec3
    {
        public double X, Y, Z;

        public Vec3(double x, double y, double z)
        {
            X = x;
            Y = y;
            Z = z;
        }

        public static Vec3 operator +(Vec3 a, Vec3 b) => new Vec3(a.X + b.X, a.Y + b.Y, a.Z + b.Z);
        public static Vec3 operator -(Vec3 a, Vec3 b) => new Vec3(a.X - b.X, a.Y - b.Y, a.Z - b.Z);
        public static Vec3 operator -(Vec3 a) => new Vec3(-a.X, -a.Y, -a.Z);
        public static Vec3 operator *(Vec3 a, double s) => new Vec3(a.X * s, a.Y * s, a.Z * s);
        public static Vec3 operator *(double s, Vec3 a) => new Vec3(a.X * s, a.Y * s, a.Z * s);
        public double Dot(Vec3 b) => X * b.X + Y * b.Y + Z * b.Z;
        public Vec3 Cross(Vec3 b) => new Vec3(Y * b.Z - Z * b.Y, Z * b.X - X * b.Z, X * b.Y - Y * b.X);
        public double Length => Math.Sqrt(X * X + Y * Y + Z * Z);

        public Vec3 Unit()
        {
            var l = Length;
            return l < 1e-15 ? this : new Vec3(X / l, Y / l, Z / l);
        }

        public double[] Arr() => new[] { X, Y, Z };
        public static Vec3 From(double[] a, int at = 0) => new Vec3(a[at], a[at + 1], a[at + 2]);
        public override string ToString() => $"[{X + 0.0:0.###}, {Y + 0.0:0.###}, {Z + 0.0:0.###}]".Replace("-0,", "0,").Replace("[-0,", "[0,").Replace(", -0]", ", 0]");

        public static readonly Vec3 Zero = new Vec3(0, 0, 0);
        public static readonly Vec3 XAxis = new Vec3(1, 0, 0);
        public static readonly Vec3 YAxis = new Vec3(0, 1, 0);
        public static readonly Vec3 ZAxis = new Vec3(0, 0, 1);
    }

    /// <summary>A sketch plane as OpenSketch defines it: origin, x direction and normal; y = normal x x.</summary>
    public struct SketchFrame
    {
        public Vec3 O, X, Y, N;

        public SketchFrame(Vec3 origin, Vec3 xdir, Vec3 normal)
        {
            N = normal.Unit();
            var x = xdir - N * xdir.Dot(N);
            X = x.Length < 1e-12 ? Perp(N) : x.Unit();
            Y = N.Cross(X);
            O = origin;
        }

        public Vec3 ToModel(double u, double v) => O + X * u + Y * v;

        public (double u, double v) ToLocal(Vec3 p)
        {
            var d = p - O;
            return (d.Dot(X), d.Dot(Y));
        }

        public static Vec3 Perp(Vec3 n)
        {
            var a = Math.Abs(n.X) < 0.9 ? Vec3.XAxis : Vec3.YAxis;
            return (a - n * a.Dot(n)).Unit();
        }

        /// <summary>OpenSketch's standard planes (docs/DOCUMENT.md), the same as SOLIDWORKS'.</summary>
        public static SketchFrame Std(int which)
        {
            switch (which)
            {
                case 1: return new SketchFrame(Vec3.Zero, Vec3.XAxis, Vec3.ZAxis);            // Front: x +X, y +Y, n +Z
                case 2: return new SketchFrame(Vec3.Zero, Vec3.XAxis, Vec3.YAxis);            // Top: x +X, y -Z, n +Y
                case 3: return new SketchFrame(Vec3.Zero, -Vec3.ZAxis, Vec3.XAxis);           // Right: x -Z, y +Y, n +X
                default: throw new ArgumentException("plane 1..3");
            }
        }

        public static int StdIndex(string name)
        {
            switch ((name ?? "").Trim().ToLowerInvariant())
            {
                case "front plane": case "front": case "xy": return 1;
                case "top plane": case "top": case "xz": return 2;
                case "right plane": case "right": case "yz": return 3;
                default: return 0;
            }
        }
    }

    /// <summary>Row-major 3x3 rotation and a translation: p' = R p + t.</summary>
    public struct Pose
    {
        public double[] R; // 9, by rows
        public Vec3 T;

        public static Pose Identity => new Pose { R = new double[] { 1, 0, 0, 0, 1, 0, 0, 0, 1 }, T = Vec3.Zero };

        public Vec3 Apply(Vec3 p) => new Vec3(R[0] * p.X + R[1] * p.Y + R[2] * p.Z + T.X,
                                              R[3] * p.X + R[4] * p.Y + R[5] * p.Z + T.Y,
                                              R[6] * p.X + R[7] * p.Y + R[8] * p.Z + T.Z);

        public Vec3 Rotate(Vec3 p) => new Vec3(R[0] * p.X + R[1] * p.Y + R[2] * p.Z,
                                               R[3] * p.X + R[4] * p.Y + R[5] * p.Z,
                                               R[6] * p.X + R[7] * p.Y + R[8] * p.Z);

        public Pose Inverse()
        {
            var rt = new[] { R[0], R[3], R[6], R[1], R[4], R[7], R[2], R[5], R[8] };
            var inv = new Pose { R = rt, T = Vec3.Zero };
            var t = inv.Rotate(T);
            inv.T = -t;
            return inv;
        }

        /// <summary>OpenSketch component rotation [rx, ry, rz] degrees: R = Rz * Ry * Rx (fixed axes).</summary>
        public static Pose FromEuler(Vec3 position, Vec3 deg)
        {
            double a = deg.X * Math.PI / 180, b = deg.Y * Math.PI / 180, c = deg.Z * Math.PI / 180;
            double ca = Math.Cos(a), sa = Math.Sin(a), cb = Math.Cos(b), sb = Math.Sin(b), cc = Math.Cos(c), sc = Math.Sin(c);
            // Rz*Ry*Rx
            var r = new double[]
            {
                cc * cb, cc * sb * sa - sc * ca, cc * sb * ca + sc * sa,
                sc * cb, sc * sb * sa + cc * ca, sc * sb * ca - cc * sa,
                -sb, cb * sa, cb * ca
            };
            return new Pose { R = r, T = position };
        }

        public List<object> ToList12() => new List<object>
        {
            Math.Round(R[0], 9), Math.Round(R[1], 9), Math.Round(R[2], 9),
            Math.Round(R[3], 9), Math.Round(R[4], 9), Math.Round(R[5], 9),
            Math.Round(R[6], 9), Math.Round(R[7], 9), Math.Round(R[8], 9),
            Math.Round(T.X, 6), Math.Round(T.Y, 6), Math.Round(T.Z, 6)
        };
    }

    public static class Units
    {
        public const double M = 0.001;       // mm -> m
        public static double ToM(double mm) => mm * M;
        public static double ToMm(double m) => m / M;
        public static double Rad(double deg) => deg * Math.PI / 180.0;
        public static double Deg(double rad) => rad * 180.0 / Math.PI;
    }
}
