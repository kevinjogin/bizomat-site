Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' A feature: the origin, a standard plane, a reference axis, or a mate (in the assembly).
Public SelKind As String            ' "feat"
Public Kind As String               ' OriginProfileFeature, RefPlane, RefAxis, Mate
Public FName As String
Public PlaneNo As Long
Public PX As Double
Public PY As Double
Public PZ As Double
Public DX As Double                 ' a reference axis: its direction (it passes through the origin)
Public DY As Double
Public DZ As Double
Public Owner As Object
Public Deleted As Boolean
' a mate: what it holds and its numbers
Public MType As Long
Public MAlign As Long
Public MFlip As Boolean
Public MSel As Collection
Public MNum As Variant

Public Sub Init(k As String, nm As String, pno As Long, own As Object)
    SelKind = "feat"
    Kind = k
    FName = nm
    PlaneNo = pno
    Set Owner = own
End Sub

Property Get Name() As String
    Name = FName
End Property

Public Function GetTypeName2() As String
    GetTypeName2 = Kind
End Function

Public Function GetNextFeature() As Object
    Set GetNextFeature = Nothing
    Set GetNextFeature = Owner.NextOf(Me)
End Function

Public Function Select2(append As Boolean, mark As Long) As Boolean
    Select2 = False
    Select2 = Owner.SelAdd(Me, append)
End Function
