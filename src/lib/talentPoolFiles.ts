import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUCKET = "talent-pool";

function extractPath(url: string): string | null {
  // Matches both public and signed URL formats for the talent-pool bucket
  const match = url.match(/\/talent-pool\/([^?]+)/);
  return match ? decodeURIComponent(match[1]) : null;
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
