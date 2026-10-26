/**
 * Central settings for the public site. Edit here, then publish.
 *
 * SHEETS_ENDPOINT: URL of the Google Apps Script web app (see apps-script/README.md).
 *   While it is empty, forms fall back to the previous Formspree inbox and the
 *   news / fundraising blocks stay hidden.
 */
export const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxueA-pAdpT1q-nQlVhJbsWFE951qrgVD3EXYsKE7jTKnl4eYDu3kD8uYr8Xw66PkFNpw/exec";

/** Previous contact inbox, used only as a fallback while SHEETS_ENDPOINT is empty. */
export const FORMSPREE_FALLBACK = "https://formspree.io/f/mdawrvbo";

export const CONTACT = {
  phone: "+34 624 865 051",
  phoneHref: "tel:+34624865051",
  whatsapp: "https://wa.me/34624865051",
  email: "info@iniciafoundation.org",
};

/** Donation details. Leave a value empty ("") to show "coming soon" for that method. */
export const DONATION = {
  holder: "Asociación Inicia Foundation",
  iban: "ES50 3007 0100 1421 5938 1827",
  bic: "",
  bank: "Caja Rural de Gijón",
  bizumCode: "",
  /** Optional card / international payment link (e.g. Stripe Payment Link). */
  cardLink: "",
  /** Optional Teaming group link for 1 €/month micro-donations. */
  teamingLink: "",
};

/** Social networks with a reserved place on the site. A network appears only when it has a link
 * (here or in the "Ajustes" tab of the Google Sheet), so there are never empty icons. */
export const SOCIAL_NETWORKS = [
  { key: "social_facebook", label: "Facebook" },
  { key: "social_instagram", label: "Instagram" },
  { key: "social_linkedin", label: "LinkedIn" },
  { key: "social_youtube", label: "YouTube" },
  { key: "social_tiktok", label: "TikTok" },
  { key: "social_x", label: "X" },
  { key: "social_telegram", label: "Telegram" },
  { key: "social_whatsapp_canal", label: "WhatsApp" },
  { key: "social_threads", label: "Threads" },
  { key: "social_bluesky", label: "Bluesky" },
] as const;

/** Defaults used until the Google Sheet is connected. The sheet always wins. */
export const DEFAULT_SETTINGS: Record<string, string> = {
  social_facebook: "https://www.facebook.com/iniciafoundation/",
  social_instagram: "https://www.instagram.com/inicia_found",
  social_linkedin: "https://www.linkedin.com/in/iniciafoundation",
  pago_bizum_codigo: DONATION.bizumCode,
  pago_tarjeta_enlace: DONATION.cardLink,
  pago_teaming_enlace: DONATION.teamingLink,
};
