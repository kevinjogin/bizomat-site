using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace OpenSketch.Sw.Core
{
    /// <summary>
    /// A small JSON reader and writer with no dependencies, so the add-in is one DLL inside SOLIDWORKS (a COM
    /// add-in cannot rely on finding other DLLs next to it). Objects are Dictionary&lt;string, object&gt;,
    /// arrays List&lt;object&gt;, numbers double, plus string, bool and null.
    /// </summary>
    public static class Json
    {
        public static object Parse(string text)
        {
            if (text == null) throw new FormatException("No JSON.");
            var p = new Parser(text);
            p.Ws();
            var v = p.Value();
            p.Ws();
            if (p.Pos != text.Length) throw new FormatException("Extra text after JSON at " + p.Pos);
            return v;
        }

        public static Dictionary<string, object> ParseObject(string text)
        {
            if (Parse(text) is Dictionary<string, object> d) return d;
            throw new FormatException("Expected a JSON object.");
        }

        public static string Write(object value)
        {
            var sb = new StringBuilder();
            WriteTo(sb, value);
            return sb.ToString();
        }

        static void WriteTo(StringBuilder sb, object v)
        {
            switch (v)
            {
                case null:
                    sb.Append("null");
                    return;
                case string s:
                    Str(sb, s);
                    return;
                case bool b:
                    sb.Append(b ? "true" : "false");
                    return;
                case double d:
                    Num(sb, d);
                    return;
                case float f:
                    Num(sb, f);
                    return;
                case int i:
                    sb.Append(i.ToString(CultureInfo.InvariantCulture));
                    return;
                case long l:
                    sb.Append(l.ToString(CultureInfo.InvariantCulture));
                    return;
                case short sh:
                    sb.Append(sh.ToString(CultureInfo.InvariantCulture));
                    return;
                case Enum e:
                    sb.Append(Convert.ToInt64(e).ToString(CultureInfo.InvariantCulture));
                    return;
                case IDictionary<string, object> dict:
                    sb.Append('{');
                    var first = true;
                    foreach (var kv in dict)
                    {
                        if (!first) sb.Append(',');
                        first = false;
                        Str(sb, kv.Key);
                        sb.Append(':');
                        WriteTo(sb, kv.Value);
                    }
                    sb.Append('}');
                    return;
                case IDictionary od:
                    sb.Append('{');
                    var f2 = true;
                    foreach (DictionaryEntry kv in od)
                    {
                        if (!f2) sb.Append(',');
                        f2 = false;
                        Str(sb, Convert.ToString(kv.Key, CultureInfo.InvariantCulture));
                        sb.Append(':');
                        WriteTo(sb, kv.Value);
                    }
                    sb.Append('}');
                    return;
                case IEnumerable list:
                    sb.Append('[');
                    var f3 = true;
                    foreach (var item in list)
                    {
                        if (!f3) sb.Append(',');
                        f3 = false;
                        WriteTo(sb, item);
                    }
                    sb.Append(']');
                    return;
                default:
                    if (v is IConvertible c)
                    {
                        try
                        {
                            Num(sb, c.ToDouble(CultureInfo.InvariantCulture));
                            return;
                        }
                        catch (Exception)
                        {
                        }
                    }
                    Str(sb, v.ToString());
                    return;
            }
        }

        static void Num(StringBuilder sb, double d)
        {
            if (double.IsNaN(d) || double.IsInfinity(d))
            {
                sb.Append("null");
                return;
            }
            if (Math.Abs(d) < 1e15 && d == Math.Floor(d))
            {
                sb.Append(((long)d).ToString(CultureInfo.InvariantCulture));
                return;
            }
            sb.Append(d.ToString("R", CultureInfo.InvariantCulture));
        }

        static void Str(StringBuilder sb, string s)
        {
            sb.Append('"');
            foreach (var ch in s)
            {
                switch (ch)
                {
                    case '"': sb.Append("\\\""); break;
                    case '\\': sb.Append("\\\\"); break;
                    case '\n': sb.Append("\\n"); break;
                    case '\r': sb.Append("\\r"); break;
                    case '\t': sb.Append("\\t"); break;
                    case '\b': sb.Append("\\b"); break;
                    case '\f': sb.Append("\\f"); break;
                    default:
                        if (ch < 0x20) sb.Append("\\u").Append(((int)ch).ToString("x4"));
                        else sb.Append(ch);
                        break;
                }
            }
            sb.Append('"');
        }

        sealed class Parser
        {
            readonly string t;
            public int Pos;

            public Parser(string text) { t = text; }

            public void Ws()
            {
                while (Pos < t.Length && (t[Pos] == ' ' || t[Pos] == '\t' || t[Pos] == '\n' || t[Pos] == '\r')) Pos++;
            }

            Exception Bad(string what) => new FormatException(what + " at " + Pos);

            public object Value()
            {
                if (Pos >= t.Length) throw Bad("Unexpected end of JSON");
                var c = t[Pos];
                if (c == '{') return Obj();
                if (c == '[') return Arr();
                if (c == '"') return Str();
                if (c == 't' && Lit("true")) return true;
                if (c == 'f' && Lit("false")) return false;
                if (c == 'n' && Lit("null")) return null;
                if (c == '-' || (c >= '0' && c <= '9')) return Number();
                throw Bad("Unexpected character '" + c + "'");
            }

            bool Lit(string w)
            {
                if (string.CompareOrdinal(t, Pos, w, 0, w.Length) != 0) throw Bad("Bad literal");
                Pos += w.Length;
                return true;
            }

            Dictionary<string, object> Obj()
            {
                var d = new Dictionary<string, object>();
                Pos++;
                Ws();
                if (Pos < t.Length && t[Pos] == '}')
                {
                    Pos++;
                    return d;
                }
                while (true)
                {
                    Ws();
                    if (Pos >= t.Length || t[Pos] != '"') throw Bad("Expected a key");
                    var k = Str();
                    Ws();
                    if (Pos >= t.Length || t[Pos] != ':') throw Bad("Expected ':'");
                    Pos++;
                    Ws();
                    d[k] = Value();
                    Ws();
                    if (Pos >= t.Length) throw Bad("Unclosed object");
                    if (t[Pos] == ',')
                    {
                        Pos++;
                        continue;
                    }
                    if (t[Pos] == '}')
                    {
                        Pos++;
                        return d;
                    }
                    throw Bad("Expected ',' or '}'");
                }
            }

            List<object> Arr()
            {
                var a = new List<object>();
                Pos++;
                Ws();
                if (Pos < t.Length && t[Pos] == ']')
                {
                    Pos++;
                    return a;
                }
                while (true)
                {
                    Ws();
                    a.Add(Value());
                    Ws();
                    if (Pos >= t.Length) throw Bad("Unclosed array");
                    if (t[Pos] == ',')
                    {
                        Pos++;
                        continue;
                    }
                    if (t[Pos] == ']')
                    {
                        Pos++;
                        return a;
                    }
                    throw Bad("Expected ',' or ']'");
                }
            }

            string Str()
            {
                Pos++;
                var sb = new StringBuilder();
                while (true)
                {
                    if (Pos >= t.Length) throw Bad("Unclosed string");
                    var c = t[Pos++];
                    if (c == '"') return sb.ToString();
                    if (c != '\\')
                    {
                        sb.Append(c);
                        continue;
                    }
                    if (Pos >= t.Length) throw Bad("Bad escape");
                    var e = t[Pos++];
                    switch (e)
                    {
                        case '"': sb.Append('"'); break;
                        case '\\': sb.Append('\\'); break;
                        case '/': sb.Append('/'); break;
                        case 'b': sb.Append('\b'); break;
                        case 'f': sb.Append('\f'); break;
                        case 'n': sb.Append('\n'); break;
                        case 'r': sb.Append('\r'); break;
                        case 't': sb.Append('\t'); break;
                        case 'u':
                            if (Pos + 4 > t.Length) throw Bad("Bad \\u escape");
                            sb.Append((char)int.Parse(t.Substring(Pos, 4), NumberStyles.HexNumber, CultureInfo.InvariantCulture));
                            Pos += 4;
                            break;
                        default: throw Bad("Bad escape");
                    }
                }
            }

            double Number()
            {
                var start = Pos;
                if (t[Pos] == '-') Pos++;
                while (Pos < t.Length && "0123456789.eE+-".IndexOf(t[Pos]) >= 0) Pos++;
                if (!double.TryParse(t.Substring(start, Pos - start), NumberStyles.Float, CultureInfo.InvariantCulture, out var d))
                    throw Bad("Bad number");
                return d;
            }
        }
    }

    /// <summary>Typed reads from parsed JSON, with plain messages when something is missing or the wrong kind.</summary>
    public static class J
    {
        public static Dictionary<string, object> Obj(object o) => o as Dictionary<string, object>;

        public static Dictionary<string, object> Obj(Dictionary<string, object> d, string key) =>
            d != null && d.TryGetValue(key, out var v) ? v as Dictionary<string, object> : null;

        public static List<object> Arr(Dictionary<string, object> d, string key) =>
            d != null && d.TryGetValue(key, out var v) ? v as List<object> : null;

        public static bool Has(Dictionary<string, object> d, string key) => d != null && d.TryGetValue(key, out var v) && v != null;

        public static string Str(Dictionary<string, object> d, string key, string dflt = null)
        {
            if (d == null || !d.TryGetValue(key, out var v) || v == null) return dflt;
            if (v is string s) return s;
            if (v is double n) return n.ToString("R", CultureInfo.InvariantCulture);
            return v.ToString();
        }

        public static double Num(Dictionary<string, object> d, string key, double dflt = 0)
        {
            if (d == null || !d.TryGetValue(key, out var v) || v == null) return dflt;
            if (v is double n) return n;
            if (v is bool b) return b ? 1 : 0;
            if (v is string s && double.TryParse(s, NumberStyles.Float, CultureInfo.InvariantCulture, out var p)) return p;
            return dflt;
        }

        public static double? NumOrNull(Dictionary<string, object> d, string key)
        {
            if (d == null || !d.TryGetValue(key, out var v) || v == null) return null;
            if (v is double n) return n;
            if (v is string s && double.TryParse(s, NumberStyles.Float, CultureInfo.InvariantCulture, out var p)) return p;
            return null;
        }

        public static int Int(Dictionary<string, object> d, string key, int dflt = 0) => (int)Math.Round(Num(d, key, dflt));

        public static bool Bool(Dictionary<string, object> d, string key, bool dflt = false)
        {
            if (d == null || !d.TryGetValue(key, out var v) || v == null) return dflt;
            if (v is bool b) return b;
            if (v is double n) return n != 0;
            if (v is string s) return s == "true" || s == "1";
            return dflt;
        }

        public static Vec3? V3(object o)
        {
            if (o is List<object> a && a.Count == 3 && a[0] is double x && a[1] is double y && a[2] is double z)
                return new Vec3(x, y, z);
            return null;
        }

        public static Vec3? V3(Dictionary<string, object> d, string key) =>
            d != null && d.TryGetValue(key, out var v) ? V3(v) : null;

        public static List<string> Strs(Dictionary<string, object> d, string key)
        {
            var o = new List<string>();
            var a = Arr(d, key);
            if (a == null) return o;
            foreach (var x in a)
                if (x is string s) o.Add(s);
            return o;
        }

        public static Dictionary<string, object> O(params object[] kv)
        {
            var d = new Dictionary<string, object>();
            for (var i = 0; i + 1 < kv.Length; i += 2)
                if (kv[i + 1] != null) d[(string)kv[i]] = kv[i + 1];
            return d;
        }

        public static List<object> L(params object[] items) => new List<object>(items);

        public static List<object> Pt(Vec3 v, int digits = 4) =>
            new List<object> { Math.Round(v.X, digits), Math.Round(v.Y, digits), Math.Round(v.Z, digits) };
    }
}
