import { Component, ReactNode } from "react";
import { getLocale, type Locale } from "@/lib/i18n";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const copy: Record<Locale, { title: string; text: string; reload: string }> = {
  es: { title: "Algo no ha funcionado.", text: "Recarga la página. Si el problema continúa, escríbenos por WhatsApp al +34 624 865 051.", reload: "Recargar la página" },
  en: { title: "Something went wrong.", text: "Please reload the page. If the problem continues, write to us on WhatsApp at +34 624 865 051.", reload: "Reload the page" },
  ru: { title: "Что-то пошло не так.", text: "Обновите страницу. Если ошибка повторяется, напишите нам в WhatsApp: +34 624 865 051.", reload: "Обновить страницу" },
  uk: { title: "Щось пішло не так.", text: "Оновіть сторінку. Якщо помилка повторюється, напишіть нам у WhatsApp: +34 624 865 051.", reload: "Оновити сторінку" },
  ast: { title: "Daqué nun funcionó.", text: "Recarga la páxina. Si'l problema sigue, escríbinos per WhatsApp al +34 624 865 051.", reload: "Recargar la páxina" },
};

/** Friendly fallback if a page crashes. Technical details go to the browser console only, never to visitors. */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const t = copy[getLocale()] ?? copy.es;
    return <div className="flex min-h-screen items-center justify-center bg-[#060A12] p-8 text-[#EEE7D7]">
      <div className="max-w-lg text-center">
        <h1 className="font-serif text-4xl">{t.title}</h1>
        <p className="mt-4 leading-7 text-slate-300">{t.text}</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-7 text-sm font-bold text-[#120D05]">{t.reload}</button>
      </div>
    </div>;
  }
}

export default ErrorBoundary;
