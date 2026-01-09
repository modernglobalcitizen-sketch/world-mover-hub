import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is The Global Moves?",
    answer:
      "The Global Moves is a membership platform for people navigating global work, study, and travel with limited passport access. Members connect, stay accountable, and unlock opportunities together. A portion of every subscription goes toward a community fund that helps accelerate selected members' international moves.",
  },
  {
    question: "What are Breakout Rooms?",
    answer:
      "Breakout Rooms are goal-based spaces where members connect with others pursuing similar objectives—whether that's landing a remote job, getting into a master's program abroad, or planning a visa-friendly travel route. You can join public rooms or create private rooms for focused collaboration with specific members.",
  },
  {
    question: "How do online presence indicators work?",
    answer:
      "When you're active on the platform, a green dot appears next to your name in Breakout Rooms. This helps members know who's online and available to chat, share advice, or collaborate in real-time. It creates a sense of community and makes it easier to connect when you need support.",
  },
  {
    question: "What is the Community Fund?",
    answer:
      "A portion of every $15/month membership subscription goes into the Community Fund. This pooled resource helps cover expenses like program fees, flights, visa fees, insurance, transportation, and accommodation for members who are accepted to international opportunities but need financial support to participate.",
  },
  {
    question: "How do I apply for Community Fund support?",
    answer:
      "Once you're accepted to an external program or opportunity, you can apply for funding through your dashboard. Our team reviews applications based on need, alignment with your goals, and fund availability. We encourage applying to programs in visa-friendly countries to maximize your chances of success.",
  },
  {
    question: "Who can become a member?",
    answer:
      "Our platform is designed for people from the Global South who face passport limitations when pursuing international opportunities. Whether you're seeking remote work, graduate programs, conferences, or cross-border collaborations, you'll find others here who understand your journey.",
  },
  {
    question: "What can I do in Breakout Rooms?",
    answer:
      "In Breakout Rooms, you can chat with fellow members, share real opportunities you've discovered, get advice on applications and visas, celebrate wins together, and hold each other accountable to your goals. Private rooms let you create focused spaces for specific collaborations.",
  },
  {
    question: "How much does membership cost?",
    answer:
      "Membership is $15/month. This gives you full access to all Breakout Rooms, the ability to create private rooms, real-time presence features, and the knowledge that part of your subscription supports the Community Fund helping other members achieve their goals.",
  },
  {
    question: "What types of opportunities are shared?",
    answer:
      "Members share a wide range of opportunities including remote job openings, scholarship programs, international conferences, fellowship opportunities, visa-friendly travel tips, and professional development resources. The focus is on practical, vetted opportunities that work for people with passport limitations.",
  },
  {
    question: "How can I support The Global Moves beyond membership?",
    answer:
      "You can become a Founding Member for exclusive benefits and a role in shaping our future, donate directly to the Community Fund, or spread the word within your network. Every bit of support helps more members unlock international opportunities.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              How Does the Platform Work?
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn how The Global Moves connects young professionals with global opportunities.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center p-6 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">
              Still have questions? We'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
