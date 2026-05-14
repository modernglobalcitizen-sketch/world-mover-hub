import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapPin, Briefcase, Home, FileText, Globe, CheckCircle } from "lucide-react";
import SEO from "@/components/SEO";

const services = [
  {
    icon: Globe,
    title: "Visa & Immigration Guidance",
    description: "Navigate visa applications, work permits, and immigration requirements for your destination country.",
  },
  {
    icon: Briefcase,
    title: "Job Search Support",
    description: "Get connected to job opportunities and understand the local job market in your new country.",
  },
  {
    icon: Home,
    title: "Housing Assistance",
    description: "Find suitable accommodation and understand rental processes in unfamiliar markets.",
  },
  {
    icon: FileText,
    title: "Document Preparation",
    description: "Ensure all your important documents are properly prepared, translated, and authenticated.",
  },
  {
    icon: MapPin,
    title: "Settling-In Support",
    description: "Get help with banking, healthcare registration, local transportation, and more.",
  },
];

const RelocationServices = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast({ title: "Please fill in your name and email", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: {
          email: email.trim(),
          name: name.trim(),
        },
      });

      if (error) throw error;

      setSubmitted(true);
      toast({ title: "Thank you for your interest!", description: "We'll be in touch soon about our relocation services." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SEO
        title="Relocation Services — Visa, Job & Housing Support"
        description="Personalized relocation help: visa pathways, international job search, and housing support for moving abroad."
        path="/relocation-services"
      />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
          <div className="container max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Relocation Services
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
              Moving to a new country? Let us help you navigate the journey — from visa applications to settling into your new home.
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-center mb-12 text-foreground">
              How We Can Help
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow"
                >
                  <service.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interest Form */}
        <section className="py-16 bg-accent/50">
          <div className="container max-w-xl">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-center mb-4 text-foreground">
              Express Your Interest
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Fill out the form below and we'll reach out with more details about how we can support your relocation.
            </p>

            {submitted ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground">
                  We've received your interest. Our team will be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    maxLength={255}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-foreground mb-1">
                    Destination Country (optional)
                  </label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Where are you planning to relocate?"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                    Tell Us More (optional)
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any specific needs or questions?"
                    maxLength={1000}
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "I'm Interested"}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RelocationServices;
