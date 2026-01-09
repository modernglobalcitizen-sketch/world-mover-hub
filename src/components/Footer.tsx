import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Globe className="h-5 w-5" />
              </div>
              <span className="text-xl font-display font-semibold text-foreground">
                The Global Moves
              </span>
            </a>
            <p className="text-sm text-muted-foreground max-w-md">
              Empowering individuals to explore global opportunities through a trusted network and transparent community fund.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/opportunities" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Opportunities
                </a>
              </li>
              <li>
                <a href="/community-fund" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community Fund
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Get in Touch
                </a>
              </li>
              <li>
                <a href="/founding-members" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Become a Member
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} The Global Moves. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
