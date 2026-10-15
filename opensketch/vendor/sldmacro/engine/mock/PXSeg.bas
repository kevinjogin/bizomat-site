Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' A sketch segment: line (L), arc (A), circle (C) or construction line (N).
Public Kind As String               ' "Seg"
Public T As String
Public PA As Object                 ' start, end, centre
Public PB As Object
Public PC As Object
Public Rmm As Double                ' circle radius, mm
Public Way As Long

Public Function Select4(append As Boolean, data As Object) As Boolean
    Select4 = False
    Select4 = pxDoc.SelAdd(Me, data.Mark, append)
End Function

Public Function GetStartPoint2() As Object
    Set GetStartPoint2 = Nothing
    If PxOn("no_points") Then Err.Raise 438, , "no GetStartPoint2"
    If T = "A" And Way = -1 And PxOn("arc_ends_swapped") Then
        Set GetStartPoint2 = PB
    Else
        Set GetStartPoint2 = PA
    End If
End Function

Public Function GetEndPoint2() As Object
    Set GetEndPoint2 = Nothing
    If PxOn("no_points") Then Err.Raise 438, , "no GetEndPoint2"
    If T = "A" And Way = -1 And PxOn("arc_ends_swapped") Then
        Set GetEndPoint2 = PA
    Else
        Set GetEndPoint2 = PB
    End If
End Function

Public Function GetCenterPoint2() As Object
    Set GetCenterPoint2 = Nothing
    If PxOn("no_points") Then Err.Raise 438, , "no GetCenterPoint2"
    Set GetCenterPoint2 = PC
End Function

Public Function GetRadius() As Double
    GetRadius = 0
    If T = "C" Then
        GetRadius = Rmm / 1000#
    ElseIf T = "A" Then
        GetRadius = Sqr((PA.X - PC.X) ^ 2 + (PA.Y - PC.Y) ^ 2)
    End If
End Function
