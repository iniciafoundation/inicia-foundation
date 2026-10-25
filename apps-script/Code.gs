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
};

const COMMON_START = ['fecha', 'referencia', 'estado', 'responsable', 'notas', 'nombre', 'email', 'telefono', 'canal', 'ciudad', 'idioma', 'proyecto'];
const COMMON_END = ['pagina'];

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
};

const TYPE_NAMES = { ayuda: 'Necesita ayuda', voluntariado: 'Voluntariado', organizacion: 'Organización', donar: 'Apoyo / donación', otro: 'Otra consulta' };

const AUTOREPLY = {
  es: { subject: 'Hemos recibido tu solicitud', body: (name, ref) => `Hola ${name}:\n\nGracias por escribir a ${CONFIG.ORG_NAME}. Hemos recibido tu solicitud con la referencia ${ref}.\n\nLa revisaremos y te responderemos por el medio que has elegido. Si es urgente, escríbenos por WhatsApp al ${CONFIG.WHATSAPP}.\n\nUn saludo,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  en: { subject: 'We have received your request', body: (name, ref) => `Hello ${name},\n\nThank you for contacting ${CONFIG.ORG_NAME}. We have received your request, reference ${ref}.\n\nWe will review it and reply through the channel you chose. If it is urgent, write to us on WhatsApp at ${CONFIG.WHATSAPP}.\n\nKind regards,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  ru: { subject: 'Мы получили вашу заявку', body: (name, ref) => `Здравствуйте, ${name}!\n\nСпасибо, что написали в ${CONFIG.ORG_NAME}. Мы получили вашу заявку, номер ${ref}.\n\nМы рассмотрим её и ответим удобным для вас способом. Если вопрос срочный, напишите нам в WhatsApp: ${CONFIG.WHATSAPP}.\n\nС уважением,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
  uk: { subject: 'Ми отримали вашу заявку', body: (name, ref) => `Вітаємо, ${name}!\n\nДякуємо, що написали до ${CONFIG.ORG_NAME}. Ми отримали вашу заявку, номер ${ref}.\n\nМи розглянемо її та відповімо зручним для вас способом. Якщо питання термінове, напишіть нам у WhatsApp: ${CONFIG.WHATSAPP}.\n\nЗ повагою,\n${CONFIG.ORG_NAME}\n${CONFIG.SITE_URL}` },
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
    const sheet = ensureSheet_(ss, conf.tab, COMMON_START.concat(conf.fields, COMMON_END));
    sheet.getRange(2, 3, sheet.getMaxRows() - 1, 1).setDataValidation(status);
  });
  Object.keys(CONTENT_TABS).forEach(tab => {
    const sheet = ensureSheet_(ss, tab, CONTENT_TABS[tab]);
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).insertCheckboxes();
  });
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
    const columns = COMMON_START.concat(conf.fields, COMMON_END);
    const row = columns.map(column => column === 'fecha' ? values.fecha : clean_(values[column]));

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try { sheet_().getSheetByName(conf.tab).appendRow(row); } finally { lock.releaseLock(); }

    notifyTeam_(data.tipo, columns, row, ref);
    autoReply_(email, clean_(data.nombre), ref, data.idioma);
    return json_({ ok: true, referencia: ref });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: 'server' });
  }
}

function notifyTeam_(tipo, columns, row, ref) {
  const lines = columns.map((column, i) => row[i] ? `${column}: ${row[i]}` : '').filter(Boolean).join('\n');
  const urgent = row[columns.indexOf('urgente')] === 'sí' ? '[URGENTE] ' : '';
  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: `${urgent}Nueva solicitud web · ${TYPE_NAMES[tipo]} · ${ref}`,
    body: `${lines}\n\nHoja de solicitudes: ${sheet_().getUrl()}`,
    name: 'Web INICIA',
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
  return { news, fundraising, events, updated: new Date().toISOString() };
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
