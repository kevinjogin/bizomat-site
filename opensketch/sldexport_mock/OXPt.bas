Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

Public X As Double
Public Y As Double
Public Z As Double
Public IsVec As Boolean

Public Sub Init(a As Double, b As Double, c As Double, v As Boolean)
    X = a: Y = b: Z = c: IsVec = v
End Sub

Public Function MultiplyTransform(xf As Object) As Object
    Dim q As Variant
    Dim p As Object
    Set MultiplyTransform = Nothing
    q = xf.Apply(X, Y, Z, IsVec)
    Set p = New OXPt
    p.Init q(0), q(1), q(2), IsVec
    Set MultiplyTransform = p
End Function

Property Get ArrayData() As Variant
    Dim a(0 To 2) As Double
    a(0) = X: a(1) = Y: a(2) = Z
    ArrayData = a
End Property
