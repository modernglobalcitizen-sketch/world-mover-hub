import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  DollarSign, 
  Users, 
  Plane, 
  FileCheck, 
  Shield, 
  Heart,
  CheckCircle2,
  Clock,
  Globe,
  GraduationCap
} from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  transaction_type: string;
  recipient_name: string | null;
}

const getInitials = (name: string | null): string => {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase() + ".";
  }
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}.${lastInitial}.`;
};

const fundCovers = [
  {
    icon: GraduationCap,
    title: "Program Fees",
    description: "Application and participation fees for conferences, fellowships, and courses"
  },
  {
    icon: Plane,
    title: "Flights",
    description: "Round-trip airfare to get you to your opportunity destination"
  },
  {
    icon: FileCheck,
    title: "Visa Fees",
    description: "Visa application costs and related documentation fees"
  },
  {
    icon: Shield,
    title: "Insurance",
    description: "Travel and health insurance for the duration of your program"
  },
  {
    icon: Globe,
    title: "Transportation",
    description: "Local transport costs including airport transfers and daily commute"
  },
  {
    icon: Heart,
    title: "Accommodation",
    description: "Housing and lodging costs during your program participation"
  }
];

const eligibilityCriteria = [
  "Active membership with The Global Moves ($15/month)",
  "Accepted to an external program, conference, fellowship, or opportunity",
  "Program is in a visa-accessible country for your passport",
  "Unable to fully self-fund the participation costs",
  "Willing to share your experience with the community upon return"
];

const applicationSteps = [
  {
    step: 1,
    title: "Get Accepted",
    description: "Apply to and receive acceptance from an external opportunity (conference, fellowship, program, etc.)"
  },
  {
    step: 2,
    title: "Submit Application",
    description: "Log into your dashboard and submit a Community Fund application with details about the opportunity and costs"
  },
  {
    step: 3,
    title: "Review Process",
    description: "Our team reviews applications based on need, fund availability, and alignment with your professional goals"
  },
  {
    step: 4,
    title: "Get Funded",
    description: "Approved applicants receive funding to cover eligible expenses directly"
  }
];

const CommunityFund = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("fund_transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        setTransactions(data || []);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.transaction_type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.transaction_type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">Community-Powered</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-headline mb-6">
                The Community Fund
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                A portion of every membership subscription goes into a shared pool that helps accelerate 
                members' international moves. When you're accepted to an opportunity but need financial 
                support, the community has your back.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/auth">Become a Member</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/dashboard">Apply for Funding</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-headline mb-4">
                How the Fund Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Community Fund is built on collective contribution. Every $15 membership 
                contributes to the pool, creating a sustainable resource for members in need.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {applicationSteps.map((item) => (
                <div key={item.step} className="relative">
                  <div className="rounded-xl border border-border bg-card p-6 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.step < 4 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Cover */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-headline mb-4">
                What the Fund Covers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We understand the real costs of pursuing international opportunities. 
                The fund is designed to remove financial barriers comprehensively.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundCovers.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-headline mb-4">
                  Eligibility Criteria
                </h2>
                <p className="text-muted-foreground">
                  To apply for Community Fund support, you should meet the following criteria:
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-8 shadow-soft">
                <ul className="space-y-4">
                  {eligibilityCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{criteria}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Visa Tip</p>
                      <p className="text-sm text-muted-foreground">
                        We encourage applying to programs in countries with favorable visa relations 
                        to your home country. This maximizes your chances of both visa approval and 
                        fund approval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Ledger */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-headline mb-4">
                Transparency Ledger
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Full visibility into how community funds are collected and distributed. 
                Every contribution matters, and every transaction is recorded.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <ArrowDownCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contributions</p>
                    <p className="text-2xl font-bold text-foreground">${totalIncome.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <ArrowUpCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Disbursed</p>
                    <p className="text-2xl font-bold text-foreground">${totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold text-foreground">${balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-display font-semibold text-foreground">Transaction History</h3>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions recorded yet.</p>
                  <p className="text-sm mt-1">Check back soon as our community grows!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {format(new Date(transaction.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {getInitials(transaction.recipient_name)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              transaction.transaction_type === "income"
                                ? "text-green-600"
                                : "text-orange-600"
                            }
                          >
                            {transaction.transaction_type === "income" ? "+" : "-"}$
                            {Number(transaction.amount).toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-headline mb-4">
                Ready to Join the Movement?
              </h2>
              <p className="text-muted-foreground mb-8">
                Every membership strengthens our collective power. Join a community that 
                believes in breaking down barriers to global opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/founding-members">Become a Founding Member</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/how-it-works">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityFund;
