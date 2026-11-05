# KEVOS Bridge security

## What is protected, and from whom

KEVOS lets an AI app that the person signed in to change CAD files on that person's own computers. The aim: only
the person's own AI app connections can send commands, only to the person's own registered computers, only commands
the person can see and stop, and nothing on the way (network, other users of the computer, a forged server) can
change a command or run one twice.

Out of scope: malware already running as the same Windows user (it could drive SOLIDWORKS directly), an
administrator of the computer, and a compromised KEVOS server (it is the trusted party that signs commands).

## Trust boundaries and controls

| Boundary | Control |
|---|---|
| AI app to gateway | OAuth 2.1 (dynamic registration, PKCE S256, 1-hour access tokens, rotating refresh), or the private address for apps that cannot sign in (a 32-character secret in the URL; can be renewed on the home page). Existing, unchanged. |
| Gateway to computer | Outbound HTTPS only, started by the Companion. Every request is signed by the computer's own key (device proof: method, path, query, time, one-time id, body hash). Every command and cancel is signed by the gateway's command key, which the Companion pinned at pairing. |
| Companion to add-in | A named pipe for one Windows user: first-instance flag (no squatting), DACL for that user only, network logons denied, remote clients rejected; each end checks the other process's image, folder and (when signed) publisher. |
| Add-in to SOLIDWORKS | In process, on SOLIDWORKS' UI thread only. Destructive operations are confirmed by the person in SOLIDWORKS. |

## The requirements and how they are met

| Requirement | How |
|---|---|
| Authenticate every remote command | The AI app's request is authenticated (OAuth or private address); the command is signed by the gateway (ES256 JWS); the Companion checks the signature against the key pinned at pairing before anything reaches SOLIDWORKS. Every Companion request to the gateway is signed by the device key. |
| Authorize the device that receives it | The gateway routes only to the signed-in person's own, not-removed computers (`devices.owner`), and the command names its one `device_id`; a Companion refuses a command for another computer (`WRONG_DEVICE`). Removing a computer on the home page ends its session at once and refuses its key from then on. |
| Validate all parameters | Three times: the MCP tool (types, ranges, the feature registry, the sketch solver, drawing actions) before anything is sent; the gateway (known op, at most 1 MiB, no credentials); the Companion and add-in (signature, expiry, known op, parameters object, spool paths), then each SOLIDWORKS handler's own checks. |
| Prevent replay | Device requests: one-time `jti` (kept 6 minutes), time window of 120 s, body hash. Commands: unique id, expiry (at most 15 minutes after creation), executed at most once (ids kept on disk by the Companion until a day after they expire, and in memory by the add-in); a repeat is answered `duplicate`, never run. A captured command is useless on another computer (it names its device) and after it expires. |
| Prevent unauthorized local IPC | See the pipe controls above. A process that is not SOLIDWORKS with the installed KEVOS add-in is refused (`pipe.bye` `peer_rejected`, logged); the add-in refuses a pipe not owned by the installed KEVOS Companion. |
| No passwords or secrets in commands | Commands carry identifiers only (`usr_`, `grt_`, the app's name). The gateway refuses parameters that look like credentials (`INPUT_FORBIDDEN_FIELD`). The device key never leaves the key store; there is no device password or token to leak. |
| Safe approval for destructive operations | The add-in asks the person in SOLIDWORKS before deleting, undoing, Save As (which may replace a file), remaking a drawing over one (closing an open copy), removing a global variable or deleting drawing views. The question names the AI app and the exact items; Deny is the default button and the answer after two minutes; the AI cannot answer it; only the person can turn it off (KEVOS window). Declined commands come back as `APPROVAL_DENIED`. |

## Credentials and where they live

| Secret | Where | Notes |
|---|---|---|
| Device private key | Windows key store for the user (TPM via the Platform Crypto Provider when present, else the software KSP), not exportable | Deleted by "Remove this computer from KEVOS"; a new one is made for pairing again. |
| Gateway command key | `bridge-signing-key.pem` in the server's data folder (0600) | Back up the data folder. Replacing it makes every Companion stop (`GATEWAY_KEY_CHANGED`) until paired again: rotate deliberately. |
| OAuth tokens | Hashed in the server's data folder | Existing. |
| Legacy add-in key (`oss_`) | HKCU, encrypted with DPAPI | Only for the direct link (fallback). |

The Companion's `device.json` holds the device id, name, server address and the gateway's public key: nothing
secret. Logs hold command ids, ops and file names, never parameters' contents or any key.

## Data that leaves the computer

Results go to the gateway, as with the earlier link. Read tools (topology, measuring, previews, interference) send a
STEP of the current body to the gateway, where the kernel reads it; exports send the exported file. Both are held
only as long as the command (exports: one hour, for the download link). Keep the gateway on infrastructure you trust
(your own Fly app, or your own server behind a named tunnel).

## Audit

Every command is recorded on the gateway (`bridge.sqlite`): who (account, AI app connection), which computer, tool,
op, effect, risk, a hash of its parameters, each state change with its time and where it happened, and the result or
error. `sw_command_status` shows a person their own.

## Tested

See [KEVOS-TEST-REPORT.md](KEVOS-TEST-REPORT.md): forged and tampered commands, commands for another computer,
expired and replayed commands, replayed and altered device requests, stale clocks, unknown and removed computers,
credentials in parameters, refused pipe clients, a computer removed while connected, and open servers refusing
pairing from the network. Not yet tested on Windows: the pipe ACL and peer checks, the CNG and TPM key, Authenticode
checks (they need a Windows test run, see the report).
