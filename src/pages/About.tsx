import Header from "@/components/Header";
import aboutImage from "@/assets/about-global-moves.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 md:py-24">
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
              Our Mission
            </h1>
            
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                The Global Moves was founded on a simple but powerful idea: to make international opportunities accessible to those historically left out — through collective power, transparency, and shared growth.
              </p>
              
              <p>
                We're a community-powered platform that helps people with limited passport mobility access global opportunities such as study abroad programs and work-travel experiences. By pooling small monthly contributions from members, we create a shared fund that supports selected members each cycle — giving them the financial proof or resources needed to pursue their dreams.
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
                What started as a small group pooling resources to help friends afford visa applications and financial proof requirements has grown into a comprehensive community-funded platform serving thousands of members worldwide. By combining small monthly contributions, we've created a sustainable model that democratizes access to global opportunities.
              </p>
              
              <p>
                Today, The Global Moves continues to grow through transparency, member participation, and our shared commitment to making international mobility a reality for those who need it most. Every member who succeeds becomes part of the solution, contributing back to help the next generation of global movers.
              </p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default About;
