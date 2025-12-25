import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, DollarSign, TrendingUp, FileText, Globe, Calendar, Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface FundSummary {
  totalContributions: number;
  totalDisbursed: number;
  balance: number;
}

interface Application {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  opportunity: {
    id: string;
    title: string;
    category: string;
    location: string | null;
    deadline: string | null;
  };
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pending: { 
    label: "Pending", 
    icon: <Clock className="h-3 w-3" />, 
    className: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20" 
  },
  approved: { 
    label: "Approved", 
    icon: <CheckCircle className="h-3 w-3" />, 
    className: "bg-green-500/10 text-green-600 hover:bg-green-500/20" 
  },
  rejected: { 
    label: "Rejected", 
    icon: <XCircle className="h-3 w-3" />, 
    className: "bg-red-500/10 text-red-600 hover:bg-red-500/20" 
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [fundSummary, setFundSummary] = useState<FundSummary>({
    totalContributions: 0,
    totalDisbursed: 0,
    balance: 0,
  });
  const [applications, setApplications] = useState<Application[]>([]);

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
    const fetchData = async () => {
      const [fundResult, appResult] = await Promise.all([
        supabase.from("fund_transactions").select("amount, transaction_type"),
        session ? supabase
          .from("applications")
          .select(`
            id,
            status,
            message,
            created_at,
            opportunity:opportunities(id, title, category, location, deadline)
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
        : Promise.resolve({ data: null }),
      ]);

      if (fundResult.data) {
        const contributions = fundResult.data
          .filter((t) => t.transaction_type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const disbursed = fundResult.data
          .filter((t) => t.transaction_type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        setFundSummary({
          totalContributions: contributions,
          totalDisbursed: disbursed,
          balance: contributions - disbursed,
        });
      }

      if (appResult.data) {
        setApplications(appResult.data as Application[]);
      }
    };

    fetchData();
  }, [session]);

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

            {/* My Applications */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  My Applications
                </CardTitle>
                <CardDescription>
                  Track the status of your opportunity applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't applied to any opportunities yet.</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href="/#opportunities">Browse Opportunities</a>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Opportunity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((app) => {
                          const status = statusConfig[app.status] || statusConfig.pending;
                          return (
                            <TableRow key={app.id}>
                              <TableCell className="font-medium">{app.opportunity.title}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{app.opportunity.category}</Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {app.opportunity.location || "—"}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {format(new Date(app.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                <Badge className={status.className}>
                                  {status.icon}
                                  <span className="ml-1">{status.label}</span>
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

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
                    Manage your account settings and view your membership details.
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
