import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, FileText, Video, ExternalLink, Globe, Compass, Award, Languages } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const countryGuideLinks = [
  {
    title: "World Bank Country Data",
    description: "Facts, figures, and economic indicators",
    url: "https://data.worldbank.org/country",
  },
  {
    title: "Wikivoyage",
    description: "Travel guides written by locals",
    url: "https://www.wikivoyage.org/",
  },
  {
    title: "World Travel Guide",
    description: "Comprehensive country guides",
    url: "https://www.worldtravelguide.net/country-guides/",
  },
  {
    title: "Countrypedia",
    description: "Workforce and employment insights",
    url: "https://www.globalexpansion.com/countrypedia",
  },
];

const careerRoadmapLinks = [
  {
    title: "CareerRoadmap",
    description: "Visual career path planning tool",
    url: "https://careeroadmap.com/",
  },
  {
    title: "Notion Career Templates",
    description: "Free career roadmap templates",
    url: "https://www.notion.com/templates/collections/top-10-free-career-roadmaps-templates-in-notion",
  },
  {
    title: "roadmap.sh",
    description: "Developer-focused learning paths",
    url: "https://roadmap.sh/",
  },
  {
    title: "B2B Marketing Career Guide",
    description: "Marketing career progression",
    url: "https://cxl.com/b2b-marketing-career-guide/",
  },
  {
    title: "Data Analyst vs Business Analyst",
    description: "Analytics career comparison",
    url: "https://roadmap.sh/data-analyst/vs-business-analyst",
  },
];

const certificationLinks = [
  {
    title: "Free Certifications",
    description: "Curated list of free certification courses",
    url: "https://free-certifications.com/",
  },
  {
    title: "Class Central",
    description: "Guide to free online certificates",
    url: "https://www.classcentral.com/report/free-certificates/",
  },
  {
    title: "Coursera Free Courses",
    description: "Free courses from top universities",
    url: "https://www.coursera.org/courses?query=free",
  },
  {
    title: "LIFE Global",
    description: "Leadership and global education programs",
    url: "https://www.life-global.org/",
  },
];

const languageLearningLinks = [
  {
    title: "FluentU",
    description: "Free language learning websites guide",
    url: "https://www.fluentu.com/blog/learn/free-language-learning-websites/",
  },
  {
    title: "Dreaming",
    description: "Learn Spanish and French",
    url: "https://www.dreaming.com/",
  },
  {
    title: "Open Culture",
    description: "Free language lessons collection",
    url: "https://www.openculture.com/freelanguagelessons",
  },
  {
    title: "HelloTalk",
    description: "Language exchange with native speakers",
    url: "https://www.hellotalk.com/en",
  },
  {
    title: "My Language Exchange",
    description: "Find language exchange partners",
    url: "https://www.mylanguageexchange.com/",
  },
];

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

            {/* Country Guides Section */}
            <div className="max-w-4xl mx-auto mt-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Guide
                    </span>
                  </div>
                  <CardTitle className="text-xl">Country Guides</CardTitle>
                  <CardDescription>
                    Detailed guides on living and working in different countries around the world.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {countryGuideLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                      >
                        <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Roadmaps Section */}
            <div className="max-w-4xl mx-auto mt-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Compass className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Career
                    </span>
                  </div>
                  <CardTitle className="text-xl">Career Roadmaps</CardTitle>
                  <CardDescription>
                    Plan your career path with curated guides and templates for various industries.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {careerRoadmapLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                      >
                        <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Free Certifications Section */}
            <div className="max-w-4xl mx-auto mt-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Learning
                    </span>
                  </div>
                  <CardTitle className="text-xl">Free Certifications</CardTitle>
                  <CardDescription>
                    Boost your credentials with free certification programs and courses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {certificationLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                      >
                        <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Language Learning Section */}
            <div className="max-w-4xl mx-auto mt-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Languages className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Languages
                    </span>
                  </div>
                  <CardTitle className="text-xl">Language Learning</CardTitle>
                  <CardDescription>
                    Master new languages with free resources and language exchange communities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {languageLearningLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                      >
                        <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

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
