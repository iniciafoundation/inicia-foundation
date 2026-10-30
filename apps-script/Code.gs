/**
 * INICIA Foundation — website backend on Google Apps Script.
 *
 * - doPost: receives requests from the website forms, saves them in the Google Sheet
 *   (one tab per request type), emails the team and sends an automatic reply.
 * - doGet?action=content: returns the published news, fundraising goals and events
 *   that the website shows.
 *
 * Setup: see apps-script/README.md. Run setup() once, then deploy as a web app.
 */

const CONFIG = {
  NOTIFY_EMAIL: 'direccion@iniciafoundation.org',
  ORG_NAME: 'Inicia Foundation',
  SITE_URL: 'https://iniciafoundation.org',
  WHATSAPP: '+34 624 865 051',
  CACHE_SECONDS: 300,
  MAX_PER_EMAIL_10_MIN: 5,
  /** SEPA Core direct debit for membership fees. */
  SEPA: {
    CREDITOR_ID: 'ES82000G05426242',
    CREDITOR_NAME: 'ASOCIACION INICIA FOUNDATION',
    CREDITOR_NAME_DISPLAY: 'ASOCIACIÓN INICIA FOUNDATION',
    CREDITOR_ADDRESS: 'Av. Manuel Llaneza 68, 33208 Gijón (Asturias), España',
    CREDITOR_IBAN: 'ES5030070100142159381827',
    CREDITOR_BIC: '', // confirm with the bank (e.g. BCOEESMM070) and write it here; optional in SEPA files
    FOLDER_NAME: 'INICIA — Socios SEPA (confidencial)',
    SHEET_NAME: 'INICIA — Socios SEPA (confidencial)',
  },
};

const COMMON_START = ['fecha', 'referencia', 'estado', 'responsable', 'notas', 'nombre', 'email', 'telefono', 'canal', 'ciudad', 'idioma', 'proyecto'];
const COMMON_END = ['pagina'];
/** Added later: kept at the end so existing rows stay aligned. */
const EXTRA_END = ['zona', 'plan', 'entidad', 'pago', 'mandato'];

const REQUEST_TABS = {
  ayuda: { tab: 'Ayuda', fields: ['necesidad', 'personas', 'urgente', 'mensaje'] },
  voluntariado: { tab: 'Voluntariado', fields: ['areas', 'disponibilidad', 'modalidad', 'idiomas_habla', 'mayor_18', 'mensaje'] },
  organizacion: { tab: 'Organizaciones', fields: ['entidad', 'tipo_entidad', 'web', 'cargo', 'colaboracion', 'mensaje'] },
  donar: { tab: 'Donaciones y socios', fields: ['modo', 'que_dona', 'descripcion', 'entrega', 'cuota', 'cuota_otra', 'periodicidad'] },
  otro: { tab: 'Otras consultas', fields: ['tema', 'mensaje'] },
};

const CONTENT_TABS = {
  Noticias: ['publicar', 'fecha', 'idioma', 'titulo', 'resumen', 'texto', 'imagen', 'enlace', 'proyecto'],
  Recaudacion: ['activo', 'proyecto', 'objetivo', 'recaudado', 'donantes', 'nota_es', 'nota_en', 'nota_ru', 'nota_uk'],
  Eventos: ['publicar', 'fecha', 'hora', 'idioma', 'titulo', 'lugar', 'enlace'],
  Asistente: ['publicar', 'idioma', 'pregunta', 'palabras_clave', 'respuesta', 'enlace'],
};

/** Site settings editable without republishing the website (tab "Ajustes": clave | valor | nota). */
const SETTINGS = [
  ['social_facebook', 'https://www.facebook.com/iniciafoundation/', 'Enlace a la página de Facebook'],
  ['social_instagram', 'https://www.instagram.com/inicia_found', 'Enlace a Instagram'],
  ['social_linkedin', 'https://www.linkedin.com/in/iniciafoundation', 'Enlace a LinkedIn'],
  ['social_youtube', 'https://www.youtube.com/@IniciaFoundation', 'Enlace al canal de YouTube'],
  ['social_tiktok', '', 'Enlace a TikTok'],
  ['social_x', '', 'Enlace a X (Twitter)'],
  ['social_telegram', '', 'Enlace al canal de Telegram'],
  ['social_whatsapp_canal', '', 'Enlace al canal de WhatsApp'],
  ['social_threads', '', 'Enlace a Threads'],
  ['social_bluesky', '', 'Enlace a Bluesky'],
  ['pago_bizum_codigo', '', 'Código Bizum ONG (5 cifras) que da el banco'],
  ['pago_tarjeta_enlace', '', 'Enlace de pago con tarjeta / Apple Pay / Google Pay (p. ej. Stripe Payment Link o TPV del banco)'],
  ['pago_paypal_enlace', '', 'Enlace de PayPal (p. ej. https://www.paypal.com/donate/?hosted_button_id=...)'],
  ['pago_teaming_enlace', '', 'Enlace al grupo de Teaming (1 €/mes)'],
  ['pago_otro_nombre', '', 'Nombre de otra plataforma de donación (p. ej. migranodearena)'],
  ['pago_otro_enlace', '', 'Enlace de esa plataforma'],
  ['video_inicio_youtube', '', 'Enlace a un vídeo de YouTube para la página de inicio'],
  ['analitica_ga4', '', 'ID de Google Analytics 4 (G-XXXXXXX)'],
  ['google_ads_conversion', '', 'ID de conversión de Google Ads (AW-XXXXXXX/etiqueta)'],
  ['aviso_banner', '', 'Texto corto para una franja de aviso arriba (vacío = sin franja)'],
];

const TYPE_NAMES = { ayuda: 'Necesita ayuda', voluntariado: 'Voluntariado', organizacion: 'Organización', donar: 'Apoyo / donación', otro: 'Otra consulta' };

const AUTOREPLY = {
  es: { subject: 'Hemos recibido tu solicitud', body: (name, ref) => `Hola ${name}:\n\nGracias por escribir a ${CONFIG.ORG_NAME}. Hemos recibido tu solicitud con la referencia ${ref}.\n\nLa revisaremos y te responderemos por el medio que has elegido. Si es urgente, escríbenos por WhatsApp al ${CONFIG.WHATSAPP}.\n\nUn saludo,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  en: { subject: 'We have received your request', body: (name, ref) => `Hello ${name},\n\nThank you for contacting ${CONFIG.ORG_NAME}. We have received your request, reference ${ref}.\n\nWe will review it and reply through the channel you chose. If it is urgent, write to us on WhatsApp at ${CONFIG.WHATSAPP}.\n\nKind regards,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  ru: { subject: 'Мы получили вашу заявку', body: (name, ref) => `Здравствуйте, ${name}!\n\nСпасибо, что написали в ${CONFIG.ORG_NAME}. Мы получили вашу заявку, номер ${ref}.\n\nМы рассмотрим её и ответим удобным для вас способом. Если вопрос срочный, напишите нам в WhatsApp: ${CONFIG.WHATSAPP}.\n\nС уважением,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  uk: { subject: 'Ми отримали вашу заявку', body: (name, ref) => `Вітаємо, ${name}!\n\nДякуємо, що написали до ${CONFIG.ORG_NAME}. Ми отримали вашу заявку, номер ${ref}.\n\nМи розглянемо її та відповімо зручним для вас способом. Якщо питання термінове, напишіть нам у WhatsApp: ${CONFIG.WHATSAPP}.\n\nЗ повагою,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  ast: { subject: 'Recibimos la to solicitú', body: (name, ref) => `Hola ${name}:\n\nGracies por escribir a ${CONFIG.ORG_NAME}. Recibimos la to solicitú cola referencia ${ref}.\n\nVamos revisala y contestate pela vía qu'escoyisti. Si ye urxente, escríbinos per WhatsApp al ${CONFIG.WHATSAPP}.\n\nUn saludu,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
};

/* ---------- Setup ---------- */

function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss;
  const existing = props.getProperty('SHEET_ID');
  if (existing) ss = SpreadsheetApp.openById(existing);
  else {
    ss = SpreadsheetApp.create('INICIA — Web: solicitudes y contenido');
    props.setProperty('SHEET_ID', ss.getId());
  }
  const status = SpreadsheetApp.newDataValidation().requireValueInList(['Nueva', 'En curso', 'Cerrada'], true).build();

  Object.keys(REQUEST_TABS).forEach(key => {
    const conf = REQUEST_TABS[key];
    const sheet = ensureSheet_(ss, conf.tab, unique_(COMMON_START.concat(conf.fields, COMMON_END, EXTRA_END)));
    sheet.getRange(2, 3, sheet.getMaxRows() - 1, 1).setDataValidation(status);
  });
  Object.keys(CONTENT_TABS).forEach(tab => {
    const sheet = ensureSheet_(ss, tab, CONTENT_TABS[tab]);
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).insertCheckboxes();
  });
  const settings = ensureSheet_(ss, 'Ajustes', ['clave', 'valor', 'nota']);
  if (settings.getLastRow() === 1) settings.getRange(2, 1, SETTINGS.length, 3).setValues(SETTINGS);
  settings.setColumnWidth(1, 200); settings.setColumnWidth(2, 380); settings.setColumnWidth(3, 420);
  const news = ss.getSheetByName('Noticias');
  if (news.getLastRow() === 1) news.appendRow([false, new Date(), 'es', 'Ejemplo: título de la noticia', 'Resumen de una o dos frases.', 'Texto completo (opcional).', '', '', '']);
  const first = ss.getSheets()[0];
  if (first.getName() === 'Hoja 1' || first.getName() === 'Sheet1') ss.deleteSheet(first);

  Logger.log('Hoja lista: ' + ss.getUrl());
  return ss.getUrl();
}

function ensureSheet_(ss, name, headers) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#0B1E3A').setFontColor('#F0D893');
  sheet.setFrozenRows(1);
  return sheet;
}

/** Adds any new column titles (e.g. zona, plan) to an existing tab without touching the data. */
function syncHeader_(sheet, columns) {
  const current = sheet.getRange(1, 1, 1, columns.length).getValues()[0];
  if (current.join('|') !== columns.join('|')) {
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight('bold').setBackground('#0B1E3A').setFontColor('#F0D893');
  }
}

function unique_(list) { return list.filter((item, i) => list.indexOf(item) === i); }

function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Run setup() first');
  return SpreadsheetApp.openById(id);
}

/* ---------- Requests from the website ---------- */

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json_({ ok: true }); // honeypot
    const conf = REQUEST_TABS[data.tipo];
    if (!conf) return json_({ ok: false, error: 'tipo' });
    const email = String(data.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !String(data.nombre || '').trim()) return json_({ ok: false, error: 'contacto' });

    const cache = CacheService.getScriptCache();
    const key = 'rate_' + email.toLowerCase();
    const count = Number(cache.get(key) || 0);
    if (count >= CONFIG.MAX_PER_EMAIL_10_MIN) return json_({ ok: false, error: 'rate' });
    cache.put(key, String(count + 1), 600);

    const ref = clean_(data.referencia) || ('INI-' + Date.now());
    const values = Object.assign({}, data, { fecha: new Date(), referencia: ref, estado: 'Nueva', responsable: '', notas: '' });

    // Membership paid by SEPA direct debit: signed mandate (PDF) in the confidential sheet and folder.
    let mandate = null;
    if (data.tipo === 'donar' && data.modo === 'socio' && data.pago === 'sepa') {
      const problem = sepaProblem_(data);
      if (problem) return json_({ ok: false, error: problem });
      mandate = saveSepaMandate_(data, ref);
      values.mandato = mandate.ref;
    }
    const columns = unique_(COMMON_START.concat(conf.fields, COMMON_END, EXTRA_END));
    const row = columns.map(column => column === 'fecha' ? values.fecha : clean_(values[column]));

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = sheet_().getSheetByName(conf.tab);
      syncHeader_(sheet, columns);
      sheet.appendRow(row);
    } finally { lock.releaseLock(); }

    notifyTeam_(data.tipo, columns, row, ref, mandate);
    if (mandate) sepaReply_(email, clean_(data.nombre), ref, mandate, data.idioma);
    else autoReply_(email, clean_(data.nombre), ref, data.idioma);
    return json_({ ok: true, referencia: ref, mandato: mandate ? mandate.ref : undefined });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: 'server' });
  }
}

function notifyTeam_(tipo, columns, row, ref, mandate) {
  const lines = columns.map((column, i) => row[i] ? `${column}: ${row[i]}` : '').filter(Boolean).join('\n');
  const urgent = row[columns.indexOf('urgente')] === 'sí' ? '[URGENTE] ' : '';
  const sepa = mandate ? `\n\nMandato SEPA firmado: ${mandate.ref} · ${mandate.amount} € ${mandate.period}\nPDF: ${mandate.pdfUrl}\nRegistro de socios SEPA (confidencial): ${mandate.sheetUrl}` : '';
  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: `${urgent}Nueva solicitud web · ${TYPE_NAMES[tipo]}${mandate ? ' · SEPA' : ''} · ${ref}`,
    body: `${lines}${sepa}\n\nHoja de solicitudes: ${sheet_().getUrl()}`,
    name: 'Web INICIA',
    attachments: mandate ? [mandate.pdf] : [],
  });
}

function autoReply_(email, name, ref, lang) {
  const text = AUTOREPLY[lang] || AUTOREPLY.es;
  MailApp.sendEmail({ to: email, subject: `${text.subject} · ${ref}`, body: text.body(name.split(' ')[0] || '', ref), name: CONFIG.ORG_NAME, replyTo: CONFIG.NOTIFY_EMAIL });
}

/** Stops formulas being injected through form fields and trims long text. */
function clean_(value) {
  if (value === undefined || value === null) return '';
  let text = String(value).trim().slice(0, 3000);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

/* ---------- Public content for the website ---------- */

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  if (action !== 'content') return json_({ ok: true, service: 'INICIA web' });
  const cache = CacheService.getScriptCache();
  const cached = cache.get('content');
  if (cached) return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);
  const content = JSON.stringify(readContent_());
  cache.put('content', content, CONFIG.CACHE_SECONDS);
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JSON);
}

function readContent_() {
  const ss = sheet_();
  const rows = name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet || sheet.getLastRow() < 2) return [];
    const [headers, ...data] = sheet.getDataRange().getValues();
    return data.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
  };
  const iso = d => d instanceof Date ? Utilities.formatDate(d, 'Europe/Madrid', 'yyyy-MM-dd') : String(d || '');
  const today = iso(new Date());

  const news = rows('Noticias').filter(r => r.publicar === true && r.titulo)
    .map((r, i) => ({ id: `${iso(r.fecha)}-${i}`, fecha: iso(r.fecha), idioma: String(r.idioma || 'es'), titulo: String(r.titulo), resumen: String(r.resumen || ''), texto: String(r.texto || ''), imagen: driveImage_(r.imagen), enlace: String(r.enlace || ''), proyecto: String(r.proyecto || '') }))
    .sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 40);
  const fundraising = rows('Recaudacion').filter(r => r.activo === true && r.proyecto)
    .map(r => ({ proyecto: String(r.proyecto), objetivo: Number(r.objetivo) || 0, recaudado: Number(r.recaudado) || 0, donantes: Number(r.donantes) || 0, nota_es: String(r.nota_es || ''), nota_en: String(r.nota_en || ''), nota_ru: String(r.nota_ru || ''), nota_uk: String(r.nota_uk || '') }));
  const events = rows('Eventos').filter(r => r.publicar === true && r.titulo && iso(r.fecha) >= today)
    .map(r => ({ fecha: iso(r.fecha), hora: r.hora instanceof Date ? Utilities.formatDate(r.hora, 'Europe/Madrid', 'HH:mm') : String(r.hora || ''), idioma: String(r.idioma || 'todos'), titulo: String(r.titulo), lugar: String(r.lugar || ''), enlace: String(r.enlace || '') }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 12);
  const faq = rows('Asistente').filter(r => r.publicar === true && r.pregunta && r.respuesta)
    .map(r => ({ idioma: String(r.idioma || 'es'), pregunta: String(r.pregunta).slice(0, 200), palabras_clave: String(r.palabras_clave || '').slice(0, 300), respuesta: String(r.respuesta).slice(0, 1200), enlace: String(r.enlace || '') })).slice(0, 80);
  const settings = {};
  rows('Ajustes').forEach(r => { const key = String(r.clave || '').trim(); const value = String(r.valor || '').trim(); if (/^[a-z0-9_]+$/.test(key) && value) settings[key] = value.slice(0, 500); });
  return { news, fundraising, events, faq, settings, updated: new Date().toISOString() };
}

/** Turns a Google Drive share link into a direct image URL (the file must be shared "anyone with the link"). */
function driveImage_(value) {
  const text = String(value || '').trim();
  const match = text.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
  return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : text;
}

/** Clears the public content cache so changes in the sheet appear immediately. */
function refreshContent() { CacheService.getScriptCache().remove('content'); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- SEPA direct debit (membership fees) ---------- */

const SEPA_COLUMNS = ['fecha_firma', 'mandato', 'estado', 'nombre', 'email', 'telefono', 'titular', 'nif_titular', 'direccion', 'cp', 'poblacion', 'pais',
  'iban', 'importe', 'periodicidad', 'plan', 'entidad', 'idioma', 'referencia_solicitud', 'firmado_en_dispositivo', 'dispositivo', 'pdf', 'ultimo_cobro', 'notas'];
const SEPA_PERIODS = { mensual: 'mensual', trimestral: 'trimestral', anual: 'anual' };

const SEPA_REPLY = {
  es: { subject: 'Tu orden de domiciliación SEPA', body: (name, m) => `Hola ${name}:\n\nGracias por hacerte socio/a de ${CONFIG.ORG_NAME}. Adjuntamos la orden de domiciliación SEPA que has firmado (referencia ${m.ref}).\n\nCuota: ${m.amount} € (${m.period}). Se cargará en la cuenta ${m.ibanMasked}. El cargo aparecerá en tu cuenta a nombre de ${CONFIG.SEPA.CREDITOR_NAME_DISPLAY}.\n\nPuedes darte de baja o cambiar la cuota cuando quieras respondiendo a este correo. Tienes derecho a solicitar a tu banco la devolución de un cargo en las 8 semanas siguientes.\n\nUn saludo,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  en: { subject: 'Your SEPA direct debit mandate', body: (name, m) => `Hello ${name},\n\nThank you for becoming a member of ${CONFIG.ORG_NAME}. Attached is the SEPA direct debit mandate you signed (reference ${m.ref}).\n\nFee: €${m.amount} (${m.period}). It will be charged to the account ${m.ibanMasked} and will appear as ${CONFIG.SEPA.CREDITOR_NAME_DISPLAY}.\n\nYou can cancel or change your fee at any time by replying to this e-mail. You may ask your bank to refund a charge within 8 weeks.\n\nKind regards,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  ru: { subject: 'Ваше поручение SEPA на списание', body: (name, m) => `Здравствуйте, ${name}!\n\nСпасибо, что стали членом ${CONFIG.ORG_NAME}. Во вложении — подписанное вами поручение SEPA на списание (номер ${m.ref}).\n\nВзнос: ${m.amount} € (${m.period}). Он будет списываться со счёта ${m.ibanMasked}; в выписке получатель — ${CONFIG.SEPA.CREDITOR_NAME_DISPLAY}.\n\nОтказаться от членства или изменить взнос можно в любой момент, ответив на это письмо. Вы вправе попросить банк вернуть списание в течение 8 недель.\n\nС уважением,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  uk: { subject: 'Ваше доручення SEPA на списання', body: (name, m) => `Вітаємо, ${name}!\n\nДякуємо, що стали членом ${CONFIG.ORG_NAME}. У вкладенні — підписане вами доручення SEPA на списання (номер ${m.ref}).\n\nВнесок: ${m.amount} € (${m.period}). Він списуватиметься з рахунку ${m.ibanMasked}; у виписці отримувач — ${CONFIG.SEPA.CREDITOR_NAME_DISPLAY}.\n\nВідмовитися від членства або змінити внесок можна будь-коли, відповівши на цей лист. Ви маєте право попросити банк повернути списання протягом 8 тижнів.\n\nЗ повагою,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  ast: { subject: 'La to orde de domiciliación SEPA', body: (name, m) => `Hola ${name}:\n\nGracies por facete sociu/a de ${CONFIG.ORG_NAME}. Axuntamos la orde de domiciliación SEPA que robesti (referencia ${m.ref}).\n\nCuota: ${m.amount} € (${m.period}). Va cargase na cuenta ${m.ibanMasked} a nome de ${CONFIG.SEPA.CREDITOR_NAME_DISPLAY}.\n\nPuedes date de baxa o camudar la cuota cuando quieras contestando a esti corréu. Tienes derechu a pidir al to bancu la devolución d'un cargu nes 8 selmanes siguientes.\n\nUn saludu,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
};

/** ISO 13616 check of an IBAN (letters, length 15–34, mod 97). */
function isValidIban_(value) {
  const iban = String(value || '').replace(/[\s-]/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;
  if (iban.slice(0, 2) === 'ES' && iban.length !== 24) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const digits = /\d/.test(char) ? char : String(char.charCodeAt(0) - 55);
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

function sepaProblem_(data) {
  if (!isValidIban_(data.sepa_iban)) return 'iban';
  if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(String(data.sepa_firma || '')) || String(data.sepa_firma).length > 400000) return 'firma';
  if (data.sepa_acepto !== 'sí' && data.sepa_acepto !== true) return 'mandato';
  const amount = Number(data.sepa_importe);
  if (!(amount >= 1 && amount <= 10000)) return 'importe';
  for (const key of ['sepa_titular', 'sepa_direccion', 'sepa_cp', 'sepa_poblacion', 'sepa_pais']) if (!String(data[key] || '').trim()) return 'datos';
  return '';
}

const escapeHtml_ = value => String(value === undefined || value === null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const formatIban_ = value => String(value || '').replace(/[\s-]/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();
const maskIban_ = value => { const iban = String(value || '').replace(/\s/g, ''); return iban.slice(0, 4) + ' **** **** ' + iban.slice(-4); };

/** Printable mandate (Spanish legal text, the version that binds) with the hand-written signature. */
function buildMandateHtml_(m) {
  const S = CONFIG.SEPA;
  const row = (label, value) => `<tr><th>${escapeHtml_(label)}</th><td>${value}</td></tr>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body{font-family:Arial,Helvetica,sans-serif;color:#1b2433;font-size:11px;margin:28px}
    h1{font-size:16px;color:#0b1e3a;margin:0 0 4px} h2{font-size:12px;color:#0b1e3a;margin:16px 0 6px;text-transform:uppercase;letter-spacing:.04em}
    table{width:100%;border-collapse:collapse} th{width:38%;text-align:left;font-weight:bold;padding:4px 6px;background:#f2eee4;border:1px solid #d9d2c0} td{padding:4px 6px;border:1px solid #d9d2c0}
    .legal{margin-top:12px;font-size:10px;line-height:1.45;color:#3a4556} .sig{margin-top:8px;border:1px solid #d9d2c0;height:110px;text-align:center} .sig img{height:105px}
    .muted{color:#6b7280;font-size:9px;margin-top:14px}
  </style></head><body>
  <h1>Orden de domiciliación de adeudo directo SEPA</h1>
  <div>SEPA Direct Debit Mandate · Esquema básico (Core) · Pago recurrente</div>
  <h2>Referencia de la orden de domiciliación</h2>
  <table>${row('Referencia', `<b>${escapeHtml_(m.ref)}</b>`)}</table>
  <h2>Acreedor</h2>
  <table>${row('Identificador del acreedor', escapeHtml_(S.CREDITOR_ID))}${row('Nombre del acreedor', escapeHtml_(S.CREDITOR_NAME_DISPLAY))}${row('Dirección', escapeHtml_(S.CREDITOR_ADDRESS))}</table>
  <h2>Deudor (titular de la cuenta)</h2>
  <table>${row('Nombre', escapeHtml_(m.holder))}${m.nif ? row('DNI / NIE / NIF', escapeHtml_(m.nif)) : ''}${row('Dirección', escapeHtml_(m.address))}${row('Código postal y población', escapeHtml_(m.postcode + ' ' + m.town))}${row('País', escapeHtml_(m.country))}${row('IBAN', `<b>${escapeHtml_(formatIban_(m.iban))}</b>`)}</table>
  <h2>Pago</h2>
  <table>${row('Tipo de pago', 'Pago recurrente')}${row('Concepto', escapeHtml_(m.concept))}${row('Importe', escapeHtml_(m.amount + ' € · ' + m.period))}</table>
  <p class="legal">Mediante la firma de esta orden de domiciliación, el deudor autoriza (A) al acreedor a enviar instrucciones a la entidad del deudor para adeudar su cuenta y (B) a la entidad para efectuar los adeudos en su cuenta siguiendo las instrucciones del acreedor. Como parte de sus derechos, el deudor está legitimado al reembolso por su entidad en los términos y condiciones del contrato suscrito con la misma. La solicitud de reembolso deberá efectuarse dentro de las ocho semanas que siguen a la fecha de adeudo en cuenta. Puede obtener información adicional sobre sus derechos en su entidad financiera.</p>
  <h2>Fecha, localidad y firma del deudor</h2>
  <table>${row('Fecha y hora de la firma', escapeHtml_(m.signedAt))}${row('Localidad', escapeHtml_(m.town))}</table>
  <div class="sig"><img src="${m.signature}" alt="Firma"></div>
  <p class="muted">Firmada electrónicamente en ${escapeHtml_(CONFIG.SITE_URL)} por el titular de la cuenta (firma manuscrita en pantalla, aceptación expresa de la orden). Solicitud ${escapeHtml_(m.request)}. Email del firmante: ${escapeHtml_(m.email)}.</p>
  </body></html>`;
}

/** Confidential spreadsheet and Drive folder for mandates, created on first use in the script owner's Drive. */
function sepaStore_() {
  const props = PropertiesService.getScriptProperties();
  let folder;
  const folderId = props.getProperty('SEPA_FOLDER_ID');
  if (folderId) folder = DriveApp.getFolderById(folderId);
  else { folder = DriveApp.createFolder(CONFIG.SEPA.FOLDER_NAME); props.setProperty('SEPA_FOLDER_ID', folder.getId()); }
  let ss;
  const sheetId = props.getProperty('SEPA_SHEET_ID');
  if (sheetId) ss = SpreadsheetApp.openById(sheetId);
  else {
    ss = SpreadsheetApp.create(CONFIG.SEPA.SHEET_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(folder);
    props.setProperty('SEPA_SHEET_ID', ss.getId());
    const sheet = ss.getSheets()[0].setName('Socios SEPA');
    ensureSheet_(ss, 'Socios SEPA', SEPA_COLUMNS);
    sheet.getRange(2, 3, sheet.getMaxRows() - 1, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['activo', 'baja', 'devuelto', 'pausado'], true).build());
    ensureSheet_(ss, 'Remesas', ['fecha_creacion', 'fecha_cargo', 'recibos', 'total_eur', 'fichero']);
    installSepaMenu_(ss);
  }
  return { folder, ss, sheet: ss.getSheetByName('Socios SEPA') };
}

function saveSepaMandate_(data, requestRef) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const props = PropertiesService.getScriptProperties();
    const next = Number(props.getProperty('SEPA_COUNTER') || 0) + 1;
    props.setProperty('SEPA_COUNTER', String(next));
    const ref = 'INI-SEPA-' + ('0000' + next).slice(-5);
    const now = new Date();
    const store = sepaStore_();
    const period = SEPA_PERIODS[data.sepa_periodicidad] || 'mensual';
    const m = {
      ref, request: requestRef, email: clean_(data.email), holder: clean_(data.sepa_titular), nif: clean_(data.sepa_nif), address: clean_(data.sepa_direccion),
      postcode: clean_(data.sepa_cp), town: clean_(data.sepa_poblacion), country: clean_(data.sepa_pais), iban: String(data.sepa_iban).replace(/[\s-]/g, '').toUpperCase(),
      amount: Number(data.sepa_importe).toFixed(2).replace(/\.00$/, ''), period, concept: `Cuota de socio/a ${CONFIG.ORG_NAME} (${clean_(data.plan)})`,
      signedAt: Utilities.formatDate(now, 'Europe/Madrid', "dd/MM/yyyy HH:mm:ss 'h' (z)"), signature: String(data.sepa_firma),
    };
    const pdf = HtmlService.createHtmlOutput(buildMandateHtml_(m)).getBlob().getAs('application/pdf').setName(`${ref} - ${m.holder}.pdf`);
    const file = store.folder.createFile(pdf);
    const values = {
      fecha_firma: now, mandato: ref, estado: 'activo', nombre: clean_(data.nombre), email: m.email, telefono: clean_(data.telefono), titular: m.holder, nif_titular: m.nif,
      direccion: m.address, cp: m.postcode, poblacion: m.town, pais: m.country, iban: formatIban_(m.iban), importe: Number(m.amount), periodicidad: period, plan: clean_(data.plan),
      entidad: clean_(data.entidad), idioma: clean_(data.idioma), referencia_solicitud: requestRef, firmado_en_dispositivo: clean_(data.sepa_firmado_en), dispositivo: clean_(data.sepa_dispositivo),
      pdf: file.getUrl(), ultimo_cobro: '', notas: '',
    };
    syncHeader_(store.sheet, SEPA_COLUMNS);
    store.sheet.appendRow(SEPA_COLUMNS.map(column => values[column]));
    return { ref, amount: m.amount, period, ibanMasked: maskIban_(m.iban), pdf: file.getBlob(), pdfUrl: file.getUrl(), sheetUrl: store.ss.getUrl() };
  } finally { lock.releaseLock(); }
}

function sepaReply_(email, name, requestRef, mandate, lang) {
  const text = SEPA_REPLY[lang] || SEPA_REPLY.es;
  MailApp.sendEmail({ to: email, subject: `${text.subject} · ${mandate.ref}`, body: text.body(name.split(' ')[0] || '', mandate) + `\n\n(${requestRef})`, name: CONFIG.ORG_NAME, replyTo: CONFIG.NOTIFY_EMAIL, attachments: [mandate.pdf] });
}

/* ---------- Monthly SEPA file (remesa) for the bank ---------- */

/** Menu "INICIA" in the confidential spreadsheet (installable trigger, because this script is not bound to it). */
function installSepaMenu_(ss) {
  const exists = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'onSepaOpen' && t.getTriggerSourceId() === ss.getId());
  if (!exists) ScriptApp.newTrigger('onSepaOpen').forSpreadsheet(ss).onOpen().create();
}

function onSepaOpen() {
  SpreadsheetApp.getUi().createMenu('INICIA').addItem('Generar remesa SEPA…', 'generarRemesaSEPA').addToUi();
}

/** Run once from the editor to create the confidential sheet, folder and menu before the first member signs. */
function setupSepa() {
  const store = sepaStore_();
  installSepaMenu_(store.ss);
  Logger.log('Registro SEPA: ' + store.ss.getUrl() + '\nCarpeta: ' + store.folder.getUrl());
}

/** Whether a member with this frequency is charged in the month of the collection date. */
function isDueThisMonth_(period, signedDate, collectionDate) {
  if (period === 'mensual') return true;
  const months = (collectionDate.getFullYear() - signedDate.getFullYear()) * 12 + collectionDate.getMonth() - signedDate.getMonth();
  if (months < 0) return false;
  if (period === 'trimestral') return months % 3 === 0;
  if (period === 'anual') return months % 12 === 0;
  return true;
}

/** ISO 20022 pain.008.001.02 (SEPA Core) — the XML format Spanish banks accept for "Cuaderno 19.14 XML". */
function buildPain008_(cfg, txs, collectionDate, now, messageId) {
  const x = value => escapeHtml_(value).replace(/'/g, '&apos;');
  // SEPA allows only a basic Latin character set in names and texts.
  const latin = value => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9 /\-?:().,'+]/g, ' ').replace(/\s+/g, ' ').trim();
  const total = txs.reduce((sum, t) => sum + Math.round(t.amount * 100), 0) / 100;
  const day = Utilities.formatDate(collectionDate, 'Europe/Madrid', 'yyyy-MM-dd');
  const created = Utilities.formatDate(now, 'Europe/Madrid', "yyyy-MM-dd'T'HH:mm:ss");
  const agent = cfg.CREDITOR_BIC ? `<CdtrAgt><FinInstnId><BIC>${x(cfg.CREDITOR_BIC)}</BIC></FinInstnId></CdtrAgt>` : '<CdtrAgt><FinInstnId><Othr><Id>NOTPROVIDED</Id></Othr></FinInstnId></CdtrAgt>';
  const items = txs.map(t => `
      <DrctDbtTxInf>
        <PmtId><EndToEndId>${x(t.endToEnd)}</EndToEndId></PmtId>
        <InstdAmt Ccy="EUR">${t.amount.toFixed(2)}</InstdAmt>
        <DrctDbtTx><MndtRltdInf><MndtId>${x(t.mandate)}</MndtId><DtOfSgntr>${Utilities.formatDate(t.signed, 'Europe/Madrid', 'yyyy-MM-dd')}</DtOfSgntr></MndtRltdInf></DrctDbtTx>
        <DbtrAgt><FinInstnId><Othr><Id>NOTPROVIDED</Id></Othr></FinInstnId></DbtrAgt>
        <Dbtr><Nm>${x(latin(t.name).slice(0, 70))}</Nm></Dbtr>
        <DbtrAcct><Id><IBAN>${x(t.iban)}</IBAN></Id></DbtrAcct>
        <RmtInf><Ustrd>${x(latin(t.text).slice(0, 140))}</Ustrd></RmtInf>
      </DrctDbtTxInf>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <CstmrDrctDbtInitn>
    <GrpHdr>
      <MsgId>${x(messageId)}</MsgId>
      <CreDtTm>${created}</CreDtTm>
      <NbOfTxs>${txs.length}</NbOfTxs>
      <CtrlSum>${total.toFixed(2)}</CtrlSum>
      <InitgPty><Nm>${x(latin(cfg.CREDITOR_NAME))}</Nm><Id><OrgId><Othr><Id>${x(cfg.CREDITOR_ID)}</Id></Othr></OrgId></Id></InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>${x(messageId)}-1</PmtInfId>
      <PmtMtd>DD</PmtMtd>
      <BtchBookg>true</BtchBookg>
      <NbOfTxs>${txs.length}</NbOfTxs>
      <CtrlSum>${total.toFixed(2)}</CtrlSum>
      <PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl><LclInstrm><Cd>CORE</Cd></LclInstrm><SeqTp>RCUR</SeqTp></PmtTpInf>
      <ReqdColltnDt>${day}</ReqdColltnDt>
      <Cdtr><Nm>${x(latin(cfg.CREDITOR_NAME))}</Nm></Cdtr>
      <CdtrAcct><Id><IBAN>${x(cfg.CREDITOR_IBAN)}</IBAN></Id><Ccy>EUR</Ccy></CdtrAcct>
      ${agent}
      <ChrgBr>SLEV</ChrgBr>
      <CdtrSchmeId><Id><PrvtId><Othr><Id>${x(cfg.CREDITOR_ID)}</Id><SchmeNm><Prtry>SEPA</Prtry></SchmeNm></Othr></PrvtId></Id></CdtrSchmeId>${items}
    </PmtInf>
  </CstmrDrctDbtInitn>
</Document>
`;
}

/** Menu action: asks for the collection date and saves the XML file for Ruralvía in the confidential folder. */
function generarRemesaSEPA() {
  const ui = SpreadsheetApp.getUi();
  const answer = ui.prompt('Remesa SEPA', 'Fecha de cargo (AAAA-MM-DD). Debe ser al menos 2–3 días hábiles después de subir el fichero al banco:', ui.ButtonSet.OK_CANCEL);
  if (answer.getSelectedButton() !== ui.Button.OK) return;
  const match = answer.getResponseText().trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return ui.alert('Formato de fecha no válido. Ejemplo: 2026-12-05');
  const collection = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  const result = createRemesa_(collection);
  ui.alert(result.count ? `Remesa creada: ${result.count} recibos, ${result.total.toFixed(2)} €.\n\nFichero en Google Drive:\n${result.url}\n\nDescárgalo y súbelo en Ruralvía → Remesas de adeudos SEPA.` : 'No hay socios activos con cobro en ese mes.');
}

function createRemesa_(collection) {
  const store = sepaStore_();
  const sheet = store.sheet;
  const [headers, ...rows] = sheet.getDataRange().getValues();
  const col = name => headers.indexOf(name);
  const month = Utilities.formatDate(collection, 'Europe/Madrid', 'yyyy-MM');
  const txs = [];
  rows.forEach((r, i) => {
    if (String(r[col('estado')]).trim() !== 'activo') return;
    const signed = r[col('fecha_firma')] instanceof Date ? r[col('fecha_firma')] : new Date(r[col('fecha_firma')]);
    if (!isDueThisMonth_(String(r[col('periodicidad')]), signed, collection)) return;
    const iban = String(r[col('iban')]).replace(/\s/g, '');
    const amount = Number(r[col('importe')]);
    if (!isValidIban_(iban) || !(amount > 0)) return;
    txs.push({ row: i + 2, mandate: String(r[col('mandato')]), signed, name: String(r[col('titular')]), iban, amount, endToEnd: `${r[col('mandato')]}-${month}`, text: `Cuota socio ${CONFIG.ORG_NAME} ${month} ${r[col('mandato')]}` });
  });
  if (!txs.length) return { count: 0, total: 0 };
  const now = new Date();
  const messageId = 'INICIA-' + Utilities.formatDate(now, 'Europe/Madrid', 'yyyyMMddHHmmss');
  const xml = buildPain008_(CONFIG.SEPA, txs, collection, now, messageId);
  const file = store.folder.createFile(Utilities.newBlob(xml, 'application/xml', `Remesa SEPA ${Utilities.formatDate(collection, 'Europe/Madrid', 'yyyy-MM-dd')} (${txs.length} recibos).xml`));
  const total = txs.reduce((sum, t) => sum + t.amount, 0);
  txs.forEach(t => sheet.getRange(t.row, col('ultimo_cobro') + 1).setValue(collection));
  store.ss.getSheetByName('Remesas').appendRow([now, collection, txs.length, total, file.getUrl()]);
  return { count: txs.length, total, url: file.getUrl() };
}
