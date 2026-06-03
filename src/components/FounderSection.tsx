import { Globe, Plane, Laptop } from "lucide-react";
import founderImage from "@/assets/kenisha-founder.jpg";

const stats = [
  { icon: Globe, label: "Countries Visited", value: "30+" },
  { icon: Laptop, label: "Remote Since", value: "2018" },
  { icon: Plane, label: "From", value: "Jamaica 🇯🇲" },
];

const FounderSection = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-hover">
              <img
                src={founderImage}
                alt="Kenisha, founder of Global Moves, standing at a scenic viewpoint in South Africa"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -z-10 -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          </div>

          {/* Story */}
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary tracking-wide uppercase">
              Meet the Founder
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
              I Built the Life I Was Told Wasn't Possible
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              I'm Kenisha — a Jamaican who started working remotely in 2018 when most people around me didn't even know it was an option. Since then, I've earned tens of thousands of dollars online and travelled to over 30 countries, all while working from my laptop.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              I created this platform because I know what it's like to feel locked out of global opportunities. If I can do it, so can you — and I want to show you how.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl bg-background p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
