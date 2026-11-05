// Coarse, privacy-friendly User-Agent classification (no fingerprinting):
// device category, browser family + major version, operating system.

export interface DeviceInfo {
  device: 'desktop' | 'mobile' | 'tablet' | 'bot' | 'unknown';
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string | null | undefined): DeviceInfo {
  const s = ua ?? '';
  if (!s) return { device: 'unknown', browser: 'Unknown', os: 'Unknown' };
  if (/bot|crawler|spider|curl|wget|python-requests|headless/i.test(s)) return { device: 'bot', browser: 'Automated client', os: 'Unknown' };
  let os = 'Unknown';
  if (/iPad|iPhone|iPod/.test(s)) os = 'iOS';
  else if (/Android/.test(s)) os = 'Android';
  else if (/CrOS/.test(s)) os = 'ChromeOS';
  else if (/Windows NT/.test(s)) os = 'Windows';
  else if (/Mac OS X|Macintosh/.test(s)) os = 'macOS';
  else if (/Linux/.test(s)) os = 'Linux';
  let device: DeviceInfo['device'] = 'desktop';
  if (/iPad|Tablet/.test(s) || (/Android/.test(s) && !/Mobile/.test(s))) device = 'tablet';
  else if (/Mobi|iPhone|iPod|Android/.test(s)) device = 'mobile';
  const v = (re: RegExp) => s.match(re)?.[1];
  let browser = 'Other';
  if (v(/Edg(?:e|A|iOS)?\/(\d+)/)) browser = `Edge ${v(/Edg(?:e|A|iOS)?\/(\d+)/)}`;
  else if (v(/OPR\/(\d+)/)) browser = `Opera ${v(/OPR\/(\d+)/)}`;
  else if (v(/SamsungBrowser\/(\d+)/)) browser = `Samsung Internet ${v(/SamsungBrowser\/(\d+)/)}`;
  else if (v(/Firefox\/(\d+)/) || v(/FxiOS\/(\d+)/)) browser = `Firefox ${v(/Firefox\/(\d+)/) ?? v(/FxiOS\/(\d+)/)}`;
  else if (v(/CriOS\/(\d+)/)) browser = `Chrome ${v(/CriOS\/(\d+)/)}`;
  else if (v(/Chrome\/(\d+)/)) browser = `Chrome ${v(/Chrome\/(\d+)/)}`;
  else if (/Safari\//.test(s) && v(/Version\/(\d+)/)) browser = `Safari ${v(/Version\/(\d+)/)}`;
  return { device, browser, os };
}
