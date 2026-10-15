Option VBASupport 1
Option Compatible
Option ClassModule
Option Explicit

' Stand-in for ISldWorks: templates, new documents, STEP import, the MathUtility.

Public Function RevisionNumber() As String
    RevisionNumber = "30.0.0 (assembly stand-in)"
End Function

Public Function GetUserPreferenceStringValue(id As Long) As String
    GetUserPreferenceStringValue = ""
    If id <> swDefaultTemplateAssembly Then OxNote "PROBLEM: template preference " & id
    If Not OxOn("no_asm_template") Then GetUserPreferenceStringValue = "asm.asmdot"
End Function

Public Function NewDocument(tmpl As String, a As Long, b As Double, c As Double) As Object
    Dim d As Object
    Set NewDocument = Nothing
    If tmpl <> "asm.asmdot" Then Exit Function
    Set d = New OXDoc
    d.InitAsm
    Set oxAsm = d
    Set NewDocument = d
End Function

Public Function GetMathUtility() As Object
    Set GetMathUtility = Nothing
    Set GetMathUtility = oxTheMath
End Function

Public Function GetCurrentMacroPathFolder() As String
    GetCurrentMacroPathFolder = "C:\job"
End Function

Public Function GetImportFileData(p As String) As Object
    Set GetImportFileData = Nothing
    Set GetImportFileData = New OXSD
End Function

Public Function LoadFile4(p As String, arg As String, impData As Object, errs As Long) As Object
    Dim k As Long
    Dim nm As String
    Dim d As Object
    Set LoadFile4 = Nothing
    errs = 0
    nm = Mid$(p, InStrRev(p, "\") + 1)
    If Left$(p, InStrRev(p, "\") - 1) <> "C:\job\steps" Then OxNote "PROBLEM: STEP file looked for in " & p
    For k = 1 To tNP
        If tStep(k) = nm Then
            Set d = New OXDoc
            d.InitPart k
            oxDocs.Add d
            Set LoadFile4 = d
            Exit Function
        End If
    Next k
    errs = 2
End Function
