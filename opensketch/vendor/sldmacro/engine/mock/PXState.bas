' Shared state of the stand-in for SOLIDWORKS part modelling, second version (LibreOffice Basic).
' See run_parts_mock.py.
Option VBASupport 1
Option Explicit

Public pxDoc As Object              ' the part document that is open
Public pxTheApp As Object
Public pxOpt As String              ' scenario switches, comma separated
Public pxFolder As String
Public pxTrace As String
Public pxDocs As Long
Public pxNextPart As Long           ' the part number the macro is about to open a document for
Public pxAllDocs As Collection

Public Const swDefaultTemplatePart As Long = 8
Public Const swShowErrorsEveryRebuild As Long = 100
Public Const swInputDimValOnCreate As Long = 10
Public Const swSketchOverdefiningDimsPromptToSetState As Long = 300
Public Const swSketchOverdefiningDimsSetDrivenByDefault As Long = 301
Public pxToggle(0 To 3) As Boolean  ' the four system options above
Public pxToggle0(0 To 3) As Boolean ' as they were before the macro ran

' What each feature of each part should be (filled by PXTruth.LoadTruth, generated from expected.json).
Public tParts As Long
Public tArcFailR As Double          ' scenario arc_fails: arcs of this radius (mm) cannot be drawn
Public tTitle(1 To 24) As String
Public tSteps(1 To 24) As Long
Public tKind(1 To 24, 1 To 80) As String        ' ex, mk, dr, ch, fi
Public tName(1 To 24, 1 To 80) As String
Public tSegs(1 To 24, 1 To 80) As Long          ' ex / mk: the sketch
Public tSum(1 To 24, 1 To 80) As Double
Public tCut(1 To 24, 1 To 80) As Boolean
Public tDraft(1 To 24, 1 To 80) As Double
Public tFixed(1 To 24, 1 To 80) As Boolean        ' ex: a traced outline, fixed like a sign (FixAll), not dimensioned
Public tNarrow(1 To 24, 1 To 80) As Boolean       ' a wall angle of its own: the outline shrinks with depth (signs, most countersinks)
Public tNRel(1 To 24, 1 To 80) As Long
Public tNMerge(1 To 24, 1 To 80) As Long
Public tNDim(1 To 24, 1 To 80) As Long
Public tN(1 To 24, 1 To 80) As Long             ' every way the feature call could be read; 0 is the feature as designed
Public rZ0(1 To 24, 1 To 80, 0 To 7) As Double
Public rZ1(1 To 24, 1 To 80, 0 To 7) As Double
Public rWiden(1 To 24, 1 To 80, 0 To 7) As Boolean
Public rDv(1 To 24, 1 To 80, 0 To 7) As Double
Public rDm(1 To 24, 1 To 80, 0 To 7) As Double
Public rBodies(1 To 24, 1 To 80, 0 To 7) As Long
Public tDv(1 To 24, 1 To 80) As Double          ' dr, ch, fi
Public tDm(1 To 24, 1 To 80) As Double
Public tFlipDv(1 To 24, 1 To 80) As Double      ' dr: leaning the other way
Public tFlipDm(1 To 24, 1 To 80) As Double
Public tVal(1 To 24, 1 To 80) As Double         ' dr: angle in degrees; ch: size; fi: radius (mm)
Public tFront(1 To 24, 1 To 80) As Boolean      ' dr: the neutral plane is the Front plane
' Points on the part: a face to draft (F), a neutral face (N), an edge to chamfer or round (E), an edge a sketch
' refers to (R, with what it is in the sketch plane: a line through two points or a circle).
Public eN As Long
Public eP(1 To 30000) As Long
Public eS(1 To 30000) As Long
Public eK(1 To 30000) As String
Public eX(1 To 30000) As Double
Public eY(1 To 30000) As Double
Public eZ(1 To 30000) As Double
Public eT(1 To 30000) As String
Public eG(1 To 30000, 0 To 3) As Double

Function PxApp() As Object
    If pxTheApp Is Nothing Then Set pxTheApp = New PXSw
    Set PxApp = pxTheApp
End Function

Function PxOn(flag As String) As Boolean
    PxOn = (InStr("," & pxOpt & ",", "," & flag & ",") > 0)
End Function

Sub PxNote(s As String)
    pxTrace = pxTrace & s & Chr(10)
End Sub

Sub PxMsg(s As String, Optional style As Variant, Optional title As Variant)
    PxNote "MSGBOX: " & s
End Sub

Function PxNum(x As Double) As String
    PxNum = Trim(Str(x))
End Function

Function PxToggleIdx(id As Long) As Long
    Select Case id
        Case 100
            PxToggleIdx = 0
        Case 10
            PxToggleIdx = 1
        Case 300
            PxToggleIdx = 2
        Case 301
            PxToggleIdx = 3
        Case Else
            PxToggleIdx = -1
    End Select
End Function

' which boss / cut / mark of a part a sketch belongs to, from how many segments it has and the sum of the
' squares of its numbers (mm)
Function PxStepOf(p As Long, n As Long, total As Double) As Long
    Dim i As Long
    PxStepOf = 0
    If p < 1 Or p > tParts Then Exit Function
    For i = 1 To tSteps(p)
        If tKind(p, i) = "ex" Or tKind(p, i) = "mk" Then
            If tSegs(p, i) = n And n > 0 And Abs(tSum(p, i) - total) < 0.001 Then
                PxStepOf = i
                Exit Function
            End If
        End If
    Next i
End Function

Function PxRun(opts As String, folder As String) As String
    Dim i As Long
    pxOpt = opts
    pxFolder = folder
    pxTrace = ""
    Set pxDoc = Nothing
    Set pxTheApp = Nothing
    Set pxAllDocs = New Collection
    pxDocs = 0
    pxNextPart = 0
    pxToggle0(0) = True
    pxToggle0(1) = True
    pxToggle0(2) = True
    pxToggle0(3) = False
    For i = 0 To 3
        pxToggle(i) = pxToggle0(i)
    Next i
    On Error GoTo broke
    LoadTruth
    main
    For i = 1 To pxAllDocs.Count
        PxNote pxAllDocs.Item(i).Dump()
    Next i
    For i = 0 To 3
        If pxToggle(i) <> pxToggle0(i) Then PxNote "PROBLEM: system option " & i & " was not put back"
    Next i
    PxRun = pxTrace
    Exit Function
broke:
    PxRun = pxTrace & "PROBLEM: BASIC ERROR " & Err & ": " & Error$ & " (line " & Erl & ")"
End Function
