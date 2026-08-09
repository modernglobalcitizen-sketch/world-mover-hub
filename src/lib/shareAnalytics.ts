import { supabase } from "@/integrations/supabase/client";

export type ShareNetwork =
  | "twitter"
  | "facebook"
  | "linkedin"
  | "threads"
  | "whatsapp"
  | "email"
  | "copy_link";

export type ShareContentType = "remote_job" | "opportunity" | "page";

interface TrackShareArgs {
  network: ShareNetwork;
  contentType: ShareContentType;
  contentId?: string;
  contentTitle?: string;
  url?: string;
}

/**
 * Fire-and-forget analytics for social share button clicks.
 * Never blocks or breaks the share action.
 */
export const trackShare = async ({
  network,
  contentType,
  contentId,
  contentTitle,
  url,
}: TrackShareArgs): Promise<void> => {
  try {
    const { data } = await supabase.auth.getSession();
    await supabase.from("share_events").insert({
      network,
      content_type: contentType,
      content_id: contentId ?? null,
      content_title: contentTitle?.slice(0, 200) ?? null,
      page_url: url ?? (typeof window !== "undefined" ? window.location.href : null),
      user_id: data.session?.user.id ?? null,
    });
  } catch (err) {
    console.warn("Share tracking failed", err);
  }
};
