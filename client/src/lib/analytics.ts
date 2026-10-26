/** Consent-gated analytics (GA4 + Google Ads conversions). Nothing loads until the visitor accepts. */
type Consent = "granted" | "denied";
const KEY = "inicia-consent";
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } }

export function getConsent(): Consent | null {
  try { const v = window.localStorage.getItem(KEY); return v === "granted" || v === "denied" ? v : null; } catch { return null; }
}

export function setConsent(value: Consent) {
  try { window.localStorage.setItem(KEY, value); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent("inicia-consent", { detail: value }));
}

export function openConsentSettings() { window.dispatchEvent(new CustomEvent("inicia-consent-open")); }

let loaded = false;
let adsTarget = "";
export function loadAnalytics(ga4: string, adsConversion: string) {
  if (loaded || (!ga4 && !adsConversion) || getConsent() !== "granted") return;
  loaded = true;
  adsTarget = adsConversion;
  const first = ga4 || adsConversion.split("/")[0];
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(first)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer!.push(arguments); }; // eslint-disable-line prefer-rest-params
  window.gtag("consent", "default", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "denied" });
  window.gtag("js", new Date());
  if (ga4) window.gtag("config", ga4, { anonymize_ip: true });
  if (adsConversion) window.gtag("config", adsConversion.split("/")[0]);
}

/** Records a conversion-type event (form sent, donation intent). Safe to call when analytics is off. */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (!window.gtag) return;
  window.gtag("event", event, params);
  if (adsTarget.includes("/") && (event === "generate_lead" || event === "donate_intent")) window.gtag("event", "conversion", { send_to: adsTarget });
}
