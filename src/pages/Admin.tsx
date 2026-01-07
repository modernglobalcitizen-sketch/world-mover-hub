import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Shield, Briefcase, DollarSign, RefreshCw, HandCoins } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  transaction_type: string;
  recipient_name: string | null;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  deadline: string | null;
  requirements: string | null;
  is_active: boolean;
  created_at: string;
}

interface FundApplication {
  id: string;
  user_id: string;
  user_email?: string;
  amount_requested: number;
  purpose: string;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const emptyTransaction = {
  date: new Date().toISOString().split("T")[0],
  description: "",
  category: "",
  amount: 0,
  transaction_type: "expense",
  recipient_name: "",
};

const emptyOpportunity = {
  title: "",
  description: "",
  category: "",
  location: "",
  deadline: "",
  requirements: "",
  is_active: true,
};

const Admin = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [fundApplications, setFundApplications] = useState<FundApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Transaction dialog
  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [txFormData, setTxFormData] = useState(emptyTransaction);
  
  // Opportunity dialog
  const [oppDialogOpen, setOppDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [oppFormData, setOppFormData] = useState(emptyOpportunity);
  
  // Fund application review
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewingApplication, setReviewingApplication] = useState<FundApplication | null>(null);
  const [reviewFormData, setReviewFormData] = useState({ status: "pending", admin_notes: "" });
  
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          setCheckingAuth(false);
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setCheckingAuth(false);
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;

    const checkAdminRole = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      setCheckingAuth(false);
    };

    checkAdminRole();
  }, [session]);

  useEffect(() => {
    if (!session || checkingAuth || !isAdmin) return;

    const fetchData = async () => {
      const [txResult, oppResult, fundAppResult] = await Promise.all([
        supabase.from("fund_transactions").select("*").order("date", { ascending: false }),
        supabase.from("opportunities").select("*").order("created_at", { ascending: false }),
        supabase.from("fund_applications").select("*").order("created_at", { ascending: false }),
      ]);

      if (txResult.data) setTransactions(txResult.data);
      if (oppResult.data) setOpportunities(oppResult.data);
      
      // Fetch user emails for fund applications
      if (fundAppResult.data) {
        const appsWithEmails = await Promise.all(
          fundAppResult.data.map(async (app) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("email")
              .eq("id", app.user_id)
              .maybeSingle();
            return { ...app, user_email: profile?.email || "Unknown" };
          })
        );
        setFundApplications(appsWithEmails);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [session, checkingAuth, isAdmin]);

  // Transaction handlers
  const handleOpenTxDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setTxFormData({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        transaction_type: transaction.transaction_type,
        recipient_name: transaction.recipient_name || "",
      });
    } else {
      setEditingTransaction(null);
      setTxFormData(emptyTransaction);
    }
    setTxDialogOpen(true);
  };

  const handleSaveTx = async () => {
    if (!txFormData.description || !txFormData.category || txFormData.amount <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    const transactionData = {
      date: txFormData.date,
      description: txFormData.description,
      category: txFormData.category,
      amount: txFormData.amount,
      transaction_type: txFormData.transaction_type,
      recipient_name: txFormData.recipient_name || null,
    };

    if (editingTransaction) {
      const { error } = await supabase
        .from("fund_transactions")
        .update(transactionData)
        .eq("id", editingTransaction.id);

      if (error) {
        toast.error("Failed to update transaction");
      } else {
        toast.success("Transaction updated");
        setTransactions(transactions.map(t => 
          t.id === editingTransaction.id ? { ...t, ...transactionData } : t
        ));
      }
    } else {
      const { data, error } = await supabase
        .from("fund_transactions")
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        toast.error("Failed to add transaction");
      } else {
        toast.success("Transaction added");
        setTransactions([data, ...transactions]);
      }
    }

    setSaving(false);
    setTxDialogOpen(false);
  };

  const handleDeleteTx = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    const { error } = await supabase.from("fund_transactions").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete transaction");
    } else {
      toast.success("Transaction deleted");
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // Opportunity handlers
  const handleOpenOppDialog = (opportunity?: Opportunity) => {
    if (opportunity) {
      setEditingOpportunity(opportunity);
      setOppFormData({
        title: opportunity.title,
        description: opportunity.description,
        category: opportunity.category,
        location: opportunity.location || "",
        deadline: opportunity.deadline || "",
        requirements: opportunity.requirements || "",
        is_active: opportunity.is_active,
      });
    } else {
      setEditingOpportunity(null);
      setOppFormData(emptyOpportunity);
    }
    setOppDialogOpen(true);
  };

  const handleSaveOpp = async () => {
    if (!oppFormData.title || !oppFormData.description || !oppFormData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    const opportunityData = {
      title: oppFormData.title,
      description: oppFormData.description,
      category: oppFormData.category,
      location: oppFormData.location || null,
      deadline: oppFormData.deadline || null,
      requirements: oppFormData.requirements || null,
      is_active: oppFormData.is_active,
    };

    if (editingOpportunity) {
      const { error } = await supabase
        .from("opportunities")
        .update(opportunityData)
        .eq("id", editingOpportunity.id);

      if (error) {
        toast.error("Failed to update opportunity");
      } else {
        toast.success("Opportunity updated");
        setOpportunities(opportunities.map(o => 
          o.id === editingOpportunity.id ? { ...o, ...opportunityData } : o
        ));
      }
    } else {
      const { data, error } = await supabase
        .from("opportunities")
        .insert(opportunityData)
        .select()
        .single();

      if (error) {
        toast.error("Failed to add opportunity");
      } else {
        toast.success("Opportunity added");
        setOpportunities([data, ...opportunities]);
      }
    }

    setSaving(false);
    setOppDialogOpen(false);
  };

  const handleDeleteOpp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;

    const { error } = await supabase.from("opportunities").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete opportunity");
    } else {
      toast.success("Opportunity deleted");
      setOpportunities(opportunities.filter(o => o.id !== id));
    }
  };

  const toggleOppActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("opportunities")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update opportunity");
    } else {
      setOpportunities(opportunities.map(o => 
        o.id === id ? { ...o, is_active: isActive } : o
      ));
    }
  };

  const handleSyncAirtable = async () => {
    setSyncing(true);
    try {
      // Get current session for auth header
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Authentication required');
        setSyncing(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('sync-airtable-opportunities', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error('Sync error:', error);
        toast.error('Failed to sync from Airtable');
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`Synced ${data?.synced || 0} opportunities from Airtable`);
        // Refresh opportunities list
        const { data: oppData } = await supabase
          .from("opportunities")
          .select("*")
          .order("created_at", { ascending: false });
        if (oppData) setOpportunities(oppData);
      }
    } catch (err) {
      console.error('Sync error:', err);
      toast.error('Failed to sync from Airtable');
    }
    setSyncing(false);
  };

  // Fund application handlers
  const handleOpenReviewDialog = (app: FundApplication) => {
    setReviewingApplication(app);
    setReviewFormData({ status: app.status, admin_notes: app.admin_notes || "" });
    setReviewDialogOpen(true);
  };

  const handleUpdateFundApplication = async () => {
    if (!reviewingApplication) return;

    setSaving(true);

    const { error } = await supabase
      .from("fund_applications")
      .update({
        status: reviewFormData.status,
        admin_notes: reviewFormData.admin_notes || null,
      })
      .eq("id", reviewingApplication.id);

    if (error) {
      toast.error("Failed to update application");
    } else {
      toast.success("Application updated");
      setFundApplications(fundApplications.map(a =>
        a.id === reviewingApplication.id
          ? { ...a, status: reviewFormData.status, admin_notes: reviewFormData.admin_notes || null }
          : a
      ));
      setReviewDialogOpen(false);
    }

    setSaving(false);
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 md:py-24">
          <div className="container">
            <div className="text-center text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 md:py-24">
          <div className="container">
            <div className="text-center space-y-4">
              <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
              <h1 className="text-2xl font-bold text-headline">Access Denied</h1>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container">
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage transactions and opportunities
              </p>
            </div>

            <Tabs defaultValue="transactions" className="space-y-6">
              <TabsList>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Opportunities
                </TabsTrigger>
                <TabsTrigger value="fund-applications" className="flex items-center gap-2">
                  <HandCoins className="h-4 w-4" />
                  Fund Applications
                  {fundApplications.filter(a => a.status === "pending").length > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {fundApplications.filter(a => a.status === "pending").length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Transactions Tab */}
              <TabsContent value="transactions" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog open={txDialogOpen} onOpenChange={setTxDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleOpenTxDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Transaction
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="tx-date">Date</Label>
                          <Input
                            id="tx-date"
                            type="date"
                            value={txFormData.date}
                            onChange={(e) => setTxFormData({ ...txFormData, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tx-description">Description *</Label>
                          <Input
                            id="tx-description"
                            value={txFormData.description}
                            onChange={(e) => setTxFormData({ ...txFormData, description: e.target.value })}
                            placeholder="Transaction description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tx-category">Category *</Label>
                          <Input
                            id="tx-category"
                            value={txFormData.category}
                            onChange={(e) => setTxFormData({ ...txFormData, category: e.target.value })}
                            placeholder="e.g., Member Support, Operations"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tx-type">Type</Label>
                          <Select
                            value={txFormData.transaction_type}
                            onValueChange={(value) => setTxFormData({ ...txFormData, transaction_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tx-amount">Amount *</Label>
                          <Input
                            id="tx-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={txFormData.amount}
                            onChange={(e) => setTxFormData({ ...txFormData, amount: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tx-recipient">Recipient Name (optional)</Label>
                          <Input
                            id="tx-recipient"
                            value={txFormData.recipient_name}
                            onChange={(e) => setTxFormData({ ...txFormData, recipient_name: e.target.value })}
                            placeholder="e.g., John D."
                          />
                        </div>
                        <Button onClick={handleSaveTx} className="w-full" disabled={saving}>
                          {saving ? "Saving..." : editingTransaction ? "Update" : "Add"} Transaction
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No transactions yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {format(new Date(transaction.date), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{transaction.category}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {transaction.recipient_name || "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={transaction.transaction_type === "income" ? "text-green-600" : "text-orange-600"}>
                                {transaction.transaction_type === "income" ? "+" : "-"}${Number(transaction.amount).toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenTxDialog(transaction)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteTx(transaction.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Opportunities Tab */}
              <TabsContent value="opportunities" className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleSyncAirtable} 
                    disabled={syncing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync from Airtable'}
                  </Button>
                  <Dialog open={oppDialogOpen} onOpenChange={setOppDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleOpenOppDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Opportunity
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>
                          {editingOpportunity ? "Edit Opportunity" : "Add Opportunity"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-2">
                          <Label htmlFor="opp-title">Title *</Label>
                          <Input
                            id="opp-title"
                            value={oppFormData.title}
                            onChange={(e) => setOppFormData({ ...oppFormData, title: e.target.value })}
                            placeholder="Opportunity title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="opp-description">Description *</Label>
                          <Textarea
                            id="opp-description"
                            value={oppFormData.description}
                            onChange={(e) => setOppFormData({ ...oppFormData, description: e.target.value })}
                            placeholder="Describe the opportunity"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="opp-category">Category *</Label>
                          <Input
                            id="opp-category"
                            value={oppFormData.category}
                            onChange={(e) => setOppFormData({ ...oppFormData, category: e.target.value })}
                            placeholder="e.g., Study Abroad, Work-Travel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="opp-location">Location</Label>
                          <Input
                            id="opp-location"
                            value={oppFormData.location}
                            onChange={(e) => setOppFormData({ ...oppFormData, location: e.target.value })}
                            placeholder="e.g., Germany, Remote"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="opp-deadline">Application Deadline</Label>
                          <Input
                            id="opp-deadline"
                            type="date"
                            value={oppFormData.deadline}
                            onChange={(e) => setOppFormData({ ...oppFormData, deadline: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="opp-requirements">Requirements</Label>
                          <Textarea
                            id="opp-requirements"
                            value={oppFormData.requirements}
                            onChange={(e) => setOppFormData({ ...oppFormData, requirements: e.target.value })}
                            placeholder="List the requirements"
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="opp-active">Active (visible to subscribers)</Label>
                          <Switch
                            id="opp-active"
                            checked={oppFormData.is_active}
                            onCheckedChange={(checked) => setOppFormData({ ...oppFormData, is_active: checked })}
                          />
                        </div>
                        <Button onClick={handleSaveOpp} className="w-full" disabled={saving}>
                          {saving ? "Saving..." : editingOpportunity ? "Update" : "Add"} Opportunity
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {opportunities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No opportunities yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        opportunities.map((opp) => (
                          <TableRow key={opp.id}>
                            <TableCell className="font-medium">{opp.title}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{opp.category}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{opp.location || "—"}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {opp.deadline ? format(new Date(opp.deadline), "MMM d, yyyy") : "—"}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={opp.is_active}
                                onCheckedChange={(checked) => toggleOppActive(opp.id, checked)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenOppDialog(opp)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteOpp(opp.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Fund Applications Tab */}
              <TabsContent value="fund-applications" className="space-y-4">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HandCoins className="h-5 w-5 text-primary" />
                      Community Fund Applications
                    </CardTitle>
                    <CardDescription>
                      Review and approve funding requests from members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {fundApplications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <HandCoins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No funding applications yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Applicant</TableHead>
                              <TableHead>Purpose</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fundApplications.map((app) => (
                              <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.user_email}</TableCell>
                                <TableCell>{app.purpose}</TableCell>
                                <TableCell className="font-semibold">${Number(app.amount_requested).toLocaleString()}</TableCell>
                                <TableCell className="text-muted-foreground">
                                  {format(new Date(app.created_at), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}
                                    className={app.status === "approved" ? "bg-green-500/10 text-green-600" : app.status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-yellow-500/10 text-yellow-600"}
                                  >
                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" onClick={() => handleOpenReviewDialog(app)}>
                                    Review
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Review Dialog */}
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Review Funding Application</DialogTitle>
                    </DialogHeader>
                    {reviewingApplication && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Applicant</span>
                            <span className="font-medium">{reviewingApplication.user_email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Amount Requested</span>
                            <span className="font-semibold text-primary">${Number(reviewingApplication.amount_requested).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Purpose</span>
                            <span className="font-medium">{reviewingApplication.purpose}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Applied</span>
                            <span>{format(new Date(reviewingApplication.created_at), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description from Applicant</Label>
                          <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                            {reviewingApplication.description}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="review-status">Decision</Label>
                          <Select
                            value={reviewFormData.status}
                            onValueChange={(value) => setReviewFormData({ ...reviewFormData, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="review-notes">Admin Notes (visible to applicant)</Label>
                          <Textarea
                            id="review-notes"
                            value={reviewFormData.admin_notes}
                            onChange={(e) => setReviewFormData({ ...reviewFormData, admin_notes: e.target.value })}
                            placeholder="Add notes or feedback for the applicant..."
                            rows={3}
                          />
                        </div>
                        <Button onClick={handleUpdateFundApplication} className="w-full" disabled={saving}>
                          {saving ? "Saving..." : "Update Application"}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
