import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Video, ExternalLink, Globe, Compass, Award, Languages, Plane, Users, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import remoteJobChecklistCover from "@/assets/remote-job-checklist-mockup.png";
import SEO from "@/components/SEO";

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
    title: "Kickresume AI Career Map",
    description: "AI-powered career path planning tool",
    url: "https://www.kickresume.com/en/ai-career-map/",
  },
  {
    title: "Coursera Career Quiz",
    description: "Discover what career you should be in",
    url: "https://www.coursera.org/resources/career-quiz",
  },
  {
    title: "Roadmap.sh",
    description: "Step-by-step guides for tech careers",
    url: "https://roadmap.sh/",
  },
  {
    title: "MyNextMove",
    description: "Career exploration and planning tool",
    url: "https://www.mynextmove.org/",
  },
];

const skillsetCheckLinks = [
  {
    title: "Digital Ascend",
    description: "Check your skillset and discover new skills to learn",
    url: "https://digital-ascend-app.lovable.app",
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

const visaImmigrationLinks = [
  {
    title: "Reddit Visas Community",
    description: "Community discussions on visa experiences",
    url: "https://www.reddit.com/r/visas/",
  },
  {
    title: "Schengen Visa Checklist",
    description: "VFS Global tourist visa requirements",
    url: "https://www.vfsglobal.com/one-pager/Malta/Libya/english/pdf/tourist-checklist-eng.pdf",
  },
  {
    title: "France Visa Application",
    description: "Official French visa guidelines",
    url: "https://france-visas.gouv.fr/en/visa-application-guidelines",
  },
  {
    title: "UK Visas & Immigration",
    description: "Official UK immigration portal",
    url: "https://www.gov.uk/browse/visas-immigration",
  },
  {
    title: "Australia Immigration",
    description: "Australian visa evidentiary tool",
    url: "https://immi.homeaffairs.gov.au/visas/web-evidentiary-tool",
  },
];

const interviewLinks = [
  {
    title: "University of Michigan Interviewing Resources",
    description: "Comprehensive interview prep guides from the U-M Career Center",
    url: "https://careercenter.umich.edu/content/interviewing-resources",
  },
  {
    title: "Texas State Job Interview Guide",
    description: "Step-by-step interview prep guide from TXST Career Services",
    url: "https://www.careerservices.txst.edu/students-alumni/resources-services/career-guides/job-interview-guide.html",
  },
];

const networkingLinks = [
  {
    title: "b2match",
    description: "Discover and join online networking events worldwide",
    url: "https://www.b2match.com/explore",
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <SEO
        title="Career Resources — Roadmaps, Certifications & Networking"
        description="Curated career roadmaps, free certifications, networking platforms, and tools for building a global professional career."
        path="/resources"
      />
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
        {/* Ebook Promo: Remote Job Beginner Checklist */}
        <section className="py-16 md:py-20 bg-secondary text-secondary-foreground">
          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="order-2 md:order-1 space-y-5">
                <Badge className="bg-primary/20 text-primary-foreground border-primary/30 hover:bg-primary/30">
                  <BookOpen className="h-3 w-3 mr-1" />
                  New Ebook
                </Badge>
                <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
                  Remote Job Beginner Checklist
                </h2>
                <p className="text-secondary-foreground/80 text-base md:text-lg">
                  After hosting 3 webinars and speaking with countless remote professionals, one thing became clear — they wanted a straightforward process from beginner to remote job. This is exactly what they asked for: mindset shift, career roadmap, resume, portfolio, LinkedIn, and a checklist to keep you accountable every step of the way.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <p className="text-3xl font-bold text-primary">$10</p>
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/ebooks">
                      Get the Checklist
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <img
                  src={remoteJobChecklistCover}
                  alt="Remote Job Beginner Checklist ebook cover"
                  className="w-full max-w-sm rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-16">
          <div className="container">

            {/* Skillset Check Section */}
            <div className="max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow border-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Start Here
                    </span>
                  </div>
                  <CardTitle className="text-xl">Check Your Skillset</CardTitle>
                  <CardDescription>
                    New to the journey? Assess your current skills and discover what to learn next.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {skillsetCheckLinks.map((link, index) => (
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

            {/* Interview Section */}
            <div className="max-w-4xl mx-auto mt-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Interview
                    </span>
                  </div>
                  <CardTitle className="text-xl">Interview Preparation</CardTitle>
                  <CardDescription>
                    Get ready for your next job interview with proven prep guides and tips.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {interviewLinks.map((link, index) => (
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

            {/* Online Networking Section */}
            <div className="max-w-4xl mx-auto mt-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Networking
                    </span>
                  </div>
                  <CardTitle className="text-xl">Online Networking Opportunities</CardTitle>
                  <CardDescription>
                    Connect with professionals and attend virtual networking events around the globe.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {networkingLinks.map((link, index) => (
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

            {/* Country Guides Section */}
            <div className="max-w-4xl mx-auto mt-6">
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

            {/* Visa & Immigration Section */}
            <div className="max-w-4xl mx-auto mt-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Immigration
                    </span>
                  </div>
                  <CardTitle className="text-xl">Visa & Immigration Tips</CardTitle>
                  <CardDescription>
                    Essential resources for navigating international moves and visa applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {visaImmigrationLinks.map((link, index) => (
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
