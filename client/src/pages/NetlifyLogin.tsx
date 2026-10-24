import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NetlifyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setPending(true); setError(null);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ email, password }) });
      if (!response.ok) throw new Error("No se pudo verificar el acceso.");
      window.location.assign("/admin");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo verificar el acceso."); }
    finally { setPending(false); }
  };
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-5"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm"><p className="text-sm font-bold uppercase tracking-[.18em] text-teal-700">INICIA Foundation</p><h1 className="mt-2 font-serif text-3xl text-[#12355b]">Acceso privado</h1><p className="mt-3 text-sm text-slate-600">Solo para administradores autorizados. Las cuentas se gestionan de forma privada por la organización.</p><div className="mt-6 space-y-4"><div><Label htmlFor="netlify-email">Correo</Label><Input id="netlify-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></div><div><Label htmlFor="netlify-password">Contraseña</Label><Input id="netlify-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></div>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<Button className="w-full" disabled={pending}>{pending ? "Comprobando…" : "Entrar"}</Button></div><Link href="/" className="mt-5 block text-center text-sm font-medium text-[#12355b]">Volver al sitio público</Link></form></main>;
}
