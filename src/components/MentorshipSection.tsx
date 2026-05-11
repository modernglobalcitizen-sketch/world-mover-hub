import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Compass, Users, ArrowRight, Sparkles } from "lucide-react";

const MentorshipSection = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Compass,
      title: "1:1 Guidance",
      description: "Personalized advice on remote work and building a global career.",
    },
    {
      icon: GraduationCap,
      title: "Skill Building",
      description: "Get matched with mentors who help sharpen the skills employers actually want.",
    },
    {
      icon: Users,
      title: "Global Network",
      description: "Tap into a community of professionals already living the international lifestyle.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Sparkles className="h-3 w-3" />
            Mentorship — Coming Soon
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline mb-4">
            Get Mentored by People Who've Done It
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're chasing a remote job, planning a relocation, or pivoting careers — connect with mentors who've walked the path.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          {benefits.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="hover:shadow-lg hover:border-primary/50 transition-all duration-200">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-headline mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" disabled className="gap-2">
            Coming Soon
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MentorshipSection;
