"""A KEVOS Companion stand-in for tests: pairs with the server, signs every request with its own device key,
verifies every command's signature against the gateway key it pinned at pairing, refuses replays and commands for
other computers, acknowledges, reports progress, uploads files in chunks and posts results, as
solidworks/src/Core/Bridge2 does. Commands are answered by a handler (canned answers or SimSW)."""

from __future__ import annotations

import hashlib
import json
import secrets
import threading
import time

import httpx
from cryptography.hazmat.primitives.asymmetric import ec

from opensketch import devicebridge as db


class Refused(Exception):
    """What a handler raises for a SOLIDWORKS refusal: (message, partial result)."""

    def __init__(self, message: str, result: dict | None = None, code: str = "SW_REFUSED"):
        super().__init__(message)
        self.result, self.code = result or {}, code


class FakeCompanion:
    def __init__(self, base: str, handler, name: str = "TESTPC", approve_as=None, instances: int = 1,
                 approve: bool = True, poll_wait: float = 2.0):
        self.base, self.handler, self.name = base, handler, name
        self.key = ec.generate_private_key(ec.SECP256R1())
        self.jwk = db.jwk_of(self.key.public_key())
        self.got: list[dict] = []          # verified command payloads
        self.cancels: list[dict] = []
        self.rejected: list[tuple[str, str]] = []
        self.seen: set[str] = set()
        self.stop = False
        self.ack = True                    # False: take commands and never acknowledge them
        self.hold: threading.Event | None = None   # set: a handler waits on it before answering
        self.poll_wait = poll_wait
        self.ended = None
        self.http = httpx.Client(timeout=60)
        r = self.http.post(base + "/v2/devices/pair/start", json={"public_jwk": self.jwk, "name": name, "machine": name,
                                                                   "os": "Windows 11 Pro", "companion_version": "1.0.0"})
        assert r.status_code == 200, r.text
        self.pair = r.json()
        self.kid = self.pair["pair_id"]
        if not approve:
            return
        db.approve_pairing(approve_as, self.pair["user_code"], name)
        r = self.post("/v2/devices/pair/poll", {})
        assert r.status_code == 200 and r.json()["status"] == "approved", r.text
        out = r.json()
        self.device_id, self.gateway_jwk = out["device_id"], out["gateway_jwk"]
        self.kid = self.device_id
        self.gw = db.jwk_public_key(self.gateway_jwk)
        self.instances = [self.instance(i) for i in range(instances)]
        self.hello()
        self.th = threading.Thread(target=self.loop, daemon=True)
        self.th.start()

    # -------------------------------------------------------------- signing
    def proof(self, method: str, path_qs: str, body: bytes, kid: str | None = None, iat: float | None = None,
              jti: str | None = None) -> str:
        claims = {"htm": method, "htu": path_qs, "iat": int(iat if iat is not None else time.time()),
                  "jti": jti or db.b64u(secrets.token_bytes(16)), "bh": hashlib.sha256(body).hexdigest()}
        return "KEVOS-Device " + db.jws_sign(self.key, {"alg": "ES256", "typ": "kevos-proof", "kid": kid or self.kid},
                                             json.dumps(claims).encode())

    def post(self, path: str, body: dict | bytes, **kw) -> httpx.Response:
        raw = body if isinstance(body, bytes) else json.dumps(body).encode()
        h = {"Authorization": self.proof("POST", path, raw, **kw), "Content-Type": "application/json"}
        return self.http.post(self.base + path, content=raw, headers=h)

    def get(self, path: str, **kw) -> httpx.Response:
        return self.http.get(self.base + path, headers={"Authorization": self.proof("GET", path, b"", **kw)})

    # -------------------------------------------------------------- session
    def instance(self, i: int) -> dict:
        return {"instance_id": db.ulid("swi"), "pid": 4000 + i, "sw_revision": "30.5.0", "addin_version": "0.11.0",
                "capabilities_sha256": "sha256:" + "0" * 64, "ui_responsive": True, "modal_dialog": False, "busy": None,
                "docs": [{"title": "Box.SLDPRT", "path": "C:\\OS\\Box.SLDPRT", "kind": "part", "active": True, "unsaved": False}]}

    def hello(self):
        r = self.post("/v2/device/hello", {"v": "2.0", "type": "device.hello", "msg_id": db.ulid("msg"), "sent_at": db.iso(),
                                           "device_id": self.device_id, "companion_version": "1.0.0",
                                           "protocol": {"min": "2.0", "max": "2.0"}, "os": "Windows 11 Pro",
                                           "installations": [{"year": 2022, "revision": "30.5.0", "path": "C:\\Program Files\\SOLIDWORKS Corp\\SOLIDWORKS"}],
                                           "instances": self.instances, "paused": False, "inflight": []})
        assert r.status_code == 200, r.text
        self.welcome = r.json()
        self.session = self.welcome["session_id"]

    def set_instances(self, instances: list[dict]):
        self.instances = instances
        r = self.post("/v2/device/status", {"v": "2.0", "type": "device.status", "msg_id": db.ulid("msg"), "sent_at": db.iso(),
                                            "device_id": self.device_id, "session_id": self.session,
                                            "instances": instances, "paused": False})
        assert r.status_code == 200, r.text

    def loop(self):
        while not self.stop:
            path = f"/v2/device/next?session={self.session}&wait={self.poll_wait}"
            try:
                r = self.get(path)
            except httpx.HTTPError:
                return
            if r.status_code == 409:
                self.ended = r.json()
                return
            if r.status_code == 204:
                continue
            if r.status_code != 200:
                self.ended = r.text
                return
            for m in r.json()["messages"]:
                if m["type"] == "command.deliver":
                    threading.Thread(target=self.run_command, args=(m,), daemon=True).start()
                elif m["type"] == "command.cancel":
                    _, payload = db.jws_verify(m["jws"], self.gw)
                    self.cancels.append(json.loads(payload))

    def _ackmsg(self, cid: str, ack: str, error: dict | None = None, status: str | None = None):
        body = {"v": "2.0", "type": "command.ack", "msg_id": db.ulid("msg"), "sent_at": db.iso(), "command_id": cid,
                "device_id": self.device_id, "attempt": 1, "hop": "companion", "ack": ack}
        if error:
            body["error"] = error
        if status:
            body["status"] = status
        return self.post("/v2/device/ack", body)

    def run_command(self, m: dict):
        # the checks the real companion makes before anything reaches SOLIDWORKS
        try:
            header, payload = db.jws_verify(m["jws"], self.gw)
            cmd = json.loads(payload)
        except ValueError as exc:
            self.rejected.append(("?", f"signature: {exc}"))
            return
        cid = cmd["command_id"]
        problem = None
        if header.get("typ") != "kevos-command":
            problem = ("SIGNATURE_INVALID", "not a command")
        elif cmd["device_id"] != self.device_id:
            problem = ("WRONG_DEVICE", "This command is for another computer.")
        elif db.parse_iso(cmd["expires_at"]) < time.time():
            problem = ("EXPIRED", "The command expired before it arrived.")
        elif cid in self.seen:
            self._ackmsg(cid, "duplicate", status="running")
            return
        elif not self.instances:
            problem = ("INSTANCE_NOT_RUNNING", f"SOLIDWORKS is not running on {self.name}. Open SOLIDWORKS there; CAD Automation "
                                               "connects by itself.")
        if problem:
            self.rejected.append((cid, problem[0]))
            self._ackmsg(cid, "rejected", {"code": problem[0], "category": "device", "message": problem[1],
                                           "retryable": False, "hop": "companion"})
            return
        self.seen.add(cid)
        self.got.append(cmd)
        if not self.ack:
            return
        self._ackmsg(cid, "accepted")
        self.post("/v2/device/progress", {"v": "2.0", "type": "command.status", "msg_id": db.ulid("msg"), "sent_at": db.iso(),
                                          "command_id": cid, "device_id": self.device_id, "status": "running", "at": db.iso(),
                                          "progress": {"step": 0, "of": 1, "note": cmd["op"]}})
        files_in = {}
        for f in cmd.get("files_in") or []:
            r = self.get(f"/v2/device/blob/{f['blob_id']}")
            assert r.status_code == 200, r.text
            assert "sha256:" + hashlib.sha256(r.content).hexdigest() == f["sha256"]
            files_in[f["name"]] = r.content
        if self.hold is not None:
            self.hold.wait(30)
        started = db.iso()
        out_files: dict[str, bytes] = {}
        cancelled = any(c["command_id"] == cid for c in self.cancels)
        try:
            if cancelled:
                raise Refused("Cancelled before it ran.", code="CANCELLED")
            res = self.handler(cmd["op"], cmd["params"], files_in, out_files) or {}
            status, error = "succeeded", None
        except Refused as exc:
            res, status = exc.result, ("cancelled" if exc.code == "CANCELLED" else "failed")
            error = {"code": exc.code, "category": "solidworks", "message": str(exc), "retryable": False, "hop": "addin",
                     "partial": bool(exc.result)}
        except Exception as exc:  # what the add-in does with an exception
            res, status = {}, "failed"
            error = {"code": "SW_EXCEPTION", "category": "solidworks", "message": f"{type(exc).__name__}: {exc}",
                     "retryable": False, "hop": "addin"}
        files_out = []
        chunk = self.welcome["limits"]["chunk_bytes"]
        for name, data in out_files.items():
            parts = max(1, -(-len(data) // chunk))
            for i in range(parts):
                part = data[i * chunk:(i + 1) * chunk]
                from urllib.parse import quote
                path = f"/v2/device/file?command={cid}&name={quote(name)}&part={i}&parts={parts}"
                r = self.http.post(self.base + path, content=part, headers={"Authorization": self.proof("POST", path, part)})
                assert r.status_code == 200, r.text
            files_out.append({"name": name, "size": len(data), "sha256": "sha256:" + hashlib.sha256(data).hexdigest()})
        r = self.post("/v2/device/result", {"v": "2.0", "type": "command.result", "msg_id": db.ulid("msg"), "sent_at": db.iso(),
                                            "command_id": cid, "device_id": self.device_id, "status": status,
                                            "params_sha256": cmd["params_sha256"], "started_at": started, "finished_at": db.iso(),
                                            "duration_ms": 1, "result": res if isinstance(res, dict) else {}, "error": error,
                                            "files_out": files_out, "executor": {"addin_version": "0.11.0", "sw_revision": "30.5.0"}})
        self.last_receipt = r.json() if r.status_code == 200 else r.text

    def close(self):
        self.stop = True
        if hasattr(self, "th"):
            self.th.join(10)
        self.http.close()
