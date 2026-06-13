import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface SmartLinkProps {
  url: string;
  label?: string;
  className?: string;
}

const SmartLink = ({ url, label = "Recommended", className = "" }: SmartLinkProps) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] ${className}`}
    >
      <div className="bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{label}</p>
          <p className="text-xs text-primary-foreground/80 truncate">Sponsored — opens in new tab</p>
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 opacity-80" />
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </a>
  );
};

export default SmartLink;
