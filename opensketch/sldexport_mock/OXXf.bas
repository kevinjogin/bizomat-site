Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

Public R00 As Double
Public R01 As Double
Public R02 As Double
Public R10 As Double
Public R11 As Double
Public R12 As Double
Public R20 As Double
Public R21 As Double
Public R22 As Double
Public TX As Double
Public TY As Double
Public TZ As Double

' the true rotation (column vectors) from the 16 numbers, read the way this stand-in's SOLIDWORKS reads them
Public Sub SetArray(a As Variant)
    If OxOn("xf_transposed") Then
        R00 = a(0): R10 = a(1): R20 = a(2)
        R01 = a(3): R11 = a(4): R21 = a(5)
        R02 = a(6): R12 = a(7): R22 = a(8)
    Else
        R00 = a(0): R01 = a(1): R02 = a(2)
        R10 = a(3): R11 = a(4): R12 = a(5)
        R20 = a(6): R21 = a(7): R22 = a(8)
    End If
    TX = a(9): TY = a(10): TZ = a(11)
End Sub

Property Get ArrayData() As Variant
    Dim a(0 To 15) As Double
    If OxOn("xf_transposed") Then
        a(0) = R00: a(1) = R10: a(2) = R20
        a(3) = R01: a(4) = R11: a(5) = R21
        a(6) = R02: a(7) = R12: a(8) = R22
    Else
        a(0) = R00: a(1) = R01: a(2) = R02
        a(3) = R10: a(4) = R11: a(5) = R12
        a(6) = R20: a(7) = R21: a(8) = R22
    End If
    a(9) = TX: a(10) = TY: a(11) = TZ: a(12) = 1#
    ArrayData = a
End Property

Public Function Apply(x As Double, y As Double, z As Double, isVec As Boolean) As Variant
    Dim c(0 To 2) As Double
    c(0) = R00 * x + R01 * y + R02 * z
    c(1) = R10 * x + R11 * y + R12 * z
    c(2) = R20 * x + R21 * y + R22 * z
    If Not isVec Then
        c(0) = c(0) + TX
        c(1) = c(1) + TY
        c(2) = c(2) + TZ
    End If
    Apply = c
End Function

' the inverse applied to a point
Public Function Back(x As Double, y As Double, z As Double) As Variant
    Dim c(0 To 2) As Double
    Dim u As Double
    Dim v As Double
    Dim w As Double
    u = x - TX: v = y - TY: w = z - TZ
    c(0) = R00 * u + R10 * v + R20 * w
    c(1) = R01 * u + R11 * v + R21 * w
    c(2) = R02 * u + R12 * v + R22 * w
    Back = c
End Function

Public Function Copy() As Object
    Dim x As Object
    Set Copy = Nothing
    Set x = New OXXf
    x.R00 = R00: x.R01 = R01: x.R02 = R02
    x.R10 = R10: x.R11 = R11: x.R12 = R12
    x.R20 = R20: x.R21 = R21: x.R22 = R22
    x.TX = TX: x.TY = TY: x.TZ = TZ
    Set Copy = x
End Function

Public Function Text() As String
    Text = OxNum(R00) & " " & OxNum(R01) & " " & OxNum(R02) & " " & OxNum(R10) & " " & OxNum(R11) & " " & OxNum(R12) & " " & _
           OxNum(R20) & " " & OxNum(R21) & " " & OxNum(R22) & " " & OxNum(TX) & " " & OxNum(TY) & " " & OxNum(TZ)
End Function
