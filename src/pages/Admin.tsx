import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  transaction_type: string;
  recipient_name: string | null;
}

const emptyTransaction = {
  date: new Date().toISOString().split("T")[0],
  description: "",
  category: "",
  amount: 0,
  transaction_type: "expense",
  recipient_name: "",
};

const Admin = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState(emptyTransaction);
  const [saving, setSaving] = useState(false);
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
    if (!session || checkingAuth) return;

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
  }, [session, checkingAuth]);

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        transaction_type: transaction.transaction_type,
        recipient_name: transaction.recipient_name || "",
      });
    } else {
      setEditingTransaction(null);
      setFormData(emptyTransaction);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.description || !formData.category || formData.amount <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    const transactionData = {
      date: formData.date,
      description: formData.description,
      category: formData.category,
      amount: formData.amount,
      transaction_type: formData.transaction_type,
      recipient_name: formData.recipient_name || null,
    };

    if (editingTransaction) {
      const { error } = await supabase
        .from("fund_transactions")
        .update(transactionData)
        .eq("id", editingTransaction.id);

      if (error) {
        toast.error("Failed to update transaction");
        console.error(error);
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
        console.error(error);
      } else {
        toast.success("Transaction added");
        setTransactions([data, ...transactions]);
      }
    }

    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    const { error } = await supabase
      .from("fund_transactions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete transaction");
      console.error(error);
    } else {
      toast.success("Transaction deleted");
      setTransactions(transactions.filter(t => t.id !== id));
    }
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
      <main className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage fund transactions
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
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
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Transaction description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Member Support, Operations"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.transaction_type}
                        onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
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
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient Name (optional)</Label>
                      <Input
                        id="recipient"
                        value={formData.recipient_name}
                        onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                        placeholder="e.g., John D."
                      />
                    </div>
                    <Button onClick={handleSave} className="w-full" disabled={saving}>
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
                        No transactions yet. Add your first transaction above.
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
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(transaction)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(transaction.id)}
                            >
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
