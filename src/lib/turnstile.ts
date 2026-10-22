// Contact-page Turnstile only. The existing hCaptcha helper remains for other forms.
// This site key is public; TURNSTILE_SECRET_KEY is read only by the Worker.
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY?.trim() || '0x4AAAAAAFfDUjBHF2Y7_omi';
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=kevosTurnstileReady';
interface Turnstile {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  getResponse(id: string): string | undefined;
  reset(id: string): void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
    kevosTurnstileReady?: () => void;
  }
}
export interface ContactCaptcha {
  token(): string;
  reset(): void;
  /** A failed submission may have consumed the token. Wait for a new widget callback. */
  consume(): void;
}
let loading: Promise<Turnstile> | null = null;
function load(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const fail = () => { clearTimeout(timer); script.remove(); loading = null; reject(new Error('captcha unavailable')); };
    const timer = setTimeout(fail, 12_000);
    window.kevosTurnstileReady = () => {
      clearTimeout(timer);
      if (window.turnstile) resolve(window.turnstile); else fail();
    };
    script.src = SCRIPT;
    script.async = true;
    script.defer = true;
    script.onerror = fail;
    document.head.append(script);
  });
  return loading;
}
const mounted = new WeakMap<HTMLElement, ContactCaptcha>();
export async function mountTurnstile(el: HTMLElement): Promise<ContactCaptcha | null> {
  try {
    const existing = mounted.get(el);
    if (existing) return existing;
    const api = await load();
    let token = '';
    const id = api.render(el, {
      sitekey: SITE_KEY, action: 'contact', size: 'flexible',
      theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
      'response-field-name': 'cf-turnstile-response', 'refresh-expired': 'auto',
      callback: (value: string) => { token = value; },
      'expired-callback': () => { token = ''; },
      'error-callback': () => { token = ''; },
    });
    const captcha: ContactCaptcha = {
      token: () => token,
      reset: () => { token = ''; api.reset(id); },
      consume: () => { token = ''; },
    };
    mounted.set(el, captcha);
    return captcha;
  } catch { return null; }
}
