' Shared state of the assembly stand-in (LibreOffice Basic). See ../sldexport_standin.py.
Option VBASupport 1
Option Explicit

Public oxTheApp As Object
Public oxTheMath As Object
Public oxAsm As Object
Public oxOpt As String
Public oxTrace As String
Public oxFolder As String
Public oxDocs As Collection          ' part documents, in the order they were opened

Public Const swMateCOINCIDENT As Long = 0
Public Const swMateCONCENTRIC As Long = 1
Public Const swMatePERPENDICULAR As Long = 2
Public Const swMatePARALLEL As Long = 3
Public Const swMateDISTANCE As Long = 5
Public Const swMateANGLE As Long = 6
Public Const swMateLOCK As Long = 16
Public Const swMateAlignALIGNED As Long = 0
Public Const swMateAlignANTI_ALIGNED As Long = 1
Public Const swMateAlignCLOSEST As Long = 2
Public Const swAddMateError_NoError As Long = 1
Public Const swDefaultTemplateAssembly As Long = 9

' Truth (filled by OXTruth.LoadTruth): parts, their faces in SOLIDWORKS part coordinates (mm), components.
Public tNP As Long
Public tStep(1 To 60) As String      ' file name a part is imported from
Public tTitle(1 To 60) As String
Public fN As Long
Public fPart(1 To 6000) As Long
Public fKind(1 To 6000) As String     ' P plane (point, outward normal), C cylinder (axis point, dir, radius)
Public fG(1 To 6000, 0 To 6) As Double
Public fB(1 To 6000, 0 To 5) As Double  ' box of the face
Public tNC As Long
Public tFixed(1 To 200) As Boolean

Function OxSwApp() As Object
    If oxTheApp Is Nothing Then Set oxTheApp = New OXApp
    Set OxSwApp = oxTheApp
End Function

Function OxOn(flag As String) As Boolean
    OxOn = (InStr("," & oxOpt & ",", "," & flag & ",") > 0)
End Function

Sub OxNote(s As String)
    oxTrace = oxTrace & s & Chr(10)
End Sub

Sub OxMsg(s As String, Optional style As Variant, Optional title As Variant)
    OxNote "MSGBOX: " & s
End Sub

Function OxDir(p As String) As String
    Dim k As Long
    Dim nm As String
    OxDir = ""
    k = InStrRev(p, "\")
    nm = Mid$(p, k + 1)
    If Left$(p, k - 1) = "C:\job\steps" Then
        For k = 1 To tNP
            If tStep(k) = nm Then OxDir = nm
        Next k
    End If
End Function

Sub OxMkDir(p As String)
End Sub

Function OxNum(x As Double) As String
    OxNum = Trim(Str(x))
End Function

Function OxRun(opts As String, folder As String) As String
    oxOpt = opts
    oxFolder = folder
    oxTrace = ""
    Set oxTheApp = Nothing
    Set oxTheMath = New OXMath
    Set oxAsm = Nothing
    Set oxDocs = New Collection
    On Error GoTo broke
    LoadTruth
    main
    If Not oxAsm Is Nothing Then OxNote oxAsm.Dump()
    OxRun = oxTrace
    Exit Function
broke:
    OxRun = oxTrace & "PROBLEM: BASIC ERROR " & Err & ": " & Error$ & " (line " & Erl & ")"
End Function

' ---- small vector helpers (arrays 0 To 2)
Function OxDot(a As Variant, b As Variant) As Double
    OxDot = a(0) * b(0) + a(1) * b(1) + a(2) * b(2)
End Function

Function OxCross(a As Variant, b As Variant) As Variant
    Dim c(0 To 2) As Double
    c(0) = a(1) * b(2) - a(2) * b(1)
    c(1) = a(2) * b(0) - a(0) * b(2)
    c(2) = a(0) * b(1) - a(1) * b(0)
    OxCross = c
End Function

Function OxSub(a As Variant, b As Variant) As Variant
    Dim c(0 To 2) As Double
    c(0) = a(0) - b(0)
    c(1) = a(1) - b(1)
    c(2) = a(2) - b(2)
    OxSub = c
End Function

Function OxLen(a As Variant) As Double
    OxLen = Sqr(OxDot(a, a))
End Function

Function OxV(x As Double, y As Double, z As Double) As Variant
    Dim c(0 To 2) As Double
    c(0) = x
    c(1) = y
    c(2) = z
    OxV = c
End Function

Function OxDocOf(pno As Long) As Object
    Dim k As Long
    Set OxDocOf = Nothing
    For k = 1 To oxDocs.Count
        If oxDocs.Item(k).PartNo = pno Then
            Set OxDocOf = oxDocs.Item(k)
            Exit Function
        End If
    Next k
End Function

Function OxClamp(v As Double, lo As Double, hi As Double) As Double
    OxClamp = v
    If v < lo Then OxClamp = lo
    If v > hi Then OxClamp = hi
End Function

' The point of face k (part mm) closest to q: on its plane or cylinder, kept inside the face's box.
Function OxFaceClosest(k As Long, qx As Double, qy As Double, qz As Double) As Variant
    Dim c(0 To 2) As Double
    Dim p As Variant
    Dim d As Variant
    Dim q As Variant
    Dim s As Double
    Dim w As Variant
    Dim r As Double
    q = OxV(qx, qy, qz)
    p = OxV(fG(k, 0), fG(k, 1), fG(k, 2))
    d = OxV(fG(k, 3), fG(k, 4), fG(k, 5))
    If fKind(k) = "P" Then
        s = OxDot(OxSub(q, p), d)
        c(0) = qx - s * d(0): c(1) = qy - s * d(1): c(2) = qz - s * d(2)
    ElseIf fKind(k) = "L" Then
        s = OxDot(OxSub(q, p), d)
        c(0) = p(0) + s * d(0): c(1) = p(1) + s * d(1): c(2) = p(2) + s * d(2)
    Else
        s = OxDot(OxSub(q, p), d)
        w = OxSub(q, OxV(p(0) + s * d(0), p(1) + s * d(1), p(2) + s * d(2)))
        r = OxLen(w)
        If r < 1E-9 Then
            w = OxCross(d, OxV(1, 0, 0))
            If OxLen(w) < 1E-6 Then w = OxCross(d, OxV(0, 1, 0))
            r = OxLen(w)
        End If
        c(0) = p(0) + s * d(0) + w(0) / r * fG(k, 6)
        c(1) = p(1) + s * d(1) + w(1) / r * fG(k, 6)
        c(2) = p(2) + s * d(2) + w(2) / r * fG(k, 6)
    End If
    c(0) = OxClamp(c(0), fB(k, 0) - 0.000001, fB(k, 3) + 0.000001)
    c(1) = OxClamp(c(1), fB(k, 1) - 0.000001, fB(k, 4) + 0.000001)
    c(2) = OxClamp(c(2), fB(k, 2) - 0.000001, fB(k, 5) + 0.000001)
    OxFaceClosest = c
End Function

Function OxPlaneN(n As Long) As Variant
    If n = 1 Then
        OxPlaneN = OxV(0, 0, 1)
    ElseIf n = 2 Then
        OxPlaneN = OxV(0, 1, 0)
    Else
        OxPlaneN = OxV(1, 0, 0)
    End If
End Function

Function OxAcos(x As Double) As Double
    If x >= 1 Then
        OxAcos = 0
    ElseIf x <= -1 Then
        OxAcos = 3.14159265358979
    Else
        OxAcos = Atn(-x / Sqr(-x * x + 1)) + 2 * Atn(1)
    End If
End Function
