Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

Public SelKind As String            ' "comp"
Public CompNo As Long
Public PartNo As Long
Public Nm As String
Public Xf As Object                 ' the true placement (rotation, translation in m)
Public Fixed As Boolean

Public Sub Init(no As Long, pno As Long, n As String)
    SelKind = "comp"
    CompNo = no
    PartNo = pno
    Nm = n
    Set Xf = New OXXf
    Xf.R00 = 1#: Xf.R11 = 1#: Xf.R22 = 1#
End Sub

Property Get Name2() As String
    Name2 = Nm
End Property

Property Get Transform2() As Object
    Set Transform2 = Nothing
    Set Transform2 = Xf.Copy()
End Property

Property Set Transform2(x As Object)
    Set Xf = x.Copy()
End Property

Property Let Transform2(x As Object)
    Set Xf = x.Copy()
End Property

Public Function GetCorresponding(o As Object) As Object
    Dim e As Object
    Set GetCorresponding = Nothing
    If OxOn("no_corresponding") Then Err.Raise 438, , "no GetCorresponding"
    Set e = New OXEnt
    e.SelKind = "ent"
    e.CompNo = CompNo
    e.FaceNo = o.FaceNo
    If fPart(o.FaceNo) <> PartNo Then OxNote "PROBLEM: GetCorresponding with a face of another part"
    Set GetCorresponding = e
End Function

Public Function GetCorrespondingEntity(o As Object) As Object
    Set GetCorrespondingEntity = Nothing
    If OxOn("no_corresponding") Then Err.Raise 438, , "no GetCorrespondingEntity"
    Set GetCorrespondingEntity = GetCorresponding(o)
End Function

Public Function FeatureByName(n As String) As Object
    Dim f As Object
    Dim e As Object
    Set FeatureByName = Nothing
    If OxOn("no_feature_by_name") Then Exit Function
    Set f = OxDocOf(PartNo).FeatureNamed(n)
    If f Is Nothing Then Exit Function
    Set e = New OXEnt
    e.SelKind = "ent"
    e.CompNo = CompNo
    Set e.Feat = f
    Set FeatureByName = e
End Function

Public Function Select4(append As Boolean, sd As Object, popup As Boolean) As Boolean
    Select4 = False
    Select4 = oxAsm.SelAdd(Me, append)
End Function

Public Function GetBodies3(t As Long, info As Variant) As Variant
    Dim a(0 To 0) As Object
    Dim bd As Object
    GetBodies3 = Empty
    If OxOn("no_comp_bodies") Then Err.Raise 438, , "no GetBodies3"
    Set bd = New OXBody
    bd.PartNo = PartNo
    bd.CompNo = CompNo
    Set a(0) = bd
    GetBodies3 = a
End Function
