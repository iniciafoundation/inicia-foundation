type OwnerNotification = { title: string; content: string; reference: string };

/**
 * No email or webhook is sent unless an owner configures a server-only webhook
 * in the separate Netlify environment. Applicant email remains disabled.
 */
export async function notifyNetlifyOwner(notification: OwnerNotification) {
  const endpoint = process.env.NETLIFY_OWNER_NOTIFICATION_WEBHOOK;
  if (!endpoint) return { status: "disabled" as const };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  });
  if (!response.ok) throw new Error("Owner notification webhook rejected the request.");
  return { status: "sent" as const };
}
