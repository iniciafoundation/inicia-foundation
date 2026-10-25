/**
 * Central settings for the public site. Edit here, then publish.
 *
 * SHEETS_ENDPOINT: URL of the Google Apps Script web app (see apps-script/README.md).
 *   While it is empty, forms fall back to the previous Formspree inbox and the
 *   news / fundraising blocks stay hidden.
 */
export const SHEETS_ENDPOINT = "";

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
