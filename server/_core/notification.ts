import { ENV } from "./env";

export type NotificationPayload = {
  title: string;
  content: string;
};

/**
 * Sends an email notification to the site owner via Resend.
 * Returns true on success, false on failure.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  const { title, content } = payload;

  if (!title?.trim() || !content?.trim()) {
    console.warn("[Notification] Title and content are required.");
    return false;
  }

  if (!ENV.resendApiKey) {
    console.warn("[Notification] RESEND_API_KEY is not configured, skipping email.");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Katie Lee Travel <onboarding@resend.dev>",
        to: [ENV.notificationEmail],
        subject: title,
        html: `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d4a3e; border-bottom: 1px solid #e8e0d4; padding-bottom: 12px;">${title}</h2>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${content}</p>
          <hr style="border: none; border-top: 1px solid #e8e0d4; margin-top: 24px;" />
          <p style="color: #999; font-size: 12px;">This is an automated notification from your Katie Lee Travel website.</p>
        </div>`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(`[Notification] Resend error (${response.status}): ${errorText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn("[Notification] Error sending email:", error);
    return false;
  }
}
