// hCaptcha for Web3Forms. The GoCore Web3Forms form requires an hCaptcha token, so the quote form and
// the assistant's "Leave a message" form both render a check before sending. The script is loaded
// only when a visitor starts filling in a form, so other pages never load third-party code.
// Site key: Web3Forms' public hCaptcha key (from https://web3forms.com/client/script.js).

const SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
const SCRIPT = 'https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off&onload=gocoreHcaptchaReady';

interface HCaptcha {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  getResponse(id?: string): string;
  reset(id?: string): void;
}
declare global {
  interface Window {
    hcaptcha?: HCaptcha;
    gocoreHcaptchaReady?: () => void;
  }
}

let loading: Promise<HCaptcha> | null = null;

function load(): Promise<HCaptcha> {
  if (window.hcaptcha) return Promise.resolve(window.hcaptcha);
  if (!loading) {
    loading = new Promise<HCaptcha>((resolve, reject) => {
      // Never leave a form waiting forever: give up after 12 seconds and let the caller explain.
      const timer = setTimeout(() => fail(), 12_000);
      const fail = () => {
        clearTimeout(timer);
        loading = null;
        reject(new Error('captcha unavailable'));
      };
      window.gocoreHcaptchaReady = () => {
        clearTimeout(timer);
        resolve(window.hcaptcha!);
      };
      const s = document.createElement('script');
      s.src = SCRIPT;
      s.async = true;
      s.onerror = fail;
      document.head.append(s);
    });
  }
  return loading;
}

export interface Captcha {
  /** The current token, or '' if the visitor has not completed the check yet. */
  token(): string;
  reset(): void;
}

/** Render the check into `el` (once). Resolves to null if hCaptcha could not be loaded. */
export async function mountCaptcha(el: HTMLElement): Promise<Captcha | null> {
  try {
    const h = await load();
    const existing = el.dataset.widgetId;
    const id =
      existing ??
      h.render(el, { sitekey: SITE_KEY, theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light' });
    el.dataset.widgetId = id;
    return { token: () => h.getResponse(id) || '', reset: () => h.reset(id) };
  } catch {
    return null;
  }
}
