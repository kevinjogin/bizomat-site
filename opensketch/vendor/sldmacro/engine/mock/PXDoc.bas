Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' Stand-in for a SOLIDWORKS part document, and for its Extension, SketchManager, FeatureManager,
' SelectionManager and a sketch's RelationManager (all the same object here).
'
' It does no solid geometry of its own:
'   - a sketch is recognised by its outline (PxStepOf); a boss or cut made from it is read with this stand-in's
'     own idea of what Dir, Ddir1 and FlipStartOffset mean (scenario switches change that idea), and the part
'     changes the way the real part would for that reading (worked out beforehand in OpenCascade);
'   - a face or an edge is one point (the point the macro looks it up by); a draft, chamfer or fillet is
'     recognised by the faces or edges selected for it;
'   - a sketch counts as fully defined when it has the relations and dimensions planned for it (or after Fully
'     Define Sketch). Relations are checked to fit what is selected and to be true as drawn; a dimension reads
'     the real distance between the things selected.
Public PartNo As Long
Private feats As Collection
Private selItems As Collection
Private selMarks As Collection
Private faces As Collection
Private edges As Collection
Private mine() As Long              ' the truth points of this part
Private nMine As Long
Private entOf() As Long             ' truth point -> index of its face / edge
Private origin As Object
Private inSketch As Boolean
Private cur As Object
Private nSketch As Long
Private nBoss As Long
Private nCut As Long
Private nDraft As Long
Private nCham As Long
Private nFil As Long
Private skSegs As Collection
Private skPts As Collection
Private skRel As Long
Private skMerge As Long
Private skDim As Long
Private skAll As Long
Private skFixAll As Boolean
Private skFixSeg As Long
Private skFixPt As Long
Private skFds As Boolean
Private skOver As Boolean
Private skMoved As Boolean          ' this stand-in moved something in the sketch (a scenario): relations are not checked against the drawing after that
Public Vol As Double                ' mm3
Public Mz As Double                 ' volume x Z of the centre of mass, mm4
Public Bodies As Long
Public ZLo As Double
Public ZHi As Double
Public AddToDB As Boolean
Public ShowFeatureErrorDialog As Boolean
Public DisplayWhenAdded As Boolean

Public Sub Init(no As Long)
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim n As Long
    Dim f As Object
    Dim e As Object
    Dim col As Collection
    Dim isFace As Boolean
    Dim perStep(1 To 80) As Long

    PartNo = no
    Set feats = New Collection
    Set selItems = New Collection
    Set selMarks = New Collection
    Set faces = New Collection
    Set edges = New Collection
    Set f = New PXFeat
    f.Kind = "OriginProfileFeature"
    f.FName = "Origin"
    feats.Add f
    For i = 1 To 3
        Set f = New PXFeat
        f.Kind = "RefPlane"
        f.PlaneIdx = i
        f.FName = Choose(i, "Front Plane", "Top Plane", "Right Plane")
        feats.Add f
    Next i
    Set origin = New PXPt
    origin.Kind = "Pt"
    origin.IsOrigin = True
    DisplayWhenAdded = True
    ShowFeatureErrorDialog = True

    nMine = 0
    For n = 1 To eN
        If eP(n) = no Then nMine = nMine + 1
    Next n
    If nMine = 0 Then Exit Sub
    ReDim mine(1 To nMine)
    ReDim entOf(1 To eN)
    j = 0
    For n = 1 To eN
        If eP(n) = no Then
            j = j + 1
            mine(j) = n
            isFace = (eK(n) = "F" Or eK(n) = "N")
            If isFace Then
                Set col = faces
            Else
                Set col = edges
            End If
            k = 0
            For i = 1 To col.Count
                Set e = col.Item(i)
                If Abs(e.PX - eX(n)) < 0.000001 And Abs(e.PY - eY(n)) < 0.000001 And Abs(e.PZ - eZ(n)) < 0.000001 Then k = i
            Next i
            If k = 0 Then
                Set e = New PXEnt
                e.Kind = IIf(isFace, "Face", "Edge")
                e.PX = eX(n)
                e.PY = eY(n)
                e.PZ = eZ(n)
                col.Add e
                k = col.Count
                e.Idx = k
                If eK(n) = "E" Then
                    If tKind(no, eS(n)) = "fi" Then     ' every third new edge of a radius can go missing (never all of them)
                        perStep(eS(n)) = perStep(eS(n)) + 1
                        e.Droppable = (perStep(eS(n)) Mod 3 = 0)
                    End If
                End If
            End If
            Set e = col.Item(k)
            If eK(n) = "N" Then e.IsNeutral = True
            If eK(n) = "R" Then e.ForSketch = True
            If eK(n) = "E" Then e.ForFinish = True
            If eT(n) <> "" Then
                e.GT = eT(n)
                e.G0 = eG(n, 0)
                e.G1 = eG(n, 1)
                e.G2 = eG(n, 2)
                e.G3 = eG(n, 3)
            End If
            If eK(n) = "E" Then
                If tKind(no, eS(n)) = "ch" Then e.GT = e.GT & "!"       ' a chamfer needs it: never left out
            End If
            entOf(n) = k
        End If
    Next n
End Sub

Property Get Extension() As Object
    Set Extension = Nothing
    Set Extension = Me
End Property

Property Get SketchManager() As Object
    Set SketchManager = Nothing
    Set SketchManager = Me
End Property

Property Get FeatureManager() As Object
    Set FeatureManager = Nothing
    Set FeatureManager = Me
End Property

Property Get SelectionManager() As Object
    Set SelectionManager = Nothing
    Set SelectionManager = Me
End Property

' ---- the tree

Public Function FirstFeature() As Object
    Set FirstFeature = Nothing
    Set FirstFeature = feats.Item(1)
End Function

Public Function NextOf(f As Object) As Object
    Set NextOf = Nothing
    Dim i As Long
    For i = 1 To feats.Count - 1
        If feats.Item(i) Is f Then
            Set NextOf = feats.Item(i + 1)
            Exit Function
        End If
    Next i
End Function

Public Function FeatureByPositionReverse(n As Long) As Object
    Set FeatureByPositionReverse = Nothing
    If n < feats.Count Then Set FeatureByPositionReverse = feats.Item(feats.Count - n)
End Function

Private Sub Drop(f As Object)
    Dim i As Long
    For i = feats.Count To 1 Step -1
        If feats.Item(i) Is f Then
            feats.Remove i
            Exit Sub
        End If
    Next i
End Sub

' Which boss / cut / mark of the part a sketch belongs to (see PxStepOf). Two features may have the same sketch (a
' recess and its countersink): the first of them that has not been made yet.
Private Function StepOfSk(n As Long, total As Double) As Long
    Dim i As Long
    StepOfSk = 0
    If PartNo < 1 Or PartNo > tParts Then Exit Function
    For i = 1 To tSteps(PartNo)
        If tKind(PartNo, i) = "ex" Or tKind(PartNo, i) = "mk" Then
            If tSegs(PartNo, i) = n And n > 0 And Abs(tSum(PartNo, i) - total) < 0.001 Then
                If StepOfSk = 0 Then StepOfSk = i
                If Not Kept(i) Then
                    StepOfSk = i
                    Exit Function
                End If
            End If
        End If
    Next i
End Function

Private Function Kept(st As Long) As Boolean
    Dim i As Long
    Kept = False
    For i = 1 To feats.Count
        If feats.Item(i).StepNo = st Then Kept = True
    Next i
End Function

' ---- selection

Public Function SelAdd(o As Object, mark As Long, append As Boolean) As Boolean
    Dim i As Long
    SelAdd = False
    If o Is Nothing Then Exit Function
    If Not append Then ClearSel
    For i = 1 To selItems.Count
        If selItems.Item(i) Is o Then
            If PxOn("append_toggles") Then
                selItems.Remove i
                selMarks.Remove i
            End If
            SelAdd = True
            Exit Function
        End If
    Next i
    selItems.Add o
    selMarks.Add mark
    SelAdd = True
End Function

Private Sub ClearSel()
    Set selItems = New Collection
    Set selMarks = New Collection
End Sub

Public Sub ClearSelection2(b As Boolean)
    ClearSel
End Sub

Public Function CreateSelectData() As Object
    Set CreateSelectData = Nothing
    Set CreateSelectData = New PXSel
End Function

Public Function SelectByID2(nm As String, typ As String, qx As Double, qy As Double, qz As Double, append As Boolean, mark As Long, _
                            callout As Object, opts As Long) As Boolean
    SelectByID2 = False
    If typ = "EXTSKETCHPOINT" And nm = "Point1@Origin" Then
        If PxOn("origin_unselectable") Then Exit Function
        SelectByID2 = SelAdd(origin, mark, append)
    Else
        PxNote "PROBLEM: SelectByID2 of " & nm & " (" & typ & ")"
    End If
End Function

' ---- sketching

Public Sub InsertSketch(upd As Boolean)
    Dim ok As Boolean
    If Not inSketch Then
        If selItems.Count = 1 Then
            If selItems.Item(1).Kind = "RefPlane" Then ok = (selItems.Item(1).PlaneIdx = 1)
        End If
        If Not ok Then
            PxNote "PROBLEM: a sketch was opened without the Front plane selected"
            Exit Sub
        End If
        nSketch = nSketch + 1
        Set cur = New PXFeat
        cur.Kind = "ProfileFeature"
        cur.FName = "Sketch" & nSketch
        feats.Add cur
        Set skSegs = New Collection
        Set skPts = New Collection
        skRel = 0
        skMerge = 0
        skDim = 0
        skAll = 0
        skFixAll = False
        skFixSeg = 0
        skFixPt = 0
        skFds = False
        skOver = False
        skMoved = False
        inSketch = True
    Else
        cur.State = Choose(SkStatus() - 1, "under", "full", "over") & " rel " & skRel & " merge " & skMerge & " dim " & skDim & IIf(skFds, " fds", "") & _
                    IIf(skFixAll Or skFixSeg > 0, " fixed", "")
        inSketch = False
    End If
    ClearSel
End Sub

Property Get ActiveSketch() As Object
    Set ActiveSketch = Nothing
    If inSketch And Not PxOn("no_active_sketch") Then Set ActiveSketch = cur
End Property

Private Function NewPt(xm As Double, ym As Double, joinable As Boolean) As Object
    Dim i As Long
    Dim p As Object
    Set NewPt = Nothing
    If joinable And PxOn("merge_already") Then
        For i = 1 To skPts.Count
            Set p = skPts.Item(i)
            If Abs(p.X - xm) < 0.000000001 And Abs(p.Y - ym) < 0.000000001 Then
                Set NewPt = p
                Exit Function
            End If
        Next i
    End If
    Set p = New PXPt
    p.Kind = "Pt"
    p.X = xm
    p.Y = ym
    If joinable Then skPts.Add p
    Set NewPt = p
End Function

Private Sub Outline(text As String, total As Double)
    If Not AddToDB Then PxNote "PROBLEM: a segment was drawn with AddToDB off"
    cur.Segs = cur.Segs & text & ";"
    cur.NSeg = cur.NSeg + 1
    cur.SumV = cur.SumV + total
End Sub

Public Function CreateLine(x1 As Double, y1 As Double, z1 As Double, x2 As Double, y2 As Double, z2 As Double) As Object
    Dim s As Object
    Set CreateLine = Nothing
    If Not inSketch Then Exit Function
    If z1 <> 0 Or z2 <> 0 Then PxNote "PROBLEM: a line off the sketch plane"
    Outline "L " & PxNum(x1 * 1000#) & " " & PxNum(y1 * 1000#) & " " & PxNum(x2 * 1000#) & " " & PxNum(y2 * 1000#), (x1 * x1 + y1 * y1 + x2 * x2 + y2 * y2) * 1000000#
    Set s = New PXSeg
    s.Kind = "Seg"
    s.T = "L"
    Set s.PA = NewPt(x1, y1, True)
    Set s.PB = NewPt(x2, y2, True)
    skSegs.Add s
    Set CreateLine = s
End Function

Public Function CreateCenterLine(x1 As Double, y1 As Double, z1 As Double, x2 As Double, y2 As Double, z2 As Double) As Object
    Dim s As Object
    Set CreateCenterLine = Nothing
    If Not inSketch Then Exit Function
    If Not AddToDB Then PxNote "PROBLEM: a construction line was drawn with AddToDB off"
    If PxOn("no_centerline") Then Exit Function
    Set s = New PXSeg
    s.Kind = "Seg"
    s.T = "N"
    Set s.PA = NewPt(x1, y1, False)
    Set s.PB = NewPt(x2, y2, False)
    skSegs.Add s
    Set CreateCenterLine = s
End Function

Public Function CreateArc(cx As Double, cy As Double, cz As Double, x1 As Double, y1 As Double, z1 As Double, _
                          x2 As Double, y2 As Double, z2 As Double, way As Long) As Object
    Dim s As Object
    Dim r As Double
    Set CreateArc = Nothing
    If Not inSketch Then Exit Function
    If way <> 1 And way <> -1 Then PxNote "PROBLEM: arc direction " & way
    r = Sqr((x1 - cx) ^ 2 + (y1 - cy) ^ 2) * 1000#
    If Abs(Sqr((x2 - cx) ^ 2 + (y2 - cy) ^ 2) * 1000# - r) > 0.00001 Then PxNote "PROBLEM: arc ends at different radii"
    If PxOn("arc_fails") And Abs(r - tArcFailR) < 0.000001 Then Exit Function
    Outline "A " & PxNum(cx * 1000#) & " " & PxNum(cy * 1000#) & " " & PxNum(x1 * 1000#) & " " & PxNum(y1 * 1000#) & " " & _
        PxNum(x2 * 1000#) & " " & PxNum(y2 * 1000#) & " " & way, (cx * cx + cy * cy + x1 * x1 + y1 * y1 + x2 * x2 + y2 * y2) * 1000000#
    Set s = New PXSeg
    s.Kind = "Seg"
    s.T = "A"
    s.Way = way
    Set s.PC = NewPt(cx, cy, False)
    Set s.PA = NewPt(x1, y1, True)
    Set s.PB = NewPt(x2, y2, True)
    skSegs.Add s
    Set CreateArc = s
End Function

Public Function CreateCircleByRadius(cx As Double, cy As Double, cz As Double, r As Double) As Object
    Dim s As Object
    Set CreateCircleByRadius = Nothing
    If Not inSketch Then Exit Function
    Outline "C " & PxNum(cx * 1000#) & " " & PxNum(cy * 1000#) & " " & PxNum(r * 1000#), (cx * cx + cy * cy + r * r) * 1000000#
    Set s = New PXSeg
    s.Kind = "Seg"
    s.T = "C"
    s.Rmm = r * 1000#
    Set s.PC = NewPt(cx, cy, False)
    skSegs.Add s
    Set CreateCircleByRadius = s
End Function

Public Function CreatePoint(qx As Double, qy As Double, qz As Double) As Object
    Set CreatePoint = Nothing
    If Not inSketch Then Exit Function
    If Not AddToDB Then PxNote "PROBLEM: a point was drawn with AddToDB off"
    Set CreatePoint = NewPt(qx, qy, False)
End Function

' swConstrainedStatus_e of the open sketch: 2 under, 3 fully, 4 over defined.
Public Function SkStatus() As Long
    Dim st As Long
    SkStatus = 2
    If cur Is Nothing Then Exit Function
    st = StepOfSk(cur.NSeg, cur.SumV)
    If st = 0 Then Exit Function
    If skOver Then
        SkStatus = 4
        Exit Function
    End If
    If tKind(PartNo, st) = "mk" Or tFixed(PartNo, st) Then
        If skFixAll And Not PxOn("fix_needs_points") Then SkStatus = 3
        If skFixSeg >= cur.NSeg Then
            If Not PxOn("fix_needs_points") Then SkStatus = 3
            If skFixPt > 0 Then SkStatus = 3
        End If
    Else
        If skFds And Not PxOn("fds_nothing") Then SkStatus = 3
        If skRel >= tNRel(PartNo, st) And skDim >= tNDim(PartNo, st) Then
            If skMerge >= tNMerge(PartNo, st) Or PxOn("merge_already") Then SkStatus = 3
        End If
    End If
End Function

Public Function GetRelationsCount(filter As Long) As Long
    GetRelationsCount = skAll
End Function

' what the things selected are, in the sketch plane (mm)
Private Function LineOf(o As Object, ax As Double, ay As Double, bx As Double, by As Double) As Boolean
    LineOf = False
    If o.Kind = "Seg" Then
        If o.T = "L" Or o.T = "N" Then
            ax = o.PA.X * 1000#
            ay = o.PA.Y * 1000#
            bx = o.PB.X * 1000#
            by = o.PB.Y * 1000#
            LineOf = True
        End If
    ElseIf o.Kind = "Edge" Then
        If Left(o.GT, 1) = "L" Then
            ax = o.G0
            ay = o.G1
            bx = o.G2
            by = o.G3
            LineOf = True
        End If
    End If
End Function

Private Function PointOf(o As Object, qx As Double, qy As Double) As Boolean
    PointOf = False
    If o.Kind = "Pt" Then
        qx = o.X * 1000#
        qy = o.Y * 1000#
        PointOf = True
    End If
End Function

Private Function CentreOf(o As Object, qx As Double, qy As Double) As Boolean
    CentreOf = False
    If o.Kind = "Pt" Then
        CentreOf = PointOf(o, qx, qy)
    ElseIf o.Kind = "Seg" Then
        If o.T = "A" Or o.T = "C" Then
            qx = o.PC.X * 1000#
            qy = o.PC.Y * 1000#
            CentreOf = True
        End If
    ElseIf o.Kind = "Edge" Then
        If Left(o.GT, 1) = "C" Then
            qx = o.G0
            qy = o.G1
            CentreOf = True
        End If
    End If
End Function

Private Function LenOf(ax As Double, ay As Double, bx As Double, by As Double) As Double
    LenOf = Sqr((bx - ax) ^ 2 + (by - ay) ^ 2)
    If LenOf < 0.000000001 Then LenOf = 0.000000001
End Function

Private Function DistPL(qx As Double, qy As Double, ax As Double, ay As Double, bx As Double, by As Double) As Double
    Dim l As Double
    l = Sqr((bx - ax) ^ 2 + (by - ay) ^ 2)
    If l < 0.000000001 Then
        DistPL = 1000000000#
    Else
        DistPL = Abs((bx - ax) * (qy - ay) - (by - ay) * (qx - ax)) / l
    End If
End Function

Public Sub SketchAddConstraints(kind As String)
    Dim a As Object
    Dim b As Object
    Dim n As Long
    Dim ok As Boolean
    Dim x1 As Double
    Dim y1 As Double
    Dim x2 As Double
    Dim y2 As Double
    Dim x3 As Double
    Dim y3 As Double
    Dim x4 As Double
    Dim y4 As Double

    If Not inSketch Then
        PxNote "PROBLEM: a relation was asked for outside a sketch"
        Exit Sub
    End If
    If PxOn("rel_raises") Then Err.Raise 5, , "no SketchAddConstraints"
    n = selItems.Count
    If n >= 1 Then Set a = selItems.Item(1)
    If n >= 2 Then Set b = selItems.Item(2)
    If kind = "sgFIXED" Then
        DoFix
        Exit Sub
    End If
    If kind = "sgMERGEPOINTS" Then
        If n < 2 Then Exit Sub                          ' the two ends are one point already
        If n = 2 Then
            If a.Kind = "Pt" And b.Kind = "Pt" Then
                If Not a.IsOrigin And Not b.IsOrigin Then ok = (Abs(a.X - b.X) < 0.000000001 And Abs(a.Y - b.Y) < 0.000000001)
            End If
        End If
        If Not ok Then
            PxNote "PROBLEM: a merge of what are not two sketch points at one place"
            Exit Sub
        End If
        skMerge = skMerge + 1
        skAll = skAll + 1
        Exit Sub
    End If

    Select Case kind
        Case "sgHORIZONTAL2D", "sgVERTICAL2D"
            If n = 1 Then
                If LineOf(a, x1, y1, x2, y2) Then
                    If kind = "sgHORIZONTAL2D" Then
                        ok = (Abs(y1 - y2) < 0.000001)
                    Else
                        ok = (Abs(x1 - x2) < 0.000001)
                    End If
                End If
            End If
        Case "sgTANGENT"
            If n = 2 Then
                If a.Kind = "Seg" And b.Kind = "Seg" Then ok = True
            End If
            If ok And PxOn("tangent_refused") Then Exit Sub
        Case "sgSAMELENGTH"
            If n = 2 Then
                If a.Kind = "Seg" And b.Kind = "Seg" Then
                    If (a.T = "A" Or a.T = "C") And (b.T = "A" Or b.T = "C") Then ok = (Abs(a.GetRadius() - b.GetRadius()) < 0.000000001)
                End If
            End If
            If ok And PxOn("rel_moves") Then
                a.PC.X = a.PC.X + 0.00001
                skMoved = True
            End If
        Case "sgCONCENTRIC"
            If n = 2 Then
                If CentreOf(a, x1, y1) And CentreOf(b, x2, y2) Then ok = (Abs(x1 - x2) < 0.000001 And Abs(y1 - y2) < 0.000001)
            End If
        Case "sgCOINCIDENT"
            If n = 2 Then
                If PointOf(a, x1, y1) Then
                    If PointOf(b, x2, y2) Then
                        ok = (Abs(x1 - x2) < 0.000001 And Abs(y1 - y2) < 0.000001)
                    ElseIf LineOf(b, x3, y3, x4, y4) Then
                        ok = (DistPL(x1, y1, x3, y3, x4, y4) < 0.000001)
                    End If
                ElseIf PointOf(b, x1, y1) Then
                    If LineOf(a, x3, y3, x4, y4) Then ok = (DistPL(x1, y1, x3, y3, x4, y4) < 0.000001)
                End If
            End If
        Case "sgATMIDDLE"
            If n = 2 Then
                If PointOf(a, x1, y1) Then
                    If LineOf(b, x3, y3, x4, y4) Then ok = (Abs(x1 - (x3 + x4) / 2#) < 0.000001 And Abs(y1 - (y3 + y4) / 2#) < 0.000001)
                ElseIf PointOf(b, x1, y1) Then
                    If LineOf(a, x3, y3, x4, y4) Then ok = (Abs(x1 - (x3 + x4) / 2#) < 0.000001 And Abs(y1 - (y3 + y4) / 2#) < 0.000001)
                End If
            End If
        Case "sgHORIZONTALPOINTS2D", "sgVERTPOINTS2D"
            If n = 2 Then
                If PointOf(a, x1, y1) And PointOf(b, x2, y2) Then
                    If kind = "sgHORIZONTALPOINTS2D" Then
                        ok = (Abs(y1 - y2) < 0.000001)
                    Else
                        ok = (Abs(x1 - x2) < 0.000001)
                    End If
                End If
            End If
        Case "sgCOLINEAR"
            If n = 2 Then
                If LineOf(a, x1, y1, x2, y2) And LineOf(b, x3, y3, x4, y4) Then
                    ok = (DistPL(x1, y1, x3, y3, x4, y4) < 0.000001 And DistPL(x2, y2, x3, y3, x4, y4) < 0.000001)
                End If
            End If
        Case "sgPARALLEL", "sgPERPENDICULAR"
            If n = 2 Then
                If LineOf(a, x1, y1, x2, y2) And LineOf(b, x3, y3, x4, y4) Then
                    If kind = "sgPARALLEL" Then
                        ok = (Abs((x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3)) < 0.000001 * LenOf(x1, y1, x2, y2) * LenOf(x3, y3, x4, y4))
                    Else
                        ok = (Abs((x2 - x1) * (x4 - x3) + (y2 - y1) * (y4 - y3)) < 0.000001 * LenOf(x1, y1, x2, y2) * LenOf(x3, y3, x4, y4))
                    End If
                End If
            End If
        Case Else
            PxNote "PROBLEM: relation " & kind & " is not one the stand-in knows"
            Exit Sub
    End Select
    If Not ok And Not skMoved Then
        PxNote "PROBLEM: relation " & kind & " on a selection it does not fit, or not true as drawn (" & n & " selected, " & cur.FName & ")"
        Exit Sub
    End If
    skRel = skRel + 1
    skAll = skAll + 1
End Sub

Private Sub DoFix()
    Dim i As Long
    Dim nS As Long
    Dim nP As Long
    For i = 1 To selItems.Count
        If selItems.Item(i).Kind = "Seg" Then nS = nS + 1
        If selItems.Item(i).Kind = "Pt" Then nP = nP + 1
    Next i
    If nS + nP = 0 Then Exit Sub
    If selItems.Count > 1 Then
        If PxOn("fix_one_by_one") Then Exit Sub
        If nS >= cur.NSeg Then skFixAll = True
    Else
        skFixSeg = skFixSeg + nS
        skFixPt = skFixPt + nP
    End If
    skAll = skAll + 1
End Sub

Private Function AddDim(how As Long) As Object
    Dim a As Object
    Dim b As Object
    Dim d As Object
    Dim n As Long
    Dim st As Long
    Dim ok As Boolean
    Dim v As Double
    Dim x1 As Double
    Dim y1 As Double
    Dim x2 As Double
    Dim y2 As Double
    Dim x3 As Double
    Dim y3 As Double
    Dim x4 As Double
    Dim y4 As Double
    Dim cr As Double
    Dim dt As Double
    Dim isAngle As Boolean

    Set AddDim = Nothing
    If Not inSketch Then
        PxNote "PROBLEM: a dimension was asked for outside a sketch"
        Exit Function
    End If
    If pxToggle(1) Then PxNote "PROBLEM: a dimension was added with the value box switched on (it would wait for an answer)"
    If PxOn("dims_nothing") Then Exit Function
    n = selItems.Count
    If n >= 1 Then Set a = selItems.Item(1)
    If n >= 2 Then Set b = selItems.Item(2)
    Select Case how
        Case 3
            If n = 1 Then
                If a.Kind = "Seg" Then
                    If a.T = "A" Then
                        v = a.GetRadius() * 1000#
                        ok = True
                    End If
                End If
            End If
        Case 4
            If n = 1 Then
                If a.Kind = "Seg" Then
                    If a.T = "C" Then
                        v = 2# * a.Rmm
                        ok = True
                    End If
                End If
            End If
        Case 1, 2
            If n = 2 Then
                If PointOf(a, x1, y1) And PointOf(b, x2, y2) Then
                    If how = 1 Then
                        v = Abs(x1 - x2)
                    Else
                        v = Abs(y1 - y2)
                    End If
                    ok = True
                End If
            End If
        Case 0
            If n = 1 Then
                If LineOf(a, x1, y1, x2, y2) Then               ' one line: its length
                    v = Sqr((x2 - x1) ^ 2 + (y2 - y1) ^ 2)
                    ok = True
                End If
            End If
            If n = 2 Then
                If LineOf(a, x1, y1, x2, y2) Then
                    If LineOf(b, x3, y3, x4, y4) Then
                        v = DistPL(x1, y1, x3, y3, x4, y4)
                        ok = (Abs(DistPL(x2, y2, x3, y3, x4, y4) - v) < 0.000001)      ' parallel
                        If Not ok Then
                            ' two lines that are not parallel: the angle between them, in radians (the sharper one)
                            cr = Abs((x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3))
                            dt = Abs((x2 - x1) * (x4 - x3) + (y2 - y1) * (y4 - y3))
                            isAngle = True
                            v = Atn(cr / IIf(dt < 0.000000000001, 0.000000000001, dt))
                            ok = True
                        End If
                    ElseIf PointOf(b, x3, y3) Then
                        v = DistPL(x3, y3, x1, y1, x2, y2)
                        ok = True
                    End If
                ElseIf PointOf(a, x3, y3) Then
                    If LineOf(b, x1, y1, x2, y2) Then
                        v = DistPL(x3, y3, x1, y1, x2, y2)
                        ok = True
                    End If
                End If
            End If
    End Select
    If Not ok And Not skMoved Then
        PxNote "PROBLEM: a dimension (kind " & how & ") on a selection it does not fit (" & n & " selected, " & cur.FName & ")"
        Exit Function
    End If
    skDim = skDim + 1
    st = StepOfSk(cur.NSeg, cur.SumV)
    If PxOn("dims_over") And st > 0 Then
        If skDim >= tNDim(PartNo, st) Then skOver = True
    End If
    Set d = New PXDim
    d.V = v / 1000#
    If isAngle Then d.V = v
    If PxOn("dim_values_off") Then d.V = d.V + 0.001
    Set AddDim = d
End Function

Public Function AddDimension2(qx As Double, qy As Double, qz As Double) As Object
    Set AddDimension2 = Nothing
    Set AddDimension2 = AddDim(0)
End Function

Public Function AddHorizontalDimension2(qx As Double, qy As Double, qz As Double) As Object
    Set AddHorizontalDimension2 = Nothing
    Set AddHorizontalDimension2 = AddDim(1)
End Function

Public Function AddVerticalDimension2(qx As Double, qy As Double, qz As Double) As Object
    Set AddVerticalDimension2 = Nothing
    Set AddVerticalDimension2 = AddDim(2)
End Function

Public Function AddRadialDimension2(qx As Double, qy As Double, qz As Double) As Object
    Set AddRadialDimension2 = Nothing
    Set AddRadialDimension2 = AddDim(3)
End Function

Public Function AddDiameterDimension2(qx As Double, qy As Double, qz As Double) As Object
    Set AddDiameterDimension2 = Nothing
    Set AddDiameterDimension2 = AddDim(4)
End Function

Public Function FullyDefineSketch(ents As Boolean, useRel As Boolean, relMask As Long, useDim As Boolean, hScheme As Long, hDatum As Object, _
                                  vScheme As Long, vDatum As Object, hPlace As Long, vPlace As Long) As Long
    Dim i As Long
    Dim datum As Boolean
    Dim s As Object
    FullyDefineSketch = 0
    If Not inSketch Then
        PxNote "PROBLEM: Fully Define Sketch outside a sketch"
        Exit Function
    End If
    For i = 1 To selItems.Count
        If selItems.Item(i) Is origin Then
            If selMarks.Item(i) = 6 Then datum = True
        End If
    Next i
    If Not datum And Not PxOn("origin_unselectable") Then PxNote "PROBLEM: Fully Define Sketch without the origin selected as its datum"
    If PxOn("no_fds") Then Err.Raise 438, , "no FullyDefineSketch"
    skFds = True
    If PxOn("fds_over") Then skOver = True
    If PxOn("fds_moves") And skSegs.Count > 0 Then
        skMoved = True
        Set s = skSegs.Item(1)
        If s.T = "C" Then
            s.PC.X = s.PC.X + 0.00001
        Else
            s.PA.X = s.PA.X + 0.00001
        End If
    End If
    FullyDefineSketch = 1
End Function

' ---- bosses and cuts

Public Function FeatureExtrusion3(Sd As Boolean, Flip As Boolean, Dir As Boolean, T1 As Long, T2 As Long, D1 As Double, D2 As Double, _
        Dchk1 As Boolean, Dchk2 As Boolean, Ddir1 As Boolean, Ddir2 As Boolean, Dang1 As Double, Dang2 As Double, _
        OffsetReverse1 As Boolean, OffsetReverse2 As Boolean, TranslateSurface1 As Boolean, TranslateSurface2 As Boolean, _
        Merge As Boolean, UseFeatScope As Boolean, UseAutoSelect As Boolean, T0 As Long, StartOffset As Double, FlipStartOffset As Boolean) As Object
    Set FeatureExtrusion3 = Nothing
    If Not Sd Or Flip Or T1 <> 0 Or Not Merge Then PxNote "PROBLEM: unexpected boss arguments"
    Set FeatureExtrusion3 = MakeFeat(False, Dir, D1, Dchk1, Ddir1, Dang1, T0, StartOffset, FlipStartOffset)
End Function

Public Function FeatureCut4(Sd As Boolean, Flip As Boolean, Dir As Boolean, T1 As Long, T2 As Long, D1 As Double, D2 As Double, _
        Dchk1 As Boolean, Dchk2 As Boolean, Ddir1 As Boolean, Ddir2 As Boolean, Dang1 As Double, Dang2 As Double, _
        OffsetReverse1 As Boolean, OffsetReverse2 As Boolean, TranslateSurface1 As Boolean, TranslateSurface2 As Boolean, _
        NormalCut As Boolean, UseFeatScope As Boolean, UseAutoSelect As Boolean, AssemblyFeatureScope As Boolean, _
        AutoSelectComponents As Boolean, PropagateFeatureToParts As Boolean, T0 As Long, StartOffset As Double, _
        FlipStartOffset As Boolean, OptimizeGeometry As Boolean) As Object
    Set FeatureCut4 = Nothing
    If Not Sd Or Flip Or T1 <> 0 Or NormalCut Then PxNote "PROBLEM: unexpected cut arguments"
    Set FeatureCut4 = MakeFeat(True, Dir, D1, Dchk1, Ddir1, Dang1, T0, StartOffset, FlipStartOffset)
End Function

Private Function MakeFeat(isCut As Boolean, Dir As Boolean, depth As Double, dchk As Boolean, ddir As Boolean, dang As Double, _
                          T0 As Long, off As Double, flipOff As Boolean) As Object
    Dim sk As Object
    Dim f As Object
    Dim st As Long
    Dim d As Double
    Dim z0 As Double
    Dim z1 As Double
    Dim j As Long
    Dim deg As Double
    Dim narrows As Boolean
    Dim i As Long

    Set MakeFeat = Nothing
    If inSketch Then
        PxNote "PROBLEM: a feature was asked for with the sketch still open"
        Exit Function
    End If
    If selItems.Count = 1 Then
        If selItems.Item(1).Kind = "ProfileFeature" Then Set sk = selItems.Item(1)
    End If
    ClearSel
    If sk Is Nothing Then
        PxNote "PROBLEM: a feature was asked for without its sketch selected"
        Exit Function
    End If
    If sk.Used Then
        PxNote "PROBLEM: a feature was asked for from a sketch already used"
        Exit Function
    End If
    st = StepOfSk(sk.NSeg, sk.SumV)
    If st = 0 Then
        PxNote "PROBLEM: a feature was asked for from a sketch that is no step of the part (" & sk.NSeg & " segments)"
        Exit Function
    End If
    If Kept(st) Then PxNote "PROBLEM: step " & st & " made twice"
    If depth <= 0 Or off < 0 Then PxNote "PROBLEM: negative depth or offset"

    ' this stand-in's reading of the flags
    d = 1#
    If isCut Then d = -1#
    If PxOn("dir_swapped") Then d = -d
    If Dir Then d = -d
    If T0 = 3 Then
        z0 = off * 1000#
        If flipOff Then z0 = -z0
        If PxOn("offset_along_normal") Then
            ' along the plane's normal whatever way the feature runs
        ElseIf PxOn("offset_against_dir") Then
            z0 = -z0 * d
        Else
            z0 = z0 * d
        End If
    ElseIf T0 <> 0 Then
        PxNote "PROBLEM: start condition " & T0
    End If
    z1 = z0 + d * depth * 1000#
    If dchk Then
        deg = dang * 180# / 3.14159265358979
        narrows = ddir
        If PxOn("ddir_swapped") Then narrows = Not ddir
    End If

    If tCut(PartNo, st) <> isCut Then PxNote "PROBLEM: a boss asked for where a cut is wanted, or the reverse (step " & st & ")"
    If Abs(deg - tDraft(PartNo, st)) > 0.000001 Then PxNote "PROBLEM: wall angle " & deg & " (step " & st & ")"
    j = -1
    For i = 0 To tN(PartNo, st) - 1
        If Abs(z0 - rZ0(PartNo, st, i)) < 0.000001 And Abs(z1 - rZ1(PartNo, st, i)) < 0.000001 Then
            If deg = 0 Then
                j = i
            ElseIf rWiden(PartNo, st, i) = (narrows <> tNarrow(PartNo, st)) Then
                j = i
            End If
        End If
    Next i
    If j < 0 Then
        PxNote "PROBLEM: a feature from " & z0 & " to " & z1 & " that is no reading of step " & st
        Exit Function
    End If
    If Abs(rDv(PartNo, st, j)) < 0.000001 And Not PxOn("empty_cut_is_a_feature") Then Exit Function      ' nothing to cut: no feature

    Set f = New PXFeat
    If isCut Then
        nCut = nCut + 1
        f.Kind = "Cut"
        f.FName = "Cut-Extrude" & nCut
    Else
        nBoss = nBoss + 1
        f.Kind = "Extrusion"
        f.FName = "Boss-Extrude" & nBoss
    End If
    f.StepNo = st
    f.Z0 = z0
    f.Z1 = z1
    f.DraftDeg = deg
    f.Narrows = narrows
    f.Right = (j = 0)
    f.Share = 1#
    Set f.Sketch = sk
    Remember f
    sk.Used = True
    feats.Add f

    If Bodies = 0 Then
        ZLo = IIf(z0 < z1, z0, z1)
        ZHi = IIf(z0 < z1, z1, z0)
    End If
    Vol = Vol + rDv(PartNo, st, j)
    Mz = Mz + rDm(PartNo, st, j)
    Bodies = rBodies(PartNo, st, j)
    Set MakeFeat = f
End Function

Private Sub Remember(f As Object)
    f.PrevVol = Vol
    f.PrevMz = Mz
    f.PrevBodies = Bodies
End Sub

' ---- drafts, chamfers, fillets

' The step of kind tk whose faces or edges (truth letter, entity kind) are what is selected with the mark given
' (any mark if wantMark is -1). share: how many of the step's faces or edges are selected (all of them, unless
' some is allowed).
Private Function StepOfSel(tk As String, letter As String, cls As String, wantMark As Long, some As Boolean, share As Double) As Long
    Dim s As Long
    Dim i As Long
    Dim j As Long
    Dim m As Long
    Dim n As Long
    Dim need As Long
    Dim have As Long
    Dim alien As Long
    Dim dup As Boolean
    Dim hit As Boolean
    Dim ids() As Long
    Dim o As Object

    StepOfSel = 0
    If nMine = 0 Then Exit Function
    For s = 1 To tSteps(PartNo)
        If tKind(PartNo, s) = tk Then
            need = 0
            ReDim ids(1 To nMine)
            For m = 1 To nMine
                n = mine(m)
                If eS(n) = s And eK(n) = letter Then
                    dup = False
                    For j = 1 To need
                        If ids(j) = entOf(n) Then dup = True
                    Next j
                    If Not dup Then
                        need = need + 1
                        ids(need) = entOf(n)
                    End If
                End If
            Next m
            have = 0
            alien = 0
            For i = 1 To selItems.Count
                If wantMark = -1 Or selMarks.Item(i) = wantMark Then
                    Set o = selItems.Item(i)
                    hit = False
                    If o.Kind = cls Then
                        For j = 1 To need
                            If ids(j) = o.Idx Then hit = True
                        Next j
                    End If
                    If hit Then
                        have = have + 1
                    Else
                        alien = alien + 1
                    End If
                End If
            Next i
            If need > 0 And have > 0 And alien = 0 Then
                If have = need Or some Then
                    share = have / need
                    StepOfSel = s
                    Exit Function
                End If
            End If
        End If
    Next s
End Function

Private Sub MarkRange(lo As Long, hi As Long)
    Dim i As Long
    lo = 99
    hi = -99
    For i = 1 To selItems.Count
        If selMarks.Item(i) < lo Then lo = selMarks.Item(i)
        If selMarks.Item(i) > hi Then hi = selMarks.Item(i)
    Next i
End Sub

Public Function InsertMultiFaceDraft(ang As Double, flip As Boolean, edgeDraft As Boolean, propType As Long, isStep As Boolean, isBody As Boolean) As Object
    Dim i As Long
    Dim m As Long
    Dim n1 As Long
    Dim s As Long
    Dim neutral As Object
    Dim isFront As Boolean
    Dim okN As Boolean
    Dim isRight As Boolean
    Dim share As Double
    Dim f As Object

    Set InsertMultiFaceDraft = Nothing
    If inSketch Then PxNote "PROBLEM: a draft was asked for with a sketch open"
    For i = 1 To selItems.Count
        If selMarks.Item(i) = 1 Then
            n1 = n1 + 1
            Set neutral = selItems.Item(i)
        End If
    Next i
    If n1 <> 1 Then
        PxNote "PROBLEM: a draft with " & n1 & " neutral planes selected"
        ClearSel
        Exit Function
    End If
    If neutral.Kind = "RefPlane" Then
        isFront = (neutral.PlaneIdx = 1)
        If Not isFront Then PxNote "PROBLEM: a draft from another plane than the Front plane"
    ElseIf neutral.Kind <> "Face" Then
        PxNote "PROBLEM: the neutral plane of a draft is a " & neutral.Kind
    End If
    s = StepOfSel("dr", "F", "Face", 2, False, share)
    ClearSel
    If s = 0 Then
        PxNote "PROBLEM: a draft on faces that are not the faces of one draft of the part"
        Exit Function
    End If
    If Kept(s) Then PxNote "PROBLEM: step " & s & " made twice"
    If tFront(PartNo, s) <> isFront Then
        PxNote "PROBLEM: the wrong neutral plane for step " & s
    ElseIf Not isFront Then
        For m = 1 To nMine
            If eS(mine(m)) = s And eK(mine(m)) = "N" Then
                If entOf(mine(m)) = neutral.Idx Then okN = True
                ' (two drafts from one flat face each know it by a point of their own: any of them is that face)
                If neutral.IsNeutral And Abs(neutral.PZ - eZ(mine(m))) < 0.000001 Then okN = True
            End If
        Next m
        If Not okN Then PxNote "PROBLEM: the wrong neutral face for step " & s
    End If
    If Abs(ang * 180# / 3.14159265358979 - tVal(PartNo, s)) > 0.000001 Then PxNote "PROBLEM: draft angle " & ang & " (step " & s & ")"
    If edgeDraft Or isStep Or isBody Or propType <> 0 Then PxNote "PROBLEM: unexpected draft arguments"
    If PxOn("no_draft") Then Exit Function
    If PxOn("no_front_draft") And isFront Then Exit Function
    isRight = (flip = Not isFront)                      ' this stand-in's idea of FlipDir: it depends on the neutral plane
    If PxOn("draft_flip_swapped") Then isRight = Not isRight

    Set f = New PXFeat
    nDraft = nDraft + 1
    f.Kind = "Draft"
    f.FName = "Draft" & nDraft
    f.StepNo = s
    f.Right = isRight
    f.Share = 1#
    Remember f
    feats.Add f
    If isRight Then
        Vol = Vol + tDv(PartNo, s)
        Mz = Mz + tDm(PartNo, s)
    Else
        Vol = Vol + tFlipDv(PartNo, s)
        Mz = Mz + tFlipDm(PartNo, s)
    End If
    Set InsertMultiFaceDraft = f
End Function

Public Function InsertFeatureChamfer(opts As Long, typ As Long, w As Double, ang As Double, od As Double, _
                                     v1 As Double, v2 As Double, v3 As Double) As Object
    Dim s As Long
    Dim lo As Long
    Dim hi As Long
    Dim share As Double
    Dim f As Object

    Set InsertFeatureChamfer = Nothing
    MarkRange lo, hi
    s = StepOfSel("ch", "E", "Edge", -1, False, share)
    ClearSel
    If s = 0 Then
        PxNote "PROBLEM: a chamfer on edges that are not the edges of one chamfer of the part"
        Exit Function
    End If
    If Kept(s) Then PxNote "PROBLEM: step " & s & " made twice"
    If opts <> 4 Or typ <> 1 Or Abs(w * 1000# - tVal(PartNo, s)) > 0.000001 Or Abs(ang - 0.785398163397448) > 0.000001 Then
        PxNote "PROBLEM: unexpected chamfer arguments (step " & s & ")"
    End If
    If lo <> hi Then Exit Function
    If PxOn("chamfer_mark1") And lo <> 1 Then Exit Function
    If PxOn("no_chamfer") Then Exit Function

    Set f = New PXFeat
    nCham = nCham + 1
    f.Kind = "Chamfer"
    f.FName = "Chamfer" & nCham
    f.StepNo = s
    f.Right = True
    f.Share = 1#
    Remember f
    feats.Add f
    Vol = Vol + tDv(PartNo, s)
    Mz = Mz + tDm(PartNo, s)
    Set InsertFeatureChamfer = f
End Function

Public Function FeatureFillet3(opts As Long, r1 As Double, r2 As Double, rho As Double, ftyp As Long, ovf As Long, crt As Long, _
        a1 As Variant, a2 As Variant, a3 As Variant, a4 As Variant, a5 As Variant, a6 As Variant, a7 As Variant) As Object
    Dim s As Long
    Dim lo As Long
    Dim hi As Long
    Dim share As Double
    Dim dv As Double
    Dim f As Object

    Set FeatureFillet3 = Nothing
    MarkRange lo, hi
    s = StepOfSel("fi", "E", "Edge", -1, True, share)
    ClearSel
    If s = 0 Then
        PxNote "PROBLEM: a fillet on edges that are not edges of one fillet of the part"
        Exit Function
    End If
    If Kept(s) Then PxNote "PROBLEM: step " & s & " made twice"
    If opts <> 195 Or Abs(r1 * 1000# - tVal(PartNo, s)) > 0.000001 Then PxNote "PROBLEM: unexpected fillet arguments (step " & s & ")"
    If PxOn("no_fillet") Then Exit Function
    If lo <> hi Then Exit Function
    If PxOn("fillet_mark0") And lo <> 0 Then Exit Function
    If PxOn("fillet_mark1") And lo <> 1 Then Exit Function
    dv = tDv(PartNo, s) * share
    If PxOn("fillet_huge") Then dv = dv * 40#

    Set f = New PXFeat
    nFil = nFil + 1
    f.Kind = "Fillet"
    f.FName = "Fillet" & nFil
    f.StepNo = s
    f.Right = True
    f.Share = share
    Remember f
    feats.Add f
    Vol = Vol + dv
    Mz = Mz + tDm(PartNo, s) * share
    Set FeatureFillet3 = f
End Function

' ---- deleting

Public Function DeleteSelection2(opts As Long) As Boolean
    DeleteSelection2 = False
    If PxOn("deletesel_fails") Or PxOn("no_delete") Then
        ClearSel
        Exit Function
    End If
    DeleteSelection2 = DoDelete((opts And 2) <> 0)
End Function

Public Sub EditDelete()
    If PxOn("no_delete") Then
        ClearSel
        Exit Sub
    End If
    DoDelete False
End Sub

Private Function DoDelete(withSketch As Boolean) As Boolean
    Dim f As Object
    DoDelete = False
    If selItems.Count <> 1 Then
        ClearSel
        Exit Function
    End If
    Set f = selItems.Item(1)
    ClearSel
    If f.Kind = "ProfileFeature" Then
        If f.Used Then
            PxNote "PROBLEM: tried to delete a sketch that a feature uses"
            Exit Function
        End If
        If inSketch Then PxNote "PROBLEM: tried to delete a sketch while a sketch is open"
        Drop f
        DoDelete = True
    ElseIf f.Kind = "Extrusion" Or f.Kind = "Cut" Or f.Kind = "Draft" Or f.Kind = "Chamfer" Or f.Kind = "Fillet" Then
        If Not feats.Item(feats.Count) Is f Then
            PxNote "PROBLEM: tried to delete a feature that is not the last one"
            Exit Function
        End If
        Vol = f.PrevVol
        Mz = f.PrevMz
        Bodies = f.PrevBodies
        Drop f
        If Not f.Sketch Is Nothing Then
            f.Sketch.Used = False
            If withSketch Then Drop f.Sketch
        End If
        DoDelete = True
    Else
        PxNote "PROBLEM: tried to delete a " & f.Kind
    End If
End Function

' ---- the body

Public Function GetBodies2(t As Long, vis As Boolean) As Variant
    Dim arr() As Object
    Dim i As Long
    GetBodies2 = Empty
    If Bodies = 0 Then Exit Function
    ReDim arr(0 To Bodies - 1)
    For i = 0 To Bodies - 1
        Set arr(i) = New PXBody
        arr(i).Share = 1# / Bodies
    Next i
    GetBodies2 = arr
End Function

' The faces or the edges of the part (every one the truth knows a point of).
Public Function Ents(cls As String) As Variant
    Dim col As Collection
    Dim arr() As Object
    Dim e As Object
    Dim i As Long
    Dim n As Long
    Ents = Empty
    If cls = "Face" Then
        Set col = faces
    Else
        Set col = edges
    End If
    If col.Count = 0 Then Exit Function
    ReDim arr(0 To col.Count - 1)
    For i = 1 To col.Count
        Set e = col.Item(i)
        If cls = "Edge" And PxOn("edges_missing") And e.GT = "" And e.Droppable Then
            ' an edge SOLIDWORKS does not have where the design has one
        ElseIf cls = "Edge" And inSketch And Not e.ForSketch Then
            ' the part as it is while a sketch is open has the edges its sketches refer to, not yet the ones its
            ' drafts will move (the truth holds both, a few hundredths apart)
        ElseIf cls = "Edge" And Not inSketch And Not e.ForFinish Then
        Else
            Set arr(n) = e
            n = n + 1
        End If
    Next i
    If n = 0 Then Exit Function
    ReDim Preserve arr(0 To n - 1)
    Ents = arr
End Function

' ---- the rest

Public Sub EditRebuild3()
End Sub

Public Sub ShowNamedView2(nm As String, id As Long)
    If id <> 7 Then PxNote "PROBLEM: view " & id
End Sub

Public Sub ViewZoomtofit2()
End Sub

' What is left in the tree, for the checks in run_parts_mock.py.
Public Function Dump() As String
    Dim i As Long
    Dim f As Object
    Dim s As String
    Dump = ""
    s = "PART|" & PartNo & Chr(10)
    If inSketch Then s = s & "PROBLEM: a sketch was left open" & Chr(10)
    If Not ShowFeatureErrorDialog Then s = s & "PROBLEM: the part's feature error box was left switched off" & Chr(10)
    If AddToDB Then s = s & "PROBLEM: AddToDB was left switched on" & Chr(10)
    For i = 1 To feats.Count
        Set f = feats.Item(i)
        If f.Kind = "ProfileFeature" Then
            If Not f.Used Then s = s & "LOOSE SKETCH|" & f.FName & Chr(10)
        ElseIf f.Kind = "Extrusion" Or f.Kind = "Cut" Then
            s = s & "FEAT|" & f.Kind & "|" & f.FName & "|" & f.StepNo & "|" & f.Right & "|" & PxNum(f.Z0) & "|" & PxNum(f.Z1) & "|" & _
                PxNum(f.DraftDeg) & "|" & f.Narrows & "|" & f.Sketch.FName & "|" & f.Sketch.State & "|" & f.Sketch.Segs & Chr(10)
        ElseIf f.Kind = "Draft" Or f.Kind = "Chamfer" Or f.Kind = "Fillet" Then
            s = s & "FEAT|" & f.Kind & "|" & f.FName & "|" & f.StepNo & "|" & f.Right & "|" & PxNum(f.Share) & Chr(10)
        End If
    Next i
    s = s & "VOLUME|" & PxNum(Vol) & "|BODIES|" & Bodies & Chr(10)
    Dump = s
End Function
