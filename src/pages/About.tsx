import Header from "@/components/Header";
import Footer from "@/components/Footer";
import aboutImage from "@/assets/about-global-moves.jpg";
import founderImage from "@/assets/kenisha-founder.jpg";
import { Users, MessageCircle, Globe, Laptop, Plane, DollarSign } from "lucide-react";

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
    icon: Globe,
    title: "Curated Opportunities",
    description: "Access a constantly updated hub of global opportunities — from study abroad programs to work-travel experiences.",
  },
  {
    icon: Laptop,
    title: "Remote Work Resources",
    description: "Learn how to earn online with visa guides, free certifications, and career resources curated for the global diaspora.",
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
                alt="Young Black professionals networking at an international conference, representing Global Moves Network community"
                className="w-full h-auto object-cover aspect-[16/9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-headline">
              About Global Moves Network
            </h1>
            
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p className="text-xl font-medium text-foreground">
                Global Moves Network is a membership platform where people navigating global work, study, and travel with limited passport access connect, stay accountable, and unlock opportunities together.
              </p>
              
              <p>
                We bring together ambitious individuals who face similar barriers — visa restrictions, financial proof requirements, and limited access to global networks. Instead of navigating these challenges alone, our members support each other through shared knowledge, real opportunities, and collective resources.
              </p>
            </div>

            {/* Meet the Founder */}
            <div className="py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-headline mb-8">
                Meet the Founder
              </h2>
              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-hover">
                  <img
                    src={founderImage}
                    alt="Kenisha, founder of Global Moves Network, at a scenic viewpoint in South Africa"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="md:col-span-3 space-y-5 text-muted-foreground text-lg leading-relaxed">
                  <p className="text-xl font-medium text-foreground">
                    Hi, I'm Kenisha — a Jamaican who decided to bet on herself.
                  </p>
                  <p>
                    In 2018, I started working remotely when most people around me didn't even know it was an option. With a Jamaican passport, limited resources, and zero connections in the "remote work world," I figured it out step by step. Since then, I've earned tens of thousands of dollars online and travelled to over 30 countries — all while working from my laptop.
                  </p>
                  <p>
                    I know what it's like to feel locked out of global opportunities because of where you're from. I created Global Moves Network because I believe the diaspora deserves better — better access, better resources, and a community that actually understands the barriers we face.
                  </p>
                  <p>
                    If I can do it, so can you. And I want to show you how.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {[
                      { icon: Plane, text: "30+ countries" },
                      { icon: DollarSign, text: "$10,000s earned remotely" },
                      { icon: Laptop, text: "Remote since 2018" },
                      { icon: Globe, text: "Jamaican 🇯🇲" },
                    ].map((item) => (
                      <span
                        key={item.text}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                Our members gain access to curated opportunities, learning resources for skill-building, and a supportive community of others on the same journey. Together, we're proving that barriers to global mobility can be overcome through solidarity and collective action.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-headline pt-8">
              Our Story
            </h2>
            
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Global Moves Network was born from a simple observation: incredible talent exists everywhere, but access to global opportunities doesn't. Having experienced the barriers of limited passport mobility firsthand, I realized that individual effort alone wasn't enough — community was the answer.
              </p>
              
              <p>
                What started as me sharing remote work tips with friends has grown into a comprehensive membership platform serving members worldwide. By combining curated resources, real-time community support, and practical guidance, we've created a space that democratizes access to global opportunities.
              </p>
              
              <p>
                Today, Global Moves Network continues to grow through transparency, member participation, and our shared commitment to making international mobility a reality for those who need it most. Every member who succeeds becomes part of the solution, inspiring and guiding the next generation of global movers.
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
