'@@TITLE@@
' ---------------------------------------------------------------------------------------------
'@@INTRO@@
'
' How to run (SOLIDWORKS 2022)
'   Tools > Macro > New..., give it a name, then replace everything in the editor with this text
'   and press F5. Each part is built in a new part document from your default part template and
'   left open, unsaved. A log is written to your TEMP folder (@@LOGNAME@@); the message at the
'   end gives the full path.
'   To build one part only, put its key in ONLY below (the keys are in the list of parts).
'
' How each part is modelled
'   1. Extrudes and cuts. The first sketch is centred on the origin, so the Right and Top planes
'      are the part's centre planes (or, for a part on an axis, cross on that axis). The Front
'      plane is a main face of the part; the list below says which. Every sketch is on the Front
'      plane; a feature that starts higher or lower starts at an offset from it. A countersink
'      or lead-in cone is a cut with a 45 deg wall angle.
'   2. Draft features (neutral plane), one per feature drafted.
'   3. Chamfers.
'   4. Radii, in several Fillet features. (A chamfer that follows a rounded edge comes after
'      that radius; the notes say where.)
'   5. Signs and symbols, last.
'   Features keep the names SOLIDWORKS gives them. The log says what each one is.
'
' How the sketches are defined
'   A sketch is drawn at its exact size first. Then relations are added (horizontal, vertical,
'   tangent, equal, concentric, collinear, at midpoint, parallel, perpendicular) and dimensions
'   that tie it to what is already there: from the wall next to it, from the axis it belongs to,
'   between holes, an angle to a straight edge, and its own sizes. The first sketch is centred on
'   the origin (by construction lines through its middle, or by its centre). A bar at an angle is
'   drawn about a construction line down its middle. Signs, symbols and computed profiles (a cam,
'   for one) are traced outlines: each segment is fixed.
'   If a sketch is still not fully defined after that, the macro runs Fully Define Sketch on it
'   (AUTO_FINISH). If adding relations ever moves a line, the sketch is thrown away and drawn
'   again without them. The log gives the state of every sketch.
'
' How it checks itself
'   After each feature the macro measures the change in the part's volume and in volume x height
'   of the centre of mass, and compares them with the values worked out from the source model. A
'   feature that went the wrong way is deleted and made again the other way round.
'
'@@PARTS@@
'
' Notes
'@@NOTES@@
' ---------------------------------------------------------------------------------------------
Option Explicit

Private Const DEFINE_SKETCHES As Boolean = True     ' relations and dimensions on every sketch
Private Const AUTO_FINISH As Boolean = True         ' Fully Define Sketch on whatever is still free
Private Const MAKE_DRAFTS As Boolean = True
Private Const MAKE_CHAMFERS As Boolean = True
Private Const MAKE_RADII As Boolean = True
Private Const MAKE_MARKS As Boolean = True
Private Const ONLY As String = ""                   ' the key of one part (see the list above) to build only that one
Private Const LOG_NAME As String = "@@LOGNAME@@"

' swconst values, written out
Private Const END_BLIND As Long = 0                 ' swEndCondBlind
Private Const START_PLANE As Long = 0               ' swStartSketchPlane
Private Const START_OFFSET As Long = 3              ' swStartOffset
Private Const SOLID_BODY As Long = 0                ' swSolidBody
Private Const DELETE_ABSORBED As Long = 2           ' swDelete_Absorbed: the feature and its sketch
Private Const VIEW_ISO As Long = 7                  ' swIsometricView
Private Const CHAMFER_ANGLE_DISTANCE As Long = 1    ' swChamferAngleDistance
Private Const CHAMFER_TANGENT As Long = 4           ' swFeatureChamferTangentPropagation
Private Const FILLET_OPTIONS As Long = 195          ' propagate + uniform radius + attach edges + keep features
Private Const SK_UNDER As Long = 2                  ' swUnderConstrained
Private Const SK_FULL As Long = 3                   ' swFullyConstrained
Private Const K_PI As Double = 3.14159265358979
Private Const REL_START As Double = 0.000002        ' see Calibrate
Private Const REL_MAX As Double = 0.00002
Private Const FIND_TOL As Double = 0.00005          ' m: how close a face or an edge must pass to the point it is looked up by
Private Const LOOSE_TOL As Double = 0.0006          ' the same once a draft is missing (edges are then up to 0.5 mm from where they should be)
Private Const MAX_SEG As Long = 400
Private Const MAX_PROBE As Long = 400

Dim swApp As SldWorks.SldWorks
Dim gModel As SldWorks.ModelDoc2
Dim gPart As SldWorks.PartDoc
Dim gExt As SldWorks.ModelDocExtension
Dim gFront As SldWorks.Feature                      ' the Front plane: every sketch is on it
Dim gOrigin As String                               ' name of the origin feature
Dim gSketch As SldWorks.Feature                     ' the sketch just drawn
Dim gSkObj As SldWorks.Sketch                       ' the same, while it is open
Dim gPartNo As Long
Dim gPartTitle As String
Dim gLog As String
Dim gWhere As String                                ' what the macro is doing, for the log if it stops
Dim gMade As Long
Dim gProblems As Long
Dim gStop As Boolean
Dim gStopWhy As String
Dim gList As String
Dim gReport As String
Dim gSkFull As Long                                 ' sketches fully defined / not, over the part
Dim gSkNot As Long
' what has been learned about the feature flags (see Extrude)
Dim gDirRev(0 To 1) As Boolean                      ' 0 boss, 1 cut
Dim gDdirRev(0 To 1) As Boolean
Dim gFlip(0 To 7) As Boolean
Dim gDraftFlip(0 To 3) As Boolean
Dim gEdgeMark As Long
Dim gFindTol As Double
Dim gIsMark As Boolean                              ' the feature being made is a sign or symbol
Dim gIsTraced As Boolean                            ' the sketch being drawn is a traced outline: fixed, never Fully Define Sketch
Dim gRel As Double                                  ' how closely SOLIDWORKS' volumes agree with the design's (a fraction of the part)
Dim gUseM As Long                                   ' the centre of mass: 0 not tried yet, 1 used, -1 not usable
' the sketch being drawn
Dim gSeg(1 To MAX_SEG) As Object
Dim gKind(1 To MAX_SEG) As String                   ' L line, A arc, C circle, N construction line, P point
Dim gG(1 To MAX_SEG, 0 To 6) As Double              ' as drawn, mm
Dim gDrawn As Long
Dim gEd(1 To 60) As Object                          ' model edges a sketch's dimensions refer to
Dim gRelWant As Long
Dim gRelOk As Long
Dim gDimWant As Long
Dim gDimOk As Long
Dim gDimOff As Long
Dim gSkNote As String
' points a draft, chamfer or fillet finds its faces and edges by (mm)
Dim gPx(1 To MAX_PROBE) As Double
Dim gPy(1 To MAX_PROBE) As Double
Dim gPz(1 To MAX_PROBE) As Double
Dim gNP As Long

Sub main()

    Dim logPath As String
    Dim was(0 To 3) As Boolean
    Dim togglesSet As Boolean
    Dim mdl As Object

    On Error GoTo crashed
    gWhere = "starting"
    gLog = ""
    gReport = ""
    Erase gDirRev
    Erase gDdirRev
    Erase gFlip
    Erase gDraftFlip
    gEdgeMark = 1
    Set gModel = Nothing
    Set swApp = Application.SldWorks
    LogLine "@@LOGHEAD@@. SOLIDWORKS " & SwVersion()

    ' no boxes that wait for an answer while features and dimensions are made; all put back at the end
    gWhere = "switching four system options for the run"
    was(0) = swApp.GetUserPreferenceToggle(swUserPreferenceToggle_e.swShowErrorsEveryRebuild)
    was(1) = swApp.GetUserPreferenceToggle(swUserPreferenceToggle_e.swInputDimValOnCreate)
    was(2) = swApp.GetUserPreferenceToggle(swUserPreferenceToggle_e.swSketchOverdefiningDimsPromptToSetState)
    was(3) = swApp.GetUserPreferenceToggle(swUserPreferenceToggle_e.swSketchOverdefiningDimsSetDrivenByDefault)
    swApp.SetUserPreferenceToggle swUserPreferenceToggle_e.swShowErrorsEveryRebuild, False
    swApp.SetUserPreferenceToggle swUserPreferenceToggle_e.swInputDimValOnCreate, False
    swApp.SetUserPreferenceToggle swUserPreferenceToggle_e.swSketchOverdefiningDimsPromptToSetState, False
    swApp.SetUserPreferenceToggle swUserPreferenceToggle_e.swSketchOverdefiningDimsSetDrivenByDefault, True
    togglesSet = True

    BuildAll

finish:
    On Error Resume Next
    If Not gModel Is Nothing Then
        Set mdl = gModel
        mdl.ShowFeatureErrorDialog = True
    End If
    If togglesSet Then
        swApp.SetUserPreferenceToggle swUserPreferenceToggle_e.swShowErrorsEveryRebuild, was(0)
        swApp.SetUserPreferenceToggle swUserPreferenceToggle_e.swInputDimValOnCreate, was(1)
        swApp.SetUserPreferenceToggle swUserPreferenceToggle_e.swSketchOverdefiningDimsPromptToSetState, was(2)
        swApp.SetUserPreferenceToggle swUserPreferenceToggle_e.swSketchOverdefiningDimsSetDrivenByDefault, was(3)
    End If
    LogLine ""
    LogLine gReport
    logPath = Environ$("TEMP") & "\" & LOG_NAME
    SaveLog logPath
    MsgBox gReport & vbCrLf & "Log: " & logPath, vbInformation, "@@LOGHEAD@@"
    Exit Sub

crashed:
    gReport = gReport & "STOPPED by run-time error " & Err.Number & ": " & Err.Description & vbCrLf & _
              "while " & gWhere & "." & vbCrLf & "Please send the log file." & vbCrLf
    Resume finish

End Sub

' ---------------------------------------------------------------------------------------------
' The parts: one line per feature, then what each sketch contains and how it is defined
' ---------------------------------------------------------------------------------------------
'
' Extrude     step, what, cut?, from Z, to Z, wall angle (signs, symbols, countersinks), wider at the far
'             end?, sketch segments, change in volume and how close it must be (mm3), change in
'             volume x Z of the centre of mass and how close it must be (mm4)
' Mark        the same, for a sign or symbol
' DraftFaces  step, what, angle, neutral plane is the Front plane?, a point on the neutral face,
'             then the same four numbers
' ChamferE    step, what, size, change in volume      FilletE  step, what, radius, change in volume, exact?
' Pr          a point on a face to draft or on an edge to chamfer or round (mm)
' In a sketch: Ln, Ar, Ci draw; Cn is a construction line, Pt a point; Ed names a model edge by a
' point on it; Rel adds a relation and Dm a dimension between the things named:
' S5 segment 5, A5 / B5 its start / end, C5 its centre, O the origin, E2 model edge 2.
' FixAll fixes a traced outline where it is drawn.

'@@GENERATED@@

' ---------------------------------------------------------------------------------------------
' A part document
' ---------------------------------------------------------------------------------------------

Private Function StartPart(partNo As Long, title As String) As Boolean

    Dim tmpl As String
    Dim mdl As Object
    Dim f As SldWorks.Feature
    Dim guard As Long

    gWhere = "opening a new part for the " & title
    gPartNo = partNo
    gPartTitle = title
    gMade = 0
    gProblems = 0
    gStop = False
    gStopWhy = ""
    gList = ""
    gSkFull = 0
    gSkNot = 0
    gRel = REL_START
    gUseM = 0
    gFindTol = FIND_TOL
    gIsMark = False
    LogLine ""
    LogLine "=== " & title
    tmpl = swApp.GetUserPreferenceStringValue(swUserPreferenceStringValue_e.swDefaultTemplatePart)
    Set gModel = swApp.NewDocument(tmpl, 0, 0, 0)
    If gModel Is Nothing Then
        gReport = gReport & title & ": could not open a new part. Check the default part template in" & vbCrLf & _
                  "Tools > Options > System Options > Default Templates." & vbCrLf
        LogLine "no part document (template '" & tmpl & "')"
        Exit Function
    End If
    Set gPart = gModel
    Set gExt = gModel.Extension
    Set gFront = PlaneOf(gModel, 1)
    If gFront Is Nothing Then
        gReport = gReport & title & ": the part's Front plane was not found." & vbCrLf
        LogLine "no Front plane"
        Exit Function
    End If
    gOrigin = "Origin"
    On Error Resume Next
    Set f = gModel.FirstFeature
    Do While Not f Is Nothing And guard < 200
        If f.GetTypeName2 = "OriginProfileFeature" Then
            gOrigin = f.Name
            Exit Do
        End If
        Set f = f.GetNextFeature
        guard = guard + 1
    Loop
    Set mdl = gModel
    mdl.ShowFeatureErrorDialog = False
    Err.Clear
    On Error GoTo 0
    LogLine "sketch plane: " & NameOf(gFront) & "; origin: " & gOrigin
    StartPart = True

End Function

Private Sub EndPart(nFeatures As Long, designMm3 As Double)

    Dim v As Double
    Dim mz As Double
    Dim nB As Long
    Dim mdl As Object
    Dim summary As String

    gWhere = "finishing the " & gPartTitle
    On Error Resume Next
    gModel.ClearSelection2 True
    gModel.EditRebuild3
    gModel.ShowNamedView2 "", VIEW_ISO
    gModel.ViewZoomtofit2
    Set mdl = gModel
    mdl.ShowFeatureErrorDialog = True
    Err.Clear
    On Error GoTo 0
    v = PartVolume(nB, mz)
    summary = gPartTitle & ": " & gMade & " of " & nFeatures & " features, " & gProblems & " problem(s). Sketches fully defined: " & _
           gSkFull & " of " & (gSkFull + gSkNot) & ". Volume " & Format$(v, "0.0") & " mm3 (source: " & Format$(designMm3, "0.0") & ")."
    gReport = gReport & summary & vbCrLf
    If gProblems > 0 Then gReport = gReport & "   Not made or not as intended:" & gList & vbCrLf
    If gStop Then gReport = gReport & "   STOPPED EARLY: " & gStopWhy & vbCrLf
    If gUseM = -1 Then gReport = gReport & "   The centre of mass could not be used: features were checked by volume only." & vbCrLf
    LogLine summary

End Sub

' Is this part wanted? ONLY at the top of the file names one part, or none for all of them.
Private Function WantPart(key As String) As Boolean
    WantPart = (ONLY = "" Or LCase$(ONLY) = LCase$(key))
End Function

Private Sub Problem(what As String)
    gProblems = gProblems + 1
    gList = gList & vbCrLf & "      " & what
End Sub

' ---------------------------------------------------------------------------------------------
' Bosses and cuts
' ---------------------------------------------------------------------------------------------

' One boss or cut from the sketch of a step, between two heights above the Front plane.
'
' The feature starts at an offset from the Front plane and runs one way. Three flags decide that,
' and the API help only settles two of them:
'   Dir              a boss runs along the plane's normal (+Z) and a cut against it unless Dir is True
'   Ddir1            True drafts inward (signs, symbols and countersinks have a wall angle of their own)
'   FlipStartOffset  which side of the plane the start offset goes (not documented)
' So the feature is made the way the help reads, measured (see Judge), and if it is not the
' feature that was wanted, deleted and made again with one flag after another reversed. What
' worked is remembered for the next feature of the same kind.
Private Sub Extrude(stepNo As Long, what As String, isCut As Boolean, z0 As Double, z1 As Double, draftDeg As Double, widen As Boolean, _
                    nSegs As Long, dV As Double, tolV As Double, dMz As Double, tolM As Double)

    Dim dirNeg As Boolean
    Dim offNeg As Boolean
    Dim hasOffset As Boolean
    Dim hasDraft As Boolean
    Dim cls As Long
    Dim k As Long
    Dim a As Long
    Dim b As Long
    Dim c As Long
    Dim bMax As Long
    Dim cMax As Long
    Dim dirF As Boolean
    Dim ddirF As Boolean
    Dim flipF As Boolean
    Dim v0 As Double
    Dim v1 As Double
    Dim m0 As Double
    Dim m1 As Double
    Dim nB As Long
    Dim tries As Long
    Dim level As Long
    Dim got As Long
    Dim f As SldWorks.Feature
    Dim why As String

    If gStop Then Exit Sub
    gWhere = "making feature " & stepNo & " (" & what & ") of the " & gPartTitle
    v0 = PartVolume(nB, m0)
    dirNeg = (z1 < z0)                                  ' it runs toward -Z
    offNeg = (z0 < 0#)                                  ' it starts on the -Z side of the Front plane
    hasOffset = (Abs(z0) > 0.000001)
    hasDraft = (draftDeg > 0.000001)
    k = 0
    If isCut Then k = 1
    cls = 4 * k
    If offNeg Then cls = cls + 2
    If dirNeg Then cls = cls + 1
    bMax = 0
    If hasDraft Then bMax = 1
    cMax = 0
    If hasOffset Then cMax = 1
    level = 0
    If DEFINE_SKETCHES Then level = 2

    For a = 0 To 1
        For b = 0 To bMax
            For c = 0 To cMax
                ' as the help reads (a boss goes +Z by default, a cut -Z; True drafts inward), with
                ' what earlier features showed, and then the other ways round
                If isCut Then
                    dirF = Not dirNeg
                Else
                    dirF = dirNeg
                End If
                dirF = dirF Xor gDirRev(k) Xor (a = 1)
                ddirF = (Not widen) Xor gDdirRev(k) Xor (b = 1)
                flipF = gFlip(cls) Xor (c = 1)
                tries = tries + 1

                ' the sketch: with relations and dimensions; if they upset it, with Fully Define
                ' Sketch alone; if that upsets it too, plain
                Do
                    got = DrawSketch(stepNo, nSegs, level)
                    If got >= 0 Then Exit Do
                    LogLine "   sketch of feature " & stepNo & " (" & what & "): " & gSkNote & "; drawn again more simply"
                    RemoveSelected gSketch
                    level = level - 1
                Loop While level >= 0
                If got <= 0 Then
                    LogLine what & ": its sketch could not be drawn (" & gDrawn & " of " & nSegs & " segments)"
                    RemoveSelected gSketch
                    GoTo failed
                End If
                Set f = MakeExtrude(isCut, dirF, Abs(z1 - z0), hasDraft, ddirF, draftDeg, hasOffset, Abs(z0), flipF)
                If f Is Nothing Then
                    why = "no feature"
                    RemoveSelected gSketch
                Else
                    v1 = PartVolume(nB, m1)
                    why = Judge(v1 - v0, m1 - m0, v1, m1, nB, dV, tolV, dMz, tolM)
                    If why = "" And v0 = 0# And gUseM <> 1 Then why = FirstBodySide(z0, z1)
                    If why = "" Then
                        gDirRev(k) = gDirRev(k) Xor (a = 1)
                        If hasDraft Then gDdirRev(k) = gDdirRev(k) Xor (b = 1)
                        If hasOffset Then gFlip(cls) = flipF
                        gMade = gMade + 1
                        If InStr(gSkNote, "fully defined") = 1 Then
                            gSkFull = gSkFull + 1
                        Else
                            gSkNot = gSkNot + 1
                        End If
                        LogLine NameOf(f) & " (" & what & "): ok, " & Format$(v1 - v0, "0.000") & " mm3" & IIf(tries > 1, " (try " & tries & ")", "") & _
                                "   [Dir " & dirF & IIf(hasDraft, ", Ddir " & ddirF, "") & IIf(hasOffset, ", FlipStartOffset " & flipF, "") & "]"
                        LogLine "   " & NameOf(gSketch) & ": " & gSkNote
                        If v0 = 0# Then Calibrate v1 - v0, dV
                        Exit Sub
                    End If
                    RemoveSelected f
                End If
                LogLine "   " & what & " try " & tries & " [Dir " & dirF & ", Ddir " & ddirF & ", FlipStartOffset " & flipF & "]: " & why
                If Abs(PartVolume(nB, m1) - v0) > 0.01 Then
                    gStop = True
                    gStopWhy = "a wrong feature could not be removed."
                    LogLine what & ": A WRONG FEATURE COULD NOT BE REMOVED. Stopping; delete it by hand."
                    GoTo failed
                End If
            Next c
        Next b
    Next a
    LogLine what & ": NOT MADE after " & tries & " tries"

failed:
    Problem "feature " & stepNo & " (" & what & ")"
    If v0 = 0# And Not gStop Then
        gStop = True                                    ' nothing else can be made or measured without the first body
        gStopWhy = "the first body could not be made or measured."
        LogLine "Stopping this part: the other features need the first body."
    End If

End Sub

' A sign or symbol: a shallow cut (or boss) with its own wall angle. Its outline is traced from the
' source model, so its sketch is not dimensioned: every segment is fixed where it is drawn.
Private Sub Mark(stepNo As Long, what As String, isCut As Boolean, z0 As Double, z1 As Double, draftDeg As Double, widen As Boolean, _
                 nSegs As Long, dV As Double, tolV As Double, dMz As Double, tolM As Double)
    If gStop Then Exit Sub
    If Not MAKE_MARKS Then
        LogLine "feature " & stepNo & " (" & what & "): left out (MAKE_MARKS is False)"
        Exit Sub
    End If
    gIsMark = True
    Extrude stepNo, what, isCut, z0, z1, draftDeg, widen, nSegs, dV, tolV, dMz, tolM
    gIsMark = False
End Sub

' Is the feature just made the one that was wanted? Returns "" if so, otherwise what is wrong.
'   gotV   change in the part's volume, mm3                      (wanted: dV, within tolV)
'   gotM   change in volume x Z of the centre of mass, mm4       (wanted: dMz, within tolM)
' Both tolerances grow with the size of the part (gRel), because that is how the error of a
' measured volume grows. The moment is what tells a feature in the right place from the same
' feature somewhere else along Z.
Private Function Judge(gotV As Double, gotM As Double, vNow As Double, mNow As Double, nB As Long, _
                       dV As Double, tolV As Double, dMz As Double, tolM As Double) As String

    Dim tV As Double
    Dim tM As Double

    If nB <> 1 Then
        Judge = nB & " bodies"
        Exit Function
    End If
    tV = tolV + gRel * Abs(vNow)
    tM = tolM + gRel * Abs(mNow)
    If Abs(gotV - dV) > tV Then
        Judge = "volume change " & Format$(gotV, "0.000") & " (wanted " & Format$(dV, "0.000") & ")"
        Exit Function
    End If
    If gUseM = 0 Then
        If Abs(gotM - dMz) <= tM Or Abs(gotM + dMz) <= tM Then
            gUseM = 1                                   ' (the second: the right body on the wrong side of the plane)
        Else
            gUseM = -1
            LogLine "   the centre of mass is not usable here (moment " & Format$(gotM, "0.0") & ", wanted " & Format$(dMz, "0.0") & _
                    "): features are checked by volume only."
        End If
    End If
    If gUseM = 1 Then
        If Abs(gotM - dMz) > tM Then Judge = "right volume in the wrong place (moment " & Format$(gotM, "0.0") & ", wanted " & Format$(dMz, "0.0") & ")"
    End If

End Function

' The first body, when the centre of mass cannot be used: is it on the right side of the Front
' plane? Returns "" if it is (or if that cannot be read), otherwise what is wrong.
Private Function FirstBodySide(z0 As Double, z1 As Double) As String
    Dim v As Variant
    Dim body As Object
    Dim px As Double
    Dim py As Double
    Dim pz As Double
    Dim hi As Double
    Dim lo As Double
    Dim got As Boolean

    On Error Resume Next
    v = gPart.GetBodies2(SOLID_BODY, False)
    If Err.Number = 0 And Not IsEmpty(v) Then
        Set body = v(LBound(v))
        got = body.GetExtremePoint(0#, 0#, 1#, px, py, pz)
        If Err.Number = 0 And got Then
            hi = pz * 1000#
            got = body.GetExtremePoint(0#, 0#, -1#, px, py, pz)
            If Err.Number = 0 And got Then
                lo = pz * 1000#
                If Abs(hi - IIf(z0 > z1, z0, z1)) > 0.01 Or Abs(lo - IIf(z0 < z1, z0, z1)) > 0.01 Then
                    FirstBodySide = "on the wrong side of the Front plane (Z " & Format$(lo, "0.00") & " to " & Format$(hi, "0.00") & ")"
                End If
            End If
        End If
    End If
    Err.Clear
    On Error GoTo 0
End Function

' The first body is a plain block, so how far its measured volume is from the design's shows how
' closely SOLIDWORKS and the design agree. Later tolerances allow four times that.
Private Sub Calibrate(gotV As Double, dV As Double)
    Dim ratio As Double
    ratio = Abs(gotV - dV) / Abs(dV)
    gRel = 4# * ratio
    If gRel < REL_START Then gRel = REL_START
    If gRel > REL_MAX Then
        gRel = REL_MAX
        LogLine "   NOTE: the first body is " & Format$(ratio * 1000000#, "0.0") & " parts per million from the design's volume, more than expected."
    Else
        LogLine "   volume agrees with the design to " & Format$(ratio * 1000000#, "0.00") & " parts per million"
    End If
End Sub

' The feature itself, from the sketch just drawn. Lengths in mm, the angle in degrees.
Private Function MakeExtrude(isCut As Boolean, dirF As Boolean, depth As Double, hasDraft As Boolean, ddirF As Boolean, _
                             draftDeg As Double, hasOffset As Boolean, offset As Double, flipF As Boolean) As SldWorks.Feature

    Dim fm As SldWorks.FeatureManager
    Dim f As SldWorks.Feature
    Dim t0 As Long
    Dim ang As Double

    t0 = START_PLANE
    If hasOffset Then t0 = START_OFFSET
    ang = draftDeg * K_PI / 180#

    On Error Resume Next
    Set fm = gModel.FeatureManager
    gModel.ClearSelection2 True
    gSketch.Select2 False, 0
    If isCut Then
        Set f = fm.FeatureCut4(True, False, dirF, END_BLIND, END_BLIND, ToM(depth), 0.001, hasDraft, False, ddirF, False, ang, 0#, _
                               False, False, False, False, False, True, True, True, True, False, t0, ToM(offset), flipF, False)
    Else
        Set f = fm.FeatureExtrusion3(True, False, dirF, END_BLIND, END_BLIND, ToM(depth), 0.001, hasDraft, False, ddirF, False, ang, 0#, _
                                     False, False, False, False, True, True, True, t0, ToM(offset), flipF)
    End If
    If Err.Number <> 0 Then
        LogLine "   (" & Err.Description & ")"
        Err.Clear
    End If
    gModel.ClearSelection2 True
    On Error GoTo 0
    Set MakeExtrude = f

End Function

' ---------------------------------------------------------------------------------------------
' Drafts, chamfers and radii: what they act on is found by a point on each face or edge
' ---------------------------------------------------------------------------------------------

Private Sub PrClear()
    gNP = 0
End Sub

Private Sub Pr(x As Double, y As Double, z As Double)
    If gNP >= MAX_PROBE Then Exit Sub
    gNP = gNP + 1
    gPx(gNP) = x
    gPy(gNP) = y
    gPz(gNP) = z
End Sub

' Neutral-plane draft on the faces the points are on. Which way FlipDir leans the faces depends on
' the neutral plane's own direction, so it is made, measured, and if it leans the wrong way (the
' volume then changes by about the same amount with the other sign) made again flipped.
Private Sub DraftFaces(stepNo As Long, what As String, angDeg As Double, frontIsNeutral As Boolean, nx As Double, ny As Double, nz As Double, _
                  dV As Double, tolV As Double, dMz As Double, tolM As Double)

    Dim faces As Collection
    Dim neutral As Object
    Dim fm As SldWorks.FeatureManager
    Dim f As SldWorks.Feature
    Dim v0 As Double
    Dim v1 As Double
    Dim m0 As Double
    Dim m1 As Double
    Dim nB As Long
    Dim t As Long
    Dim i As Long
    Dim cls As Long
    Dim flip As Boolean
    Dim missing As Long
    Dim why As String

    If gStop Then Exit Sub
    If Not MAKE_DRAFTS Then
        LogLine "feature " & stepNo & " (" & what & "): left out (MAKE_DRAFTS is False)"
        gFindTol = LOOSE_TOL
        Exit Sub
    End If
    gWhere = "making feature " & stepNo & " (" & what & ") of the " & gPartTitle
    v0 = PartVolume(nB, m0)
    Set faces = FindAll(True, missing)
    If faces.Count = 0 Or missing > 0 Then
        LogLine what & ": NOT MADE: " & missing & " of its " & gNP & " faces were not found"
        Problem "feature " & stepNo & " (" & what & ")"
        gFindTol = LOOSE_TOL
        Exit Sub
    End If
    If Not frontIsNeutral Then
        Set neutral = FindOne(True, nx, ny, nz)
        If neutral Is Nothing Then
            LogLine what & ": NOT MADE: its neutral face was not found"
            Problem "feature " & stepNo & " (" & what & ")"
            gFindTol = LOOSE_TOL
            Exit Sub
        End If
    End If
    cls = 0
    If frontIsNeutral Then cls = 2
    If dV > 0# Then cls = cls + 1

    For t = 0 To 1
        flip = gDraftFlip(cls) Xor (t = 1)
        Set f = Nothing
        gModel.ClearSelection2 True
        On Error Resume Next
        If frontIsNeutral Then
            gFront.Select2 False, 1
        Else
            PickEnt neutral, False, 1
        End If
        For i = 1 To faces.Count
            PickEnt faces.Item(i), True, 2
        Next i
        Set fm = gModel.FeatureManager
        Set f = fm.InsertMultiFaceDraft(angDeg * K_PI / 180#, flip, False, 0, False, False)
        Err.Clear
        On Error GoTo 0
        gModel.ClearSelection2 True
        If f Is Nothing Then
            why = "no feature"
        Else
            v1 = PartVolume(nB, m1)
            why = ""
            If nB <> 1 Then
                why = nB & " bodies"
            ElseIf Abs((v1 - v0) - dV) > tolV + 0.1 * Abs(dV) + gRel * Abs(v1) Then
                why = "volume change " & Format$(v1 - v0, "0.000") & " (wanted " & Format$(dV, "0.000") & ")"
            End If
            If why = "" Then
                gDraftFlip(cls) = flip
                gMade = gMade + 1
                LogLine NameOf(f) & " (" & what & "): ok, " & Format$(v1 - v0, "0.000") & " mm3 on " & faces.Count & " face(s)   [FlipDir " & flip & "]"
                Exit Sub
            End If
            RemoveSelected f
            If Abs(PartVolume(nB, m1) - v0) > 0.01 Then
                gStop = True
                gStopWhy = "a wrong feature could not be removed."
                LogLine what & ": A WRONG FEATURE COULD NOT BE REMOVED. Stopping; delete it by hand."
                Exit For
            End If
        End If
        LogLine "   " & what & " [FlipDir " & flip & "]: " & why
    Next t

    LogLine what & ": NOT MADE. Add a " & angDeg & " deg draft by hand."
    Problem "feature " & stepNo & " (" & what & ")"
    gFindTol = LOOSE_TOL                                ' what follows is looked up less strictly

End Sub

' Chamfer, size x 45 degrees, on the edges the points are on.
Private Sub ChamferE(stepNo As Long, what As String, sizeMm As Double, dV As Double)

    Dim edges As Collection
    Dim fm As SldWorks.FeatureManager
    Dim f As SldWorks.Feature
    Dim v0 As Double
    Dim v1 As Double
    Dim mz As Double
    Dim nB As Long
    Dim t As Long
    Dim i As Long
    Dim selMark As Long
    Dim missing As Long
    Dim why As String

    If gStop Then Exit Sub
    If Not MAKE_CHAMFERS Then
        LogLine "feature " & stepNo & " (" & what & "): left out (MAKE_CHAMFERS is False)"
        Exit Sub
    End If
    gWhere = "making feature " & stepNo & " (" & what & ") of the " & gPartTitle
    v0 = PartVolume(nB, mz)
    Set edges = FindAll(False, missing)
    If edges.Count = 0 Or missing > 0 Then
        LogLine what & ": NOT MADE: " & missing & " of its " & gNP & " edges were not found"
        Problem "feature " & stepNo & " (" & what & ")"
        Exit Sub
    End If

    For t = 0 To 1
        selMark = IIf(t = 0, 0, 1)
        Set f = Nothing
        gModel.ClearSelection2 True
        On Error Resume Next
        For i = 1 To edges.Count
            PickEnt edges.Item(i), True, selMark
        Next i
        Set fm = gModel.FeatureManager
        Set f = fm.InsertFeatureChamfer(CHAMFER_TANGENT, CHAMFER_ANGLE_DISTANCE, ToM(sizeMm), K_PI / 4#, 0#, 0#, 0#, 0#)
        Err.Clear
        On Error GoTo 0
        gModel.ClearSelection2 True
        If f Is Nothing Then
            why = "no feature"
        Else
            v1 = PartVolume(nB, mz)
            If nB = 1 And Abs((v1 - v0) - dV) <= 0.12 * Abs(dV) + 0.05 Then
                gMade = gMade + 1
                LogLine NameOf(f) & " (" & what & "): ok, " & Format$(v1 - v0, "0.000") & " mm3 on " & edges.Count & " edge(s)"
                Exit Sub
            End If
            why = "volume change " & Format$(v1 - v0, "0.000") & " (wanted about " & Format$(dV, "0.000") & ")"
            RemoveSelected f
            If Abs(PartVolume(nB, mz) - v0) > 0.01 Then
                gStop = True
                gStopWhy = "a wrong feature could not be removed."
                LogLine what & ": A WRONG FEATURE COULD NOT BE REMOVED. Stopping; delete it by hand."
                Exit For
            End If
        End If
        LogLine "   " & what & " with mark " & selMark & ": " & why
    Next t

    LogLine what & ": NOT MADE. Add a " & sizeMm & " mm x 45 deg chamfer by hand."
    Problem "feature " & stepNo & " (" & what & ")"

End Sub

' Fillet of radius rMm on the edges the points are on. exact: the change in volume is known from
' the source model; otherwise dV is only about what it should be.
Private Sub FilletE(stepNo As Long, what As String, rMm As Double, dV As Double, exact As Boolean)

    Dim edges As Collection
    Dim fm As SldWorks.FeatureManager
    Dim f As SldWorks.Feature
    Dim v0 As Double
    Dim v1 As Double
    Dim mz As Double
    Dim nB As Long
    Dim t As Long
    Dim i As Long
    Dim selMark As Long
    Dim missing As Long
    Dim ok As Boolean
    Dim why As String
    Dim one(0) As Double
    Dim e1 As Variant
    Dim e2 As Variant
    Dim e3 As Variant
    Dim e4 As Variant
    Dim e5 As Variant
    Dim e6 As Variant
    Dim e7 As Variant

    If gStop Then Exit Sub
    If Not MAKE_RADII Then
        LogLine "feature " & stepNo & " (" & what & "): left out (MAKE_RADII is False)"
        Exit Sub
    End If
    gWhere = "making feature " & stepNo & " (" & what & ") of the " & gPartTitle
    v0 = PartVolume(nB, mz)
    Set edges = FindAll(False, missing)
    If edges.Count = 0 Then
        LogLine what & ": NOT MADE: none of its " & gNP & " edges were found"
        Problem "feature " & stepNo & " (" & what & ")"
        Exit Sub
    End If
    If missing > 0 Then LogLine "   " & what & ": " & missing & " of its " & gNP & " edges were not found; rounding the rest"
    e1 = one
    e2 = one
    e3 = one
    e4 = one
    e5 = one
    e6 = one
    e7 = one

    For t = 0 To 1
        selMark = gEdgeMark
        If t = 1 Then selMark = 1 - gEdgeMark
        Set f = Nothing
        gModel.ClearSelection2 True
        On Error Resume Next
        For i = 1 To edges.Count
            PickEnt edges.Item(i), True, selMark
        Next i
        Set fm = gModel.FeatureManager
        Set f = fm.FeatureFillet3(FILLET_OPTIONS, ToM(rMm), 0#, 0#, 0, 0, 0, e1, e2, e3, e4, e5, e6, e7)
        Err.Clear
        On Error GoTo 0
        gModel.ClearSelection2 True
        If f Is Nothing Then
            why = "no feature"
        Else
            v1 = PartVolume(nB, mz)
            ' the right sign, and the right size: closely if it is known, roughly if it is an estimate
            If exact And missing = 0 Then
                ok = Abs((v1 - v0) - dV) <= 0.3 * Abs(dV) + 0.05
            Else
                ok = ((v1 - v0) * dV > 0#) And Abs(v1 - v0) < 3# * Abs(dV) + 0.05
            End If
            If nB = 1 And ok Then
                gEdgeMark = selMark
                gMade = gMade + 1
                LogLine NameOf(f) & " (" & what & "): ok, " & Format$(v1 - v0, "0.000") & " mm3 on " & edges.Count & " edge(s)" & _
                        IIf(exact, "", " (about " & Format$(dV, "0.0") & " expected)")
                Exit Sub
            End If
            why = "volume change " & Format$(v1 - v0, "0.000") & " (wanted about " & Format$(dV, "0.000") & "), bodies " & nB
            RemoveSelected f
            If Abs(PartVolume(nB, mz) - v0) > 0.01 Then
                gStop = True
                gStopWhy = "a wrong feature could not be removed."
                LogLine what & ": A WRONG FEATURE COULD NOT BE REMOVED. Stopping; delete it by hand."
                Exit For
            End If
        End If
        LogLine "   " & what & " with mark " & selMark & ": " & why
    Next t

    LogLine what & ": NOT MADE. Add R" & rMm & " there by hand."
    Problem "feature " & stepNo & " (" & what & ")"

End Sub

' The faces (or edges) the points gPx.. are on, each once. missing: points with nothing under them.
Private Function FindAll(wantFaces As Boolean, ByRef missing As Long) As Collection
    Dim found As New Collection
    Dim ents As Variant
    Dim v As Variant
    Dim body As Object
    Dim ent As Object
    Dim cp As Variant
    Dim best() As Double
    Dim who() As Long
    Dim hit() As Object
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim b As Long
    Dim d As Double
    Dim dup As Boolean

    missing = 0
    If gNP = 0 Then
        Set FindAll = found
        Exit Function
    End If
    ReDim best(1 To gNP)
    ReDim who(1 To gNP)
    ReDim hit(1 To gNP)
    For i = 1 To gNP
        best(i) = 1E+30
        who(i) = -1
    Next i
    On Error Resume Next
    v = gPart.GetBodies2(SOLID_BODY, False)
    If Err.Number = 0 And Not IsEmpty(v) Then
        For b = LBound(v) To UBound(v)
            Set body = v(b)
            ents = Empty
            If wantFaces Then
                ents = body.GetFaces
            Else
                ents = body.GetEdges
            End If
            If Not IsEmpty(ents) Then
                For j = LBound(ents) To UBound(ents)
                    Set ent = ents(j)
                    For i = 1 To gNP
                        cp = Empty
                        d = 1E+30
                        cp = ent.GetClosestPointOn(ToM(gPx(i)), ToM(gPy(i)), ToM(gPz(i)))
                        If Not IsEmpty(cp) Then
                            d = Sqr((cp(0) - ToM(gPx(i))) ^ 2 + (cp(1) - ToM(gPy(i))) ^ 2 + (cp(2) - ToM(gPz(i))) ^ 2)
                            If d < best(i) Then
                                best(i) = d
                                who(i) = b * 100000 + j         ' which body, which of its faces
                                Set hit(i) = ent
                            End If
                        End If
                        Err.Clear
                    Next i
                Next j
            End If
        Next b
    End If
    Err.Clear
    On Error GoTo 0
    For i = 1 To gNP
        If who(i) < 0 Or best(i) > gFindTol Then
            missing = missing + 1
        Else
            dup = False
            For k = 1 To i - 1
                If who(k) = who(i) And best(k) <= gFindTol Then dup = True
            Next k
            If Not dup Then found.Add hit(i)
        End If
    Next i
    Set FindAll = found
End Function

' The face (or edge) one point is on, or Nothing.
Private Function FindOne(wantFace As Boolean, x As Double, y As Double, z As Double) As Object
    Dim ents As Variant
    Dim v As Variant
    Dim body As Object
    Dim ent As Object
    Dim cp As Variant
    Dim b As Long
    Dim j As Long
    Dim d As Double
    Dim best As Double

    best = 1E+30
    On Error Resume Next
    v = gPart.GetBodies2(SOLID_BODY, False)
    If Err.Number = 0 And Not IsEmpty(v) Then
        For b = LBound(v) To UBound(v)
            Set body = v(b)
            ents = Empty
            If wantFace Then
                ents = body.GetFaces
            Else
                ents = body.GetEdges
            End If
            If Not IsEmpty(ents) Then
                For j = LBound(ents) To UBound(ents)
                    Set ent = ents(j)
                    cp = Empty
                    d = 1E+30
                    cp = ent.GetClosestPointOn(ToM(x), ToM(y), ToM(z))
                    If Not IsEmpty(cp) Then
                        d = Sqr((cp(0) - ToM(x)) ^ 2 + (cp(1) - ToM(y)) ^ 2 + (cp(2) - ToM(z)) ^ 2)
                        If d < best Then
                            best = d
                            If d <= gFindTol Then Set FindOne = ent
                        End If
                    End If
                    Err.Clear
                Next j
            End If
        Next b
    End If
    Err.Clear
    On Error GoTo 0
End Function

' Selects a face, an edge, a sketch segment or a sketch point with a selection mark.
Private Function PickEnt(o As Object, append As Boolean, selMark As Long) As Boolean
    Dim selMgr As SldWorks.SelectionMgr
    Dim selData As SldWorks.SelectData
    If o Is Nothing Then Exit Function
    On Error Resume Next
    Set selMgr = gModel.SelectionManager
    Set selData = selMgr.CreateSelectData
    selData.Mark = selMark
    PickEnt = o.Select4(append, selData)
    Err.Clear
    On Error GoTo 0
End Function

' ---------------------------------------------------------------------------------------------
' Sketching: everything in mm on the Front plane
' ---------------------------------------------------------------------------------------------

' Draws the sketch of a step. level 2: with its relations and dimensions (and Fully Define Sketch
' for what is left); level 1: Fully Define Sketch only; level 0: plain.
' Returns 1 if the sketch is drawn, 0 if not every segment could be drawn, -1 if defining it moved
' it or left it over defined (the caller then draws it again at a lower level).
Private Function DrawSketch(stepNo As Long, nSegs As Long, level As Long) As Long
    Dim sm As SldWorks.SketchManager
    Dim last As SldWorks.Feature
    Dim st As Long
    Dim st0 As Long
    Dim moved As Boolean
    Dim i As Long

    Set gSketch = Nothing
    Set gSkObj = Nothing
    gDrawn = 0
    gSkNote = "plain"
    For i = 1 To MAX_SEG
        Set gSeg(i) = Nothing
        gKind(i) = ""
    Next i
    For i = 1 To 60
        Set gEd(i) = Nothing
    Next i
    On Error Resume Next
    Set sm = gModel.SketchManager
    gModel.ClearSelection2 True
    gFront.Select2 False, 0
    sm.InsertSketch True
    sm.AddToDB = True
    sm.DisplayWhenAdded = False
    Err.Clear
    On Error GoTo 0

    DrawStep gPartNo, stepNo

    On Error Resume Next
    Set gSkObj = sm.ActiveSketch
    Set gSketch = gSkObj
    sm.DisplayWhenAdded = True
    sm.AddToDB = False
    Err.Clear
    On Error GoTo 0

    If gDrawn = nSegs And level > 0 Then
        gRelWant = 0
        gRelOk = 0
        gDimWant = 0
        gDimOk = 0
        gDimOff = 0
        gIsTraced = gIsMark
        If gIsMark Then
            FixAll nSegs
        ElseIf level >= 2 Then
            DefineStep gPartNo, stepNo                  ' (a traced outline calls FixAll from there)
        End If
        st0 = SketchStatus()
        st = st0
        If st <> SK_FULL And (AUTO_FINISH Or level = 1) And Not gIsTraced Then
            FinishSketch
            st = SketchStatus()
        End If
        moved = Not AsDrawn(nSegs)
        gSkNote = StatusText(st) & " (" & gRelOk & " of " & gRelWant & " relations, " & gDimOk & " of " & gDimWant & " dimensions" & _
                  IIf(gDimOff > 0, ", " & gDimOff & " with another value than meant", "") & _
                  IIf(st0 <> SK_FULL And st = SK_FULL, "; finished by Fully Define Sketch", "") & ")"
        If moved Then gSkNote = "defining it moved it"
        If st >= 4 And st <= 6 Then gSkNote = "defining it left it " & StatusText(st)
    End If

    On Error Resume Next
    sm.InsertSketch True                                ' leaves the sketch
    gModel.ClearSelection2 True
    Err.Clear
    If gSketch Is Nothing Then                          ' the sketch is the last feature in the tree
        Set last = gModel.FeatureByPositionReverse(0)
        If Not last Is Nothing Then
            If last.GetTypeName2 = "ProfileFeature" Then Set gSketch = last
        End If
    End If
    Err.Clear
    On Error GoTo 0
    Set gSkObj = Nothing
    If gDrawn <> nSegs Or gSketch Is Nothing Then
        DrawSketch = 0
    ElseIf level > 0 And (moved Or (st >= 4 And st <= 6)) Then
        DrawSketch = -1
    Else
        DrawSketch = 1
    End If
End Function

Private Function StatusText(st As Long) As String
    Select Case st
        Case SK_FULL: StatusText = "fully defined"
        Case SK_UNDER: StatusText = "under defined"
        Case 4: StatusText = "over defined"
        Case 5: StatusText = "without a solution"
        Case 6: StatusText = "with an invalid solution"
        Case Else: StatusText = "state not known"
    End Select
End Function

' swConstrainedStatus_e of the open sketch: 2 under, 3 fully, 4 over, 5 no solution, 6 invalid; 0 if it cannot be read.
Private Function SketchStatus() As Long
    If gSkObj Is Nothing Then Exit Function
    On Error Resume Next
    SketchStatus = gSkObj.GetConstrainedStatus
    If Err.Number <> 0 Then SketchStatus = 0
    Err.Clear
    On Error GoTo 0
End Function

' Fully Define Sketch (Tools > Dimensions) on the open sketch, measured from the origin.
Private Sub FinishSketch()
    Dim sm As SldWorks.SketchManager
    Dim r As Long
    On Error Resume Next
    Set sm = gModel.SketchManager
    gModel.ClearSelection2 True
    gExt.SelectByID2 "Point1@" & gOrigin, "EXTSKETCHPOINT", 0#, 0#, 0#, False, 6, Nothing, 0
    r = sm.FullyDefineSketch(True, True, 1023, True, 1, Nothing, 1, Nothing, 1, 1)
    gModel.ClearSelection2 True
    Err.Clear
    On Error GoTo 0
End Sub

Private Sub Keep(i As Long, kind As String, s As Object, a As Double, b As Double, c As Double, d As Double, e As Double, f As Double)
    If i < 1 Or i > MAX_SEG Or s Is Nothing Then Exit Sub
    Set gSeg(i) = s
    gKind(i) = kind
    gG(i, 0) = a
    gG(i, 1) = b
    gG(i, 2) = c
    gG(i, 3) = d
    gG(i, 4) = e
    gG(i, 5) = f
    If kind = "L" Or kind = "A" Or kind = "C" Then gDrawn = gDrawn + 1
End Sub

Private Sub Ln(i As Long, x0 As Double, y0 As Double, x1 As Double, y1 As Double)
    Dim s As Object
    On Error Resume Next
    Set s = gModel.SketchManager.CreateLine(ToM(x0), ToM(y0), 0#, ToM(x1), ToM(y1), 0#)
    Err.Clear
    On Error GoTo 0
    Keep i, "L", s, x0, y0, x1, y1, 0#, 0#
End Sub

' An arc about (cx, cy) from (x0, y0) to (x1, y1); way = 1 counter-clockwise, -1 clockwise.
Private Sub Ar(i As Long, cx As Double, cy As Double, x0 As Double, y0 As Double, x1 As Double, y1 As Double, way As Long)
    Dim s As Object
    On Error Resume Next
    Set s = gModel.SketchManager.CreateArc(ToM(cx), ToM(cy), 0#, ToM(x0), ToM(y0), 0#, ToM(x1), ToM(y1), 0#, way)
    Err.Clear
    On Error GoTo 0
    Keep i, "A", s, cx, cy, x0, y0, x1, y1
End Sub

Private Sub Ci(i As Long, cx As Double, cy As Double, r As Double)
    Dim s As Object
    On Error Resume Next
    Set s = gModel.SketchManager.CreateCircleByRadius(ToM(cx), ToM(cy), 0#, ToM(r))
    Err.Clear
    On Error GoTo 0
    Keep i, "C", s, cx, cy, r, 0#, 0#, 0#
End Sub

' Construction line and point: only drawn while a sketch is being defined.
' (Drawn straight into the database like the outline, so that nothing snaps to anything.)
Private Sub Cn(i As Long, x0 As Double, y0 As Double, x1 As Double, y1 As Double)
    Dim s As Object
    Dim sm As Object
    On Error Resume Next
    Set sm = gModel.SketchManager
    sm.AddToDB = True
    Set s = sm.CreateCenterLine(ToM(x0), ToM(y0), 0#, ToM(x1), ToM(y1), 0#)
    sm.AddToDB = False
    Err.Clear
    On Error GoTo 0
    Keep i, "N", s, x0, y0, x1, y1, 0#, 0#
End Sub

Private Sub Pt(i As Long, x As Double, y As Double)
    Dim s As Object
    Dim sm As Object
    On Error Resume Next
    Set sm = gModel.SketchManager
    sm.AddToDB = True
    Set s = sm.CreatePoint(ToM(x), ToM(y), 0#)
    sm.AddToDB = False
    Err.Clear
    On Error GoTo 0
    Keep i, "P", s, x, y, 0#, 0#, 0#, 0#
End Sub

' Names the model edge through a point (mm) so that a relation or a dimension can refer to it.
Private Sub Ed(n As Long, x As Double, y As Double, z As Double)
    If n < 1 Or n > 60 Then Exit Sub
    Set gEd(n) = FindOne(False, x, y, z)
End Sub

' The start ("A"), end ("B") or centre ("C") point of segment i. Start and end are told apart by
' where they are, not by what SOLIDWORKS calls them: it may store an arc the other way round.
Private Function PtOf(i As Long, which As String) As Object
    Dim sl As SldWorks.SketchLine
    Dim sa As SldWorks.SketchArc
    Dim p As SldWorks.SketchPoint
    Dim q As SldWorks.SketchPoint
    Dim wx As Double
    Dim wy As Double

    If i < 1 Or i > MAX_SEG Then Exit Function
    If gSeg(i) Is Nothing Then Exit Function
    On Error Resume Next
    Select Case gKind(i)
        Case "P"
            Set PtOf = gSeg(i)
        Case "C"
            Set sa = gSeg(i)
            Set PtOf = sa.GetCenterPoint2
        Case "L", "N"
            Set sl = gSeg(i)
            Set p = sl.GetStartPoint2
            Set q = sl.GetEndPoint2
            If which = "A" Then
                wx = gG(i, 0)
                wy = gG(i, 1)
            Else
                wx = gG(i, 2)
                wy = gG(i, 3)
            End If
            Set PtOf = Nearer(p, q, wx, wy)
        Case "A"
            Set sa = gSeg(i)
            If which = "C" Then
                Set PtOf = sa.GetCenterPoint2
            Else
                Set p = sa.GetStartPoint2
                Set q = sa.GetEndPoint2
                If which = "A" Then
                    wx = gG(i, 2)
                    wy = gG(i, 3)
                Else
                    wx = gG(i, 4)
                    wy = gG(i, 5)
                End If
                Set PtOf = Nearer(p, q, wx, wy)
            End If
    End Select
    Err.Clear
    On Error GoTo 0
End Function

Private Function Nearer(p As Object, q As Object, wxMm As Double, wyMm As Double) As Object
    Dim px As Double
    Dim py As Double
    Dim qx As Double
    Dim qy As Double
    Dim okP As Boolean
    Dim okQ As Boolean
    okP = PtXY(p, px, py)
    okQ = PtXY(q, qx, qy)
    If okP And okQ Then
        If (qx - wxMm) ^ 2 + (qy - wyMm) ^ 2 < (px - wxMm) ^ 2 + (py - wyMm) ^ 2 Then
            Set Nearer = q
        Else
            Set Nearer = p
        End If
    ElseIf okP Then
        Set Nearer = p
    ElseIf okQ Then
        Set Nearer = q
    End If
End Function

' Selects what a code names: S5 segment 5, A5 / B5 its start / end, C5 its centre, O the origin,
' E2 model edge 2.
Private Function Sel(code As String, append As Boolean) As Boolean
    Dim kind As String
    Dim n As Long
    kind = Left$(code, 1)
    n = CLng(Val(Mid$(code, 2)))
    On Error Resume Next
    Select Case kind
        Case "S"
            If n >= 1 And n <= MAX_SEG Then Sel = PickEnt(gSeg(n), append, 0)
        Case "A", "B", "C"
            Sel = PickEnt(PtOf(n, kind), append, 0)
        Case "O"
            Sel = gExt.SelectByID2("Point1@" & gOrigin, "EXTSKETCHPOINT", 0#, 0#, 0#, append, 0, Nothing, 0)
        Case "E"
            If n >= 1 And n <= 60 Then Sel = PickEnt(gEd(n), append, 0)
    End Select
    Err.Clear
    On Error GoTo 0
End Function

Private Function RelCount() As Long
    Dim rm As Object
    RelCount = -1
    If gSkObj Is Nothing Then Exit Function
    On Error Resume Next
    Set rm = gSkObj.RelationManager
    RelCount = rm.GetRelationsCount(0)
    If Err.Number <> 0 Then RelCount = -1
    Err.Clear
    On Error GoTo 0
End Function

' A relation between two or three things: sgHORIZONTAL2D, sgVERTICAL2D, sgTANGENT, sgSAMELENGTH
' (equal), sgCONCENTRIC, sgCOINCIDENT, sgCOLINEAR, sgATMIDDLE, sgHORIZONTALPOINTS2D,
' sgVERTPOINTS2D, sgPARALLEL, sgPERPENDICULAR, sgMERGEPOINTS, sgFIXED.
Private Sub Rel(kind As String, a As String, Optional b As String = "", Optional c As String = "")
    Dim n0 As Long
    Dim n1 As Long
    Dim ok As Boolean
    gRelWant = gRelWant + 1
    n0 = RelCount()
    gModel.ClearSelection2 True
    ok = Sel(a, False)
    If ok And b <> "" Then ok = Sel(b, True)
    If ok And c <> "" Then ok = Sel(c, True)
    If ok Then
        On Error Resume Next
        gModel.SketchAddConstraints kind
        If Err.Number <> 0 Then ok = False
        Err.Clear
        On Error GoTo 0
    End If
    gModel.ClearSelection2 True
    n1 = RelCount()
    If ok And (n0 < 0 Or n1 < 0 Or n1 > n0 Or kind = "sgMERGEPOINTS") Then gRelOk = gRelOk + 1
End Sub

' A dimension. how: 0 between the two things (or the size of one), 1 horizontal, 2 vertical,
' 3 radius, 4 diameter, 5 the angle between two lines. (tx, ty): where its text goes; valueMm:
' what it should read (mm, or degrees for an angle).
Private Sub Dm(how As Long, a As String, b As String, tx As Double, ty As Double, valueMm As Double)
    Dim dd As Object
    Dim dm0 As Object
    Dim got As Double
    Dim ok As Boolean
    gDimWant = gDimWant + 1
    gModel.ClearSelection2 True
    ok = Sel(a, False)
    If ok And b <> "" Then ok = Sel(b, True)
    If ok Then
        On Error Resume Next
        Select Case how
            Case 1: Set dd = gModel.AddHorizontalDimension2(ToM(tx), ToM(ty), 0#)
            Case 2: Set dd = gModel.AddVerticalDimension2(ToM(tx), ToM(ty), 0#)
            Case 3: Set dd = gModel.AddRadialDimension2(ToM(tx), ToM(ty), 0#)
            Case 4: Set dd = gModel.AddDiameterDimension2(ToM(tx), ToM(ty), 0#)
            Case Else: Set dd = gModel.AddDimension2(ToM(tx), ToM(ty), 0#)
        End Select
        Err.Clear
        If Not dd Is Nothing Then
            gDimOk = gDimOk + 1
            got = -1#
            Set dm0 = dd.GetDimension2(0)
            If how = 5 Then
                ' an angle reads in radians, and may be the one between the lines or its supplement
                got = dm0.SystemValue * 180# / K_PI
                If Err.Number = 0 And got >= 0# Then
                    If Abs(got - valueMm) > 0.001 And Abs(180# - got - valueMm) > 0.001 Then gDimOff = gDimOff + 1
                End If
            Else
                got = dm0.SystemValue * 1000#
                If Err.Number = 0 And got >= 0# Then
                    If Abs(got - valueMm) > 0.0005 Then gDimOff = gDimOff + 1
                End If
            End If
            Err.Clear
        End If
        On Error GoTo 0
    End If
    gModel.ClearSelection2 True
End Sub

' Fixes every segment of the open sketch where it is (signs and symbols, and outlines traced from
' the source model such as a cam profile). All at once; if the sketch is not fully defined then, one by
' one, and after that their end points too.
Private Sub FixAll(nSegs As Long)
    Dim i As Long
    Dim n0 As Long
    Dim n1 As Long
    Dim k As Long
    Dim code As String

    gIsTraced = True
    gRelWant = gRelWant + 1
    n0 = RelCount()
    gModel.ClearSelection2 True
    For i = 1 To nSegs
        PickEnt gSeg(i), True, 0
    Next i
    On Error Resume Next
    gModel.SketchAddConstraints "sgFIXED"
    Err.Clear
    On Error GoTo 0
    gModel.ClearSelection2 True
    If SketchStatus() <> SK_FULL Then
        For i = 1 To nSegs
            If PickEnt(gSeg(i), False, 0) Then
                On Error Resume Next
                gModel.SketchAddConstraints "sgFIXED"
                Err.Clear
                On Error GoTo 0
            End If
        Next i
        gModel.ClearSelection2 True
    End If
    If SketchStatus() <> SK_FULL Then
        For i = 1 To nSegs
            For k = 1 To 3
                code = Mid$("ABC", k, 1)
                If (gKind(i) = "L" And k < 3) Or gKind(i) = "A" Or (gKind(i) = "C" And k = 3) Then
                    If PickEnt(PtOf(i, code), False, 0) Then
                        On Error Resume Next
                        gModel.SketchAddConstraints "sgFIXED"
                        Err.Clear
                        On Error GoTo 0
                    End If
                End If
            Next k
        Next i
        gModel.ClearSelection2 True
    End If
    n1 = RelCount()
    If n0 < 0 Or n1 > n0 Then gRelOk = gRelOk + 1
End Sub

' True if every segment of the open sketch is still where it was drawn (to 0.1 micron). A point that
' cannot be read is not counted as moved.
Private Function AsDrawn(nSegs As Long) As Boolean
    Dim sl As SldWorks.SketchLine
    Dim sa As SldWorks.SketchArc
    Dim p As Object
    Dim q As Object
    Dim c As Object
    Dim i As Long
    Dim bad As Boolean
    Dim r As Double
    Const T As Double = 0.0001

    For i = 1 To nSegs
        Set p = Nothing
        Set q = Nothing
        Set c = Nothing
        r = -1#
        On Error Resume Next
        Select Case gKind(i)
            Case "L"
                Set sl = gSeg(i)
                Set p = sl.GetStartPoint2
                Set q = sl.GetEndPoint2
            Case "A"
                Set sa = gSeg(i)
                Set p = sa.GetStartPoint2
                Set q = sa.GetEndPoint2
                Set c = sa.GetCenterPoint2
            Case "C"
                Set sa = gSeg(i)
                Set c = sa.GetCenterPoint2
                r = sa.GetRadius * 1000#
        End Select
        Err.Clear
        On Error GoTo 0
        Select Case gKind(i)
            Case "L"
                If Not Ends(p, q, gG(i, 0), gG(i, 1), gG(i, 2), gG(i, 3), T) Then bad = True
            Case "A"
                If Not Ends(p, q, gG(i, 2), gG(i, 3), gG(i, 4), gG(i, 5), T) Then bad = True
                If Not Near1(c, gG(i, 0), gG(i, 1), T) Then bad = True
            Case "C"
                If Not Near1(c, gG(i, 0), gG(i, 1), T) Then bad = True
                If r >= 0# And Abs(r - gG(i, 2)) > T Then bad = True
        End Select
    Next i
    AsDrawn = Not bad
End Function

' Where a sketch point is, in mm. False if it cannot be read.
Private Function PtXY(p As Object, ByRef x As Double, ByRef y As Double) As Boolean
    If p Is Nothing Then Exit Function
    On Error Resume Next
    x = p.X * 1000#
    If Err.Number = 0 Then y = p.Y * 1000#
    PtXY = (Err.Number = 0)
    Err.Clear
    On Error GoTo 0
End Function

' False only if the point can be read and is not at (ax, ay).
Private Function Near1(p As Object, ax As Double, ay As Double, t As Double) As Boolean
    Dim px As Double
    Dim py As Double
    Near1 = True
    If PtXY(p, px, py) Then Near1 = (Abs(px - ax) <= t And Abs(py - ay) <= t)
End Function

' False only if both points can be read and are not at (ax, ay) and (bx, by), either way round.
Private Function Ends(p As Object, q As Object, ax As Double, ay As Double, bx As Double, by As Double, t As Double) As Boolean
    Dim px As Double
    Dim py As Double
    Dim qx As Double
    Dim qy As Double
    Ends = True
    If PtXY(p, px, py) And PtXY(q, qx, qy) Then
        Ends = (Abs(px - ax) <= t And Abs(py - ay) <= t And Abs(qx - bx) <= t And Abs(qy - by) <= t) Or _
               (Abs(px - bx) <= t And Abs(py - by) <= t And Abs(qx - ax) <= t And Abs(qy - ay) <= t)
    End If
End Function

' ---------------------------------------------------------------------------------------------
' Measuring and tidying up
' ---------------------------------------------------------------------------------------------

' Volume of the part in mm3, the number of solid bodies in it, and its volume x the Z of its centre
' of mass in mm4 (summed over the bodies).
Private Function PartVolume(ByRef nBodies As Long, ByRef momentZ As Double) As Double
    Dim v As Variant
    Dim mp As Variant
    Dim body As Object
    Dim i As Long
    Dim total As Double
    Dim mz As Double
    nBodies = 0
    On Error Resume Next
    v = gPart.GetBodies2(SOLID_BODY, False)
    If Err.Number = 0 And Not IsEmpty(v) Then
        For i = LBound(v) To UBound(v)
            mp = Empty
            Set body = v(i)
            mp = body.GetMassProperties(1#)             ' centre of mass x, y, z (m), volume (m3), ...
            If Not IsEmpty(mp) Then
                total = total + mp(3)
                mz = mz + mp(3) * mp(2)
            End If
            nBodies = nBodies + 1
        Next i
    End If
    Err.Clear
    On Error GoTo 0
    momentZ = mz * 1000000000000#
    PartVolume = total * 1000000000#
End Function

' Deletes a feature together with its sketch (or a sketch that gave no feature).
Private Sub RemoveSelected(f As SldWorks.Feature)
    Dim ext As Object
    Dim mdl As Object
    If f Is Nothing Then Exit Sub
    On Error Resume Next
    Set ext = gExt
    Set mdl = gModel
    gModel.ClearSelection2 True
    If f.Select2(False, 0) Then
        If Not ext.DeleteSelection2(DELETE_ABSORBED) Then
            Err.Clear
            gModel.ClearSelection2 True
            f.Select2 False, 0
            mdl.EditDelete
        End If
    End If
    gModel.ClearSelection2 True
    Err.Clear
    On Error GoTo 0
End Sub

Private Function NameOf(f As SldWorks.Feature) As String
    NameOf = "(no name)"
    If f Is Nothing Then Exit Function
    On Error Resume Next
    NameOf = f.Name
    Err.Clear
    On Error GoTo 0
End Function

' The nth default plane of the part: 1 Front (XY), 2 Top (XZ), 3 Right (YZ). Found by position in
' the tree, so its name (and the language) does not matter.
Private Function PlaneOf(owner As Object, which As Long) As SldWorks.Feature
    Dim f As SldWorks.Feature
    Dim n As Long
    Dim guard As Long
    On Error Resume Next
    Set f = owner.FirstFeature
    Do While Not f Is Nothing
        If f.GetTypeName2 = "RefPlane" Then
            n = n + 1
            If n = which Then
                Set PlaneOf = f
                Exit Do
            End If
        End If
        Set f = f.GetNextFeature
        guard = guard + 1
        If Err.Number <> 0 Or guard > 100000 Then Exit Do
    Loop
    Err.Clear
    On Error GoTo 0
End Function

Private Function ToM(mm As Double) As Double
    ToM = mm / 1000#
End Function

Private Function SwVersion() As String
    On Error Resume Next
    SwVersion = swApp.RevisionNumber
    Err.Clear
    On Error GoTo 0
End Function

Private Sub LogLine(msg As String)
    gLog = gLog & msg & vbCrLf
End Sub

Private Sub SaveLog(filePath As String)
    Dim n As Integer
    On Error Resume Next
    n = FreeFile
    Open filePath For Output As #n
    Print #n, gLog
    Close #n
    Err.Clear
    On Error GoTo 0
End Sub
