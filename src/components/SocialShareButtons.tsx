import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link2, Mail } from "lucide-react";
import { toast } from "sonner";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShareButtons = ({ url, title, description }: SocialShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        asChild
      >
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        asChild
      >
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        asChild
      >
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        asChild
      >
        <a href={shareLinks.email} aria-label="Share via Email">
          <Mail className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={copyToClipboard}
        aria-label="Copy link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialShareButtons;
