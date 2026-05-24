import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUCKET = "talent-pool";

function extractPath(value: string): string | null {
  // Accept either a raw storage path (e.g. "resumes/123.pdf") or a full
  // public/signed URL containing the bucket prefix.
  const match = value.match(/\/talent-pool\/([^?]+)/);
  if (match) return decodeURIComponent(match[1]);
  if (!value.includes("://") && value.length > 0) return value;
  return null;
}

export async function openTalentPoolFile(url: string | null | undefined) {
  if (!url) return;
  const path = extractPath(url);
  if (!path) {
    toast.error("Invalid file reference");
    return;
  }
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 5); // 5 minutes
  if (error || !data?.signedUrl) {
    toast.error("Could not open file");
    return;
  }
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}
