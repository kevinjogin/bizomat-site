# KEVOS bridge protocol 2.0

The contract between the KEVOS gateway (this server, `opensketch/devicebridge.py`), the KEVOS Companion on each
Windows computer and the KEVOS add-in inside SOLIDWORKS (`solidworks/src/Core/Bridge2`). Version 2.0. Minor versions
(2.x) only add optional fields; receivers ignore fields they do not know. A major version change needs a new URL
prefix (`/v3/`) and a new pipe hello range.

```
AI app --MCP (OAuth)--> sw_ tools --swbridge.call--> devicebridge --HTTPS long poll, outbound from the PC--> Companion
                                                                                --named pipe (this Windows user only)--> add-in --UI thread--> SOLIDWORKS API
```

The v1 link (`/mcp/sw/*`, the add-in polls with an `oss_` key) stays as the fallback. `swbridge.call` sends a command
to a registered computer when one is online, otherwise to the v1 add-in.

## 1. Common rules

- JSON, UTF-8. Times are RFC 3339 UTC with milliseconds: `2026-11-05T10:14:02.123Z`.
- Ids: a prefix and 26 Crockford base32 characters (48-bit time in ms, 80 random bits): `cmd_`, `dev_`, `msg_`, `ses_`,
  `pip_`, `swi_`, `cor_`, `par_`.
- Every message has `v` ("2.0"), `type`, `msg_id`, `sent_at`.
- No password, token, cookie or key is ever in a body. The gateway refuses a command whose parameters contain one
  (key names such as `password`, `api_key`, `token`; values shaped like an `oss_` key, a Bearer token, a JWT, a PEM
  private key, or the person's own private MCP address): error `INPUT_FORBIDDEN_FIELD`.

## 2. Identity and signatures

| What | How |
|---|---|
| A computer | An EC P-256 key made on it, non-exportable (Windows key store, the TPM when available). Its public JWK is registered at pairing. |
| A request from a computer | `Authorization: KEVOS-Device <JWS>`, ES256 by the device key. Header `{"alg":"ES256","typ":"kevos-proof","kid":"<device_id>"}`. Claims `{"htm","htu","iat","jti","bh"}`: method, path and query, Unix time, a one-time id (16 to 64 chars), SHA-256 hex of the body. |
| Checks on every request | Signature with the registered key; device not removed; `htm`/`htu` match the request (compared percent-decoded); `|now - iat| <= 120 s`; `jti` not seen in the last 6 minutes; `bh` matches the body. |
| A command or cancel from the gateway | A compact JWS by the gateway's command key, `typ` `kevos-command` or `kevos-cancel`, `kid` = the key's RFC 7638 thumbprint. The companion pinned that key at pairing and refuses anything else, including a welcome naming another key (`GATEWAY_KEY_CHANGED`: pair again). |
| An update manifest | A JWS by the same key, `typ` `kevos-update`. |
| The pipe | Not signed: it is local to one Windows user and both ends check the other process (section 6). The add-in still checks each command's id, expiry and op, and refuses a repeat. |

## 3. Gateway HTTP API

| Method and path | Auth | Body | Answer |
|---|---|---|---|
| `POST /v2/devices/pair/start` | none (rate-limited: 20 per address per hour) | `{public_jwk, name, machine, os, companion_version}` | `{pair_id, user_code "ABCD-EFGH", verification_uri, verification_uri_complete, expires_in 600, interval 3}` |
| `GET/POST /devices/pair` | the person signed in on the website | form: `code`, `name`, or `decision=deny` | the approval page |
| `POST /v2/devices/pair/poll` | proof signed with the pairing key, `kid` = `pair_id` | `{}` | `{status: pending}` or `{status: approved, device_id, device_name, account, gateway_jwk}`; 410 when expired or denied |
| `POST /v2/devices/pair/password` | proof signed with the pairing key, `kid` = `pair_id` | `{email, password, name?}` | approves this pairing for the account with that email and password (the same password the person signs in with; the Companion keeps neither), then answers like an approved poll; 401 `INVALID_CREDENTIALS` (failures rate-limited per address and email, as the sign-in page); 403 when the server has no accounts; 410 when the pairing expired or was decided |
| `POST /v2/device/hello` | device proof | device.hello | device.welcome |
| `GET /v2/device/next?session=&wait=25` | device proof | | 204 (heartbeat), 200 gateway.messages, 409 session.end |
| `POST /v2/device/ack` | device proof | command.ack | `{ok, known, status}` |
| `POST /v2/device/progress` | device proof | command.status | `{ok, known}` |
| `POST /v2/device/status` | device proof | device.status | `{ok}` |
| `POST /v2/device/file?command=&name=&part=&parts=` | device proof (body hash over the chunk) | raw bytes, at most 32 MiB | `{received, parts_received, complete}` |
| `POST /v2/device/result` | device proof | command.result | result.receipt |
| `GET /v2/device/blob/{blob_id}` | device proof | | the file; only for a command open on this computer |
| `POST /v2/device/unpair` | device proof | `{}` | `{ok}`; the device is removed |
| `GET /v2/bridge/update.json` | device proof | | `{manifest_jws}` or 404 |
| `GET /v2/keys` | none | | `{keys: [gateway JWK]}` |
| `GET /api/devices`, `POST /api/devices/{id}`, `DELETE /api/devices/{id}` | signed-in person | `{name?, default?}` | the person's computers; rename, default, remove |

Every answer carries `KEVOS-Server-Time`; the companion corrects its clock with it. Errors use
`{"v":"2.0","type":"error","error":{code, category, message, retryable, hop}}`.

## 4. Command lifecycle

```
created -> queued -> delivered -> accepted -> running -> succeeded | failed | cancelled
                 \-> expired (not started before expires_at)        \-> unknown (gateway or companion restarted while it ran)
        rejected (the companion or add-in refused it: bad signature, wrong device, expired, replay, unknown op, paused,
                  SOLIDWORKS not running, a dialog open)
```

- **Acknowledgment.** The companion acks `accepted` (hop `companion`) once every check passed and it handed the
  command to a SOLIDWORKS session; the add-in's own acceptance comes back as progress `accepted` (hop `addin`) with its
  queue position. A delivery without an ack within 10 s is delivered again (same command id, at most 5 times).
- **At most once.** The companion and the add-in remember every command id (the companion on disk, until a day after
  it expires). A repeat is acked `duplicate` and never run again; a stored result is sent again instead.
- **Expiry.** `expires_at` is the latest a command may start: `created_at` plus the tool's time limit, at most 15
  minutes. A command not started by then is withdrawn (`EXPIRED` / `NOT_DELIVERED`).
- **Run time.** `run_timeout_ms` is the tool's own limit (30 s to 15 min, as in v1). If it passes while SOLIDWORKS
  works, the tool answers `STILL_RUNNING` with the command id; the result, when it comes, is kept and read with
  `sw_command_status`.
- **Cancellation.** By the AI app (MCP cancel), `sw_cancel_command`, an expiry, or removing the computer. Not yet
  delivered: withdrawn. Delivered: a signed `command.cancel` goes to the computer. Queued in the add-in: dropped and
  answered `cancelled`. Running: a batch stops between steps and is rolled back; feature lists and drawing edits stop
  between items (the ones made are kept, as in v1); a single SOLIDWORKS call finishes (`cancel_ignored`).
- **Results.** Files first (chunks of 32 MiB, each request signed with the chunk's hash), then the result with each
  file's name, size and SHA-256; the gateway refuses a result whose files do not match, or whose `params_sha256` is
  not the command's. The companion keeps a result in its outbox until the gateway's receipt, so a network drop or a
  restart never loses one.

## 5. Heartbeats and reconnecting

| Link | Heartbeat | Lost | Reconnect |
|---|---|---|---|
| Companion to gateway | Each long poll (held 25 s). Online = polled in the last 70 s. Status (SOLIDWORKS sessions, documents, busy, dialogs) is posted when it changes and every 60 s. | A poll not answered in 40 s is abandoned | Backoff 1, 2, 4 ... 60 s with jitter; at once after a network change, resume from sleep or unlock. 409 (`replaced`, `restarted`): hello again. 401 removed/unknown: stop and show "pair again". |
| Companion to add-in | `pipe.ping` every 10 s, answered on the add-in's pipe thread with `ui_responsive`, `modal_dialog`, `busy` | 3 missed: the link is closed | The add-in reconnects (1, 2, 5, 10 s) and starts the companion when it has been missing for 5 s. A SOLIDWORKS that closes or crashes while it works: the command fails as `RESULT_LOST` after 5 s. |

## 6. The pipe (companion and add-in)

- Name `\\.\pipe\KEVOS.Bridge.<user SID>`. Made by the companion with `FILE_FLAG_FIRST_PIPE_INSTANCE` (it refuses to
  run if another process holds the name), a protected DACL allowing only this user and denying network logons, and
  `PIPE_REJECT_REMOTE_CLIENTS`.
- The companion accepts a client only when its process is `SLDWORKS.exe` from a registered SOLIDWORKS folder with the
  KEVOS add-in loaded from the KEVOS install folder, signed by the same publisher as the companion when it is signed.
- The add-in talks to the pipe only when its server process is `KEVOS.Companion.exe` from the install folder, signed
  by the same publisher as the add-in when it is signed.
- Frames: 4-byte little-endian length, then UTF-8 JSON, at most 4 MiB. Files never go through the pipe: they are in
  the command's spool folder (`%LOCALAPPDATA%\KEVOS\Bridge\spool\<command id>`), and both sides check paths stay in it.
- Messages: add-in `pipe.hello`, `pipe.pong`, `addin.state`, `addin.event`, `command.ack`, `command.status`,
  `command.result`; companion `pipe.welcome`, `pipe.ping`, `companion.state`, `command.deliver`, `command.cancel`,
  `pipe.bye`.

## 7. Errors

`{code, category, message, retryable, hop, partial?, detail?}`. The `message` keeps v1's wording (the AI reads it);
MCP tools add `error_code` beside `error` in their JSON.

| Code | Meaning | Retry |
|---|---|---|
| `INPUT_INVALID`, `INPUT_FORBIDDEN_FIELD`, `UNKNOWN_OP`, `PAYLOAD_TOO_LARGE` | The command is wrong; nothing ran | after fixing it |
| `UNAUTHENTICATED`, `SIGNATURE_INVALID`, `REPLAY_DETECTED`, `TOKEN_EXPIRED` (clock), `DPOP_INVALID` | A request or command failed its checks | no (clock: after correcting) |
| `DEVICE_UNKNOWN`, `DEVICE_REVOKED`, `WRONG_DEVICE` | Not this account's computer, or removed | pair again |
| `DEVICE_OFFLINE`, `DEVICE_AMBIGUOUS`, `NOT_CONNECTED` | Which computer: offline, several online, none | when it is online / with `device=` |
| `INSTANCE_NOT_RUNNING`, `SW_BUSY_DIALOG`, `USER_EDITING`, `PAUSED` | SOLIDWORKS closed, a dialog open, a sketch open, paused by the person | after they act |
| `APPROVAL_DENIED` | The person declined a destructive operation in SOLIDWORKS | no |
| `NOT_DELIVERED`, `EXPIRED`, `STILL_RUNNING`, `RESULT_LOST`, `CANCELLED` | Delivery and timing | read the document first |
| `SW_REFUSED`, `SW_EXCEPTION` | SOLIDWORKS could not do it (the add-in's message says why) | after changing the request |

## 8. Ops and risk

The 21 add-in ops are v1's, with the same arguments and results. Each command carries `effect` and `risk`;
`risk: high` marks the ones the add-in asks the person about before running them:
`delete` (not a dry run), `undo`, `save` with `path`, `create_drawing` with `overwrite`, `set_parameter` with
`remove`, `edit_drawing` with a `delete` action (`devicebridge.risk_of`, `Bridge.Destructive`).

## 9. Sample messages

A command as the companion receives it (the JWS payload, shown decoded):

```json
{"v": "2.0", "type": "command", "command_id": "cmd_01JD7Q3M2W8X4K9V6T5R1B0N3E", "device_id": "dev_01JD7P9Z0A1B2C3D4E5F6G7H8J",
 "instance": {"mode": "doc", "doc": "C:\\Work\\Plate.SLDPRT"},
 "issued_by": {"user_id": "usr_3f9c2a1b7d4e", "grant_id": "grt_Xk2LpQ9s", "client": {"name": "Claude"}, "auth": "oauth"},
 "tool": "sw_add_features", "op": "add_features", "op_version": 1,
 "params": {"doc": "C:\\Work\\Plate.SLDPRT", "features": [{"id": "s1", "type": "sketch", "...": "..."}]},
 "params_sha256": "sha256:9b2f...", "effect": "modify", "risk": "low", "approval": null, "files_in": [],
 "created_at": "2026-11-05T10:14:00.000Z", "expires_at": "2026-11-05T10:24:00.000Z", "run_timeout_ms": 600000,
 "correlation_id": "cor_01JD7Q3M2W8X4K9V6T5R1B0N3F", "nonce": "4hT0b8Zr2mQy1KxP9vW3sA"}
```

Delivered in a poll answer:

```json
{"v": "2.0", "type": "gateway.messages", "msg_id": "msg_...", "sent_at": "...", "session_id": "ses_...", "server_time": "...",
 "messages": [{"v": "2.0", "type": "command.deliver", "msg_id": "msg_...", "sent_at": "...", "attempt": 1,
               "command_id": "cmd_01JD7Q3M2W8X4K9V6T5R1B0N3E", "jws": "eyJhbGciOiJFUzI1NiIs..."}]}
```

The companion's ack and the add-in's progress:

```json
{"v": "2.0", "type": "command.ack", "msg_id": "msg_...", "sent_at": "...", "command_id": "cmd_...", "device_id": "dev_...",
 "attempt": 1, "hop": "companion", "ack": "accepted"}
{"v": "2.0", "type": "command.status", "msg_id": "msg_...", "sent_at": "...", "command_id": "cmd_...", "device_id": "dev_...",
 "instance_id": "swi_...", "status": "running", "at": "...", "progress": {"step": 3, "of": 12, "note": "e2"}}
```

A refusal and a result:

```json
{"v": "2.0", "type": "command.ack", "command_id": "cmd_...", "device_id": "dev_...", "hop": "companion", "ack": "rejected",
 "error": {"code": "INSTANCE_NOT_RUNNING", "category": "device", "retryable": false, "hop": "companion",
           "message": "SOLIDWORKS is not running on DESK. Open SOLIDWORKS there; CADOS connects by itself."}}
{"v": "2.0", "type": "command.result", "msg_id": "msg_...", "sent_at": "...", "command_id": "cmd_...", "device_id": "dev_...",
 "instance_id": "swi_...", "status": "failed", "params_sha256": "sha256:9b2f...", "started_at": "...", "finished_at": "...",
 "duration_ms": 4210, "result": {"features": ["..."], "stopped_at": "f3 (fillet): ..."},
 "error": {"code": "SW_REFUSED", "category": "solidworks", "message": "Stopped at f3 (fillet): ...", "retryable": false,
           "hop": "addin", "partial": true},
 "files_out": [], "executor": {"addin_version": "0.11.0", "sw_revision": "30.5.0", "pid": 4120}}
```

A pipe hello and welcome:

```json
{"v": "2.0", "type": "pipe.hello", "msg_id": "msg_...", "sent_at": "...", "protocol": {"min": "2.0", "max": "2.0"},
 "pid": 4120, "process_started_at": "2026-11-05T08:00:00.000Z", "sw_revision": "30.5.0",
 "install_path": "C:\\Program Files\\SOLIDWORKS Corp\\SOLIDWORKS", "addin_version": "0.11.0",
 "capabilities": {"ops": {"read": 1, "create_drawing": 2, "...": 1}, "feature_types": ["sketch", "..."]}, "recent": []}
{"v": "2.0", "type": "pipe.welcome", "msg_id": "msg_...", "sent_at": "...", "pipe_session": "pip_...", "instance_id": "swi_...",
 "companion_version": "0.11.0", "protocol": "2.0", "device_id": "dev_...", "device_name": "DESK", "cloud": "Connected to https://...",
 "heartbeat": {"interval_ms": 10000, "missed_limit": 3, "ui_probe_ms": 2000}, "paused": false, "confirm_destructive": true}
```
