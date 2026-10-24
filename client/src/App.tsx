import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Redirect, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { IniciaAssistant } from "./components/IniciaAssistant";
import { SiteMetadata } from "./components/SiteMetadata";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";
import Collaboration from "./pages/Collaboration";
import Alliances from "./pages/Alliances";
import Home from "./pages/Home";
import LegalIdentity from "./pages/LegalIdentity";
import Ideology from "./pages/Ideology";
import Mission from "./pages/Mission";
import NetlifyLogin from "./pages/NetlifyLogin";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/mision" component={Mission} /><Route path="/ideologia" component={Ideology} /><Route path="/alianzas" component={Alliances} /><Route path="/galeria">{() => <Redirect to="/alianzas" />}</Route><Route path="/colaborar" component={Collaboration} /><Route path="/contacto" component={Contact} /><Route path="/proyectos" component={Projects} /><Route path="/solicitud/socio">{() => <Apply type="socio" />}</Route><Route path="/solicitud/voluntariado">{() => <Apply type="volunteer" />}</Route><Route path="/proyectos/:slug" component={ProjectDetail} /><Route path="/identidad" component={LegalIdentity} /><Route path="/login" component={NetlifyLogin} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
function PublicAssistant() { const [location] = useLocation(); const independentAssistantEnabled = import.meta.env.VITE_DEPLOY_TARGET !== "netlify" || import.meta.env.VITE_NETLIFY_ASSISTANT_ENABLED === "true"; return !independentAssistantEnabled || location === "/admin" || location.startsWith("/solicitud/") ? null : <IniciaAssistant />; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><SiteMetadata /><Router /><PublicAssistant /><Toaster /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
