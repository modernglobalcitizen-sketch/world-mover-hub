import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

interface SocialLinksProps {
  variant?: "header" | "footer";
}

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/theglobalmoves", icon: Twitter },
  { name: "Facebook", href: "https://facebook.com/theglobalmoves", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com/theglobalmoves", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/company/theglobalmoves", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com/@theglobalmoves", icon: Youtube },
];

const SocialLinks = ({ variant = "footer" }: SocialLinksProps) => {
  const isHeader = variant === "header";

  return (
    <div className={`flex items-center ${isHeader ? "gap-1" : "gap-3"}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors ${
            isHeader
              ? "p-2 text-muted-foreground hover:text-primary"
              : "p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
          aria-label={social.name}
        >
          <social.icon className={isHeader ? "h-4 w-4" : "h-5 w-5"} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
