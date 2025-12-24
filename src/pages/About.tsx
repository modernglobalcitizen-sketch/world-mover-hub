import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <article className="space-y-8 animate-fade-in">
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
          </article>
        </div>
      </main>
    </div>
  );
};

export default About;
