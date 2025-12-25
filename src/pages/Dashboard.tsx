import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, DollarSign, TrendingUp, FileText, Globe, Calendar } from "lucide-react";
import { format } from "date-fns";

interface FundSummary {
  totalContributions: number;
  totalDisbursed: number;
  balance: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [fundSummary, setFundSummary] = useState<FundSummary>({
    totalContributions: 0,
    totalDisbursed: 0,
    balance: 0,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchFundSummary = async () => {
      const { data } = await supabase
        .from("fund_transactions")
        .select("amount, transaction_type");

      if (data) {
        const contributions = data
          .filter((t) => t.transaction_type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const disbursed = data
          .filter((t) => t.transaction_type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        setFundSummary({
          totalContributions: contributions,
          totalDisbursed: disbursed,
          balance: contributions - disbursed,
        });
      }
    };

    fetchFundSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container">
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline">
                  Welcome back
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Member since {session?.user?.created_at && format(new Date(session.user.created_at), "MMM yyyy")}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="shadow-soft">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardDescription>Total Fund Contributions</CardDescription>
                    <CardTitle className="text-2xl">${fundSummary.totalContributions.toLocaleString()}</CardTitle>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-soft">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardDescription>Members Supported</CardDescription>
                    <CardTitle className="text-2xl">${fundSummary.totalDisbursed.toLocaleString()}</CardTitle>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-soft sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardDescription>Current Fund Balance</CardDescription>
                    <CardTitle className="text-2xl">${fundSummary.balance.toLocaleString()}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Transparency Ledger
                  </CardTitle>
                  <CardDescription>
                    View the complete record of all fund transactions and how contributions are being used.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild>
                    <a href="/transparency">View All Transactions</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your account settings, update your information, and view your membership details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{session?.user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-green-600">Active Member</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Community Message */}
            <Card className="shadow-soft bg-primary/5 border-primary/20">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">Thank you for being part of our community</h3>
                    <p className="mt-1 text-muted-foreground">
                      Your contributions help members around the world pursue global opportunities. Together, we're making dreams possible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
