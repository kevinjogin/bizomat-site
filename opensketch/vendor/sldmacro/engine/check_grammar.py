#!/usr/bin/env python3
"""
check_grammar.py - is a SOLIDWORKS VBA macro (.bas) syntactically valid VBA?

    python3 check_grammar.py <macro.bas> [--cache DIR]

The macro is parsed with the ANTLR 4 VBA grammar (antlr/grammars-v4, vba/vba6/vba.g4, start rule
"startRule"). One summary line is printed on standard output:

    GRAMMAR OK: <file>: <n> lines parsed, 0 syntax errors (<seconds> s)       exit code 0
    GRAMMAR FAIL: <file>: <n> lines, <k> syntax errors (<seconds> s)          exit code 1
        followed by up to 30 errors, each as  line:column: kind: message  and the source line
    GRAMMAR NOT CHECKED: <what is missing>                                    exit code 2

Lines and columns are those of the file as given; both count from 1. The kinds of error:
    lexer        text that is no token at all (in practice: a string literal that is not closed)
    parser       the first place where the text stops being a VBA module
    parser-more  the first error of a later procedure. The parser cannot carry on after an error
                 inside a procedure, so the rest of the file is then checked one procedure at a
                 time. At most one error is reported per procedure, so a second fault in the same
                 procedure shows up only once the first is mended.
A parser message names the token that does not fit and what could have come instead. That list is
taken from ANTLR's look-ahead and is a guide only: it can name more than would really fit.

Other options: --setup-only (download and build, check nothing), --exact (see below), -v.

What it needs: Python 3 (standard library only) and a JDK 11 or newer (java and javac). On first
use it downloads the ANTLR tool and the grammar into the cache folder (default
~/.cache/sldmacro-grammar), generates the Java parser and compiles it. Later runs reuse all of that
and need no network. Both downloads are pinned and checked against a SHA-256, so every run uses the
same grammar. The grammar file carries a GPL v3 notice; it is downloaded, not shipped with this
script.

How the verdict is reached: the whole file is parsed from the start rule with a quick way of
choosing between alternatives. OK is only ever said when a parse consumed every token up to the
end of the file without a single error. If the quick parse does not get through cleanly, that
proves nothing yet: the procedure it stopped in is parsed again on its own with ANTLR's exact way.
If that fails, the file fails; if not, the whole file is parsed the exact way. FAIL is only ever
said on text the lexer cannot read or on an error from the exact way. --exact leaves out both
shortcuts and parses the whole file the exact way, several times slower.

What it is not: a compiler. It knows nothing about SOLIDWORKS, variable names, types or whether a
called method exists, and it only knows VBA as far as this one grammar does. The grammar is looser
than the VBA editor in some places and stricter in a few:

  Wrong VBA that passes: a lone Next, Loop, Wend or Else with no block open (they are read as
  names; "Next i", "End If", "End With", "End Select" are caught); a plain Do with its Loop line
  missing ("Do While ..." without Loop is caught); two Else branches in one If; a call statement
  with parentheses round several arguments, Foo(1, 2); a name that starts with a digit, 2x = 1;
  odd characters inside a name, including curly quotes round a single word; a statement keyword
  on its own (Dim, Call, GoTo, Exit, ReDim); and everything that is not syntax (undeclared names,
  wrong types, Exit For outside a loop, a Next naming the wrong variable, duplicate names, the
  editor's limits of 24 line continuations and 1023 characters per line).

  Right VBA that fails: a division written without blanks before a number with a decimal point
  (x/2.5; write x / 2.5); a minus with a blank before it and none after (a -1; write a - 1); a
  blank after the underscore of a line continuation; "3." for 3.0; a number with a type suffix
  other than # in the middle of an expression (x = 5& * 2), and 1E3# likewise; "Print #1, 5#"
  (read as a date literal). Apart from 5& and its like, the VBA editor writes none of these forms
  itself.
"""

import argparse
import hashlib
import http.client
import os
import re
import shutil
import ssl
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

# ---------------------------------------------------------------------------------------------
# What is downloaded. Change a version here and its SHA-256 with it.
# ---------------------------------------------------------------------------------------------

ANTLR_JAR = "antlr4-4.13.2-complete.jar"
ANTLR_SHA256 = "eae2dfa119a64327444672aff63e9ec35a20180dc5b8090b7a6ab85125df4d76"
ANTLR_URLS = [
    "https://repo1.maven.org/maven2/org/antlr/antlr4/4.13.2/antlr4-4.13.2-complete.jar",
    # The same file as published on antlr.org (github.com/antlr/website-antlr4, branch gh-pages).
    # Maven Central sometimes answers "429 Too Many Requests" to a shared address.
    "https://raw.githubusercontent.com/antlr/website-antlr4/"
    "052ec886db21c3367dc6fd2f304e1b5275988834/download/antlr-4.13.2-complete.jar",
]

# antlr/grammars-v4 at the commit that last changed vba/vba6 (13 Feb 2026). vba.g4 itself was last
# changed in acc240d (6 Apr 2025). It is one combined grammar (lexer and parser in one file) and
# sets caseInsensitive = true itself, so it needs no case-changing input stream.
GRAMMAR_COMMIT = "bf61744020dc46f2d7b8761e35b0c0cb39b3f31a"
GRAMMAR_SHA256 = "a24fe1f21bd0feb524fc2acb15b9b4e5105e2e2186cb4bf65af7861ec7409fae"
GRAMMAR_URLS = [
    "https://raw.githubusercontent.com/antlr/grammars-v4/" + GRAMMAR_COMMIT + "/vba/vba6/vba.g4",
]

DEFAULT_CACHE = os.path.join("~", ".cache", "sldmacro-grammar")
MAX_ERRORS_SHOWN = 30
MIN_JAVA = 11           # ANTLR 4.13 needs Java 11

EXIT_OK, EXIT_FAIL, EXIT_SETUP = 0, 1, 2


class SetupProblem(Exception):
    """Something the check needs is missing or broken. Reported in plain words, exit code 2."""


# ---------------------------------------------------------------------------------------------
# The Java side: a small driver around the generated lexer and parser.
# ---------------------------------------------------------------------------------------------

DRIVER_CLASS = "SldVbaCheck"
DRIVER_SOURCE = r'''
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.misc.IntervalSet;
import org.antlr.v4.runtime.misc.ParseCancellationException;
import java.io.FileDescriptor;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Syntax check of one VBA module with the ANTLR grammar vba.g4 (start rule: startRule).
 *
 * Input:  the module text on standard input, UTF-8.
 * Output: tab-separated records on standard output, one per line:
 *           STAT  name  value
 *           E     kind  line  column  message     (kind: lexer, parser, parser-more; column counts from 0)
 *           DONE  number-of-E-records
 *           FATAL message                         (the check itself broke)
 * Exit:   0 no syntax errors and the whole input was consumed, 1 syntax errors, 3 the check itself broke.
 *
 * With the argument "exact" the quick pass (see Sim below) and the one-procedure shortcut (see
 * parseWhole) are left out: the whole file is parsed with ANTLR's exact prediction only.
 */
public class SldVbaCheck {

    static final class Err {
        final String kind; final int line, col; final String msg;
        Err(String kind, int line, int col, String msg) { this.kind = kind; this.line = line; this.col = col; this.msg = msg; }
    }

    /** What came of parsing one run of tokens. */
    static final class Result {
        final List<Err> errors = new ArrayList<>();     // from the exact pass: the first error, if there is one
        int firstErrorToken = -1;   // where the first error is, as a position in the whole file's tokens; -1 if none
        boolean reachedEof;
        boolean clean;              // no error of any kind and the parser stopped at the end of the run
        String pass;                // which pass gave this result, in words
    }

    /**
     * ANTLR's prediction engine with two additions.
     *
     * 1. It notes the first token that no alternative of the grammar could accept. With this grammar
     *    ANTLR has to look ahead over a whole procedure before it enters it, and when that look-ahead
     *    runs out it reports the error against the place it was standing (often the first line of the
     *    procedure). The token where the look-ahead ran out is the real place of the error.
     *
     * 2. In the quick pass, the decisions of the rules in QUICK_RULES are taken by ANTLR's fast
     *    prediction (SLL) without its full-context step. In those two rules nearly every decision
     *    looks ambiguous to the fast prediction, and settling each one exactly is what makes a plain
     *    parse of a 9,000-line macro take about 80 seconds. A parse that gets to the end of the file
     *    with no error has matched every token against the grammar, whichever way the choices were
     *    made, so a clean quick pass is proof that the text is valid. A quick pass that does not come
     *    out clean proves nothing: the text is then parsed again the exact way.
     */
    static final class Sim extends ParserATNSimulator {
        static final List<String> QUICK_RULES = Arrays.asList("module", "argsCall");
        final Parser p;
        final boolean[] quick;      // by decision number; null in the exact pass
        int deadEnd = -1;           // position in the token stream, -1 while there is none
        String expected = "";

        Sim(Parser p, boolean quickPass) {
            super(p, p.getATN(), p.getInterpreter().decisionToDFA, p.getInterpreter().getSharedContextCache());
            this.p = p;
            if (quickPass) {
                quick = new boolean[atn.getNumberOfDecisions()];
                for (int d = 0; d < quick.length; d++) {
                    quick[d] = QUICK_RULES.contains(p.getRuleNames()[atn.getDecisionState(d).ruleIndex]);
                }
            } else {
                quick = null;
            }
        }

        @Override
        public int adaptivePredict(TokenStream input, int decision, ParserRuleContext outerContext) {
            if (quick == null || !quick[decision]) return super.adaptivePredict(input, decision, outerContext);
            setPredictionMode(PredictionMode.SLL);
            try {
                return super.adaptivePredict(input, decision, outerContext);
            } finally {
                setPredictionMode(PredictionMode.LL);
            }
        }

        @Override
        protected NoViableAltException noViableAlt(TokenStream input, ParserRuleContext outerContext, ATNConfigSet configs, int startIndex) {
            if (deadEnd < 0) {
                deadEnd = input.index();
                expected = describeExpected(configs);
            }
            return super.noViableAlt(input, outerContext, configs, startIndex);
        }

        /** The tokens that could have come next instead: those the surviving paths through the grammar were waiting for. */
        String describeExpected(ATNConfigSet configs) {
            IntervalSet set = new IntervalSet();
            for (ATNConfig c : configs) {
                for (Transition t : c.state.getTransitions()) {
                    if (t.isEpsilon() || t instanceof NotSetTransition || t instanceof WildcardTransition) continue;
                    IntervalSet label = t.label();
                    if (label != null) set.addAll(label);
                }
            }
            return describe(set, p.getVocabulary());
        }
    }

    /**
     * A set of token types in a few words, the most telling first, for example
     * "'End If', '.', '!', a number, a statement". The grammar's own lists run to 150 entries,
     * because most of its keywords may also be used as names.
     */
    static String describe(IntervalSet set, Vocabulary v) {
        if (set == null) return "";
        List<String> closers = new ArrayList<>(), marks = new ArrayList<>(), words = new ArrayList<>(), starters = new ArrayList<>();
        Set<String> kinds = new LinkedHashSet<>();
        boolean name = false;
        for (int type : set.toList()) {
            if (type == Token.EOF) { kinds.add("end of file"); continue; }
            String symbol = v.getSymbolicName(type);    // END_IF, NEWLINE, DIM, ...
            String literal = v.getLiteralName(type);    // '(' or 'DIM' when the token is one fixed text, else null
            if (symbol == null) symbol = "";
            if (literal != null && literal.length() > 2 && Character.isLetter(literal.charAt(1))) words.add(literal);
            else if (literal != null && literal.startsWith("'#")) starters.add(literal);            // #If, #Const, ...
            else if (literal != null) marks.add(literal);
            else if (symbol.equals("IDENTIFIER")) name = true;
            else if (symbol.equals("NEWLINE")) kinds.add("end of line");
            else if (symbol.equals("WS")) kinds.add("a space");
            else if (symbol.equals("COMMENT") || symbol.equals("REMCOMMENT")) kinds.add("a comment");
            else if (symbol.equals("STRINGLITERAL")) kinds.add("a string");
            else if (symbol.equals("DATELITERAL")) kinds.add("a date");
            else if (symbol.endsWith("LITERAL")) kinds.add("a number");
            else if (symbol.equals("DIV")) marks.add("'/'");
            else if (symbol.equals("LINE_CONTINUATION")) continue;      // never reaches the parser: the lexer skips it
            else {
                // A keyword pair that the lexer hands over as one token: END_IF, EXIT_DO, ON_ERROR, ...
                StringBuilder sb = new StringBuilder("'");
                for (String w : symbol.split("_")) {
                    if (w.isEmpty()) continue;
                    if (sb.length() > 1) sb.append(' ');
                    sb.append(w.charAt(0)).append(w.substring(1).toLowerCase());
                }
                (symbol.startsWith("END_") ? closers : starters).add(sb.append("'").toString());
            }
        }
        int operators = 0;
        for (String m : marks) if (OPERATORS.contains(m)) operators++;
        if (operators >= 10) {                          // an expression may go on here: say so once
            marks.removeAll(OPERATORS);
            words.removeAll(WORD_OPERATORS);
            kinds.add("an operator");
        }
        List<String> out = new ArrayList<>(closers);    // End If, End Sub, ...: what a block is waiting for
        if (words.size() > 12) name = true; else out.addAll(words);     // To, Then, As ...; or every keyword there is
        out.addAll(marks);
        out.addAll(kinds);
        if (name && starters.size() > 3) out.add("a statement");         // Exit Do, On Error, #If ...: a statement may start here
        else out.addAll(starters);
        if (name) out.add("a name or keyword");
        if (out.size() > 14) { out = new ArrayList<>(out.subList(0, 13)); out.add("..."); }
        return String.join(", ", out);
    }

    static final List<String> OPERATORS = Arrays.asList("'&'", "'/'", "'='", "'>='", "'>'", "'<='", "'<'", "'-'", "'*'", "'<>'", "'+'", "'^'");
    static final List<String> WORD_OPERATORS = Arrays.asList("'AND'", "'OR'", "'XOR'", "'EQV'", "'IMP'", "'MOD'", "'IS'", "'LIKE'");

    static List<Token> all;          // every token of the file; the last one is the end-of-file token
    static final Set<Integer> TRIVIA = new HashSet<>(), PROC_START = new HashSet<>(), PROC_END = new HashSet<>(),
            PROC_PREFIX = new HashSet<>(), LINE_END = new HashSet<>();

    static String clean(String s) {
        return s.replace("\r", "\\r").replace("\n", "\\n").replace("\t", "\\t");
    }

    static String show(Token t) {
        if (t.getType() == Token.EOF) return "end of file";
        if (t.getType() == vbaLexer.NEWLINE) return "end of line";
        if (t.getType() == vbaLexer.WS) return "white space";
        String s = clean(t.getText());
        if (s.length() > 40) s = s.substring(0, 37) + "...";
        return "'" + s + "'";
    }

    static boolean exactOnly;        // leave out the quick pass

    /** Parse the tokens all[from..to] as a whole module: the quick way first, the exact way if that is not clean. */
    static Result parse(int from, int to, String kind) {
        if (!exactOnly) {
            Result r = attempt(from, to, kind, true);
            if (r.clean) return r;
        }
        return attempt(from, to, kind, false);
    }

    /**
     * The check itself: the whole file from the start rule.
     *
     * When the quick pass is not clean, the exact pass would normally parse the whole file again,
     * which takes half a minute for 9,000 lines however small the fault. Usually that is not needed:
     * the procedure in which the quick pass stopped is parsed the exact way on its own (with what
     * stands between it and the procedure before), and if that fails, the file fails. This is sound
     * because of how the pinned grammar is built: the tokens End Sub, End Function and End Property
     * occur in it only as the last token of a procedure, and a module body is a list of procedures.
     * So in a valid file every stretch from just after one of those tokens up to and including the
     * next is a module in its own right (the first stretch: the declarations and the first
     * procedure). A stretch that is not a module therefore means the file is not one either. The
     * one construct that can wrap several procedures is #If ... #End If; a file with a #If in it is
     * parsed whole. If the stretch turns out to be fine on its own, the file is parsed whole too.
     */
    static Result parseWhole() {
        final int last = all.size() - 2;        // the last token before the end-of-file token
        if (exactOnly) return attempt(0, last, "parser", false);
        Result quick = attempt(0, last, "parser", true);
        if (quick.clean) return quick;
        boolean conditional = false;
        for (Token t : all) conditional |= t.getType() == vbaLexer.MACRO_IF;
        if (!conditional && quick.firstErrorToken >= 0) {
            int from = 0;
            for (int i = quick.firstErrorToken - 1; i >= 0 && from == 0; i--) {
                if (PROC_END.contains(all.get(i).getType())) from = i + 1;
            }
            int to = Math.min(next(quick.firstErrorToken, PROC_END), last);
            if (from > 0 || to < last) {
                Result one = attempt(from, to, "parser", false);
                if (!one.errors.isEmpty()) {
                    one.pass = "quick pass, then exact pass on one procedure";
                    return one;
                }
            }
        }
        return attempt(0, last, "parser", false);
    }

    static Result attempt(int from, int to, final String kind, boolean quickPass) {
        if (!quickPass) {
            // Leave out comments and blank lines that come before any code. The module rule accepts any
            // number of them in several places at once, and ANTLR's exact prediction takes time that
            // grows with the square of their number to settle that (48 of 80 seconds for a macro with
            // a 445-line header comment). What follows them is a module by itself exactly when the
            // whole run is one: module starts "WS? endOfLine* ...", and that matches any such lines.
            while (from <= to && TRIVIA.contains(all.get(from).getType())) from++;
        }
        List<Token> run = new ArrayList<>(all.subList(from, to + 1));
        if (to == all.size() - 2) run.add(all.get(all.size() - 1));     // the file's own end-of-file token
        CommonTokenStream tokens = new CommonTokenStream(new ListTokenSource(run));
        vbaParser parser = new vbaParser(tokens);
        final Sim sim = new Sim(parser, quickPass);
        parser.setInterpreter(sim);
        parser.getInterpreter().setPredictionMode(PredictionMode.LL);
        parser.removeErrorListeners();
        final Result r = new Result();
        r.pass = quickPass ? "quick pass" : "exact pass";

        if (quickPass) {
            parser.setErrorHandler(new BailErrorStrategy());            // stop at the first sign of trouble
            int stoppedAt = -1;
            try {
                parser.startRule();
                r.reachedEof = tokens.LA(1) == Token.EOF;
                r.clean = r.reachedEof && sim.deadEnd < 0;
            } catch (ParseCancellationException ex) {
                r.clean = false;
                stoppedAt = tokens.index();
            }
            if (sim.deadEnd >= 0) stoppedAt = sim.deadEnd;
            if (stoppedAt >= 0) r.firstErrorToken = Math.min(from + stoppedAt, all.size() - 1);
            return r;
        }

        final String[] antlrSaid = {null};
        final int[] firstLocal = {-1};
        parser.addErrorListener(new BaseErrorListener() {
            @Override
            public void syntaxError(Recognizer<?, ?> rec, Object sym, int line, int col, String msg, RecognitionException e) {
                if (sim.deadEnd >= 0) {
                    // After its look-ahead has run out, what ANTLR reports is where it gave up, not the cause.
                    if (antlrSaid[0] == null) antlrSaid[0] = line + ":" + (col + 1);
                    return;
                }
                // One error per run: what ANTLR reports after its first error comes from its attempt to
                // carry on, and with this grammar that is rarely a second fault in the text.
                if (!r.errors.isEmpty()) return;
                // Same wording as for the look-ahead errors below. ANTLR's own text is kept if anything is missing.
                String text = clean(msg);
                if (sym instanceof Token && rec instanceof Parser) {
                    try {
                        IntervalSet expected = e != null ? e.getExpectedTokens() : null;
                        if (expected == null) expected = ((Parser) rec).getExpectedTokens();
                        String list = describe(expected, rec.getVocabulary());
                        if (!list.isEmpty()) text = "unexpected " + show((Token) sym) + "; expected one of: " + list;
                    } catch (RuntimeException ignored) {
                        // keep ANTLR's text
                    }
                }
                if (text.length() > 400) text = text.substring(0, 397) + "...";
                r.errors.add(new Err(kind, line, col, text));
                if (firstLocal[0] < 0 && sym instanceof Token) firstLocal[0] = ((Token) sym).getTokenIndex();
            }
        });
        parser.startRule();
        r.reachedEof = tokens.LA(1) == Token.EOF;
        if (sim.deadEnd >= 0 && r.errors.isEmpty()) {
            Token t = tokens.get(sim.deadEnd);
            String msg = "unexpected " + show(t);
            if (!sim.expected.isEmpty()) msg += "; expected one of: " + sim.expected;
            if (antlrSaid[0] != null && !antlrSaid[0].startsWith(t.getLine() + ":")) msg += " [ANTLR's own message is at " + antlrSaid[0] + "]";
            r.errors.add(new Err(kind, t.getLine(), t.getCharPositionInLine(), msg));
            if (firstLocal[0] < 0 || sim.deadEnd < firstLocal[0]) firstLocal[0] = sim.deadEnd;
        }
        if (firstLocal[0] >= 0) r.firstErrorToken = Math.min(from + firstLocal[0], all.size() - 1);
        r.clean = r.errors.isEmpty() && r.reachedEof;
        return r;
    }

    /** True if all[i] is the Sub, Function or Property keyword that opens a procedure (not, say, "Declare Function"). */
    static boolean opensProcedure(int i) {
        if (!PROC_START.contains(all.get(i).getType())) return false;
        for (int k = i - 1; k >= 0; k--) {
            int type = all.get(k).getType();
            if (type == vbaLexer.WS || PROC_PREFIX.contains(type)) continue;
            return LINE_END.contains(type);
        }
        return true;
    }

    /** First position at or after i of a token of one of these types, or the end-of-file position. */
    static int next(int i, Set<Integer> types) {
        int eof = all.size() - 1;
        while (i < eof && !types.contains(all.get(i).getType())) i++;
        return i;
    }

    /**
     * Where to pick up again after an error at token err, in a run that started at token start: after
     * the End Sub, End Function or End Property that closes the procedure the error is in or, if the
     * error comes before any procedure (in the declarations), at the next line.
     */
    static int resumeAfter(int err, int start) {
        boolean inProcedure = false;
        for (int i = start; i <= err && i < all.size() - 1 && !inProcedure; i++) inProcedure = opensProcedure(i);
        return Math.min(next(err, inProcedure ? PROC_END : LINE_END) + 1, all.size() - 1);
    }

    static int run(PrintStream out) throws Exception {
        final List<Err> errors = new ArrayList<>();

        CharStream in = CharStreams.fromStream(System.in, StandardCharsets.UTF_8);
        vbaLexer lexer = new vbaLexer(in);
        lexer.removeErrorListeners();
        lexer.addErrorListener(new BaseErrorListener() {
            @Override
            public void syntaxError(Recognizer<?, ?> rec, Object sym, int line, int col, String msg, RecognitionException e) {
                // ANTLR says: token recognition error at: '<the text it could not read>'
                String text = clean(msg);
                if (text.startsWith("token recognition error at: '\"")) text = "string literal is not closed (" + text + ")";
                if (text.length() > 200) text = text.substring(0, 197) + "...";
                errors.add(new Err("lexer", line, col, text));
            }
        });
        CommonTokenStream lexed = new CommonTokenStream(lexer);
        lexed.fill();
        all = new ArrayList<>(lexed.getTokens());
        final int eof = all.size() - 1;

        TRIVIA.addAll(Arrays.asList(vbaLexer.NEWLINE, vbaLexer.WS, vbaLexer.COMMENT, vbaLexer.REMCOMMENT));
        LINE_END.addAll(Arrays.asList(vbaLexer.NEWLINE, vbaLexer.COMMENT, vbaLexer.REMCOMMENT));
        PROC_START.addAll(Arrays.asList(vbaLexer.SUB, vbaLexer.FUNCTION, vbaLexer.PROPERTY_GET, vbaLexer.PROPERTY_LET, vbaLexer.PROPERTY_SET));
        PROC_END.addAll(Arrays.asList(vbaLexer.END_SUB, vbaLexer.END_FUNCTION, vbaLexer.END_PROPERTY));
        PROC_PREFIX.addAll(Arrays.asList(vbaLexer.PRIVATE, vbaLexer.PUBLIC, vbaLexer.FRIEND, vbaLexer.GLOBAL, vbaLexer.STATIC));

        // 1. The check itself: the whole file, from the grammar's start rule.
        Result whole = parseWhole();
        errors.addAll(whole.errors);
        boolean ok = errors.isEmpty() && whole.clean && whole.reachedEof;
        int runs = 1;

        // 2. Only to list more errors once the file has failed. After an error inside a procedure the
        //    parser cannot get going again (it skips to the end of the file), so the rest of the file
        //    is gone through one procedure at a time, each parsed from the start rule on its own. A
        //    procedure gives one error at most, its first, so a second fault in the same procedure
        //    shows up only once the first is mended.
        if (whole.firstErrorToken >= 0) {
            int segStart = 0;
            for (int i = whole.firstErrorToken - 1; i >= 0 && segStart == 0; i--) {
                if (PROC_END.contains(all.get(i).getType())) segStart = i + 1;
            }
            int at = resumeAfter(whole.firstErrorToken, segStart);
            while (at < eof && errors.size() < 200) {
                int end = Math.min(next(at, PROC_END), eof - 1);
                boolean blank = true;
                for (int i = at; i <= end && blank; i++) blank = TRIVIA.contains(all.get(i).getType());
                if (blank) { at = end + 1; continue; }
                Result r = parse(at, end, "parser-more");
                runs++;
                if (r.clean || r.errors.isEmpty()) { at = end + 1; continue; }
                errors.add(r.errors.get(0));
                at = Math.max(r.firstErrorToken >= 0 ? resumeAfter(r.firstErrorToken, at) : end + 1, at + 1);
            }
        }

        out.println("STAT\ttokens\t" + all.size());
        out.println("STAT\teof_line\t" + all.get(eof).getLine());
        out.println("STAT\treached_eof\t" + (whole.reachedEof ? 1 : 0));
        out.println("STAT\tpass\t" + whole.pass);
        out.println("STAT\truns\t" + runs);
        for (Err e : errors) out.println("E\t" + e.kind + "\t" + e.line + "\t" + e.col + "\t" + e.msg);
        out.println("DONE\t" + errors.size());
        return ok ? 0 : 1;
    }

    public static void main(String[] args) throws Exception {
        final PrintStream out = new PrintStream(new FileOutputStream(FileDescriptor.out), false, "UTF-8");
        exactOnly = args.length > 0 && args[0].equals("exact");
        final int[] rc = {3};
        final Throwable[] failure = {null};
        // Deeply nested code needs a deep stack. A new thread can be given one; the main thread cannot.
        Thread t = new Thread(null, () -> {
            try { rc[0] = run(out); } catch (Throwable ex) { failure[0] = ex; }
        }, "check", 256L * 1024 * 1024);
        t.start();
        t.join();
        if (failure[0] != null) {
            out.println("FATAL\t" + clean(String.valueOf(failure[0])));
            rc[0] = 3;
        }
        out.flush();
        System.exit(rc[0]);
    }
}
'''


# ---------------------------------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------------------------------

VERBOSE = False


def note(text, always=False):
    """Progress and detail go to standard error; standard output carries only the result."""
    if always or VERBOSE:
        sys.stderr.write("check_grammar: " + text + "\n")
        sys.stderr.flush()


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def java_noise_removed(text):
    """
    What a Java tool wrote to standard error, without the lines the JVM itself adds when the
    environment sets JAVA_TOOL_OPTIONS (or _JAVA_OPTIONS, JDK_JAVA_OPTIONS): "Picked up
    JAVA_TOOL_OPTIONS: ...". Those lines are not errors. Success or failure of a Java step is
    always decided by its exit code and its standard output, never by standard error.
    """
    lines = [l for l in text.splitlines() if l.strip() and not l.startswith(("Picked up ", "NOTE: Picked up "))]
    return "\n".join(lines)


def run_tool(cmd, what, stdin_bytes=None, timeout=None, cwd=None):
    """Run a Java tool. Returns (exit code, standard output, cleaned standard error)."""
    try:
        p = subprocess.run(cmd, input=stdin_bytes, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                           timeout=timeout, cwd=cwd)
    except subprocess.TimeoutExpired:
        raise SetupProblem("%s did not finish within %d seconds" % (what, timeout))
    except OSError as e:
        raise SetupProblem("could not start %s (%s): %s" % (what, cmd[0], e))
    return p.returncode, p.stdout.decode("utf-8", "replace"), java_noise_removed(p.stderr.decode("utf-8", "replace"))


# ---------------------------------------------------------------------------------------------
# Setup: Java, downloads, parser generation, compilation. All of it is kept in the cache folder.
# ---------------------------------------------------------------------------------------------

def find_java_tool(name):
    """java or javac: from JAVA_HOME if that is set and has it, else from PATH."""
    home = os.environ.get("JAVA_HOME")
    if home:
        candidate = os.path.join(home, "bin", name)
        if os.path.isfile(candidate) and os.access(candidate, os.X_OK):
            return candidate
    return shutil.which(name)


def java_major_version(java):
    """The major version of this java (8, 11, 17, 21, ...), or None if it cannot be told."""
    code, out, err = run_tool([java, "-version"], "java -version", timeout=60)
    m = re.search(r'version "(\d+)(?:\.(\d+))?', out + "\n" + err)
    if not m:
        return None
    major = int(m.group(1))
    if major == 1 and m.group(2):       # "1.8.0_392" is Java 8
        major = int(m.group(2))
    return major


def open_url(url, timeout):
    """
    Download with Python, not with Java: urllib honours HTTPS_PROXY / NO_PROXY, and the default
    TLS context reads the CA bundle named by SSL_CERT_FILE. A sandbox whose proxy re-signs TLS
    may name its CA bundle only in REQUESTS_CA_BUNDLE or CURL_CA_BUNDLE, so those are loaded too.
    Certificate checking is never switched off.
    """
    context = ssl.create_default_context()
    for var in ("SSL_CERT_FILE", "REQUESTS_CA_BUNDLE", "CURL_CA_BUNDLE"):
        bundle = os.environ.get(var)
        if bundle and os.path.isfile(bundle):
            try:
                context.load_verify_locations(cafile=bundle)
            except (ssl.SSLError, OSError):
                pass
    opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=context))
    request = urllib.request.Request(url, headers={"User-Agent": "check_grammar.py (sldmacro)"})
    with opener.open(request, timeout=timeout) as response:
        return response.read()


def fetch(dest, urls, sha256, what):
    """
    Make sure the file dest exists with exactly this SHA-256, downloading it if need be.
    The hash is what makes this safe: an error page saved under the right name (Maven Central
    answers "429 Too Many Requests" with a short text) can never be taken for the real file.
    Returns True if it had to be downloaded.
    """
    if os.path.isfile(dest) and sha256_of(dest) == sha256:
        return False
    problems = []
    for attempt in range(3):                    # three rounds over the sources, with a pause between rounds
        if attempt:
            time.sleep(4 * attempt)
        for url in urls:
            note("downloading %s from %s" % (what, url), always=True)
            try:
                data = open_url(url, timeout=120)
                got = hashlib.sha256(data).hexdigest()
                problem = None if got == sha256 else ("got %d bytes with SHA-256 %s, expected %s" % (len(data), got, sha256))
            except urllib.error.HTTPError as e:
                problem = "HTTP %d %s" % (e.code, e.reason)
            except (urllib.error.URLError, http.client.HTTPException, OSError, ValueError) as e:
                problem = str(getattr(e, "reason", e))
            if problem:
                note("  that did not work: " + problem, always=True)
                problems.append(url + ": " + problem)
                continue
            fd, tmp = tempfile.mkstemp(prefix=".download-", dir=os.path.dirname(dest))
            with os.fdopen(fd, "wb") as f:
                f.write(data)
            os.chmod(tmp, 0o644)        # readable by other users, in case the cache folder is a shared one
            os.replace(tmp, dest)       # in one step, so a half-written file is never left under the real name
            return True
    raise SetupProblem("could not download %s (needed once; it is then kept in %s). Last tries: %s. "
                       "If these are certificate errors behind a proxy, point SSL_CERT_FILE at the proxy's CA bundle."
                       % (what, os.path.dirname(dest), "; ".join(problems[-len(urls):])))


def ensure_parser(cache):
    """
    Return (java, classpath) for running the driver. Everything missing is fetched and built:
        <cache>/antlr4-4.13.2-complete.jar
        <cache>/vba-<commit>.g4
        <cache>/build-<key>/src/      vba.g4, the generated vbaLexer.java and vbaParser.java, the driver
        <cache>/build-<key>/classes/  the compiled classes
        <cache>/build-<key>/BUILD_OK  written last
    The key is a hash of the jar, the grammar and the driver source, so changing any of them
    gives a fresh build next to the old one instead of a mix.
    """
    java = find_java_tool("java")
    if not java:
        raise SetupProblem("java was not found (not on PATH, and JAVA_HOME is unset or has no bin/java). "
                           "Install a JDK %d or newer, for example: apt-get install openjdk-21-jdk-headless" % MIN_JAVA)

    try:
        os.makedirs(cache, exist_ok=True)
        probe = tempfile.NamedTemporaryFile(dir=cache)
        probe.close()
    except OSError as e:
        raise SetupProblem("the cache folder %s cannot be created or written: %s (choose another with --cache)" % (cache, e))

    key = hashlib.sha256("\n".join(["recipe 1", ANTLR_SHA256, GRAMMAR_SHA256, DRIVER_SOURCE]).encode("utf-8")).hexdigest()[:16]
    jar = os.path.join(cache, ANTLR_JAR)
    build = os.path.join(cache, "build-" + key)
    classpath = os.pathsep.join([jar, os.path.join(build, "classes")])

    built = os.path.isfile(os.path.join(build, "BUILD_OK"))
    if built and os.path.isfile(jar) and sha256_of(jar) == ANTLR_SHA256:
        return java, classpath                         # the usual case: nothing to do

    started = time.time()
    major = java_major_version(java)
    if major is not None and major < MIN_JAVA:
        raise SetupProblem("%s is Java %d; ANTLR 4.13 needs Java %d or newer" % (java, major, MIN_JAVA))

    javac = find_java_tool("javac")
    if not built and not javac:
        raise SetupProblem("javac was not found: the first run compiles the parser and needs a full JDK, not only a "
                           "Java runtime. Install one, for example: apt-get install openjdk-21-jdk-headless")
    fetch(jar, ANTLR_URLS, ANTLR_SHA256, "the ANTLR tool (" + ANTLR_JAR + ")")
    if built:
        return java, classpath
    grammar = os.path.join(cache, "vba-" + GRAMMAR_COMMIT[:12] + ".g4")
    fetch(grammar, GRAMMAR_URLS, GRAMMAR_SHA256, "the VBA grammar (vba/vba6/vba.g4 at " + GRAMMAR_COMMIT[:12] + ")")

    # Build in a folder of its own and move it into place when it is complete, so that a run that is
    # interrupted, or two first runs at the same time, cannot leave half a build behind.
    tmp = tempfile.mkdtemp(prefix="build-tmp-", dir=cache)
    try:
        src = os.path.join(tmp, "src")
        classes = os.path.join(tmp, "classes")
        os.makedirs(src)
        os.makedirs(classes)
        shutil.copyfile(grammar, os.path.join(src, "vba.g4"))       # the generated classes are named after the file
        with open(os.path.join(src, DRIVER_CLASS + ".java"), "w", encoding="utf-8") as f:
            f.write(DRIVER_SOURCE)

        note("generating the Java parser from the grammar", always=True)
        code, out, err = run_tool([java, "-cp", jar, "org.antlr.v4.Tool", "-Dlanguage=Java", "-no-listener",
                                   "-no-visitor", "-Xexact-output-dir", "-o", src, os.path.join(src, "vba.g4")],
                                  "the ANTLR tool", timeout=600)
        generated = [os.path.join(src, n) for n in ("vbaLexer.java", "vbaParser.java")]
        if code != 0 or not all(os.path.isfile(g) for g in generated):
            raise SetupProblem("the ANTLR tool could not generate the parser (exit code %d):\n%s" % (code, (err or out).strip()))

        note("compiling the parser", always=True)
        # --release keeps the classes usable by any Java from MIN_JAVA on, whichever JDK compiled them.
        code, out, err = run_tool([javac, "--release", str(MIN_JAVA), "-encoding", "UTF-8", "-nowarn", "-cp", jar,
                                   "-d", classes] + generated + [os.path.join(src, DRIVER_CLASS + ".java")],
                                  "javac", timeout=600)
        if code != 0 or not os.path.isfile(os.path.join(classes, DRIVER_CLASS + ".class")):
            raise SetupProblem("javac could not compile the parser (exit code %d):\n%s" % (code, (err or out).strip()))

        with open(os.path.join(tmp, "BUILD_OK"), "w", encoding="utf-8") as f:
            f.write("antlr %s sha256 %s\ngrammar antlr/grammars-v4 %s vba/vba6/vba.g4 sha256 %s\n"
                    % (ANTLR_JAR, ANTLR_SHA256, GRAMMAR_COMMIT, GRAMMAR_SHA256))
        os.chmod(tmp, 0o755)            # as above: mkdtemp makes folders that only their owner can enter
        try:
            os.rename(tmp, build)
        except OSError:
            if not os.path.isfile(os.path.join(build, "BUILD_OK")):     # not simply "another run got there first"
                raise
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    note("setup done in %.1f s; kept in %s" % (time.time() - started, cache), always=True)
    return java, classpath


# ---------------------------------------------------------------------------------------------
# Reading the macro, and the one rewrite this grammar needs
# ---------------------------------------------------------------------------------------------

def read_macro(path):
    """
    The macro as text. A .bas file exported by the VBA editor is in the Windows code page; one
    written by a script is usually UTF-8. The choice only matters inside strings and comments,
    which the grammar does not look into, so the fallback is a byte-for-byte reading (Latin-1).
    """
    try:
        with open(path, "rb") as f:
            raw = f.read()
    except OSError as e:
        raise SetupProblem("cannot read %s: %s" % (path, e.strerror or e))
    if raw.startswith((b"\xff\xfe", b"\xfe\xff")):
        text = raw.decode("utf-16", "replace")
    else:
        try:
            text = raw.decode("utf-8-sig")
        except UnicodeDecodeError:
            text = raw.decode("latin-1")
    # A lone CR (old Mac line end) is a line break to the grammar but not to ANTLR's line counter.
    # Writing it as LF changes nothing for the grammar (its NEWLINE token is any run of CR and LF)
    # and keeps the reported line numbers in step with what an editor shows. CR LF is left alone.
    return re.sub(r"\r(?!\n)", "\n", text)


# Rewrite 1: a Double literal written with the type suffix, as the VBA editor writes it: 1#  ->  1.0
#
# The grammar's number tokens have no type suffix. It takes "#" as a type hint only after a name, and
# at the very end of an assignment (so "x = 1000#" parses but "x = 4# * y" and "f(0#, 0#)" do not).
#
#   1#     ->  1.0      one character longer; columns reported to the right of it are corrected
#   1.5#   ->  1.50     same length
#
# It is kept narrow so that it cannot turn wrong text into right text:
#   - only in code, never inside a string literal or a comment;
#   - the digits must start a number: the character before them is the start of the line, a blank or
#     one of ( , = + - * / \ ^ < > & : ;   (so not x1#, which is a name with a type hint, nor &H10#);
#   - after the # must come the end of the line, a blank or one of ) , + - * / \ ^ < > = & : ; '
#     (so "1#2" or "1#x", which are errors, stay as they are and are reported);
#   - a date literal such as #1/31/2026# is left alone, closing # included.
# Not rewritten: 1E3# (the editor itself writes that as 1000#) and the other suffixes on a number
# (5& 5% 5! 5@; the three real macros this was tested on use none, and & is also an operator). The
# grammar accepts those only as a whole argument or at the end of an assignment; elsewhere, as in
# "x = 5& * 2", it reports an error although VBA accepts the text.
_BEFORE_NUMBER = set(" \t(,=+-*/\\^<>&:;")
_AFTER_NUMBER = set(" \t),+-*/\\^<>=&:;'")
_DIGITS = "0123456789"
_NUMBER_HASH = re.compile(r"([0-9]+)(\.[0-9]+)?#")
_MONTH = (r"(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|"
          r"sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)")
_DATE_PART = r"(?:[0-9]+|" + _MONTH + r")"
_DATE_LITERAL = re.compile(r"#\s*" + _DATE_PART + r"(?:\s*[/,\-:. ]\s*" + _DATE_PART + r")+\s*(?:[ap]m?)?\s*#", re.I)


def rewrite_double_suffix(line):
    """
    Apply rewrite 1 to one line (without its line end). Returns (new line, inserted, count):
    inserted lists the columns, in the new line, of the characters that were added, and count is
    the number of literals rewritten.
    """
    if "#" not in line:
        return line, [], 0
    out = []            # pieces of the new line
    length = 0          # length of the new line so far
    inserted = []
    count = 0
    i, n = 0, len(line)

    def keep(piece):
        nonlocal length
        out.append(piece)
        length += len(piece)

    while i < n:
        c = line[i]
        if c == '"':                                    # a string literal: copy it whole ("" is a quote inside it)
            j = i + 1
            while True:
                j = line.find('"', j)
                if j < 0 or j + 1 >= n or line[j + 1] != '"':
                    break
                j += 2
            if j < 0:                                   # not closed: leave the rest of the line for the lexer to report
                keep(line[i:])
                break
            keep(line[i:j + 1])
            i = j + 1
        elif c == "'":                                  # a comment: the rest of the line
            keep(line[i:])
            break
        elif c == "#":
            before = line[i - 1] if i else " "
            m = _DATE_LITERAL.match(line, i) if before in _BEFORE_NUMBER else None
            if m:                                       # a date literal: copy it whole
                keep(m.group())
                i = m.end()
            else:
                keep(c)
                i += 1
        elif c in _DIGITS and (i == 0 or line[i - 1] in _BEFORE_NUMBER):
            m = _NUMBER_HASH.match(line, i)
            if m and (m.end() == n or line[m.end()] in _AFTER_NUMBER):
                if m.group(2):
                    keep(m.group(1) + m.group(2) + "0")
                else:
                    keep(m.group(1) + ".0")
                    inserted.append(length - 1)
                count += 1
                i = m.end()
            else:                                       # some other number or word: copy it whole
                j = i + 1
                while j < n and (line[j].isalnum() or line[j] in "._"):
                    j += 1
                keep(line[i:j])
                i = j
        else:
            keep(c)
            i += 1
    return "".join(out), inserted, count


def preprocess(text):
    """
    The text handed to the parser, and what is needed to report positions in the original.
    No line is added or removed, so line numbers are the same in both.
    Returns (new text, {line number: inserted columns}, number of literals rewritten).
    """
    lines = text.split("\n")
    inserted_by_line = {}
    count = 0
    for k, line in enumerate(lines):
        if "#" not in line:
            continue
        cr = "\r" if line.endswith("\r") else ""
        body = line[:-1] if cr else line
        new, inserted, rewritten = rewrite_double_suffix(body)
        if rewritten:
            lines[k] = new + cr
            count += rewritten
            if inserted:
                inserted_by_line[k + 1] = inserted
    return "\n".join(lines), inserted_by_line, count


def original_column(inserted, col):
    """A column (from 0) in a rewritten line, as a column in the original line."""
    return col - sum(1 for q in inserted if q <= col)


# With this grammar a block that is not closed shows up only where the next thing fails to fit,
# and the message there ("unexpected 'i'" on a line "Next i") does not say so. These two patterns
# pick out such lines so that a hint can be printed under the error.
_BLOCK_LINE = re.compile(r"(?i)(next|loop|wend|else|elseif|case|#else|#elseif|#end\s*if|"
                         r"end\s+(?:if|select|with|sub|function|property|type|enum))\b")
_PROCEDURE_LINE = re.compile(r"(?i)(?:(?:private|public|friend|global|static)\s+)*"
                             r"(?:sub|function|property\s+(?:get|let|set))\s+")


def hint_for(source_line, col):
    """A hint for an error at this column (from 1) of this source line, or None."""
    indent = len(source_line) - len(source_line.lstrip())
    m = _PROCEDURE_LINE.match(source_line, indent)
    if m and col <= m.end() + 1:                    # the error is at the name of the procedure or before it
        return ("a procedure starts on this line while the one above is still open: "
                "look above for a missing End Sub, End Function or End Property")
    m = _BLOCK_LINE.match(source_line, indent)
    if m and col <= m.end() + 2:                    # the error is at the block keyword or right after it
        return ("this line closes or continues a block and does not fit here: check the line just above it, then look "
                "further up for a block left unclosed (End If, Next, Loop, Wend, End With or End Select missing)")
    return None


# ---------------------------------------------------------------------------------------------
# The check
# ---------------------------------------------------------------------------------------------

def check(path, java, classpath, timeout, exact=False):
    """
    Parse the macro. Returns (line count, errors, how, source lines): errors is a list of
    (line, column, kind, message) with both numbers counted from 1, and how says in a few words
    how the verdict was reached.
    """
    text = read_macro(path)
    line_count = text.count("\n") + (1 if text and not text.endswith("\n") else 0)
    parsed_text, inserted_by_line, rewritten = preprocess(text)
    note("%d lines; %d double literals of the form 1# passed to the grammar as 1.0" % (line_count, rewritten))

    code, out, err = run_tool([java, "-cp", classpath, DRIVER_CLASS] + (["exact"] if exact else []), "the parser",
                              stdin_bytes=parsed_text.encode("utf-8"), timeout=timeout)
    stats, errors, done = {}, [], None
    for record in out.splitlines():
        field = record.split("\t")
        if field[0] == "STAT" and len(field) == 3:
            stats[field[1]] = field[2]
        elif field[0] == "E" and len(field) >= 5:
            line, col = int(field[2]), int(field[3])
            message = "\t".join(field[4:])
            if line in inserted_by_line:        # the parser saw 1.0 where the file has 1#; its message may quote that
                col = original_column(inserted_by_line[line], col)
                message += " [on this line the check read each 1# as 1.0]"
            errors.append((line, col + 1, field[1], message))
        elif field[0] == "DONE" and len(field) == 2:
            done = int(field[1])
        elif field[0] == "FATAL":
            raise SetupProblem("the parser itself failed: " + "\t".join(field[1:]))
    # Believe the result only if every part of it agrees: the exit code, the DONE record, the count
    # of errors, and the parser having stopped at the end of the input.
    consistent = (done is not None and done == len(errors) and code in (0, 1)
                  and (code == 0) == (not errors and stats.get("reached_eof") == "1"))
    if not consistent:
        raise SetupProblem("the parser did not give a usable result (exit code %d)%s"
                           % (code, ":\n" + err if err else ""))
    if not errors and code == 1:
        errors.append((line_count, 1, "parser", "the parser stopped before the end of the file"))
    errors.sort(key=lambda e: (e[0], e[1]))
    how = "%s; %s tokens; %s parser run(s)" % (stats.get("pass", "?"), stats.get("tokens", "?"), stats.get("runs", "?"))
    return line_count, errors, how, text.split("\n")


def main(argv=None):
    global VERBOSE
    ap = argparse.ArgumentParser(
        description="Check that a SOLIDWORKS VBA macro (.bas) is syntactically valid VBA, with the ANTLR 4 VBA grammar.",
        epilog="Exit code: 0 valid, 1 syntax errors, 2 the check could not be made (no Java, download failed, file unreadable).")
    ap.add_argument("macro", nargs="?", help="the .bas file to check")
    ap.add_argument("--cache", default=DEFAULT_CACHE, metavar="DIR",
                    help="where the ANTLR tool, the grammar and the compiled parser are kept (default: %(default)s)")
    ap.add_argument("--setup-only", action="store_true",
                    help="download and build what is missing, then stop (to prepare a sandbox ahead of time)")
    ap.add_argument("--exact", action="store_true",
                    help="leave out the quick pass and the one-procedure shortcut and parse the whole file with "
                         "ANTLR's exact prediction only: same verdict, several times slower; for checking the checker")
    ap.add_argument("--timeout", type=int, default=900, metavar="SECONDS",
                    help="give up on the parse after this long (default: %(default)s)")
    ap.add_argument("-v", "--verbose", action="store_true", help="say more on standard error")
    args = ap.parse_args(argv)
    VERBOSE = args.verbose
    if not args.macro and not args.setup_only:
        ap.error("give the macro file to check (or --setup-only)")
    # A source line shown under an error may hold characters the terminal's encoding lacks (the
    # locale of a sandbox is often plain ASCII). Print those as escapes rather than fail on them.
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(errors="backslashreplace")
        except (AttributeError, ValueError):
            pass

    started = time.time()
    cache = os.path.abspath(os.path.expanduser(args.cache))
    try:
        if args.setup_only:
            ensure_parser(cache)
            print("GRAMMAR SETUP OK: parser ready in %s (%.1f s)" % (cache, time.time() - started))
            return EXIT_OK
        if not os.path.isfile(args.macro):
            raise SetupProblem("no such file: " + args.macro)
        java, classpath = ensure_parser(cache)
        line_count, errors, how, source = check(args.macro, java, classpath, args.timeout, args.exact)
    except SetupProblem as problem:
        print("GRAMMAR NOT CHECKED: %s" % problem)
        return EXIT_SETUP
    except Exception as surprise:       # never let a fault of the checker look like a verdict on the macro
        print("GRAMMAR NOT CHECKED: the checker itself failed: %s: %s" % (type(surprise).__name__, surprise))
        return EXIT_SETUP

    seconds = time.time() - started
    note(how)
    if not errors:
        print("GRAMMAR OK: %s: %d lines parsed, 0 syntax errors (%.1f s)" % (args.macro, line_count, seconds))
        return EXIT_OK
    print("GRAMMAR FAIL: %s: %d lines, %d syntax error%s (%.1f s)"
          % (args.macro, line_count, len(errors), "" if len(errors) == 1 else "s", seconds))
    for line, col, kind, message in errors[:MAX_ERRORS_SHOWN]:
        print("  %d:%d: %s: %s" % (line, col, kind, message))
        if 1 <= line <= len(source):
            source_line = source[line - 1].rstrip("\r")
            shown = source_line.strip()
            if shown:
                print("      | " + (shown if len(shown) <= 140 else shown[:137] + "..."))
            hint = hint_for(source_line, col) if kind != "lexer" else None
            if hint:
                print("      hint: " + hint)
    if len(errors) > MAX_ERRORS_SHOWN:
        print("  ... and %d more" % (len(errors) - MAX_ERRORS_SHOWN))
    return EXIT_FAIL


if __name__ == "__main__":
    sys.exit(main())
