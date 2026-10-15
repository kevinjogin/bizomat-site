Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

Public PartNo As Long
Public CompNo As Long

Public Function GetFaces() As Variant
    GetFaces = Ents(False)
End Function

Public Function GetEdges() As Variant
    GetEdges = Ents(True)
End Function

Private Function Ents(wantEdges As Boolean) As Variant
    Dim a() As Object
    Dim k As Long
    Dim n As Long
    Dim f As Object
    Ents = Empty
    For k = 1 To fN
        If fPart(k) = PartNo And ((fKind(k) = "L") = wantEdges) Then n = n + 1
    Next k
    If n = 0 Then Exit Function
    ReDim a(0 To n - 1)
    n = 0
    For k = 1 To fN
        If fPart(k) = PartNo And ((fKind(k) = "L") = wantEdges) Then
            Set f = New OXFace
            f.FaceNo = k
            f.CompNo = CompNo
            If CompNo > 0 Then f.SelKind = "ent"
            Set a(n) = f
            n = n + 1
        End If
    Next k
    Ents = a
End Function
