# Netlify independent deployment

This directory contains the independent Netlify deployment track for INICIA. The static application builds to `dist/public`; Functions provide the separate tRPC gateway, Netlify Identity login, protected evidence access, legal 410 responses, and a health endpoint. It is deployed only to an isolated test site and is not connected to `iniciafoundation.org`.

Follow `NETLIFY_PORTABILITY_MATRIX.md` and `NETLIFY_MIGRATION_DESIGN.md` before any production routing decision. Configure real credentials only in the separate Netlify project's Functions environment, never in `netlify.toml` or repository files.[1]

## Conservative runtime defaults

The independent deployment keeps application intake closed unless `NETLIFY_APPLICATION_INTAKE_ENABLED=true` is explicitly set after approved legal documents are activated. Applicant email is not implemented. Owner notification is disabled until the server-only `NETLIFY_OWNER_NOTIFICATION_WEBHOOK` is configured.

The public assistant is hidden from Netlify builds unless `VITE_NETLIFY_ASSISTANT_ENABLED=true`. Enable it only after a server-side AI provider adapter has been approved and configured; never put provider keys in client variables.

## References

[1] [Netlify Functions — Environment variables](https://docs.netlify.com/build/functions/environment-variables/)
