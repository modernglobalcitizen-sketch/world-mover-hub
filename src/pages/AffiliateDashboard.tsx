import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, DollarSign, TrendingUp, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const AffiliateDashboard = () => {
  const [affiliate, setAffiliate] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: aff } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!aff) {
        setLoading(false);
        return;
      }

      setAffiliate(aff);

      const { data: salesData } = await supabase.rpc("get_affiliate_sales");

      if (salesData) setSales(salesData);
      setLoading(false);
    };

    load();
  }, [navigate]);

  const copyLink = () => {
    if (!affiliate) return;
    const url = `${window.location.origin}/ebooks?ref=${affiliate.referral_code}`;
    navigator.clipboard.writeText(url);
    toast.success("Your affiliate link has been copied!");
  };

  const totalEarned = sales.reduce((sum, s) => sum + s.commission_amount, 0);
  const totalPaid = sales.filter(s => s.status === "paid").reduce((sum, s) => sum + s.commission_amount, 0);
  const totalPending = sales.filter(s => s.status === "confirmed").reduce((sum, s) => sum + s.commission_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-16"><div className="container text-center text-muted-foreground">Loading...</div></main>
        <Footer />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-16">
          <div className="container max-w-lg mx-auto text-center space-y-4">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Affiliate Program</h1>
            <p className="text-muted-foreground">
              You're not currently registered as an affiliate. Contact us to join the program and start earning 50% commission on ebook sales!
            </p>
            <Button onClick={() => navigate("/contact")}>Contact Us</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold font-serif">Affiliate Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {affiliate.name}</p>
          </div>

          {/* Affiliate Link */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Your Affiliate Link</p>
                  <code className="text-sm bg-muted px-3 py-1.5 rounded block break-all">
                    {window.location.origin}/ebooks?ref={affiliate.referral_code}
                  </code>
                </div>
                <Button onClick={copyLink} className="gap-2">
                  <Copy className="h-4 w-4" /> Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Earned</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">${totalEarned.toFixed(2)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Paid Out</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-primary">${totalPaid.toFixed(2)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending Payout</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-destructive">${totalPending.toFixed(2)}</p></CardContent>
            </Card>
          </div>

          {/* Sales Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Ebook</TableHead>
                      <TableHead>Sale</TableHead>
                      <TableHead>Your Commission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{format(new Date(sale.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell>{sale.ebook_title}</TableCell>
                        <TableCell>${sale.sale_amount.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${sale.commission_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={sale.status === "paid" ? "default" : "secondary"}>
                            {sale.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sales.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No sales yet. Share your affiliate link to start earning!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDashboard;
