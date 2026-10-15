"""VBA that OpenSketch adds to the sldmacro engine's macro: parts imported from STEP, saving the parts, and
the assembly with its mates. sldexport.py fills the @@ placeholders and the generated data procedure.

Rules this code keeps (see vendor/sldmacro/reference/traps.md):
- every name starts with Os / gOs / OS_ so nothing hides a name of the engine (VBA is not case-sensitive);
- no line of 1023 characters or more, ASCII only, procedures well under 400 lines;
- every API call that may fail runs under On Error Resume Next and is checked, and the log says what happened.

How the macro makes sure of itself in the assembly (it cannot be run here):
- components are placed at the positions OpenSketch solved; the transform is checked with
  MathPoint.MultiplyTransform (SOLIDWORKS' own reading of the matrix) and the transposed matrix is used if
  that is the one that maps the probe point where it should go;
- each mate is tried with the alignment (and flip) OpenSketch expects first, then the others; a mate is kept
  only if SOLIDWORKS reports no error AND no component moved when the assembly rebuilt. Otherwise it is
  deleted, the components are put back, and the next reading is tried. A mate no reading fits is named in
  the log with what to add by hand.
"""

# Module-level declarations. Inserted before `Sub main()` of the engine's macro (VBA wants every module-level
# declaration before the first procedure), or after the shim's header when no part is built by the engine.
DECL = r"""
' ---- OpenSketch: STEP-imported parts, saving, the assembly and its mates
Private Const MAKE_ASSEMBLY As Boolean = @@MAKE_ASM@@        ' build the assembly and add its mates after the parts
Private Const SAVE_FOLDER As String = ""            ' where parts and assembly are saved; "" = Documents\OpenSketch\@@NAME@@
Private Const STEP_FOLDER As String = ""            ' where the STEP files are; "" = this macro's folder or its steps subfolder
Private Const OS_NAME As String = "@@NAME@@"
Private Const OS_ASM_TITLE As String = "@@ASM_TITLE@@"
Private Const OS_IS_ASM As Boolean = @@IS_ASM@@
Private Const OS_NP As Long = @@NP@@                ' parts
Private Const OS_NC As Long = @@NC@@                ' components
Private Const OS_NM As Long = @@NM@@                ' mates
Private Const OS_NE As Long = @@NE@@                ' mate entities
Private Const OS_NA As Long = @@NA@@                ' reference axes to add to parts
Private Const OS_TOL_T As Double = 0.00002          ' m: a component has moved if its origin moved more than this
Private Const OS_TOL_R As Double = 0.0001           ' the same for any entry of its rotation
Dim gOsKey(1 To OS_NP) As String
Dim gOsTitle(1 To OS_NP) As String
Dim gOsStep(1 To OS_NP) As String                   ' STEP file of a part imported rather than built ("" = built)
Dim gOsWhy(1 To OS_NP) As String                    ' why it is imported
Dim gOsDoc(1 To OS_NP) As Object                    ' the open part document
Dim gOsPath(1 To OS_NP) As String                   ' where it was saved
Dim gOsCPart(1 To OS_NC) As Long
Dim gOsCName(1 To OS_NC) As String
Dim gOsCFixed(1 To OS_NC) As Boolean
Dim gOsXf(1 To OS_NC, 0 To 11) As Double           ' rotation (9) and translation (3, m): where OpenSketch puts it
Dim gOsProbe(1 To OS_NC, 0 To 5) As Double         ' a point in the part (m) and where it must land in the assembly (m)
Dim gOsComp(1 To OS_NC) As Object
Dim gOsMType(1 To OS_NM) As Long
Dim gOsMWhat(1 To OS_NM) As String
Dim gOsMTry(1 To OS_NM) As String                   ' readings to try, in order: A aligned, N anti-aligned, C closest; F flipped
Dim gOsMNum(1 To OS_NM, 0 To 5) As Double          ' distance, max, min (m); angle, max, min (rad)
Dim gOsMFirst(1 To OS_NM) As Long                   ' first entity of the mate
Dim gOsMCount(1 To OS_NM) As Long
Dim gOsEComp(1 To OS_NE) As Long                    ' 0 = the assembly itself
Dim gOsEKind(1 To OS_NE) As String                  ' F face, P part plane, G assembly plane, X part axis, K component
Dim gOsENum(1 To OS_NE) As Long                     ' plane number (1 Front, 2 Top, 3 Right) or axis number
Dim gOsEPt(1 To OS_NE, 0 To 5) As Double           ' a point on it in the part (mm), and in the assembly (mm)
Dim gOsAPart(1 To OS_NA) As Long
Dim gOsAKind(1 To OS_NA) As String                  ' P where two standard planes meet, E along a straight edge
Dim gOsAPl(1 To OS_NA, 0 To 1) As Long
Dim gOsAPt(1 To OS_NA, 0 To 2) As Double           ' E: a point on the edge (mm, part)
Dim gOsAName(1 To OS_NA) As String
Dim gOsAsmDoc As Object
Dim gOsAsm As Object
Dim gOsMath As Object
Dim gOsMade As Long
Dim gOsAsIs As Long
"""

CODE = r"""
' ---------------------------------------------------------------------------------------------
' OpenSketch: parts imported from STEP, saving, the assembly and its mates
' ---------------------------------------------------------------------------------------------

'@@OSDATA@@

' Called after the engine built a part: keep its document for the assembly.
Private Sub OsKeep(partNo As Long, i As Long)
    If gModel Is Nothing Then Exit Sub
    If gPartNo <> partNo Then Exit Sub
    Set gOsDoc(i) = gModel
End Sub

' Everything a previous run in the same SOLIDWORKS session left behind (module variables live on).
Private Sub OsReset()
    Dim i As Long
    For i = 1 To OS_NP
        Set gOsDoc(i) = Nothing
        gOsPath(i) = ""
    Next i
    For i = 1 To OS_NA
        gOsAName(i) = ""
    Next i
    Set gOsAsmDoc = Nothing
    Set gOsAsm = Nothing
    gOsMade = 0
    gOsAsIs = 0
End Sub

Private Sub OsAfterParts()
    gWhere = "reading the OpenSketch data"
    OsData
    OsImportSteps
    If OS_IS_ASM Then
        If MAKE_ASSEMBLY Then
            OsAssembly
        Else
            LogLine "assembly: left out (MAKE_ASSEMBLY is False)"
        End If
    End If
End Sub

' ------------------------------------------------------------------------------- STEP imports

Private Function OsStepPath(fileName As String) As String
    Dim dirs(0 To 2) As String
    Dim k As Long
    Dim here As String
    On Error Resume Next
    here = swApp.GetCurrentMacroPathFolder
    Err.Clear
    If STEP_FOLDER <> "" Then
        dirs(0) = STEP_FOLDER
    Else
        dirs(0) = here
        dirs(1) = here & "\steps"
        dirs(2) = Environ$("USERPROFILE") & "\Downloads\" & OS_NAME & "\steps"
    End If
    For k = 0 To 2
        If dirs(k) <> "" Then
            If Dir$(dirs(k) & "\" & fileName) <> "" Then
                OsStepPath = dirs(k) & "\" & fileName
                Exit For
            End If
        End If
        Err.Clear
    Next k
    Err.Clear
    On Error GoTo 0
End Function

Private Sub OsImportSteps()
    Dim i As Long
    Dim p As String
    Dim impData As Object
    Dim doc As Object
    Dim errs As Long
    For i = 1 To OS_NP
        If gOsStep(i) <> "" And WantPart(gOsKey(i)) Then
            gWhere = "importing " & gOsStep(i)
            LogLine ""
            LogLine "=== " & gOsTitle(i) & " (imported from STEP: " & gOsWhy(i) & ")"
            p = OsStepPath(gOsStep(i))
            If p = "" Then
                LogLine "STEP file not found: " & gOsStep(i)
                gReport = gReport & gOsTitle(i) & ": " & gOsStep(i) & " not found. Save this macro in the folder you unzipped (next to steps\), or set STEP_FOLDER." & vbCrLf
            Else
                Set doc = Nothing
                On Error Resume Next
                Set impData = swApp.GetImportFileData(p)
                Set doc = swApp.LoadFile4(p, "r", impData, errs)
                If doc Is Nothing Then
                    Err.Clear
                    Set doc = swApp.LoadFile4(p, "", Nothing, errs)
                End If
                Err.Clear
                On Error GoTo 0
                If doc Is Nothing Then
                    LogLine "could not import " & p & " (error " & errs & ")"
                    gReport = gReport & gOsTitle(i) & ": the STEP import failed (error " & errs & ")." & vbCrLf
                Else
                    Set gOsDoc(i) = doc
                    LogLine "imported " & p
                    gReport = gReport & gOsTitle(i) & ": imported from STEP (" & gOsWhy(i) & ")." & vbCrLf
                End If
            End If
        End If
    Next i
End Sub

' ------------------------------------------------------------------------------- the assembly

Private Function OsFolder() As String
    Dim f As String
    f = SAVE_FOLDER
    On Error Resume Next
    If f = "" Then
        f = Environ$("USERPROFILE") & "\Documents\OpenSketch"
        MkDir f
        Err.Clear
        f = f & "\" & OS_NAME
    End If
    MkDir f
    Err.Clear
    On Error GoTo 0
    OsFolder = f
End Function

' A file name that is not taken yet: Name.ext, Name_2.ext, ...
Private Function OsFree(folder As String, stem As String, ext As String) As String
    Dim k As Long
    Dim p As String
    p = folder & "\" & stem & ext
    k = 1
    On Error Resume Next
    Do While Dir$(p) <> "" And k < 99
        k = k + 1
        p = folder & "\" & stem & "_" & k & ext
    Loop
    Err.Clear
    On Error GoTo 0
    OsFree = p
End Function

Private Function OsSaveDoc(doc As Object, p As String) As Boolean
    Dim errs As Long
    Dim warns As Long
    Dim ok As Boolean
    On Error Resume Next
    ok = doc.Extension.SaveAs(p, 0, 1, Nothing, errs, warns)       ' current version, silent
    Err.Clear
    On Error GoTo 0
    If Not ok Then LogLine "could not save " & p & " (error " & errs & ")"
    OsSaveDoc = ok
End Function

Private Sub OsAssembly()
    Dim i As Long
    Dim m As Long
    Dim folder As String
    Dim tmpl As String
    Dim missing As String
    Dim kept As Long
    Dim apath As String

    LogLine ""
    LogLine "=== Assembly " & OS_ASM_TITLE
    For i = 1 To OS_NP
        If gOsDoc(i) Is Nothing Then missing = missing & " " & gOsTitle(i) & ";"
    Next i
    If missing <> "" Then
        LogLine "not built: these parts are missing:" & missing
        gReport = gReport & "Assembly not built: parts missing:" & missing & " (ONLY set, or a part failed)." & vbCrLf
        Exit Sub
    End If
    gWhere = "adding reference axes to the parts"
    OsAxes
    gWhere = "saving the parts"
    folder = OsFolder()
    For i = 1 To OS_NP
        gOsPath(i) = OsFree(folder, OsFileName(gOsTitle(i)), ".SLDPRT")
        If Not OsSaveDoc(gOsDoc(i), gOsPath(i)) Then
            gReport = gReport & "Assembly not built: could not save " & gOsPath(i) & "." & vbCrLf
            Exit Sub
        End If
        LogLine "saved " & gOsPath(i)
    Next i
    gWhere = "opening a new assembly"
    On Error Resume Next
    tmpl = swApp.GetUserPreferenceStringValue(swUserPreferenceStringValue_e.swDefaultTemplateAssembly)
    Set gOsAsmDoc = swApp.NewDocument(tmpl, 0, 0, 0)
    Set gOsAsm = gOsAsmDoc
    Set gOsMath = swApp.GetMathUtility
    Err.Clear
    On Error GoTo 0
    If gOsAsmDoc Is Nothing Then
        gReport = gReport & "Assembly not built: no new assembly (check the default assembly template)." & vbCrLf
        Exit Sub
    End If
    gWhere = "inserting the components"
    For i = 1 To OS_NC
        If Not OsInsert(i) Then
            gReport = gReport & "Assembly stopped: could not insert " & gOsCName(i) & "." & vbCrLf
            Exit Sub
        End If
    Next i
    OsRebuild
    For i = 1 To OS_NC
        OsFix i
    Next i
    OsRebuild
    If OsMoved("") Then LogLine "warning: components are not where they were put before any mate"
    gWhere = "adding the mates"
    For m = 1 To OS_NM
        gWhere = "adding mate " & m & " (" & gOsMWhat(m) & ")"
        If OsMate(m) Then kept = kept + 1
    Next m
    OsRebuild
    On Error Resume Next
    gOsAsmDoc.ShowNamedView2 "", 7
    gOsAsmDoc.ViewZoomtofit2
    Err.Clear
    On Error GoTo 0
    apath = OsFree(folder, OsFileName(OS_ASM_TITLE), ".SLDASM")
    If OsSaveDoc(gOsAsmDoc, apath) Then LogLine "saved " & apath
    gReport = gReport & "Assembly " & OS_ASM_TITLE & ": " & OS_NC & " components, " & kept & " of " & OS_NM & _
              " mates made as in OpenSketch" & IIf(gOsAsIs > 0, " (" & gOsAsIs & " kept although SOLIDWORKS moved a component)", "") & _
              ". Saved in " & folder & "." & vbCrLf
    If kept < OS_NM Then gReport = gReport & "   Mates to add by hand are listed in the log." & vbCrLf
End Sub

Private Function OsFileName(s As String) As String
    Dim k As Long
    Dim c As String
    Dim out As String
    For k = 1 To Len(s)
        c = Mid$(s, k, 1)
        If InStr("\/:*?""<>|", c) > 0 Then c = "_"
        out = out & c
    Next k
    If Trim$(out) = "" Then out = "Part"
    OsFileName = Trim$(out)
End Function

Private Sub OsRebuild()
    On Error Resume Next
    gOsAsmDoc.EditRebuild3
    Err.Clear
    On Error GoTo 0
End Sub

' Reference axes a mate needs where the part has no round face on that axis: where two of its standard
' planes meet, or along a straight edge (Insert > Reference Geometry > Axis).
Private Sub OsAxes()
    Dim k As Long
    Dim doc As Object
    Dim pa As Object
    Dim pb As Object
    Dim edg As Object
    Dim sd As Object
    Dim f As Object
    For k = 1 To OS_NA
        Set doc = gOsDoc(gOsAPart(k))
        On Error Resume Next
        doc.ClearSelection2 True
        If gOsAKind(k) = "E" Then
            Set edg = OsFindEdge(doc, gOsAPt(k, 0), gOsAPt(k, 1), gOsAPt(k, 2))
            Set sd = doc.SelectionManager.CreateSelectData
            sd.Mark = 0
            If Not edg Is Nothing Then edg.Select4 False, sd
        Else
            Set pa = PlaneOf(doc, gOsAPl(k, 0))
            Set pb = PlaneOf(doc, gOsAPl(k, 1))
            pa.Select2 False, 0
            pb.Select2 True, 0
        End If
        Set f = Nothing
        If doc.InsertAxis2(True) Then Set f = doc.Extension.GetLastFeatureAdded
        If Not f Is Nothing Then gOsAName(k) = f.Name
        doc.ClearSelection2 True
        Err.Clear
        On Error GoTo 0
        If gOsAName(k) = "" Then
            LogLine gOsTitle(gOsAPart(k)) & ": could not add a reference axis (" & IIf(gOsAKind(k) = "E", "along an edge", "where two planes meet") & ")"
        Else
            LogLine gOsTitle(gOsAPart(k)) & ": added " & gOsAName(k) & IIf(gOsAKind(k) = "E", " along an edge", " where two standard planes meet") & " (for a mate)"
        End If
    Next k
End Sub

' The straight edge of a part document that passes through a point (mm).
Private Function OsFindEdge(doc As Object, x As Double, y As Double, z As Double) As Object
    Dim v As Variant
    Dim es As Variant
    Dim cp As Variant
    Dim b As Long
    Dim j As Long
    Dim d As Double
    On Error Resume Next
    v = doc.GetBodies2(0, False)
    If Not IsEmpty(v) Then
        For b = LBound(v) To UBound(v)
            es = v(b).GetEdges
            If Not IsEmpty(es) Then
                For j = LBound(es) To UBound(es)
                    cp = Empty
                    cp = es(j).GetClosestPointOn(ToM(x), ToM(y), ToM(z))
                    If Not IsEmpty(cp) Then
                        d = Sqr((cp(0) - ToM(x)) ^ 2 + (cp(1) - ToM(y)) ^ 2 + (cp(2) - ToM(z)) ^ 2)
                        If d <= 0.00005 Then
                            Set OsFindEdge = es(j)
                            Exit For
                        End If
                    End If
                    Err.Clear
                Next j
            End If
            If Not OsFindEdge Is Nothing Then Exit For
        Next b
    End If
    Err.Clear
    On Error GoTo 0
End Function

' The transform of component i as SOLIDWORKS reads it. tr = True: the rotation transposed.
Private Function OsXfObj(i As Long, tr As Boolean) As Object
    Dim a(0 To 15) As Double
    Dim r As Long
    Dim c As Long
    For r = 0 To 2
        For c = 0 To 2
            If tr Then
                a(r * 3 + c) = gOsXf(i, c * 3 + r)
            Else
                a(r * 3 + c) = gOsXf(i, r * 3 + c)
            End If
        Next c
    Next r
    a(9) = gOsXf(i, 9)
    a(10) = gOsXf(i, 10)
    a(11) = gOsXf(i, 11)
    a(12) = 1#
    On Error Resume Next
    Set OsXfObj = gOsMath.CreateTransform(a)
    Err.Clear
    On Error GoTo 0
End Function

' How far the probe point of component i lands from where it should, with that transform (m).
Private Function OsProbeOff(i As Long, xf As Object) As Double
    Dim p(0 To 2) As Double
    Dim mp As Object
    Dim q As Variant
    OsProbeOff = 1E+30
    If xf Is Nothing Then Exit Function
    p(0) = gOsProbe(i, 0)
    p(1) = gOsProbe(i, 1)
    p(2) = gOsProbe(i, 2)
    On Error Resume Next
    Set mp = gOsMath.CreatePoint(p)
    q = mp.MultiplyTransform(xf).ArrayData
    If Not IsEmpty(q) Then OsProbeOff = Sqr((q(0) - gOsProbe(i, 3)) ^ 2 + (q(1) - gOsProbe(i, 4)) ^ 2 + (q(2) - gOsProbe(i, 5)) ^ 2)
    Err.Clear
    On Error GoTo 0
End Function

Private Function OsInsert(i As Long) As Boolean
    Dim c As Object
    Dim xf As Object
    Dim off1 As Double
    Dim off2 As Double
    On Error Resume Next
    Set c = gOsAsm.AddComponent5(gOsPath(gOsCPart(i)), 0, "", False, "", 0#, 0#, 0#)
    Err.Clear
    On Error GoTo 0
    If c Is Nothing Then
        LogLine "could not insert " & gOsPath(gOsCPart(i))
        Exit Function
    End If
    Set gOsComp(i) = c
    OsPlace i
    off1 = OsProbeOff(i, OsXfObj(i, False))
    off2 = OsProbeOff(i, OsXfObj(i, True))
    LogLine "inserted " & gOsCName(i) & " as " & OsCompName(i) & IIf(gOsCFixed(i), " (fixed)", " (floating)") & _
            "; probe point off by " & Format$(off1 * 1000#, "0.0000") & " mm (transposed: " & Format$(off2 * 1000#, "0.0000") & " mm)"
    OsInsert = True
End Function

Private Function OsCompName(i As Long) As String
    On Error Resume Next
    OsCompName = gOsComp(i).Name2
    Err.Clear
    On Error GoTo 0
End Function

' Puts component i where OpenSketch has it, reading the matrix the way SOLIDWORKS does.
Private Sub OsPlace(i As Long)
    Dim xf As Object
    Dim xt As Object
    Set xf = OsXfObj(i, False)
    Set xt = OsXfObj(i, True)
    If OsProbeOff(i, xt) < OsProbeOff(i, xf) Then Set xf = xt
    On Error Resume Next
    gOsComp(i).Transform2 = xf
    Err.Clear
    On Error GoTo 0
End Sub

Private Sub OsFix(i As Long)
    On Error Resume Next
    gOsAsmDoc.ClearSelection2 True
    gOsComp(i).Select4 False, Nothing, False
    If gOsCFixed(i) Then
        gOsAsm.FixComponent
    Else
        gOsAsm.UnfixComponent
    End If
    gOsAsmDoc.ClearSelection2 True
    Err.Clear
    On Error GoTo 0
End Sub

' True if a component is not where OpenSketch has it. who gets the names of those that moved.
Private Function OsMoved(ByRef who As String) As Boolean
    Dim i As Long
    Dim k As Long
    Dim v As Variant
    Dim xf As Object
    Dim off As Double
    who = ""
    For i = 1 To OS_NC
        v = Empty
        On Error Resume Next
        Set xf = gOsComp(i).Transform2
        off = OsProbeOff(i, xf)
        Err.Clear
        On Error GoTo 0
        If off > OS_TOL_T Then
            who = who & " " & gOsCName(i)
        Else
            ' a second point, along each axis, so that a turn about the probe point is seen too
            For k = 0 To 2
                If OsAxisOff(i, k, xf) > OS_TOL_R Then
                    who = who & " " & gOsCName(i)
                    Exit For
                End If
            Next k
        End If
    Next i
    OsMoved = (who <> "")
End Function

' How far the direction of part axis k of component i is from where OpenSketch has it.
Private Function OsAxisOff(i As Long, k As Long, xf As Object) As Double
    Dim d(0 To 2) As Double
    Dim mv As Object
    Dim q As Variant
    OsAxisOff = 1E+30
    If xf Is Nothing Then Exit Function
    d(k) = 1#
    On Error Resume Next
    Set mv = gOsMath.CreateVector(d)
    q = mv.MultiplyTransform(xf).ArrayData
    If Not IsEmpty(q) Then
        OsAxisOff = Abs(q(0) - gOsXf(i, k)) + Abs(q(1) - gOsXf(i, 3 + k)) + Abs(q(2) - gOsXf(i, 6 + k))
    End If
    Err.Clear
    On Error GoTo 0
End Function

Private Sub OsPutBack()
    Dim i As Long
    For i = 1 To OS_NC
        OsPlace i
    Next i
    OsRebuild
End Sub

' ------------------------------------------------------------------------------- mates

' Selects entity e of a mate (mark 1, appended). True if it is selected.
Private Function OsPick(e As Long) As Boolean
    Dim c As Object
    Dim doc As Object
    Dim ent As Object
    Dim obj As Object
    Dim sd As Object
    Dim nm As String
    Dim before As Long
    Dim after As Long
    Dim ok As Boolean
    On Error Resume Next
    before = gOsAsmDoc.SelectionManager.GetSelectedObjectCount2(-1)
    Err.Clear
    If gOsEComp(e) > 0 Then
        Set c = gOsComp(gOsEComp(e))
        Set doc = gOsDoc(gOsCPart(gOsEComp(e)))
    End If
    Set sd = gOsAsmDoc.SelectionManager.CreateSelectData
    sd.Mark = 1
    Select Case gOsEKind(e)
        Case "F"
            Set ent = OsFindFace(doc, gOsEPt(e, 0), gOsEPt(e, 1), gOsEPt(e, 2))
            If Not ent Is Nothing Then
                Set obj = c.GetCorresponding(ent)
                If obj Is Nothing Then Set obj = c.GetCorrespondingEntity(ent)
                Err.Clear
                If Not obj Is Nothing Then ok = obj.Select4(True, sd)
            End If
            Err.Clear
            If Not ok Then
                Set obj = OsCompFace(c, e)
                If Not obj Is Nothing Then ok = obj.Select4(True, sd)
            End If
            Err.Clear
            If Not ok Then
                ok = gOsAsmDoc.Extension.SelectByID2("", "FACE", ToM(gOsEPt(e, 3)), ToM(gOsEPt(e, 4)), ToM(gOsEPt(e, 5)), True, 1, Nothing, 0)
                If ok Then ok = OsLastIsOf(c)
            End If
        Case "P"
            nm = NameOf(PlaneOf(doc, gOsENum(e)))
            Set obj = c.FeatureByName(nm)
            If Not obj Is Nothing Then ok = obj.Select2(True, 1)
            Err.Clear
            If Not ok Then ok = gOsAsmDoc.Extension.SelectByID2(nm & "@" & c.Name2 & "@" & gOsAsmDoc.GetTitle, "PLANE", 0, 0, 0, True, 1, Nothing, 0)
        Case "X"
            nm = gOsAName(gOsENum(e))
            Set obj = c.FeatureByName(nm)
            If Not obj Is Nothing Then ok = obj.Select2(True, 1)
            Err.Clear
            If Not ok Then ok = gOsAsmDoc.Extension.SelectByID2(nm & "@" & c.Name2 & "@" & gOsAsmDoc.GetTitle, "AXIS", 0, 0, 0, True, 1, Nothing, 0)
        Case "G"
            Set obj = PlaneOf(gOsAsmDoc, gOsENum(e))
            If Not obj Is Nothing Then ok = obj.Select2(True, 1)
        Case "K"
            ok = c.Select4(True, sd, False)
    End Select
    Err.Clear
    after = gOsAsmDoc.SelectionManager.GetSelectedObjectCount2(-1)
    Err.Clear
    On Error GoTo 0
    OsPick = ok And (after > before)
End Function

' The face of component c (in the assembly) that passes through the point of entity e: from the
' component's own bodies, at the point in the assembly or, if its bodies are in part space, in the part.
Private Function OsCompFace(c As Object, e As Long) As Object
    Dim v As Variant
    Dim info As Variant
    Dim fs As Variant
    Dim cp As Variant
    Dim b As Long
    Dim j As Long
    Dim s As Long
    Dim d As Double
    On Error Resume Next
    v = c.GetBodies3(0, info)
    If Err.Number <> 0 Or IsEmpty(v) Then
        Err.Clear
        On Error GoTo 0
        Exit Function
    End If
    For s = 0 To 1
        For b = LBound(v) To UBound(v)
            fs = v(b).GetFaces
            If Not IsEmpty(fs) Then
                For j = LBound(fs) To UBound(fs)
                    cp = Empty
                    cp = fs(j).GetClosestPointOn(ToM(gOsEPt(e, 3 - 3 * s)), ToM(gOsEPt(e, 4 - 3 * s)), ToM(gOsEPt(e, 5 - 3 * s)))
                    If Not IsEmpty(cp) Then
                        d = Sqr((cp(0) - ToM(gOsEPt(e, 3 - 3 * s))) ^ 2 + (cp(1) - ToM(gOsEPt(e, 4 - 3 * s))) ^ 2 + (cp(2) - ToM(gOsEPt(e, 5 - 3 * s))) ^ 2)
                        If d <= 0.00005 Then
                            Set OsCompFace = fs(j)
                            Err.Clear
                            On Error GoTo 0
                            Exit Function
                        End If
                    End If
                    Err.Clear
                Next j
            End If
        Next b
    Next s
    Err.Clear
    On Error GoTo 0
End Function

' True if the last thing selected belongs to component c; if not, it is deselected.
Private Function OsLastIsOf(c As Object) As Boolean
    Dim sm As Object
    Dim n As Long
    Dim oc As Object
    On Error Resume Next
    Set sm = gOsAsmDoc.SelectionManager
    n = sm.GetSelectedObjectCount2(-1)
    Set oc = sm.GetSelectedObjectsComponent4(n, -1)
    If Not oc Is Nothing Then OsLastIsOf = (oc.Name2 = c.Name2)
    If Not OsLastIsOf Then sm.DeSelect2 n, -1
    Err.Clear
    On Error GoTo 0
End Function

' The face of a part document that passes through a point (mm), found by GetClosestPointOn.
Private Function OsFindFace(doc As Object, x As Double, y As Double, z As Double) As Object
    Dim v As Variant
    Dim fs As Variant
    Dim cp As Variant
    Dim b As Long
    Dim j As Long
    Dim d As Double
    Dim best As Double
    If doc Is Nothing Then Exit Function
    best = 1E+30
    On Error Resume Next
    v = doc.GetBodies2(0, False)
    If Not IsEmpty(v) Then
        For b = LBound(v) To UBound(v)
            fs = v(b).GetFaces
            If Not IsEmpty(fs) Then
                For j = LBound(fs) To UBound(fs)
                    cp = Empty
                    cp = fs(j).GetClosestPointOn(ToM(x), ToM(y), ToM(z))
                    If Not IsEmpty(cp) Then
                        d = Sqr((cp(0) - ToM(x)) ^ 2 + (cp(1) - ToM(y)) ^ 2 + (cp(2) - ToM(z)) ^ 2)
                        If d < best Then
                            best = d
                            If d <= 0.00005 Then Set OsFindFace = fs(j)
                        End If
                    End If
                    Err.Clear
                Next j
            End If
        Next b
    End If
    Err.Clear
    On Error GoTo 0
End Function

Private Function OsSelectAll(m As Long) As Boolean
    Dim e As Long
    On Error Resume Next
    gOsAsmDoc.ClearSelection2 True
    Err.Clear
    On Error GoTo 0
    For e = gOsMFirst(m) To gOsMFirst(m) + gOsMCount(m) - 1
        If Not OsPick(e) Then
            LogLine "   could not select entity " & (e - gOsMFirst(m) + 1) & " (" & gOsEKind(e) & ")"
            Exit Function
        End If
    Next e
    OsSelectAll = True
End Function

Private Sub OsDeleteLast(before As String)
    Dim f As Object
    On Error Resume Next
    Set f = gOsAsmDoc.Extension.GetLastFeatureAdded
    If Not f Is Nothing Then
        If f.Name <> before Then
            gOsAsmDoc.ClearSelection2 True
            f.Select2 False, 0
            gOsAsmDoc.EditDelete
        End If
    End If
    gOsAsmDoc.ClearSelection2 True
    Err.Clear
    On Error GoTo 0
End Sub

Private Function OsLastName() As String
    Dim f As Object
    On Error Resume Next
    Set f = gOsAsmDoc.Extension.GetLastFeatureAdded
    If Not f Is Nothing Then OsLastName = f.Name
    Err.Clear
    On Error GoTo 0
End Function

' Adds mate m. Tries each reading in gOsMTry until one is made without error and moves nothing.
Private Function OsMate(m As Long) As Boolean
    Dim k As Long
    Dim rd As String
    Dim al As Long
    Dim fl As Boolean
    Dim mt As Object
    Dim st As Long
    Dim who As String
    Dim before As String
    Dim tried As String
    Dim readings As Variant

    readings = Split(gOsMTry(m) & "," & gOsMTry(m), ",")
    For k = LBound(readings) To UBound(readings)
        rd = readings(k)
        ' the second round only repeats readings SOLIDWORKS refused (one that moved something stays out)
        If k > UBound(readings) \ 2 And InStr(tried, " " & rd & ": moved") > 0 Then GoTo nextReading
        al = swMateAlign_e.swMateAlignCLOSEST
        If Left$(rd, 1) = "A" Then al = swMateAlign_e.swMateAlignALIGNED
        If Left$(rd, 1) = "N" Then al = swMateAlign_e.swMateAlignANTI_ALIGNED
        fl = (InStr(rd, "F") > 0)
        If Not OsSelectAll(m) Then
            LogLine "mate " & m & " (" & gOsMWhat(m) & "): NOT MADE, its faces or planes could not be selected. Add it by hand."
            Exit Function
        End If
        before = OsLastName()
        st = 0
        Set mt = Nothing
        On Error Resume Next
        Set mt = gOsAsm.AddMate5(gOsMType(m), al, fl, gOsMNum(m, 0), gOsMNum(m, 1), gOsMNum(m, 2), 1#, 1#, _
                                 gOsMNum(m, 3), gOsMNum(m, 4), gOsMNum(m, 5), False, False, 0, st)
        Err.Clear
        gOsAsmDoc.ClearSelection2 True
        Err.Clear
        On Error GoTo 0
        If mt Is Nothing Or st <> swAddMateError_e.swAddMateError_NoError Then
            tried = tried & " " & rd & ": error " & st & ";"
            If Not mt Is Nothing Then OsDeleteLast before
            OsPutBack
        Else
            OsRebuild
            If OsMoved(who) Then
                tried = tried & " " & rd & ": moved" & who & ";"
                OsDeleteLast before
                OsPutBack
            Else
                LogLine "mate " & m & " (" & gOsMWhat(m) & "): made as " & OsLastName() & ", reading " & rd & IIf(tried <> "", " (before:" & tried & ")", "")
                OsMate = True
                Exit Function
            End If
        End If
nextReading:
    Next k
    LogLine "mate " & m & " (" & gOsMWhat(m) & "): NOT MADE (" & tried & " ). Add it by hand."
    gReport = gReport & "   Mate not made: " & gOsMWhat(m) & "." & vbCrLf
End Function
"""

# A minimal frame for a macro in which the engine builds no part (every part is imported from STEP).
SHIM_HEAD = r"""'@@TITLE@@
' ---------------------------------------------------------------------------------------------
' How to run (SOLIDWORKS 2022)
'   Unzip the download. Tools > Macro > New..., save the new macro in the unzipped folder (next to
'   steps\), then replace everything in the editor with this text and press F5.
'   Parts are imported from the STEP files in steps\. With an assembly, the parts and the assembly
'   are saved in Documents\OpenSketch\@@NAME@@ and the mates are added one by one; each mate is kept
'   only if it holds without moving anything. A log is written to your TEMP folder (@@LOGNAME@@).
'
'@@PARTS@@
' ---------------------------------------------------------------------------------------------
Option Explicit

Private Const ONLY As String = ""                   ' the key of one part to import only that one
Private Const LOG_NAME As String = "@@LOGNAME@@"

Dim swApp As SldWorks.SldWorks
Dim gModel As SldWorks.ModelDoc2
Dim gPartNo As Long
Dim gLog As String
Dim gReport As String
Dim gWhere As String
"""

SHIM_CODE = r"""
Sub main()
    Dim logPath As String
    On Error GoTo crashed
    gWhere = "starting"
    gLog = ""
    gReport = ""
    Set swApp = Application.SldWorks
    LogLine "@@LOGHEAD@@. SOLIDWORKS " & swApp.RevisionNumber
    OsReset
    OsAfterParts
finish:
    On Error Resume Next
    LogLine ""
    LogLine gReport
    logPath = Environ$("TEMP") & "\" & LOG_NAME
    SaveLog logPath
    MsgBox gReport & vbCrLf & "Log: " & logPath, vbInformation, "@@LOGHEAD@@"
    Exit Sub
crashed:
    gReport = gReport & "STOPPED by run-time error " & Err.Number & ": " & Err.Description & vbCrLf & _
              "while " & gWhere & "." & vbCrLf & "Please send the log file." & vbCrLf
    Resume finish
End Sub

Private Function WantPart(key As String) As Boolean
    WantPart = (ONLY = "" Or LCase$(ONLY) = LCase$(key))
End Function

Private Function NameOf(f As Object) As String
    NameOf = "(no name)"
    If f Is Nothing Then Exit Function
    On Error Resume Next
    NameOf = f.Name
    Err.Clear
    On Error GoTo 0
End Function

' The nth default plane: 1 Front, 2 Top, 3 Right, by position in the tree.
Private Function PlaneOf(owner As Object, which As Long) As Object
    Dim f As Object
    Dim n As Long
    Dim guard As Long
    On Error Resume Next
    Set f = owner.FirstFeature
    Do While Not f Is Nothing
        If f.GetTypeName2 = "RefPlane" Then
            n = n + 1
            If n = which Then
                Set PlaneOf = f
                Exit Do
            End If
        End If
        Set f = f.GetNextFeature
        guard = guard + 1
        If Err.Number <> 0 Or guard > 100000 Then Exit Do
    Loop
    Err.Clear
    On Error GoTo 0
End Function

Private Function ToM(mm As Double) As Double
    ToM = mm / 1000#
End Function

Private Sub LogLine(msg As String)
    gLog = gLog & msg & vbCrLf
End Sub

Private Sub SaveLog(filePath As String)
    Dim n As Integer
    On Error Resume Next
    n = FreeFile
    Open filePath For Output As #n
    Print #n, gLog
    Close #n
    Err.Clear
    On Error GoTo 0
End Sub
"""
