import Header from "@/components/Header";
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
      "The Global Moves is a nonprofit organization dedicated to giving young professionals from the Global South the opportunity to network and develop internationally. We connect talented individuals with global opportunities that were previously inaccessible to them.",
  },
  {
    question: "Who can apply for opportunities?",
    answer:
      "Our programs are designed for young professionals from the Global South who are looking to expand their professional networks, gain international experience, and develop their careers on a global stage.",
  },
  {
    question: "How do I become a Founding Member?",
    answer:
      "Founding Members are early supporters who believe in our mission. You can apply through our Founding Members page. Founding Members receive exclusive benefits and play a key role in shaping our organization's future.",
  },
  {
    question: "Is there a cost to join?",
    answer:
      "Membership is $15/month. Some specialized programs may have associated costs, but we work to provide scholarships and financial assistance to ensure accessibility for all qualified candidates.",
  },
  {
    question: "How are funds used?",
    answer:
      "We maintain full transparency in our operations. Visit our Transparency page to see detailed breakdowns of how donations and funds are allocated to support our programs and participants.",
  },
  {
    question: "What types of opportunities are available?",
    answer:
      "We offer various opportunities including international conferences, networking events, mentorship programs, professional development workshops, and cross-border collaboration projects.",
  },
  {
    question: "How can I support The Global Moves?",
    answer:
      "You can support us by becoming a Founding Member, donating to our programs, volunteering your time and expertise, or spreading the word about our mission within your network.",
  },
  {
    question: "How do I contact The Global Moves?",
    answer:
      "You can reach us through our Contact page. We welcome inquiries about partnerships, programs, volunteering, and general questions about our organization.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16 md:py-24">
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
    </div>
  );
};

export default HowItWorks;
