Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

Public Function RevisionNumber() As String
    RevisionNumber = "30.0.0 (stand-in)"
End Function

Public Function GetUserPreferenceStringValue(id As Long) As String
    GetUserPreferenceStringValue = ""
    If id <> 8 Then PxNote "PROBLEM: template preference " & id
    If Not PxOn("no_template") Then GetUserPreferenceStringValue = "part.prtdot"
End Function

Public Function NewDocument(tmpl As String, a As Long, b As Double, c As Double) As Object
    Set NewDocument = Nothing
    Dim d As Object
    If tmpl = "" Then Exit Function
    pxDocs = pxDocs + 1
    Set d = New PXDoc
    ' which part this document is going to be: the macro says so through a line the test adds to StartPart (a part
    ' may be left out, so counting documents is not enough)
    If pxNextPart < 1 Then pxNextPart = pxDocs
    d.Init pxNextPart
    Set pxDoc = d
    pxAllDocs.Add d
    Set NewDocument = d
End Function

Public Function GetUserPreferenceToggle(id As Long) As Boolean
    Dim k As Long
    GetUserPreferenceToggle = False
    k = PxToggleIdx(id)
    If k < 0 Then
        PxNote "PROBLEM: toggle " & id
        Exit Function
    End If
    GetUserPreferenceToggle = pxToggle(k)
End Function

Public Sub SetUserPreferenceToggle(id As Long, v As Boolean)
    Dim k As Long
    k = PxToggleIdx(id)
    If k < 0 Then
        PxNote "PROBLEM: toggle " & id
        Exit Sub
    End If
    pxToggle(k) = v
End Sub
