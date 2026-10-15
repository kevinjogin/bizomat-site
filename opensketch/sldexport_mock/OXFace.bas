Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' A face of a part, in part coordinates (mm in the truth, m through the API).
Public FaceNo As Long
Public CompNo As Long               ' > 0: a face of a component's body, in the assembly
Public SelKind As String            ' "ent" once it belongs to a component
Public Feat As Object

Public Function GetClosestPointOn(qx As Double, qy As Double, qz As Double) As Variant
    Dim a(0 To 4) As Double
    Dim q As Variant
    GetClosestPointOn = Empty
    Dim w As Variant
    Dim xf As Object
    If CompNo > 0 And Not OxOn("comp_bodies_part_space") Then
        Set xf = oxAsm.CompXf(CompNo)
        w = xf.Back(qx, qy, qz)
        q = OxFaceClosest(FaceNo, w(0) * 1000#, w(1) * 1000#, w(2) * 1000#)
        q = xf.Apply(q(0) / 1000#, q(1) / 1000#, q(2) / 1000#, False)
        a(0) = q(0): a(1) = q(1): a(2) = q(2)
    Else
        q = OxFaceClosest(FaceNo, qx * 1000#, qy * 1000#, qz * 1000#)
        a(0) = q(0) / 1000#
        a(1) = q(1) / 1000#
        a(2) = q(2) / 1000#
    End If
    GetClosestPointOn = a
End Function

Public Function Select4(append As Boolean, sd As Object) As Boolean
    Select4 = False
    If CompNo = 0 Then
        Select4 = OxDocOf(fPart(FaceNo)).SelAdd(Me, append)
        Exit Function
    End If
    If Not sd Is Nothing Then
        If sd.Mark <> 1 Then OxNote "PROBLEM: mate entity selected with mark " & sd.Mark
    End If
    Select4 = oxAsm.SelAdd(Me, append)
End Function
