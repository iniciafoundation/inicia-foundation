/**
 * Applications must remain closed by default. A production owner may set this
 * to true only after activating approved legal documents in the independent CRM.
 */
export const isApplicationIntakeEnabled = () => process.env.NETLIFY_APPLICATION_INTAKE_ENABLED === "true";
