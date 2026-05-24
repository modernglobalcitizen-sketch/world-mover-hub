import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_NAME = "Global Moves Network";
const SITE_URL = "https://globalmovesnetwork.com";
const SENDER_DOMAIN = "notify.globalmovesnetwork.com";
const FROM_DOMAIN = "globalmovesnetwork.com";
const allowedInterests = new Set(["remote-work", "travel-opportunities"]);
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

type Action = "signup" | "recovery";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[char] ?? char));
}

function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

function getRedirectOrigin(value: unknown) {
  const fallback = SITE_URL;
  if (typeof value !== "string") return fallback;

  try {
    const url = new URL(value);
    const host = url.hostname;
    const isAllowed =
      host === "globalmovesnetwork.com" ||
      host.endsWith(".lovable.app") ||
      host === "localhost" ||
      host === "127.0.0.1";

    return isAllowed ? url.origin : fallback;
  } catch {
    return fallback;
  }
}

function validateEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(normalized) && normalized.length <= 255 ? normalized : null;
}

function validatePassword(password: unknown): string | null {
  if (typeof password !== "string") return null;
  if (password.length < 8) return null;
  if (!/[a-z]/.test(password)) return null;
  if (!/[A-Z]/.test(password)) return null;
  if (!/[0-9]/.test(password)) return null;
  if (!/[^a-zA-Z0-9]/.test(password)) return null;
  return password;
}

function buildEmailHtml(title: string, intro: string, buttonText: string, actionUrl: string, footer: string) {
  const safeTitle = escapeHtml(title);
  const safeIntro = escapeHtml(intro);
  const safeButton = escapeHtml(buttonText);
  const safeFooter = escapeHtml(footer);
  const safeUrl = escapeHtml(actionUrl);

  return `<!doctype html>
  <html><body style="margin:0;background:#f7faf9;font-family:Inter,Arial,sans-serif;color:#153532;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7faf9;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #dbe8e5;border-radius:12px;padding:32px;">
          <tr><td>
            <p style="margin:0 0 18px;color:#047b73;font-size:14px;font-weight:700;">${SITE_NAME}</p>
            <h1 style="margin:0 0 16px;color:#153532;font-family:Georgia,serif;font-size:28px;line-height:1.2;">${safeTitle}</h1>
            <p style="margin:0 0 26px;color:#486663;font-size:16px;line-height:1.6;">${safeIntro}</p>
            <a href="${safeUrl}" style="display:inline-block;background:#047b73;color:#ffffff;text-decoration:none;border-radius:8px;padding:14px 22px;font-size:15px;font-weight:700;">${safeButton}</a>
            <p style="margin:28px 0 0;color:#6f8582;font-size:13px;line-height:1.6;">${safeFooter}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

async function queueAuthEmail(
  supabase: ReturnType<typeof createClient>,
  to: string,
  label: string,
  subject: string,
  html: string,
  text: string,
) {
  const messageId = crypto.randomUUID();

  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: label,
    recipient_email: to,
    status: "pending",
  });

  const { error } = await supabase.rpc("enqueue_email", {
    queue_name: "auth_emails",
    payload: {
      message_id: messageId,
      to,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: "transactional",
      label,
      queued_at: new Date().toISOString(),
    },
  });

  if (error) {
    throw new Error(`Email queue failed: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const action = body?.action as Action;
    const email = validateEmail(body?.email);
    const redirectOrigin = getRedirectOrigin(body?.redirectOrigin);
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!email || (action !== "signup" && action !== "recovery")) {
      return jsonResponse({ error: "Invalid request" }, 400);
    }

    if (
      isRateLimited(`${clientIp}:${action}`, 8, 60 * 60 * 1000) ||
      isRateLimited(`${email}:${action}`, 4, 30 * 60 * 1000)
    ) {
      return jsonResponse({ error: "Too many attempts. Please try again later." }, 429);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Auth service is not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    if (action === "signup") {
      const password = validatePassword(body?.password);
      const country = typeof body?.country === "string" ? body.country.trim().slice(0, 100) : "";
      const fieldOfWork = typeof body?.fieldOfWork === "string" ? body.fieldOfWork.trim().slice(0, 120) : "";
      const opportunityInterests = Array.isArray(body?.opportunityInterests)
        ? body.opportunityInterests.filter((item: unknown) => typeof item === "string" && allowedInterests.has(item))
        : [];

      if (!password || !country || !fieldOfWork || opportunityInterests.length === 0) {
        return jsonResponse({ error: "Please complete all signup fields." }, 400);
      }

      const { data, error } = await supabase.auth.admin.generateLink({
        type: "signup",
        email,
        password,
        options: {
          redirectTo: redirectOrigin,
          data: {
            country,
            field_of_work: fieldOfWork,
            opportunity_interests: opportunityInterests,
          },
        },
      });

      if (error || !data.properties?.action_link) {
        console.error("Signup link generation failed", { error: error?.message, email });
        return jsonResponse({ error: error?.message || "Unable to create signup link" }, 400);
      }

      if (data.user?.id) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          country,
          field_of_work: fieldOfWork,
          opportunity_interests: opportunityInterests,
        }, { onConflict: "id" });
      }

      await sendResendEmail(
        email,
        "Confirm your Global Moves Network account",
        buildEmailHtml(
          "Confirm your email",
          "Thanks for creating your free Global Moves Network account. Confirm your email to finish setting up access.",
          "Verify Email",
          data.properties.action_link,
          "If you didn't create an account, you can safely ignore this email."
        ),
        `Confirm your Global Moves Network account: ${data.properties.action_link}`,
      );

      await supabase.from("email_send_log").insert({
        message_id: crypto.randomUUID(),
        template_name: "resend_signup",
        recipient_email: email,
        status: "sent",
      });

      return jsonResponse({ success: true });
    }

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${redirectOrigin}/reset-password` },
    });

    if (error || !data.properties?.action_link) {
      console.error("Recovery link generation failed", { error: error?.message, email });
      return jsonResponse({ success: true });
    }

    await sendResendEmail(
      email,
      "Reset your Global Moves Network password",
      buildEmailHtml(
        "Reset your password",
        "We received a request to reset your Global Moves Network password. Use the secure link below to choose a new password.",
        "Reset Password",
        data.properties.action_link,
        "If you didn't request a password reset, you can safely ignore this email."
      ),
      `Reset your Global Moves Network password: ${data.properties.action_link}`,
    );

    await supabase.from("email_send_log").insert({
      message_id: crypto.randomUUID(),
      template_name: "resend_recovery",
      recipient_email: email,
      status: "sent",
    });

    return jsonResponse({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("auth-resend failed", { error: message });
    return jsonResponse({ error: "Email could not be sent. Please try again." }, 500);
  }
});