Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' A sketch point: the end or the centre of a segment, a point drawn on its own, or the origin.
Public Kind As String               ' "Pt"
Public X As Double                  ' metres, as SOLIDWORKS gives them
Public Y As Double
Public IsOrigin As Boolean

Public Function Select4(append As Boolean, data As Object) As Boolean
    Select4 = False
    Select4 = pxDoc.SelAdd(Me, data.Mark, append)
End Function
