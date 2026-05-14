import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, Users, Globe, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-network.jpg";

const features = [
  {
    icon: Globe,
    text: "Curated remote jobs hiring globally — open to young professionals from the Global South",
  },
  {
    icon: Wallet,
    text: "Free travel opportunities, fully-funded programs, internships, and visa-friendly pathways",
  },
  {
    icon: Users,
    text: "Career resources, free certifications, and a community of peers building global careers",
  },
];

const Hero = () => {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <p className="text-sm md:text-base font-semibold uppercase tracking-widest text-primary">
                Your Passport Isn't the Problem. Your Strategy Is.
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-headline leading-tight">
                Unlock Global Opportunities:{" "}
                <span className="text-subtle font-normal">The All-in-One Platform for Moving Abroad and Remote Work</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                A platform for young professionals from the Global South — connecting you to remote jobs, free travel opportunities, internships, and career resources to build a global life on your own terms.
              </p>
            </div>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-base md:text-lg">{feature.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="lg" className="group" asChild>
                <Link to="/auth">
                  <Rocket className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                  Join Free
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div 
            className="relative animate-slide-in-right"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img
                src={heroImage}
                alt="Global network connectivity visualization representing worldwide opportunities"
                className="w-full h-auto object-cover aspect-square"
                width={1024}
                height={1024}
                fetchPriority="high"
                decoding="async"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
            </div>
            
            {/* Opportunities Hub label */}
            <div className="mt-4 text-center">
              <Link 
                to="#opportunities" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
              >
                <span>Opportunities Hub</span>
                <span className="text-xs">↓</span>
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
