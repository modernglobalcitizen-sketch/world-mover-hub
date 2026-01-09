import Header from "@/components/Header";
import Footer from "@/components/Footer";
import aboutImage from "@/assets/about-global-moves.jpg";
import { Users, MessageCircle, Wallet, Globe } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Breakout Rooms by Goal",
    description: "Join rooms organized around your aspirations — whether you're pursuing a scholarship, remote work visa, or international fellowship.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Presence",
    description: "See who's actively online, share real opportunities, and support each other's progress in real time.",
  },
  {
    icon: Wallet,
    title: "Community Fund",
    description: "A portion of every subscription goes toward accelerating selected members' international moves with financial support.",
  },
  {
    icon: Globe,
    title: "Curated Opportunities",
    description: "Access a constantly updated hub of global opportunities — from study abroad programs to work-travel experiences.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container max-w-4xl">
          <article className="space-y-8 animate-fade-in">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-hover mb-12">
              <img
                src={aboutImage}
                alt="Young Black professionals networking at an international conference, representing The Global Moves community"
                className="w-full h-auto object-cover aspect-[16/9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-headline">
              About The Global Moves
            </h1>
            
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p className="text-xl font-medium text-foreground">
                The Global Moves is a membership platform where people navigating global work, study, and travel with limited passport access connect, stay accountable, and unlock opportunities together.
              </p>
              
              <p>
                We bring together ambitious individuals who face similar barriers — visa restrictions, financial proof requirements, and limited access to global networks. Instead of navigating these challenges alone, our members support each other through shared knowledge, real opportunities, and collective resources.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-6 py-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl border border-border bg-card/50 space-y-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-headline">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-headline pt-8">
              How It Works
            </h2>
            
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Members join breakout rooms organized by goal — whether you're applying for scholarships, seeking remote work visas, or exploring international fellowships. Inside these rooms, you can see who's actively online, share real opportunities you've discovered, and hold each other accountable.
              </p>
              
              <p>
                A portion of every membership subscription goes into a community fund. This fund helps accelerate selected members' international moves by providing the financial proof or resources they need to take the next step.
              </p>
              
              <p>
                Beyond funding, our members gain access to curated opportunities, learning resources for skill-building, and a supportive community of others on the same journey. Together, we're proving that barriers to global mobility can be overcome through solidarity and collective action.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-headline pt-8">
              Our Story
            </h2>
            
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                The Global Moves was born from a simple observation: incredible talent exists everywhere, but access to global opportunities doesn't. Our founders, having experienced the barriers of limited passport mobility firsthand, realized that individual effort alone wasn't enough — collective action was the answer.
              </p>
              
              <p>
                What started as a small group pooling resources to help friends afford visa applications and financial proof requirements has grown into a comprehensive membership platform serving members worldwide. By combining small monthly contributions with active community support, we've created a sustainable model that democratizes access to global opportunities.
              </p>
              
              <p>
                Today, The Global Moves continues to grow through transparency, member participation, and our shared commitment to making international mobility a reality for those who need it most. Every member who succeeds becomes part of the solution, contributing back to help the next generation of global movers.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
