import { useEffect } from 'react';
import { api } from './api';

const INTERVAL_MS = 60_000;
const IDLE_AFTER_MS = 5 * 60_000;

/**
 * Activity heartbeat. Sends at most one request per minute, only while the
 * tab is visible AND the person has interacted (keyboard, pointer, scroll,
 * touch) in the last five minutes. An open-but-idle tab therefore stops
 * counting as "active", and no content or identifiers beyond the existing
 * session are sent.
 */
export function useHeartbeat(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let lastInteraction = Date.now();
    let lastSent = 0;
    const mark = () => {
      lastInteraction = Date.now();
    };
    const send = () => {
      const t = Date.now();
      if (document.visibilityState !== 'visible') return;
      if (t - lastInteraction > IDLE_AFTER_MS) return;
      if (t - lastSent < INTERVAL_MS - 2_000) return;
      lastSent = t;
      void api('/heartbeat', { method: 'POST', body: {}, allowStatuses: [401, 404, 429] }).catch(() => {});
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        mark();
        send();
      }
    };
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'] as const;
    let moveThrottle = 0;
    const onMove = () => {
      const t = Date.now();
      if (t - moveThrottle > 15_000) {
        moveThrottle = t;
        mark();
      }
    };
    events.forEach((e) => window.addEventListener(e, mark, { passive: true, capture: true }));
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisible);
    send();
    const timer = setInterval(send, INTERVAL_MS);
    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, mark, { capture: true }));
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled]);
}
