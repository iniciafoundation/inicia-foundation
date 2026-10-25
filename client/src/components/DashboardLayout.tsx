import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "./ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-50" />;
  if (!user) return <main className="grid min-h-screen place-items-center bg-slate-50 p-5"><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow"><h1 className="font-serif text-3xl text-[#0F274A]">Área privada INICIA</h1><p className="mt-3 text-sm text-slate-600">Inicia sesión para acceder al panel de gestión.</p><Button className="mt-6" onClick={startLogin}>Iniciar sesión</Button></div></main>;
  return <div className="min-h-screen bg-slate-50"><header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><a href="/" className="font-serif text-xl text-[#0F274A]">INICIA <span className="font-sans text-[10px] font-bold tracking-[.18em] text-teal-700">CRM</span></a><div className="flex items-center gap-3 text-sm"><span className="hidden text-slate-500 sm:inline">{user.email}</span><Button size="sm" variant="outline" onClick={logout}>Salir</Button></div></div></header>{children}</div>;
}

