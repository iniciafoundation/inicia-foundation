/**
 * Variant 2 deployment-health endpoint.
 * This function is intentionally provider-independent and reveals no secrets.
 */
export default async () =>
  Response.json({
    status: "migration-scaffold",
    configured: false,
    message: "INICIA Netlify migration scaffold is not connected to production services.",
  });

export const config = { path: "/api/health" };
