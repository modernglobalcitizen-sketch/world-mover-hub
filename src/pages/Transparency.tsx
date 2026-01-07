import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Users } from "lucide-react";
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

const Transparency = () => {
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
      <main className="flex-1 py-16 md:py-24">
        <div className="container">
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-headline">
                Transparency Ledger
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Full visibility into how community funds are collected and distributed. Every contribution matters, and every transaction is recorded.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
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
                <h2 className="text-xl font-display font-semibold text-foreground">Transaction History</h2>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Transparency;
