import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, DollarSign, TrendingUp, FileText, Globe, Calendar, Briefcase, Clock, CheckCircle, XCircle, Crown, Bookmark, Trash2, MapPin, ArrowRight, HandCoins, Plus, Pencil, Settings } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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

interface SavedOpportunity {
  id: string;
  opportunity_id: string;
  created_at: string;
  opportunity: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string | null;
    deadline: string | null;
    is_active: boolean;
  };
}

interface FundApplication {
  id: string;
  amount_requested: number;
  purpose: string;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
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
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [fundApplications, setFundApplications] = useState<FundApplication[]>([]);
  const [foundingMember, setFoundingMember] = useState<{ isFounder: boolean; number: number | null; displayName: string | null }>({
    isFounder: false,
    number: null,
    displayName: null,
  });
  const [displayNameDialogOpen, setDisplayNameDialogOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [savingDisplayName, setSavingDisplayName] = useState(false);
  
  // Fund application form
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [fundFormData, setFundFormData] = useState({
    amount_requested: "",
    purpose: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

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
      if (!session) return;
      
      const [fundResult, appResult, profileResult, savedResult, fundAppResult] = await Promise.all([
        supabase.from("fund_transactions").select("amount, transaction_type"),
        supabase
          .from("applications")
          .select(`
            id,
            status,
            message,
            created_at,
            opportunity:opportunities(id, title, category, location, deadline)
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("is_founding_member, founding_member_number, display_name")
          .eq("id", session.user.id)
          .maybeSingle(),
        supabase
          .from("saved_opportunities")
          .select(`
            id,
            opportunity_id,
            created_at,
            opportunity:opportunities(id, title, description, category, location, deadline, is_active)
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("fund_applications")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
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

      if (profileResult.data) {
        setFoundingMember({
          isFounder: profileResult.data.is_founding_member,
          number: profileResult.data.founding_member_number,
          displayName: profileResult.data.display_name,
        });
        setNewDisplayName(profileResult.data.display_name || "");
      }

      if (savedResult.data) {
        setSavedOpportunities(savedResult.data as SavedOpportunity[]);
      }

      if (fundAppResult.data) {
        setFundApplications(fundAppResult.data as FundApplication[]);
      }
    };

    fetchData();
  }, [session]);

  const handleRemoveSaved = async (savedId: string) => {
    setRemovingId(savedId);
    const { error } = await supabase
      .from("saved_opportunities")
      .delete()
      .eq("id", savedId);

    if (error) {
      toast.error("Failed to remove saved opportunity");
      console.error(error);
    } else {
      setSavedOpportunities(savedOpportunities.filter(s => s.id !== savedId));
      toast.success("Opportunity removed from saved");
    }
    setRemovingId(null);
  };

  const handleSaveDisplayName = async () => {
    if (!session) return;
    
    setSavingDisplayName(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: newDisplayName.trim() || null })
      .eq("id", session.user.id);

    if (error) {
      toast.error("Failed to update display name");
      console.error(error);
    } else {
      setFoundingMember({ ...foundingMember, displayName: newDisplayName.trim() || null });
      toast.success("Display name updated!");
      setDisplayNameDialogOpen(false);
    }
    setSavingDisplayName(false);
  };

  const handleSubmitFundApplication = async () => {
    if (!fundFormData.amount_requested || !fundFormData.purpose || !fundFormData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(fundFormData.amount_requested);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("fund_applications")
      .insert({
        user_id: session!.user.id,
        amount_requested: amount,
        purpose: fundFormData.purpose,
        description: fundFormData.description,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to submit application");
      console.error(error);
    } else {
      toast.success("Funding application submitted successfully!");
      setFundApplications([data, ...fundApplications]);
      setFundFormData({ amount_requested: "", purpose: "", description: "" });
      setFundDialogOpen(false);
    }

    setSubmitting(false);
  };

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
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline">
                    Welcome back
                  </h1>
                  {foundingMember.isFounder && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 gap-1">
                        <Crown className="h-3 w-3" />
                        Founding Member #{foundingMember.number}
                      </Badge>
                      <Dialog open={displayNameDialogOpen} onOpenChange={setDisplayNameDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Pencil className="h-3 w-3 mr-1" />
                            {foundingMember.displayName ? "Edit Name" : "Add Name"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Set Display Name</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm text-muted-foreground">
                              This name will be shown publicly on the Founding Members page. Leave blank to show only your member number.
                            </p>
                            <div className="space-y-2">
                              <Label htmlFor="displayName">Display Name</Label>
                              <Input
                                id="displayName"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                placeholder="Enter your display name"
                              />
                            </div>
                            <Button 
                              onClick={handleSaveDisplayName} 
                              className="w-full"
                              disabled={savingDisplayName}
                            >
                              {savingDisplayName ? "Saving..." : "Save Display Name"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/profile")} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member since {session?.user?.created_at && format(new Date(session.user.created_at), "MMM yyyy")}
                </div>
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

            {/* Fund Applications */}
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <HandCoins className="h-5 w-5 text-primary" />
                    My Funding Applications
                  </CardTitle>
                  <CardDescription>
                    Apply for funding from the community fund
                  </CardDescription>
                </div>
                <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Apply for Funding
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for Community Funding</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="fund-amount">Amount Requested ($) *</Label>
                        <Input
                          id="fund-amount"
                          type="number"
                          min="1"
                          step="0.01"
                          value={fundFormData.amount_requested}
                          onChange={(e) => setFundFormData({ ...fundFormData, amount_requested: e.target.value })}
                          placeholder="Enter amount"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fund-purpose">Purpose *</Label>
                        <Input
                          id="fund-purpose"
                          value={fundFormData.purpose}
                          onChange={(e) => setFundFormData({ ...fundFormData, purpose: e.target.value })}
                          placeholder="e.g., Visa fees, Flight tickets, Tuition"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fund-description">Detailed Description *</Label>
                        <Textarea
                          id="fund-description"
                          value={fundFormData.description}
                          onChange={(e) => setFundFormData({ ...fundFormData, description: e.target.value })}
                          placeholder="Explain why you need this funding and how it will help you..."
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleSubmitFundApplication} className="w-full" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {fundApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <HandCoins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't applied for funding yet.</p>
                    <p className="text-sm mt-2">Apply to receive support from the community fund.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fundApplications.map((app) => {
                          const status = statusConfig[app.status] || statusConfig.pending;
                          return (
                            <TableRow key={app.id}>
                              <TableCell className="font-medium">{app.purpose}</TableCell>
                              <TableCell>${Number(app.amount_requested).toLocaleString()}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {format(new Date(app.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                <Badge className={status.className}>
                                  {status.icon}
                                  <span className="ml-1">{status.label}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                                {app.admin_notes || "—"}
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

            {/* Saved Opportunities */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  Saved Opportunities
                </CardTitle>
                <CardDescription>
                  Opportunities you've bookmarked for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedOpportunities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't saved any opportunities yet.</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href="/#opportunities">Browse Opportunities</a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {savedOpportunities.map((saved) => {
                      const isExpired = saved.opportunity.deadline && new Date(saved.opportunity.deadline) < new Date();
                      return (
                        <div key={saved.id} className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium">{saved.opportunity.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {saved.opportunity.category}
                              </Badge>
                              {isExpired && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  Expired
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {saved.opportunity.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {saved.opportunity.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {saved.opportunity.location}
                                </span>
                              )}
                              {saved.opportunity.deadline && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(saved.opportunity.deadline), "MMM d, yyyy")}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveSaved(saved.id)}
                              disabled={removingId === saved.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href="/#opportunities">
                                View
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
