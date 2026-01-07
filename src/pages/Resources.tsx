import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, FileText, Video, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn how to make the most of your membership and explore opportunities.",
    icon: BookOpen,
    type: "Guide",
  },
  {
    title: "Visa & Immigration Tips",
    description: "Essential information for navigating international moves and work permits.",
    icon: FileText,
    type: "Article",
  },
  {
    title: "Member Success Stories",
    description: "Watch videos from members who have successfully relocated through our network.",
    icon: Video,
    type: "Video",
  },
  {
    title: "Country Guides",
    description: "Detailed guides on living and working in different countries around the world.",
    icon: FileText,
    type: "Guide",
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Resources
              </h1>
              <p className="text-lg text-muted-foreground">
                Helpful guides, articles, and tools to support your global journey.
              </p>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <resource.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {resource.type}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="gap-2">
                      Learn More
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                More resources coming soon. Check back regularly for updates!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
