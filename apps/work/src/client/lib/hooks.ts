import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BRAND, pageTitle } from './brand';
import { BASE } from './base';

// ---------------------------------------------------------------- theme

export type ThemePref = 'light' | 'dark' | 'system';

export function applyTheme(pref: ThemePref) {
  const dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? BRAND.themeColor.dark : BRAND.themeColor.light);
  try {
    localStorage.setItem('workos:theme', pref);
  } catch {
    /* ignore */
  }
}

export function storedTheme(): ThemePref {
  try {
    const v = localStorage.getItem('workos:theme');
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* ignore */
  }
  return 'system';
}

// --------------------------------------------------------- keyboard shortcuts

export function isTypingTarget(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
}

/** Global keyboard shortcut. Combos like 'mod+k', '?', 'g h' (sequence). */
export function useShortcut(combo: string, handler: (e: KeyboardEvent) => void, enabled = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!enabled) return;
    const parts = combo.split(' ');
    let seq: string[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const isModCombo = combo.startsWith('mod+');
      if (isModCombo) {
        if (mod && e.key.toLowerCase() === combo.slice(4)) {
          e.preventDefault();
          ref.current(e);
        }
        return;
      }
      if (mod || e.altKey || isTypingTarget(e.target)) return;
      seq.push(e.key);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => (seq = []), 800);
      if (seq.length > parts.length) seq = seq.slice(-parts.length);
      if (seq.join(' ') === combo) {
        e.preventDefault();
        seq = [];
        ref.current(e);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (timer) clearTimeout(timer);
    };
  }, [combo, enabled]);
}

// ------------------------------------------------------------ realtime

/** Subscribes to a board's WebSocket channel and refreshes cached data on change. */
export function useBoardRealtime(boardId: string | undefined, selfId: string) {
  const qc = useQueryClient();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!boardId || typeof WebSocket === 'undefined') return;
    let ws: WebSocket | null = null;
    let closed = false;
    let retry = 0;
    let ping: ReturnType<typeof setInterval> | undefined;
    let debounce: ReturnType<typeof setTimeout> | undefined;
    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      ws = new WebSocket(`${proto}://${location.host}${BASE}/api/live/boards/${boardId}`);
      ws.onopen = () => {
        retry = 0;
        setConnected(true);
        ping = setInterval(() => ws?.readyState === 1 && ws.send('ping'), 25_000);
      };
      ws.onmessage = (ev) => {
        if (ev.data === 'pong') return;
        try {
          const msg = JSON.parse(String(ev.data));
          if (msg.actorId === selfId && msg.kind !== 'item_created') return; // own changes are already applied
          if (debounce) clearTimeout(debounce);
          debounce = setTimeout(() => {
            qc.invalidateQueries({ queryKey: ['board', boardId] });
            if (msg.itemId) qc.invalidateQueries({ queryKey: ['item', msg.itemId] });
          }, 150);
        } catch {
          /* ignore malformed */
        }
      };
      ws.onclose = () => {
        setConnected(false);
        if (ping) clearInterval(ping);
        if (!closed) setTimeout(connect, Math.min(30_000, 1000 * 2 ** retry++));
      };
    };
    connect();
    return () => {
      closed = true;
      if (ping) clearInterval(ping);
      ws?.close();
    };
  }, [boardId, selfId, qc]);
  return connected;
}

/** Sets the browser tab title: "<parts> · BIZOMAT Project Management". Pass nothing while data is loading. */
export function usePageTitle(...parts: (string | null | undefined)[]) {
  const title = parts.some(Boolean) ? pageTitle(...parts) : null;
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}

export function useDebounced<T>(value: T, ms = 250): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useLocalState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const set = (nv: T) => {
    setV(nv);
    try {
      localStorage.setItem(key, JSON.stringify(nv));
    } catch {
      /* ignore */
    }
  };
  return [v, set];
}
