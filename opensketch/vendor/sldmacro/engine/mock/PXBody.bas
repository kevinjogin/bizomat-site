Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

Public Share As Double

Public Function GetMassProperties(density As Double) As Variant
    GetMassProperties = Empty
    Dim a(0 To 11) As Double
    If PxOn("com_error") Then Err.Raise 438, , "no mass properties"
    a(3) = pxDoc.Vol * Share * 0.000000001
    If Not PxOn("no_com") And pxDoc.Vol <> 0 Then a(2) = pxDoc.Mz / pxDoc.Vol / 1000#
    If PxOn("com_mm") Then a(2) = a(2) * 1000#          ' centre of mass in other units than the macro expects
    GetMassProperties = a
End Function

Public Function GetFaces() As Variant
    GetFaces = Empty
    GetFaces = pxDoc.Ents("Face")
End Function

Public Function GetEdges() As Variant
    GetEdges = Empty
    GetEdges = pxDoc.Ents("Edge")
End Function

Public Function GetExtremePoint(dx As Double, dy As Double, dz As Double, ox As Double, oy As Double, oz As Double) As Boolean
    GetExtremePoint = False
    If PxOn("no_extreme") Then Err.Raise 438, , "no GetExtremePoint"
    ox = 0.123
    oy = 0.456
    oz = 0.789
    If dz > 0.5 Then oz = pxDoc.ZHi / 1000#
    If dz < -0.5 Then oz = pxDoc.ZLo / 1000#
    GetExtremePoint = True
End Function
