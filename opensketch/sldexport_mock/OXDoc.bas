Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' A part document (imported from STEP) or the assembly, with its Extension and SelectionManager (the same
' object). The assembly checks every mate against the real geometry: a mate that does not hold where the
' components are moves one of them, as SOLIDWORKS would.
Public IsAsm As Boolean
Public PartNo As Long
Public SavedPath As String
Private feats As Collection
Private sel As Collection
Private comps As Collection
Private nAxis As Long
Private nMate As Long
Private lastAdded As Object
Private nCalls As Long
Private lastKey As String

Public Sub InitPart(no As Long)
    Dim f As Object
    Dim k As Long
    PartNo = no
    Set feats = New Collection
    Set sel = New Collection
    Set f = New OXFeat
    f.Init "OriginProfileFeature", "Origin", 0, Me
    feats.Add f
    For k = 1 To 3
        Set f = New OXFeat
        f.Init "RefPlane", Choose(k, "Front Plane", "Top Plane", "Right Plane"), k, Me
        feats.Add f
    Next k
End Sub

Public Sub InitAsm()
    InitPart 0
    IsAsm = True
    Set comps = New Collection
End Sub

Property Get Extension() As Object
    Set Extension = Nothing
    Set Extension = Me
End Property

Property Get SelectionManager() As Object
    Set SelectionManager = Nothing
    Set SelectionManager = Me
End Property

Public Function GetTitle() As String
    GetTitle = IIf(IsAsm, "Assem1", "Part" & PartNo)
End Function

Public Function FirstFeature() As Object
    Set FirstFeature = Nothing
    Set FirstFeature = feats.Item(1)
End Function

Public Function NextOf(f As Object) As Object
    Dim k As Long
    Set NextOf = Nothing
    For k = 1 To feats.Count - 1
        If feats.Item(k) Is f Then
            Set NextOf = feats.Item(k + 1)
            Exit Function
        End If
    Next k
End Function

Public Function FeatureNamed(n As String) As Object
    Dim k As Long
    Set FeatureNamed = Nothing
    For k = 1 To feats.Count
        If feats.Item(k).FName = n Then
            Set FeatureNamed = feats.Item(k)
            Exit Function
        End If
    Next k
End Function

Public Function CreateSelectData() As Object
    Set CreateSelectData = Nothing
    Set CreateSelectData = New OXSD
End Function

Public Function GetSelectedObjectCount2(m As Long) As Long
    GetSelectedObjectCount2 = sel.Count
End Function

Public Function CompXf(k As Long) As Object
    Set CompXf = Nothing
    Set CompXf = comps.Item(k).Xf
End Function

Public Function GetSelectedObjectsComponent4(i As Long, m As Long) As Object
    Set GetSelectedObjectsComponent4 = Nothing
    If i < 1 Or i > sel.Count Then Exit Function
    If sel.Item(i).SelKind = "comp" Then
        Set GetSelectedObjectsComponent4 = sel.Item(i)
    ElseIf sel.Item(i).SelKind = "ent" Then
        Set GetSelectedObjectsComponent4 = comps.Item(sel.Item(i).CompNo)
    End If
End Function

Public Function DeSelect2(i As Long, m As Long) As Boolean
    DeSelect2 = False
    If i < 1 Or i > sel.Count Then Exit Function
    sel.Remove i
    DeSelect2 = True
End Function

Public Function SelAdd(o As Object, append As Boolean) As Boolean
    If Not append Then Set sel = New Collection
    sel.Add o
    SelAdd = True
End Function

Public Sub ClearSelection2(b As Boolean)
    Set sel = New Collection
End Sub

Public Function GetBodies2(t As Long, b As Boolean) As Variant
    Dim a(0 To 0) As Object
    Dim bd As Object
    GetBodies2 = Empty
    If IsAsm Then Exit Function
    Set bd = New OXBody
    bd.PartNo = PartNo
    Set a(0) = bd
    GetBodies2 = a
End Function

Public Function InsertAxis2(b As Boolean) As Boolean
    Dim f As Object
    Dim d As Variant
    Dim k As Long
    InsertAxis2 = False
    Set f = New OXFeat
    If sel.Count = 1 Then
        If sel.Item(1).SelKind = "feat" Then
            OxNote "PROBLEM: InsertAxis2 with a feature selected alone"
            Exit Function
        End If
        k = sel.Item(1).FaceNo
        If fKind(k) <> "L" Then
            OxNote "PROBLEM: InsertAxis2 on a face"
            Exit Function
        End If
        nAxis = nAxis + 1
        f.Init "RefAxis", "Axis" & nAxis, 0, Me
        f.PX = fG(k, 0): f.PY = fG(k, 1): f.PZ = fG(k, 2)
        f.DX = fG(k, 3): f.DY = fG(k, 4): f.DZ = fG(k, 5)
    ElseIf sel.Count = 2 Then
        If sel.Item(1).Kind <> "RefPlane" Or sel.Item(2).Kind <> "RefPlane" Then
            OxNote "PROBLEM: InsertAxis2 needs two planes"
            Exit Function
        End If
        d = OxCross(OxPlaneN(sel.Item(1).PlaneNo), OxPlaneN(sel.Item(2).PlaneNo))
        nAxis = nAxis + 1
        f.Init "RefAxis", "Axis" & nAxis, 0, Me
        f.DX = d(0): f.DY = d(1): f.DZ = d(2)
    Else
        OxNote "PROBLEM: InsertAxis2 with " & sel.Count & " selected"
        Exit Function
    End If
    feats.Add f
    Set lastAdded = f
    InsertAxis2 = True
End Function

Public Function GetLastFeatureAdded() As Object
    Set GetLastFeatureAdded = Nothing
    Set GetLastFeatureAdded = lastAdded
End Function

Public Function SaveAs(p As String, v As Long, o As Long, ed As Object, errs As Long, warns As Long) As Boolean
    SavedPath = p
    errs = 0
    SaveAs = True
    OxNote "SAVED|" & IIf(IsAsm, "asm", "part " & PartNo) & "|" & p
End Function

Public Sub ShowNamedView2(n As String, v As Long)
End Sub

Public Sub ViewZoomtofit2()
End Sub

Public Function EditRebuild3() As Boolean
    EditRebuild3 = True
End Function

' ---------------------------------------------------------------- the assembly

Public Function AddComponent5(p As String, cfg As Long, n1 As String, useCfg As Boolean, n2 As String, x As Double, y As Double, z As Double) As Object
    Dim k As Long
    Dim c As Object
    Set AddComponent5 = Nothing
    For k = 1 To oxDocs.Count
        If oxDocs.Item(k).SavedPath = p And p <> "" Then
            Set c = New OXComp
            c.Init comps.Count + 1, oxDocs.Item(k).PartNo, "Part" & oxDocs.Item(k).PartNo & "-" & (comps.Count + 1)
            ' the stand-in puts the component somewhere near the point, as SOLIDWORKS does
            c.Xf.TX = x + 0.0123: c.Xf.TY = y - 0.0456: c.Xf.TZ = z + 0.0078
            comps.Add c
            Set AddComponent5 = c
            Exit Function
        End If
    Next k
    OxNote "PROBLEM: AddComponent5 of a file that is not saved and open: " & p
End Function

Public Sub FixComponent()
    Dim k As Long
    For k = 1 To sel.Count
        If sel.Item(k).SelKind = "comp" Then sel.Item(k).Fixed = True
    Next k
End Sub

Public Sub UnfixComponent()
    Dim k As Long
    For k = 1 To sel.Count
        If sel.Item(k).SelKind = "comp" Then sel.Item(k).Fixed = False
    Next k
End Sub

Public Function EditDelete() As Boolean
    Dim k As Long
    Dim j As Long
    EditDelete = False
    For k = 1 To sel.Count
        If sel.Item(k).SelKind = "feat" Then
            If sel.Item(k).Kind = "Mate" Then
                For j = feats.Count To 1 Step -1
                    If feats.Item(j) Is sel.Item(k) Then feats.Remove j
                Next j
                sel.Item(k).Deleted = True
                EditDelete = True
            End If
        End If
    Next k
    Set lastAdded = Nothing
    If feats.Count > 0 Then
        If feats.Item(feats.Count).Kind = "Mate" Then Set lastAdded = feats.Item(feats.Count)
    End If
End Function

' Selects by name ("Front Plane@Part1-1@Assem1") or a face by a point in the assembly (m).
Public Function SelectByID2(n As String, t As String, x As Double, y As Double, z As Double, append As Boolean, mark As Long, co As Object, opt As Long) As Boolean
    Dim k As Long
    Dim j As Long
    Dim c As Object
    Dim q As Variant
    Dim e As Object
    Dim parts As Variant
    SelectByID2 = False
    If mark <> 1 Then OxNote "PROBLEM: SelectByID2 with mark " & mark
    If t = "FACE" And n = "" Then
        For k = 1 To comps.Count
            Set c = comps.Item(k)
            q = c.Xf.Back(x, y, z)
            For j = 1 To fN
                If fPart(j) = c.PartNo Then
                    If OxLen(OxSub(OxFaceClosest(j, q(0) * 1000#, q(1) * 1000#, q(2) * 1000#), OxV(q(0) * 1000#, q(1) * 1000#, q(2) * 1000#))) < 0.001 Then
                        Set e = New OXEnt
                        e.SelKind = "ent"
                        e.CompNo = k
                        e.FaceNo = j
                        SelectByID2 = SelAdd(e, append)
                        Exit Function
                    End If
                End If
            Next j
        Next k
        Exit Function
    End If
    parts = Split(n, "@")
    If UBound(parts) <> 2 Then Exit Function
    For k = 1 To comps.Count
        If comps.Item(k).Nm = parts(1) Then
            If Not OxDocOf(comps.Item(k).PartNo).FeatureNamed(parts(0)) Is Nothing Then
                Set e = New OXEnt
                e.SelKind = "ent"
                e.CompNo = k
                Set e.Feat = OxDocOf(comps.Item(k).PartNo).FeatureNamed(parts(0))
                SelectByID2 = SelAdd(e, append)
            End If
        End If
    Next k
End Function

' kind (1 plane, 2 axis, 3 component), point (mm, 3), direction (3), component number, of a selected thing, in the assembly
Private Function Geo(o As Object) As Variant
    Dim g(0 To 7) As Double
    Dim c As Object
    Dim p As Variant
    Dim d As Variant
    Dim w As Variant
    Dim v As Variant
    Dim isAx As Boolean
    Geo = g
    If o.SelKind = "comp" Then
        g(0) = 3
        g(7) = o.CompNo
        Geo = g
        Exit Function
    End If
    If o.SelKind = "feat" Then
        g(0) = 1
        d = OxPlaneN(o.PlaneNo)
        g(4) = d(0): g(5) = d(1): g(6) = d(2)
        Geo = g
        Exit Function
    End If
    Set c = comps.Item(o.CompNo)
    g(7) = o.CompNo
    If o.FaceNo > 0 Then
        p = OxV(fG(o.FaceNo, 0), fG(o.FaceNo, 1), fG(o.FaceNo, 2))
        d = OxV(fG(o.FaceNo, 3), fG(o.FaceNo, 4), fG(o.FaceNo, 5))
        isAx = (fKind(o.FaceNo) = "C")
    ElseIf o.Feat.Kind = "RefAxis" Then
        p = OxV(o.Feat.PX, o.Feat.PY, o.Feat.PZ)
        d = OxV(o.Feat.DX, o.Feat.DY, o.Feat.DZ)
        isAx = True
    Else
        p = OxV(0, 0, 0)
        d = OxPlaneN(o.Feat.PlaneNo)
    End If
    w = c.Xf.Apply(p(0) / 1000#, p(1) / 1000#, p(2) / 1000#, False)
    v = c.Xf.Apply(d(0), d(1), d(2), True)
    g(0) = IIf(isAx, 2, 1)
    g(1) = w(0) * 1000#: g(2) = w(1) * 1000#: g(3) = w(2) * 1000#
    g(4) = v(0): g(5) = v(1): g(6) = v(2)
    Geo = g
End Function

Private Function SelKey() As String
    Dim k As Long
    Dim g As Variant
    Dim j As Long
    For k = 1 To sel.Count
        g = Geo(sel.Item(k))
        For j = 0 To 7
            SelKey = SelKey & OxNum(CDbl(Int(g(j) * 1000 + 0.5))) & ","
        Next j
    Next k
End Function

Private Function Rel(al As Long, dot As Double) As Boolean
    Rel = True
    If al = swMateAlignALIGNED Then Rel = (dot > 0)
    If al = swMateAlignANTI_ALIGNED Then Rel = (dot < 0)
    If al = swMateAlignCLOSEST And OxOn("closest_flips") Then Rel = False
End Function

' Does the mate hold where the components are now?
Public Function Holds(mt As Long, al As Long, fl As Boolean, nums As Variant, s As Collection) As Boolean
    Dim a As Variant
    Dim b As Variant
    Dim na As Variant
    Dim nb As Variant
    Dim pa As Variant
    Dim pb As Variant
    Dim dot As Double
    Dim dist As Double
    Dim ang As Double
    Dim tmp As Variant
    Holds = False
    If s.Count <> 2 Then Exit Function
    a = Geo(s.Item(1))
    b = Geo(s.Item(2))
    If mt = swMateLOCK Then
        Holds = (a(0) = 3 And b(0) = 3)
        Exit Function
    End If
    If a(0) = 3 Or b(0) = 3 Then Exit Function
    If a(0) > b(0) Then
        tmp = a: a = b: b = tmp
    End If
    pa = OxV(a(1), a(2), a(3)): na = OxV(a(4), a(5), a(6))
    pb = OxV(b(1), b(2), b(3)): nb = OxV(b(4), b(5), b(6))
    dot = OxDot(na, nb)
    Select Case mt
        Case swMateCOINCIDENT
            If a(0) = 1 And b(0) = 1 Then
                Holds = Abs(Abs(dot) - 1) < 0.000001 And Abs(OxDot(OxSub(pb, pa), na)) < 0.001 And Rel(al, dot)
            ElseIf a(0) = 1 And b(0) = 2 Then
                Holds = Abs(dot) < 0.000001 And Abs(OxDot(OxSub(pb, pa), na)) < 0.001
            Else
                Holds = Abs(Abs(dot) - 1) < 0.000001 And OxLen(OxCross(OxSub(pb, pa), na)) < 0.001 And Rel(al, dot)
            End If
        Case swMateCONCENTRIC
            Holds = a(0) = 2 And b(0) = 2 And Abs(Abs(dot) - 1) < 0.000001 And OxLen(OxCross(OxSub(pb, pa), na)) < 0.001 And Rel(al, dot)
        Case swMatePARALLEL
            Holds = Abs(Abs(dot) - 1) < 0.000001 And Rel(al, dot)
        Case swMatePERPENDICULAR
            Holds = Abs(dot) < 0.000001
        Case swMateDISTANCE
            If a(0) <> 1 Or b(0) <> 1 Then Exit Function
            dist = OxDot(OxSub(pb, pa), na)
            If Abs(Abs(dot) - 1) > 0.000001 Then Exit Function
            If Abs(nums(1) - nums(2)) > 0.0000001 Then
                Holds = Abs(dist) >= nums(2) * 1000# - 0.001 And Abs(dist) <= nums(1) * 1000# + 0.001 And Rel(al, dot)
            Else
                Holds = Abs(Abs(dist) - nums(0) * 1000#) < 0.001 And Rel(al, dot) And (((dist >= 0) = (Not fl)) Xor OxOn("flip_other_way"))
            End If
        Case swMateANGLE
            ang = OxAcos(dot)
            If Abs(nums(4) - nums(5)) > 0.0000001 Then
                ang = OxAcos(Abs(dot))
                Holds = ang >= nums(5) - 0.00001 And ang <= nums(4) + 0.00001
            Else
                If al = swMateAlignALIGNED Then
                    Holds = Abs(ang - nums(3)) < 0.00001
                ElseIf al = swMateAlignANTI_ALIGNED Then
                    Holds = Abs(3.14159265358979 - ang - nums(3)) < 0.00001
                Else
                    Holds = (Abs(ang - nums(3)) < 0.00001 Or Abs(3.14159265358979 - ang - nums(3)) < 0.00001) And Not OxOn("closest_flips")
                End If
            End If
    End Select
End Function

Public Function AddMate5(mt As Long, al As Long, fl As Boolean, d As Double, dmax As Double, dmin As Double, gn As Double, gd As Double, _
                         ang As Double, amax As Double, amin As Double, posOnly As Boolean, lockRot As Boolean, wOpt As Long, st As Long) As Object
    Dim f As Object
    Dim nums(0 To 5) As Double
    Dim k As Long
    Dim c As Object
    Dim moved As Boolean
    Dim key As String
    Set AddMate5 = Nothing
    st = 0
    nCalls = nCalls + 1
    If sel.Count <> 2 Then
        st = 3
        OxNote "PROBLEM: AddMate5 with " & sel.Count & " selected"
        Exit Function
    End If
    If OxOn("first_try_errors") Then
        key = SelKey()
        If key <> lastKey Then
            lastKey = key
            st = 4
            Exit Function
        End If
    End If
    nums(0) = d: nums(1) = dmax: nums(2) = dmin: nums(3) = ang: nums(4) = amax: nums(5) = amin
    nMate = nMate + 1
    Set f = New OXFeat
    f.Init "Mate", Choose(mt + 1, "Coincident", "Concentric", "Perpendicular", "Parallel", "Tangent", "Distance", "Angle", "", "", "", "", "", "", "", "", "", "Lock") & nMate, 0, Me
    f.MType = mt: f.MAlign = al: f.MFlip = fl
    Set f.MSel = sel
    f.MNum = nums
    If Not Holds(mt, al, fl, nums, sel) Then
        ' SOLIDWORKS would solve: a free component of the two moves
        For k = 1 To sel.Count
            If sel.Item(k).SelKind <> "feat" And Not moved Then
                Set c = comps.Item(sel.Item(k).CompNo)
                If Not c.Fixed Then
                    c.Xf.TX = c.Xf.TX + 0.005
                    moved = True
                End If
            End If
        Next k
        If Not moved Then
            st = 6
            nMate = nMate - 1
            Exit Function
        End If
    End If
    feats.Add f
    Set lastAdded = f
    st = swAddMateError_NoError
    Set sel = New Collection
    Set AddMate5 = f
End Function

Public Function Dump() As String
    Dim s As String
    Dim k As Long
    Dim f As Object
    If Not IsAsm Then Exit Function
    For k = 1 To comps.Count
        s = s & "COMP|" & k & "|" & IIf(comps.Item(k).Fixed, "fixed", "free") & "|" & comps.Item(k).Xf.Text() & Chr(10)
    Next k
    For k = 1 To feats.Count
        Set f = feats.Item(k)
        If f.Kind = "Mate" Then s = s & "MATE|" & f.FName & "|" & IIf(Holds(f.MType, f.MAlign, f.MFlip, f.MNum, f.MSel), "holds", "BROKEN") & Chr(10)
    Next k
    Dump = s
End Function
