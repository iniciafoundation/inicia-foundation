import type { Locale } from "./i18n";
import { MEMBERSHIP } from "./siteConfig";

/** The foundation as SEPA creditor (Core direct debit). */
export const SEPA_CREDITOR = {
  id: "ES82000G05426242",
  name: "ASOCIACIÓN INICIA FOUNDATION",
  nif: "G05426242",
  address: "Av. Manuel Llaneza 68",
  city: "33208 Gijón (Asturias)",
  country: "España",
};

/** IBAN lengths of the SEPA countries. */
const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AT: 20, BE: 16, BG: 22, CH: 21, CY: 28, CZ: 24, DE: 22, DK: 18, EE: 20, ES: 24, FI: 18, FR: 27, GB: 22, GI: 23, GR: 27,
  HR: 21, HU: 28, IE: 22, IS: 26, IT: 27, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MT: 31, NL: 18, NO: 15, PL: 28, PT: 25, RO: 24,
  SE: 24, SI: 19, SK: 24, SM: 27, VA: 22,
};

export const compactIban = (value: string) => value.replace(/[\s-]/g, "").toUpperCase();

/** Groups an IBAN in blocks of four for display. */
export const formatIban = (value: string) => compactIban(value).replace(/(.{4})/g, "$1 ").trim();

/** Checks country, length and the ISO 13616 mod-97 check digits of a SEPA IBAN. */
export function isValidIban(value: string): boolean {
  const iban = compactIban(value);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return false;
  const length = IBAN_LENGTHS[iban.slice(0, 2)];
  if (!length || iban.length !== length) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const digits = /\d/.test(char) ? char : String(char.charCodeAt(0) - 55);
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

/** Amount (EUR) and frequency of a membership request, as charged by direct debit. */
export function membershipCharge(values: Record<string, unknown>): { amount: number; period: string } | undefined {
  const plan = values.plan;
  const fee = values.cuota === "otra" ? Number(values.cuota_otra) : Number(values.cuota);
  if (plan === "pleno") return { amount: MEMBERSHIP.fullAmount, period: MEMBERSHIP.fullPeriod };
  if (plan === "reducida") return { amount: MEMBERSHIP.reducedAmount, period: "mensual" };
  if (plan === "empresa") return fee >= MEMBERSHIP.companyMin ? { amount: fee, period: "mensual" } : undefined;
  if (plan === "colaborador") return fee >= MEMBERSHIP.minAmount && typeof values.periodicidad === "string" ? { amount: fee, period: values.periodicidad } : undefined;
  return undefined;
}

type SepaCopy = {
  payLabel: string;
  payOptions: [string, string][];
  sepaNote: string;
  otherNote: string;
  title: string;
  intro: string;
  holder: string;
  holderNif: string;
  address: string;
  postcode: string;
  town: string;
  country: string;
  iban: string;
  ibanHint: string;
  ibanError: string;
  mandateTitle: string;
  creditor: string;
  creditorId: string;
  reference: string;
  referenceLater: string;
  paymentType: string;
  recurrent: string;
  amount: string;
  periods: Record<string, string>;
  legal: string;
  sign: string;
  signHint: string;
  clear: string;
  signError: string;
  accept: string;
  acceptError: string;
  doneNote: string;
};

export const sepaCopy: Record<Locale, SepaCopy> = {
  es: {
    payLabel: "¿Cómo quieres pagar la cuota?",
    payOptions: [["sepa", "Domiciliación bancaria (SEPA)"], ["otro", "Transferencia o Bizum"]],
    sepaNote: "En el siguiente paso firmarás la orden de domiciliación SEPA en pantalla. Recibirás una copia en PDF por email.",
    otherNote: "Te enviaremos los datos para pagar la cuota por transferencia o Bizum.",
    title: "Orden de domiciliación SEPA",
    intro: "Datos de la cuenta en la que se cargará la cuota. El titular de la cuenta es quien firma la orden.",
    holder: "Titular de la cuenta",
    holderNif: "DNI / NIE / NIF del titular (opcional)",
    address: "Dirección",
    postcode: "Código postal",
    town: "Población",
    country: "País",
    iban: "IBAN",
    ibanHint: "Lo encontrarás en tu app del banco. Ejemplo: ES12 3456 7890 1234 5678 9012.",
    ibanError: "Revisa el IBAN: el número no es válido.",
    mandateTitle: "Orden de domiciliación de adeudo directo SEPA (Core)",
    creditor: "Acreedor",
    creditorId: "Identificador del acreedor",
    reference: "Referencia de la orden",
    referenceLater: "se asigna al enviar",
    paymentType: "Tipo de pago",
    recurrent: "Pago recurrente",
    amount: "Importe",
    periods: { mensual: "al mes", trimestral: "al trimestre", anual: "al año" },
    legal: "Mediante la firma de esta orden de domiciliación, el deudor autoriza (A) al acreedor a enviar instrucciones a la entidad del deudor para adeudar su cuenta y (B) a la entidad para efectuar los adeudos en su cuenta siguiendo las instrucciones del acreedor. Como parte de sus derechos, el deudor está legitimado al reembolso por su entidad en los términos y condiciones del contrato suscrito con la misma. La solicitud de reembolso deberá efectuarse dentro de las ocho semanas que siguen a la fecha de adeudo en cuenta. Puede obtener información adicional sobre sus derechos en su entidad financiera.",
    sign: "Firma del titular",
    signHint: "Firma con el dedo o con el ratón dentro del recuadro.",
    clear: "Borrar firma",
    signError: "Falta la firma.",
    accept: "He leído la orden de domiciliación y autorizo a INICIA Foundation a cargar la cuota en mi cuenta.",
    acceptError: "Marca la casilla para autorizar la domiciliación.",
    doneNote: "Te hemos enviado por email la orden de domiciliación firmada (PDF).",
  },
  en: {
    payLabel: "How would you like to pay your fee?",
    payOptions: [["sepa", "Direct debit (SEPA)"], ["otro", "Bank transfer or Bizum"]],
    sepaNote: "In the next step you will sign the SEPA direct debit mandate on screen. You will receive a PDF copy by e-mail.",
    otherNote: "We will send you the details to pay your fee by bank transfer or Bizum.",
    title: "SEPA direct debit mandate",
    intro: "Details of the account the fee will be charged to. The account holder is the person who signs the mandate.",
    holder: "Account holder",
    holderNif: "Holder's ID / NIE / tax number (optional)",
    address: "Address",
    postcode: "Postcode",
    town: "Town / city",
    country: "Country",
    iban: "IBAN",
    ibanHint: "You will find it in your banking app. Example: ES12 3456 7890 1234 5678 9012.",
    ibanError: "Check the IBAN: the number is not valid.",
    mandateTitle: "SEPA Core direct debit mandate",
    creditor: "Creditor",
    creditorId: "Creditor identifier",
    reference: "Mandate reference",
    referenceLater: "assigned when you send",
    paymentType: "Type of payment",
    recurrent: "Recurrent payment",
    amount: "Amount",
    periods: { mensual: "per month", trimestral: "per quarter", anual: "per year" },
    legal: "By signing this mandate form, you authorise (A) the creditor to send instructions to your bank to debit your account and (B) your bank to debit your account in accordance with the instructions from the creditor. As part of your rights, you are entitled to a refund from your bank under the terms and conditions of your agreement with your bank. A refund must be claimed within eight weeks starting from the date on which your account was debited. Your rights are explained in a statement that you can obtain from your bank.",
    sign: "Account holder's signature",
    signHint: "Sign with your finger or mouse inside the box.",
    clear: "Clear signature",
    signError: "The signature is missing.",
    accept: "I have read the direct debit mandate and authorise INICIA Foundation to charge the fee to my account.",
    acceptError: "Tick the box to authorise the direct debit.",
    doneNote: "We have e-mailed you the signed direct debit mandate (PDF).",
  },
  ru: {
    payLabel: "Как вы хотите оплачивать взнос?",
    payOptions: [["sepa", "Автосписание со счёта (SEPA)"], ["otro", "Перевод или Bizum"]],
    sepaNote: "На следующем шаге вы подпишете на экране поручение SEPA на списание. Копию в PDF мы пришлём на email.",
    otherNote: "Мы пришлём вам реквизиты для оплаты взноса переводом или через Bizum.",
    title: "Поручение на списание SEPA",
    intro: "Данные счёта, с которого будет списываться взнос. Поручение подписывает владелец счёта.",
    holder: "Владелец счёта",
    holderNif: "DNI / NIE / NIF владельца (необязательно)",
    address: "Адрес",
    postcode: "Почтовый индекс",
    town: "Город",
    country: "Страна",
    iban: "IBAN",
    ibanHint: "Его можно найти в приложении банка. Пример: ES12 3456 7890 1234 5678 9012.",
    ibanError: "Проверьте IBAN: номер недействителен.",
    mandateTitle: "Поручение на прямое списание SEPA (Core)",
    creditor: "Получатель (кредитор)",
    creditorId: "Идентификатор кредитора",
    reference: "Номер поручения",
    referenceLater: "присваивается при отправке",
    paymentType: "Тип платежа",
    recurrent: "Регулярный платёж",
    amount: "Сумма",
    periods: { mensual: "в месяц", trimestral: "в квартал", anual: "в год" },
    legal: "Подписывая это поручение, плательщик разрешает (A) кредитору направлять в банк плательщика распоряжения о списании средств с его счёта и (B) банку списывать средства со счёта в соответствии с распоряжениями кредитора. Плательщик имеет право на возврат средств своим банком на условиях договора с ним. Запрос на возврат должен быть подан в течение восьми недель с даты списания. Подробнее о своих правах вы можете узнать в своём банке. Юридически обязательным является текст поручения на испанском языке.",
    sign: "Подпись владельца счёта",
    signHint: "Распишитесь пальцем или мышью внутри рамки.",
    clear: "Стереть подпись",
    signError: "Нет подписи.",
    accept: "Я прочитал(а) поручение и разрешаю INICIA Foundation списывать взнос с моего счёта.",
    acceptError: "Отметьте галочку, чтобы разрешить списание.",
    doneNote: "Мы отправили вам на email подписанное поручение на списание (PDF).",
  },
  uk: {
    payLabel: "Як ви хочете сплачувати внесок?",
    payOptions: [["sepa", "Автосписання з рахунку (SEPA)"], ["otro", "Переказ або Bizum"]],
    sepaNote: "На наступному кроці ви підпишете на екрані доручення SEPA на списання. Копію у PDF ми надішлемо на email.",
    otherNote: "Ми надішлемо вам реквізити для оплати внеску переказом або через Bizum.",
    title: "Доручення на списання SEPA",
    intro: "Дані рахунку, з якого списуватиметься внесок. Доручення підписує власник рахунку.",
    holder: "Власник рахунку",
    holderNif: "DNI / NIE / NIF власника (необов’язково)",
    address: "Адреса",
    postcode: "Поштовий індекс",
    town: "Місто",
    country: "Країна",
    iban: "IBAN",
    ibanHint: "Його можна знайти в застосунку банку. Приклад: ES12 3456 7890 1234 5678 9012.",
    ibanError: "Перевірте IBAN: номер недійсний.",
    mandateTitle: "Доручення на пряме списання SEPA (Core)",
    creditor: "Отримувач (кредитор)",
    creditorId: "Ідентифікатор кредитора",
    reference: "Номер доручення",
    referenceLater: "присвоюється під час надсилання",
    paymentType: "Тип платежу",
    recurrent: "Регулярний платіж",
    amount: "Сума",
    periods: { mensual: "на місяць", trimestral: "на квартал", anual: "на рік" },
    legal: "Підписуючи це доручення, платник дозволяє (A) кредитору надсилати до банку платника розпорядження про списання коштів з його рахунку та (B) банку списувати кошти з рахунку відповідно до розпоряджень кредитора. Платник має право на повернення коштів своїм банком на умовах договору з ним. Запит на повернення має бути поданий протягом восьми тижнів від дати списання. Детальніше про свої права ви можете дізнатися у своєму банку. Юридично обов’язковим є текст доручення іспанською мовою.",
    sign: "Підпис власника рахунку",
    signHint: "Розпишіться пальцем або мишею всередині рамки.",
    clear: "Стерти підпис",
    signError: "Немає підпису.",
    accept: "Я прочитав(ла) доручення і дозволяю INICIA Foundation списувати внесок з мого рахунку.",
    acceptError: "Позначте галочку, щоб дозволити списання.",
    doneNote: "Ми надіслали вам на email підписане доручення на списання (PDF).",
  },
  ast: {
    payLabel: "¿Cómo quies pagar la cuota?",
    payOptions: [["sepa", "Domiciliación bancaria (SEPA)"], ["otro", "Tresferencia o Bizum"]],
    sepaNote: "Nel pasu siguiente vas robrar la orde de domiciliación SEPA na pantalla. Vas recibir una copia en PDF per corréu.",
    otherNote: "Vamos unviate los datos pa pagar la cuota per tresferencia o Bizum.",
    title: "Orde de domiciliación SEPA",
    intro: "Datos de la cuenta na que se va cargar la cuota. Quien roba la orde ye'l titular de la cuenta.",
    holder: "Titular de la cuenta",
    holderNif: "DNI / NIE / NIF del titular (opcional)",
    address: "Direición",
    postcode: "Códigu postal",
    town: "Población",
    country: "País",
    iban: "IBAN",
    ibanHint: "Atópeslu na app del to bancu. Exemplu: ES12 3456 7890 1234 5678 9012.",
    ibanError: "Revisa l'IBAN: el númberu nun ye válidu.",
    mandateTitle: "Orde de domiciliación d'adeudu direutu SEPA (Core)",
    creditor: "Acreedor",
    creditorId: "Identificador del acreedor",
    reference: "Referencia de la orde",
    referenceLater: "asígnase al unviar",
    paymentType: "Tipu de pagu",
    recurrent: "Pagu recurrente",
    amount: "Importe",
    periods: { mensual: "al mes", trimestral: "al trimestre", anual: "al añu" },
    legal: "Mediante la firma de esta orden de domiciliación, el deudor autoriza (A) al acreedor a enviar instrucciones a la entidad del deudor para adeudar su cuenta y (B) a la entidad para efectuar los adeudos en su cuenta siguiendo las instrucciones del acreedor. Como parte de sus derechos, el deudor está legitimado al reembolso por su entidad en los términos y condiciones del contrato suscrito con la misma. La solicitud de reembolso deberá efectuarse dentro de las ocho semanas que siguen a la fecha de adeudo en cuenta. Puede obtener información adicional sobre sus derechos en su entidad financiera.",
    sign: "Firma del titular",
    signHint: "Roba col deu o col mur dientro del cuadru.",
    clear: "Borrar firma",
    signError: "Falta la firma.",
    accept: "Lleí la orde de domiciliación y autorizo a INICIA Foundation a cargar la cuota na mio cuenta.",
    acceptError: "Marca la caxella p'autorizar la domiciliación.",
    doneNote: "Unviámoste per corréu la orde de domiciliación robada (PDF).",
  },
};
