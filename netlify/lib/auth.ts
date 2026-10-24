import { getUser, logout } from "@netlify/identity";
import { TRPCError } from "@trpc/server";

export type NetlifyPortalUser = { identityId: string; name: string | null; email: string | null; role: "admin" | "user" };

export async function currentNetlifyUser(): Promise<NetlifyPortalUser | null> {
  const user = await getUser();
  if (!user) return null;
  const name = typeof user.userMetadata?.fullName === "string" ? user.userMetadata.fullName : null;
  const email = typeof user.email === "string" ? user.email : null;
  return {
    identityId: user.id,
    name: name || email,
    email,
    role: (user.roles || []).includes("admin") ? "admin" : "user",
  };
}

export async function requireNetlifyAdmin() {
  const user = await currentNetlifyUser();
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  if (user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return user;
}

export async function netlifyLogout() {
  await logout();
}
