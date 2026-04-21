import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BootcampBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-card border-b border-border">
      <div className="container max-w-4xl">
        <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-soft">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-8 md:p-10 text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Rocket className="h-3 w-3 mr-1" />
              New Webinar
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-3">
              Remote Work Webinar
            </h2>
            <p className="text-primary-foreground/90 max-w-xl mx-auto mb-6 text-base md:text-lg">
              Land your first remote job. Master the skills, tools, and strategies to build a global career — from anywhere.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-primary-foreground/90 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Live training session</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Flexible scheduling</span>
              </div>
            </div>
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 font-semibold text-lg px-8 group">
              <Link to="/webinar">
                Join the Webinar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BootcampBanner;
