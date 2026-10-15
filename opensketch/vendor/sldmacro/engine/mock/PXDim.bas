Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' A dimension (the display dimension and the dimension behind it are the same object here).
Public V As Double                  ' metres

Public Function GetDimension2(i As Long) As Object
    Set GetDimension2 = Nothing
    If PxOn("dim_unreadable") Then Err.Raise 438, , "no GetDimension2"
    Set GetDimension2 = Me
End Function

Property Get SystemValue() As Double
    SystemValue = V
End Property
