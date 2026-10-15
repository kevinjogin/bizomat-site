Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' Something of a component in the context of the assembly: one of its faces, planes or axes.
Public SelKind As String            ' "ent"
Public CompNo As Long
Public FaceNo As Long               ' a face, or 0
Public Feat As Object               ' a plane or axis of the part, or Nothing

Public Function Select4(append As Boolean, sd As Object) As Boolean
    Select4 = False
    If sd Is Nothing Then OxNote "PROBLEM: Select4 without SelectData"
    If Not sd Is Nothing Then
        If sd.Mark <> 1 Then OxNote "PROBLEM: mate entity selected with mark " & sd.Mark
    End If
    Select4 = oxAsm.SelAdd(Me, append)
End Function

Public Function Select2(append As Boolean, mark As Long) As Boolean
    Select2 = False
    If mark <> 1 Then OxNote "PROBLEM: mate entity selected with mark " & mark
    Select2 = oxAsm.SelAdd(Me, append)
End Function
