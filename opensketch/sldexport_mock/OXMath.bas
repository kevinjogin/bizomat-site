Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' MathUtility. How SOLIDWORKS reads the 9 rotation numbers of a transform is not settled by its help: by
' default this stand-in reads them row by row as R (p' = R p + t); the switch xf_transposed reads them the
' other way. The macro has to place every component right either way.

Public Function CreateTransform(a As Variant) As Object
    Dim x As Object
    Set CreateTransform = Nothing
    Set x = New OXXf
    x.SetArray a
    Set CreateTransform = x
End Function

Public Function CreatePoint(a As Variant) As Object
    Dim p As Object
    Set CreatePoint = Nothing
    Set p = New OXPt
    p.Init a(0), a(1), a(2), False
    Set CreatePoint = p
End Function

Public Function CreateVector(a As Variant) As Object
    Dim p As Object
    Set CreateVector = Nothing
    Set p = New OXPt
    p.Init a(0), a(1), a(2), True
    Set CreateVector = p
End Function
