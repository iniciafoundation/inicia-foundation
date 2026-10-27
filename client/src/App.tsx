import { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import { ConsentBanner } from "./components/ConsentBanner";
import { MobileActionBar } from "./components/MobileActionBar";
import ErrorBoundary from "./components/ErrorBoundary";
import { SiteMetadata } from "./components/SiteMetadata";
import { ThemeProvider } from "./contexts/ThemeContext";
// The help assistant is loaded separately so it does not delay the page itself.
const HelpAssistant = lazy(() => import("./components/HelpAssistant").then(m => ({ default: m.HelpAssistant })));
const Admin = lazy(() => Promise.all([import("./pages/Admin"), import("./admin/TrpcRoot")]).then(([page, root]) => ({ default: () => <root.TrpcRoot><page.default /></root.TrpcRoot> })));
const Contact = lazy(() => import("./pages/Contact"));
const Donate = lazy(() => import("./pages/Donate"));
const News = lazy(() => import("./pages/News"));
const Collaboration = lazy(() => import("./pages/Collaboration"));
const Alliances = lazy(() => import("./pages/Alliances"));
import Home from "./pages/Home";
const LegalIdentity = lazy(() => import("./pages/LegalIdentity"));
const Ideology = lazy(() => import("./pages/Ideology"));
const Mission = lazy(() => import("./pages/Mission"));
const NetlifyLogin = lazy(() => Promise.all([import("./pages/NetlifyLogin"), import("./admin/TrpcRoot")]).then(([page, root]) => ({ default: () => <root.TrpcRoot><page.default /></root.TrpcRoot> })));
import NotFound from "./pages/NotFound";
const PrivacyPolicy = lazy(() => import("./pages/LegalPages").then(m => ({ default: m.PrivacyPolicy })));
const CookiePolicy = lazy(() => import("./pages/LegalPages").then(m => ({ default: m.CookiePolicy })));
const LegalNotice = lazy(() => import("./pages/LegalPages").then(m => ({ default: m.LegalNotice })));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Projects = lazy(() => import("./pages/Projects"));

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/mision" component={Mission} /><Route path="/ideologia" component={Ideology} /><Route path="/alianzas" component={Alliances} /><Route path="/galeria">{() => <Redirect to="/alianzas" />}</Route><Route path="/colaborar" component={Collaboration} /><Route path="/contacto" component={Contact} /><Route path="/proyectos" component={Projects} /><Route path="/donar" component={Donate} /><Route path="/privacidad" component={PrivacyPolicy} /><Route path="/cookies" component={CookiePolicy} /><Route path="/aviso-legal" component={LegalNotice} /><Route path="/noticias" component={News} /><Route path="/solicitud/socio">{() => <Redirect to="/contacto?tipo=donar" />}</Route><Route path="/solicitud/voluntariado">{() => <Redirect to="/contacto?tipo=voluntariado" />}</Route><Route path="/proyectos/:slug" component={ProjectDetail} /><Route path="/identidad" component={LegalIdentity} /><Route path="/login" component={NetlifyLogin} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
function PublicAssistant() { const [location] = useLocation(); return location === "/admin" || location === "/login" ? null : <Suspense fallback={null}><HelpAssistant /></Suspense>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><SiteMetadata /><Suspense fallback={<div className="min-h-screen bg-[#F7F3EA]" />}><Router /></Suspense><ConsentBanner /><MobileActionBar /><PublicAssistant /></ThemeProvider></ErrorBoundary>; }
