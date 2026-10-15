"""VBA names are not case-sensitive: a parameter `door` hides a module-level constant `DOOR`, and the macro then
does something other than it reads. (That happened once: a switch did nothing, and the stand-in test did not see it.)

This scan reads a .bas file and reports every local name (a parameter, or a Dim / Static / Const inside a procedure)
that equals, ignoring case, a module-level constant or variable or the name of a procedure; and every pair of
module-level names that differ only in case.

    python3 check_names.py <file.bas>        exit 0 if there are none

Run it after any change to engine.bas, and on every generated macro (sldmacro verify does).
"""
import re
import sys


def logical_lines(text):
    """(line number, text) with line continuations joined and comments cut off."""
    out, buf, start = [], "", 0
    for no, raw in enumerate(text.replace("\r\n", "\n").split("\n"), 1):
        line = raw
        # cut a comment: a ' outside a string
        cut, in_str = None, False
        for i, ch in enumerate(line):
            if ch == '"':
                in_str = not in_str
            elif ch == "'" and not in_str:
                cut = i
                break
        if cut is not None:
            line = line[:cut]
        line = line.rstrip()
        if not buf:
            start = no
        if line.endswith(" _"):
            buf += line[:-1]
            continue
        buf += line
        if buf.strip():
            out.append((start, buf.strip()))
        buf = ""
    return out


def names_in_decl(rest):
    """Names declared in the tail of a Dim / Const / parameter list: a(1 To 3) As Long, b As String = "x", ..."""
    out, depth, cur, in_str = [], 0, "", False
    for ch in rest + ",":
        if ch == '"':
            in_str = not in_str
        if not in_str and ch == "(":
            depth += 1
        if not in_str and ch == ")":
            depth -= 1
        if ch == "," and depth == 0 and not in_str:
            piece = cur.strip()
            cur = ""
            if not piece:
                continue
            piece = re.sub(r"^(Optional|ByVal|ByRef|ParamArray|WithEvents)\s+", "", piece, flags=re.I)
            piece = re.sub(r"^(Optional|ByVal|ByRef|ParamArray|WithEvents)\s+", "", piece, flags=re.I)
            m = re.match(r"([A-Za-z_][A-Za-z0-9_]*)", piece)
            if m:
                out.append(m.group(1))
        else:
            cur += ch
    return out


def scan(text):
    module, procs, local = {}, {}, []           # name.lower() -> (name, line); procedures; (proc, name, line)
    cur = None
    for no, line in logical_lines(text):
        m = re.match(r"(?:(?:Public|Private|Friend|Static)\s+)*(Sub|Function|Property\s+(?:Get|Let|Set))\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:\((.*)\))?", line, flags=re.I)
        if m and not re.match(r"End\b", line, flags=re.I) and not re.match(r"Exit\b", line, flags=re.I) and not re.match(r"Declare\b", line, flags=re.I):
            cur = m.group(2)
            procs.setdefault(cur.lower(), (cur, no))
            params = m.group(3) or ""
            # the parameter list ends at the bracket that closes it: cut a trailing "As Type" of a Function
            depth, end = 0, len(params)
            for i, ch in enumerate(params):
                if ch == "(":
                    depth += 1
                elif ch == ")":
                    if depth == 0:
                        end = i
                        break
                    depth -= 1
            for n in names_in_decl(params[:end]):
                local.append((cur, n, no))
            continue
        if re.match(r"End\s+(Sub|Function|Property)\b", line, flags=re.I):
            cur = None
            continue
        m = re.match(r"(?:(Public|Private|Global|Dim|Static)\s+)?(Const\s+)?(.*)", line, flags=re.I)
        head, is_const, rest = (m.group(1) or ""), bool(m.group(2)), m.group(3)
        if not head and not is_const:
            continue
        if cur is None:
            if head.lower() in ("public", "private", "global", "dim") or is_const:
                if re.match(r"(Declare|Type|Enum|Sub|Function|Property)\b", rest, flags=re.I):
                    continue
                for n in names_in_decl(rest):
                    module.setdefault(n.lower(), []).append((n, no))
        else:
            if head.lower() in ("dim", "static") or is_const:
                for n in names_in_decl(rest):
                    local.append((cur, n, no))
    return module, procs, local


def problems(text):
    module, procs, local = scan(text)
    out = []
    for low, seen in module.items():
        spellings = {n for n, _ in seen}
        if len(spellings) > 1:
            out.append(f"module-level names differ only in case: {sorted(spellings)} (lines {[l for _, l in seen]})")
        if low in procs:
            out.append(f"module-level name {seen[0][0]} (line {seen[0][1]}) is also the procedure {procs[low][0]} (line {procs[low][1]})")
    for proc, n, no in local:
        low = n.lower()
        if low in module:
            out.append(f"in {proc} (line {no}): local name {n} hides the module-level {module[low][0][0]} (line {module[low][0][1]})")
        elif low in procs and procs[low][0].lower() != proc.lower():
            out.append(f"in {proc} (line {no}): local name {n} hides the procedure {procs[low][0]} (line {procs[low][1]})")
    return out, (len(module), len(procs), len(local))


def main(argv):
    if len(argv) != 1:
        print(__doc__)
        return 2
    text = open(argv[0], newline="", encoding="latin-1").read()
    out, (nm, npr, nl) = problems(text)
    for o in out:
        print("NAME: " + o)
    print(f"NAMES {'OK' if not out else 'FAIL'}: {nm} module-level names, {npr} procedures, {nl} parameters and locals; {len(out)} that hide another")
    return 1 if out else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
