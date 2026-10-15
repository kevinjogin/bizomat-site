Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' A face or an edge of the part. The stand-in knows it only by one point on it (mm) and, for an edge a sketch
' refers to, by what it is in the sketch plane.
Public Kind As String               ' "Face" or "Edge"
Public Idx As Long
Public PX As Double
Public PY As Double
Public PZ As Double
Public GT As String                 ' "", "L" (through G0,G1 and G2,G3) or "C" (centre G0,G1, radius G2)
Public G0 As Double
Public G1 As Double
Public G2 As Double
Public G3 As Double
Public Droppable As Boolean         ' an edge of a radius that the "edges_missing" scenario leaves out
Public IsNeutral As Boolean         ' a flat face that some draft uses as its neutral plane
Public ForSketch As Boolean         ' an edge a sketch refers to (as the part is while its bosses and cuts are being made)
Public ForFinish As Boolean         ' an edge a chamfer or a radius is made on (as the part is after its drafts)

Public Function GetClosestPointOn(qx As Double, qy As Double, qz As Double) As Variant
    GetClosestPointOn = Empty
    Dim a(0 To 4) As Double
    Dim sh As Double
    If PxOn("no_closest") Then Err.Raise 438, , "no GetClosestPointOn"
    If PxOn("ents_shifted") Then sh = 0.02
    If PxOn("ents_far") Then sh = 0.2
    a(0) = (PX + sh) / 1000#
    a(1) = (PY + sh) / 1000#
    a(2) = (PZ + sh / 2#) / 1000#
    GetClosestPointOn = a
End Function

Public Function Select4(append As Boolean, data As Object) As Boolean
    Select4 = False
    Select4 = pxDoc.SelAdd(Me, data.Mark, append)
End Function
