import { useEffect } from 'react';

const SESSION_KEY = 'anh_session_tracked';
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://banco-compose.6tqx2r.easypanel.host';

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getDevice(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getParam(params: URLSearchParams, name: string): string | null {
  return params.get(name) || null;
}

export function useSessionTracker() {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const params = new URLSearchParams(window.location.search);

    const gclid = getParam(params, 'gclid');
    const gbraid = getParam(params, 'gbraid');
    const wbraid = getParam(params, 'wbraid');
    const isGoogleAds = !!(gclid || gbraid || wbraid || getParam(params, 'gad_source'));

    const payload = {
      session_id: generateSessionId(),
      landing_page: window.location.href,
      first_page: window.location.pathname,
      referrer: document.referrer || null,
      device: getDevice(),
      user_agent: navigator.userAgent,
      utm_source: getParam(params, 'utm_source') || (isGoogleAds ? 'google' : null),
      utm_medium: getParam(params, 'utm_medium') || (isGoogleAds ? 'cpc' : null),
      utm_campaign: getParam(params, 'utm_campaign') || getParam(params, 'gad_campaignid') || null,
      utm_content: getParam(params, 'utm_content'),
      utm_term: getParam(params, 'utm_term'),
      gclid,
      gbraid,
      wbraid,
    };

    sessionStorage.setItem(SESSION_KEY, '1');

    fetch(`${BACKEND_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }, []);
}
