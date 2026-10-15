Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' One stand-in for the origin, a default plane, a sketch and every kind of feature.
Public Kind As String               ' OriginProfileFeature, RefPlane, ProfileFeature, Extrusion, Cut, Draft, Chamfer, Fillet
Public FName As String
Public PlaneIdx As Long
Public Segs As String               ' a sketch's outline segments, mm
Public NSeg As Long
Public SumV As Double
Public Used As Boolean              ' the sketch is absorbed by a feature
Public State As String              ' how the sketch was defined when it was closed
Public Sketch As Object
Public StepNo As Long
Public Z0 As Double
Public Z1 As Double
Public DraftDeg As Double
Public Narrows As Boolean
Public Right As Boolean
Public Share As Double              ' how much of the step the feature covers (a fillet on some of its edges)
Public PrevVol As Double
Public PrevMz As Double
Public PrevBodies As Long

Property Get Name() As String
    Name = FName
End Property

Property Let Name(s As String)
    FName = s
End Property

Public Function GetTypeName2() As String
    GetTypeName2 = Kind
End Function

Public Function GetNextFeature() As Object
    Set GetNextFeature = Nothing
    Set GetNextFeature = pxDoc.NextOf(Me)
End Function

Public Function Select2(append As Boolean, mark As Long) As Boolean
    Select2 = False
    Select2 = pxDoc.SelAdd(Me, mark, append)
End Function

' ---- as a sketch

Public Function GetConstrainedStatus() As Long
    GetConstrainedStatus = 0
    If PxOn("status_unreadable") Then Err.Raise 438, , "no GetConstrainedStatus"
    GetConstrainedStatus = pxDoc.SkStatus()
End Function

Property Get RelationManager() As Object
    Set RelationManager = Nothing
    If PxOn("no_relcount") Then Err.Raise 438, , "no RelationManager"
    Set RelationManager = pxDoc
End Property
