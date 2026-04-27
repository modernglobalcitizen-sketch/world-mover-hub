import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CalendarDays } from "lucide-react";
import { getLocalWebinarTime } from "@/lib/webinar";

const WebinarPromoStrip = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700">
      {/* decorative blurs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-yellow-300/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />

      <div className="container relative z-10 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-start md:items-center gap-4 text-center md:text-left">
            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/40">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Live Webinar
              </span>
              <h3 className="mt-2 text-xl md:text-2xl font-display font-bold leading-tight">
                Call Center to Remote Career
              </h3>
              <p className="mt-1 flex items-center justify-center md:justify-start gap-1.5 text-sm md:text-base text-white/90">
                <CalendarDays className="h-4 w-4" />
                {getLocalWebinarTime()}
              </p>
            </div>
          </div>

          <Link
            to="/webinar"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-pink-700 shadow-lg transition-transform hover:scale-105 hover:shadow-xl whitespace-nowrap"
          >
            Reserve My Spot
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WebinarPromoStrip;
