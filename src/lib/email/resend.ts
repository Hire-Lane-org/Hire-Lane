import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const isConfigured = Boolean(resendApiKey && !resendApiKey.includes("placeholder"));

export const resend = isConfigured ? new Resend(resendApiKey) : null;

export const emailSender = process.env.EMAIL_FROM || "HireLane <reminders@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.warn("[HireLane Email Service] RESEND_API_KEY is not configured or using placeholder. Email skipped (logged):", {
      to,
      subject,
    });
    return {
      success: true,
      id: "mock-email-id-" + Date.now(),
    };
  }

  try {
    const data = await resend.emails.send({
      from: emailSender,
      to,
      subject,
      html,
    });

    if (data.error) {
      console.error("[HireLane Email Error]", data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true, id: data.data?.id };
  } catch (err: any) {
    console.error("[HireLane Email Exception]", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}
