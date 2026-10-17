"""AI providers for the in-app copilot. Anthropic runs natively (web search, thinking, live streaming).
Every other provider speaks the OpenAI Chat Completions format (OpenAI, Google Gemini's OpenAI endpoint,
OpenRouter, Groq, Together, Mistral, a self-hosted server...), so one adapter covers them all: it turns the
copilot's Anthropic-style request into a Chat Completions request and the streamed answer back into
Anthropic-style events, so ai.run_stream, the live build and the chat work unchanged.
"""

from __future__ import annotations

import json
from contextlib import contextmanager

import httpx

DEFAULT_ANTHROPIC_MODEL = "claude-opus-5-5"

# label, base URL, a starting model (the person can type any other; "List models" asks the provider)
PROVIDERS: dict[str, dict] = {
    "anthropic": {"label": "Anthropic (Claude)", "base_url": "https://api.anthropic.com", "model": DEFAULT_ANTHROPIC_MODEL,
                  "keys": "console.anthropic.com > API Keys", "web": True},
    "openai": {"label": "OpenAI", "base_url": "https://api.openai.com/v1", "model": "",
               "keys": "platform.openai.com > API keys"},
    "gemini": {"label": "Google Gemini", "base_url": "https://generativelanguage.googleapis.com/v1beta/openai", "model": "",
               "keys": "aistudio.google.com > Get API key"},
    "openrouter": {"label": "OpenRouter (many models)", "base_url": "https://openrouter.ai/api/v1", "model": "",
                   "keys": "openrouter.ai > Keys"},
    "custom": {"label": "Other (OpenAI-compatible)", "base_url": "", "model": "", "keys": "your provider's dashboard"},
}

TIMEOUT = httpx.Timeout(600.0, connect=20.0)


class ProviderError(Exception):
    def __init__(self, message: str, status: int | None = None):
        super().__init__(message)
        self.status = status


def public_list() -> list[dict]:
    return [{"id": k, "label": v["label"], "base_url": v["base_url"], "model": v["model"], "keys": v["keys"],
             "web": bool(v.get("web"))} for k, v in PROVIDERS.items()]


# ---------------------------------------------------------------- clients

def client_for(cfg: dict):
    """An object with .beta.messages.stream(**kw) like anthropic.Anthropic()."""
    if cfg["provider"] == "anthropic":
        import anthropic
        return anthropic.Anthropic(api_key=cfg["key"]) if cfg.get("key") else anthropic.Anthropic()
    return _NS(beta=_NS(messages=OpenAICompatMessages(cfg)))


def adapt_kwargs(cfg: dict, kw: dict) -> dict:
    """Request options per provider: the model chosen, and Anthropic-only options only where they apply."""
    kw = dict(kw, model=cfg["model"])
    if cfg["provider"] == "anthropic" and cfg["model"] != DEFAULT_ANTHROPIC_MODEL:
        for k in ("betas", "fallbacks", "output_config"):
            kw.pop(k, None)
    return kw


class _NS:
    def __init__(self, **kw):
        self.__dict__.update(kw)


class _Obj:
    """A small attribute bag shaped like the Anthropic SDK's objects (blocks, events, deltas)."""

    def __init__(self, type_, **kw):
        self.type = type_
        self.__dict__.update(kw)

    def model_dump(self):
        return {k: v for k, v in self.__dict__.items() if v is not None}


def _g(o, k, default=None):
    return o.get(k, default) if isinstance(o, dict) else getattr(o, k, default)


def to_openai_messages(system: str, messages: list) -> list[dict]:
    """Anthropic-style conversation -> Chat Completions messages."""
    out = [{"role": "system", "content": system}] if system else []
    for m in messages:
        role, content = _g(m, "role"), _g(m, "content")
        if isinstance(content, str):
            out.append({"role": role, "content": content})
            continue
        if role == "assistant":
            text, calls = [], []
            for b in content or []:
                t = _g(b, "type")
                if t == "text":
                    text.append(_g(b, "text") or "")
                elif t == "tool_use":
                    calls.append({"id": _g(b, "id"), "type": "function",
                                  "function": {"name": _g(b, "name"), "arguments": json.dumps(_g(b, "input") or {})}})
            msg = {"role": "assistant", "content": "".join(text) or None}
            if calls:
                msg["tool_calls"] = calls
            out.append(msg)
        else:
            texts = []
            for b in content or []:
                t = _g(b, "type")
                if t == "tool_result":
                    c = _g(b, "content")
                    if not isinstance(c, str):
                        c = json.dumps(c) if not isinstance(c, list) else "".join(_g(x, "text") or "" for x in c)
                    out.append({"role": "tool", "tool_call_id": _g(b, "tool_use_id"), "content": c})
                elif t == "text":
                    texts.append(_g(b, "text") or "")
            if texts:
                out.append({"role": "user", "content": "".join(texts)})
    return out


def to_openai_tools(tools: list) -> list[dict]:
    out = []
    for t in tools or []:
        if "input_schema" not in t:  # Anthropic server tools (web search) have no equivalent here
            continue
        out.append({"type": "function", "function": {"name": t["name"], "description": t.get("description", "")[:1024],
                                                      "parameters": t["input_schema"]}})
    return out


STOP = {"tool_calls": "tool_use", "function_call": "tool_use", "stop": "end_turn", "length": "max_tokens",
        "content_filter": "refusal"}


def translate_stream(lines, on_event) -> _Obj:
    """Chat Completions SSE lines -> Anthropic-style events through on_event; returns the final message."""
    blocks: list[_Obj] = []
    text_idx = None
    think_idx = None
    calls: dict[int, int] = {}      # OpenAI tool call index -> our block index
    args: dict[int, str] = {}
    stop = "end_turn"

    def start(block):
        blocks.append(block)
        on_event(_Obj("content_block_start", index=len(blocks) - 1, content_block=block))
        return len(blocks) - 1

    for line in lines:
        line = line.strip() if isinstance(line, str) else line.decode().strip()
        if not line.startswith("data:"):
            continue
        data = line[5:].strip()
        if data == "[DONE]":
            break
        try:
            chunk = json.loads(data)
        except ValueError:
            continue
        if chunk.get("error"):
            err = chunk["error"]
            raise ProviderError(err.get("message") if isinstance(err, dict) else str(err))
        for ch in chunk.get("choices") or []:
            d = ch.get("delta") or {}
            reasoning = d.get("reasoning") or d.get("reasoning_content")
            if isinstance(reasoning, str) and reasoning:
                if think_idx is None:
                    think_idx = start(_Obj("thinking", thinking=""))
                blocks[think_idx].thinking += reasoning
                on_event(_Obj("content_block_delta", index=think_idx, delta=_Obj("thinking_delta", thinking=reasoning)))
            if d.get("content"):
                if text_idx is None:
                    text_idx = start(_Obj("text", text="", citations=None))
                blocks[text_idx].text += d["content"]
                on_event(_Obj("content_block_delta", index=text_idx, delta=_Obj("text_delta", text=d["content"])))
            for tc in d.get("tool_calls") or []:
                k = tc.get("index", 0)
                fn = tc.get("function") or {}
                if k not in calls:
                    calls[k] = start(_Obj("tool_use", id=tc.get("id") or f"call_{k}", name=fn.get("name") or "", input={}))
                    args[k] = ""
                    text_idx = None  # text after a tool call starts a new block
                b = blocks[calls[k]]
                if fn.get("name") and not b.name:
                    b.name = fn["name"]
                if fn.get("arguments"):
                    args[k] += fn["arguments"]
                    on_event(_Obj("content_block_delta", index=calls[k], delta=_Obj("input_json_delta", partial_json=fn["arguments"])))
            if ch.get("finish_reason"):
                stop = STOP.get(ch["finish_reason"], "end_turn")
    for k, i in calls.items():
        try:
            blocks[i].input = json.loads(args[k] or "{}")
        except ValueError:
            blocks[i].input = {}
    for i in range(len(blocks)):
        on_event(_Obj("content_block_stop", index=i))
    if calls and stop == "end_turn":
        stop = "tool_use"
    content = [b for b in blocks if b.type != "thinking"]
    return _Obj("message", content=content, stop_reason=stop, role="assistant")


def _headers(cfg: dict) -> dict:
    h = {"Authorization": f"Bearer {cfg['key']}", "Content-Type": "application/json"}
    if cfg["provider"] == "openrouter":
        h["X-Title"] = "OpenSketch"
    return h


def _error_text(r: httpx.Response) -> str:
    try:
        j = r.json()
        e = j.get("error") if isinstance(j, dict) else None
        if isinstance(e, dict):
            return e.get("message") or json.dumps(e)[:300]
        if isinstance(j, list) and j and isinstance(j[0], dict) and "error" in j[0]:
            return j[0]["error"].get("message", "")
        return str(e or j)[:300]
    except ValueError:
        return r.text[:300]


class OpenAICompatMessages:
    def __init__(self, cfg: dict):
        self.cfg = cfg

    @contextmanager
    def stream(self, **kw):
        cfg = self.cfg
        body = {"model": cfg["model"], "stream": True,
                "messages": to_openai_messages(kw.get("system", ""), kw.get("messages", []))}
        tools = to_openai_tools(kw.get("tools"))
        if tools:
            body["tools"] = tools
        url = cfg["base_url"].rstrip("/") + "/chat/completions"
        with httpx.Client(timeout=TIMEOUT) as http:
            with http.stream("POST", url, headers=_headers(cfg), json=body) as r:
                if r.status_code >= 400:
                    r.read()
                    raise ProviderError(f"{PROVIDERS[cfg['provider']]['label']} error {r.status_code}: {_error_text(r)}", r.status_code)
                yield _Stream(r.iter_lines())

    def create(self, **kw):  # not used: run_stream always streams with this client
        raise NotImplementedError


class _Stream:
    def __init__(self, lines):
        self._lines = lines
        self._events: list = []
        self._final = None

    def __iter__(self):
        import queue
        import threading
        q: queue.Queue = queue.Queue()
        done = object()

        def run():
            try:
                self._final = translate_stream(self._lines, q.put)
            except Exception as exc:  # passed to the reader
                q.put(exc)
            q.put(done)

        threading.Thread(target=run, daemon=True).start()
        while True:
            ev = q.get()
            if ev is done:
                return
            if isinstance(ev, Exception):
                raise ev
            yield ev

    def get_final_message(self):
        return self._final


# ---------------------------------------------------------------- key checks

def list_models(cfg: dict) -> list[str]:
    """The models this key can use (also proves the key works). Raises ProviderError."""
    try:
        if cfg["provider"] == "anthropic":
            r = httpx.get("https://api.anthropic.com/v1/models?limit=100", timeout=20,
                          headers={"x-api-key": cfg["key"], "anthropic-version": "2023-06-01"})
        else:
            r = httpx.get(cfg["base_url"].rstrip("/") + "/models", headers=_headers(cfg), timeout=20)
    except httpx.HTTPError as exc:
        raise ProviderError(f"Could not reach the provider: {exc}") from None
    if r.status_code == 401 or r.status_code == 403:
        raise ProviderError("The provider refused this key.", r.status_code)
    if r.status_code >= 400:
        raise ProviderError(f"The provider answered {r.status_code}: {_error_text(r)}", r.status_code)
    data = r.json()
    items = data.get("data") if isinstance(data, dict) else data
    ids = []
    for m in items or []:
        mid = _g(m, "id") or _g(m, "name")
        if mid:
            ids.append(str(mid).removeprefix("models/"))
    return sorted(set(ids))


def plain_blocks(content) -> list:
    """Blocks made by this adapter as plain dicts, so a conversation can carry on with any provider."""
    return [b.model_dump() if isinstance(b, _Obj) else b for b in content or []]


def check_base_url(url: str) -> str:
    """A custom provider address must be public https: the server makes the calls, so private and local
    addresses (cloud metadata, other services on the machine) are refused."""
    import ipaddress
    import socket
    from urllib.parse import urlparse
    u = urlparse((url or "").strip())
    if u.scheme != "https" or not u.hostname:
        raise ProviderError("The provider's address must start with https://.")
    try:
        infos = socket.getaddrinfo(u.hostname, u.port or 443, proto=socket.IPPROTO_TCP)
    except OSError:
        raise ProviderError(f"Could not find {u.hostname}.") from None
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast or ip.is_unspecified:
            raise ProviderError("That address is on a private network. Use the provider's public https address.")
    return url.strip().rstrip("/")
