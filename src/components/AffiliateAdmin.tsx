import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Copy, Check, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Affiliate {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  commission_rate: number;
  is_active: boolean;
  user_id: string | null;
  created_at: string;
}

interface AffiliateSale {
  id: string;
  affiliate_id: string;
  ebook_title: string;
  sale_amount: number;
  commission_amount: number;
  status: string;
  buyer_email: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
}

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const AffiliateAdmin = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [sales, setSales] = useState<AffiliateSale[]>([]);
  const [loading, setLoading] = useState(true);

  // Affiliate dialog
  const [affDialogOpen, setAffDialogOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [affForm, setAffForm] = useState({ name: "", email: "", referral_code: "", commission_rate: 0.5 });

  // Sale dialog
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    affiliate_id: "",
    ebook_title: "",
    sale_amount: 25,
    buyer_email: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [affResult, salesResult] = await Promise.all([
      supabase.from("affiliates").select("*").order("created_at", { ascending: false }),
      supabase.from("affiliate_sales").select("*").order("created_at", { ascending: false }),
    ]);
    if (affResult.data) setAffiliates(affResult.data as Affiliate[]);
    if (salesResult.data) setSales(salesResult.data as AffiliateSale[]);
    setLoading(false);
  };

  const handleOpenAffDialog = (affiliate?: Affiliate) => {
    if (affiliate) {
      setEditingAffiliate(affiliate);
      setAffForm({
        name: affiliate.name,
        email: affiliate.email,
        referral_code: affiliate.referral_code,
        commission_rate: affiliate.commission_rate,
      });
    } else {
      setEditingAffiliate(null);
      setAffForm({ name: "", email: "", referral_code: generateCode(), commission_rate: 0.5 });
    }
    setAffDialogOpen(true);
  };

  const handleSaveAffiliate = async () => {
    if (!affForm.name || !affForm.email || !affForm.referral_code) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);

    const data = {
      name: affForm.name,
      email: affForm.email,
      referral_code: affForm.referral_code.toUpperCase(),
      commission_rate: affForm.commission_rate,
    };

    if (editingAffiliate) {
      const { error } = await supabase.from("affiliates").update(data).eq("id", editingAffiliate.id);
      if (error) toast.error("Failed to update affiliate");
      else {
        toast.success("Affiliate updated");
        setAffiliates(affiliates.map(a => a.id === editingAffiliate.id ? { ...a, ...data } : a));
      }
    } else {
      const { data: newAff, error } = await supabase.from("affiliates").insert(data).select().single();
      if (error) toast.error(error.message);
      else {
        toast.success("Affiliate added");
        setAffiliates([newAff as Affiliate, ...affiliates]);
      }
    }
    setSaving(false);
    setAffDialogOpen(false);
  };

  const handleDeleteAffiliate = async (id: string) => {
    if (!confirm("Delete this affiliate and all their sales records?")) return;
    const { error } = await supabase.from("affiliates").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Affiliate deleted");
      setAffiliates(affiliates.filter(a => a.id !== id));
      setSales(sales.filter(s => s.affiliate_id !== id));
    }
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from("affiliates").update({ is_active }).eq("id", id);
    if (!error) setAffiliates(affiliates.map(a => a.id === id ? { ...a, is_active } : a));
  };

  const handleRecordSale = async () => {
    if (!saleForm.affiliate_id || !saleForm.ebook_title) {
      toast.error("Select an affiliate and ebook");
      return;
    }
    setSaving(true);
    const affiliate = affiliates.find(a => a.id === saleForm.affiliate_id);
    const commission = saleForm.sale_amount * (affiliate?.commission_rate || 0.5);

    const { data, error } = await supabase.from("affiliate_sales").insert({
      affiliate_id: saleForm.affiliate_id,
      ebook_title: saleForm.ebook_title,
      sale_amount: saleForm.sale_amount,
      commission_amount: commission,
      buyer_email: saleForm.buyer_email || null,
      notes: saleForm.notes || null,
      status: "confirmed",
    }).select().single();

    if (error) toast.error(error.message);
    else {
      toast.success(`Sale recorded — $${commission.toFixed(2)} commission`);
      setSales([data as AffiliateSale, ...sales]);
      setSaleDialogOpen(false);
      setSaleForm({ affiliate_id: "", ebook_title: "", sale_amount: 25, buyer_email: "", notes: "" });
    }
    setSaving(false);
  };

  const handleMarkPaid = async (saleId: string) => {
    const { error } = await supabase.from("affiliate_sales").update({
      status: "paid",
      paid_at: new Date().toISOString(),
    }).eq("id", saleId);
    if (!error) {
      setSales(sales.map(s => s.id === saleId ? { ...s, status: "paid", paid_at: new Date().toISOString() } : s));
      toast.success("Marked as paid");
    }
  };

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/ebooks?ref=${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Affiliate link copied!");
  };

  const totalCommissionOwed = sales
    .filter(s => s.status === "confirmed")
    .reduce((sum, s) => sum + s.commission_amount, 0);

  const totalPaid = sales
    .filter(s => s.status === "paid")
    .reduce((sum, s) => sum + s.commission_amount, 0);

  if (loading) return <div className="text-muted-foreground">Loading affiliates...</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Affiliates</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{affiliates.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Commission Owed</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-destructive">${totalCommissionOwed.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Paid Out</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-primary">${totalPaid.toFixed(2)}</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="affiliates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
          <TabsTrigger value="sales">
            Sales
            {sales.filter(s => s.status === "confirmed").length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">{sales.filter(s => s.status === "confirmed").length} unpaid</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Affiliates Tab */}
        <TabsContent value="affiliates" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button onClick={() => handleOpenAffDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Affiliate
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map((aff) => {
                  const affSales = sales.filter(s => s.affiliate_id === aff.id);
                  const totalEarned = affSales.reduce((sum, s) => sum + s.commission_amount, 0);
                  return (
                    <TableRow key={aff.id}>
                      <TableCell className="font-medium">{aff.name}</TableCell>
                      <TableCell>{aff.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{aff.referral_code}</code>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyLink(aff.referral_code)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{(aff.commission_rate * 100).toFixed(0)}%</TableCell>
                      <TableCell>{affSales.length} (${totalEarned.toFixed(2)})</TableCell>
                      <TableCell>
                        <Badge variant={aff.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleActive(aff.id, !aff.is_active)}>
                          {aff.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenAffDialog(aff)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAffiliate(aff.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {affiliates.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No affiliates yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setSaleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Record Sale
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Ebook</TableHead>
                  <TableHead>Sale</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => {
                  const aff = affiliates.find(a => a.id === sale.affiliate_id);
                  return (
                    <TableRow key={sale.id}>
                      <TableCell>{format(new Date(sale.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>{aff?.name || "Unknown"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{sale.ebook_title}</TableCell>
                      <TableCell>${sale.sale_amount.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">${sale.commission_amount.toFixed(2)}</TableCell>
                      <TableCell>{sale.buyer_email || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={sale.status === "paid" ? "default" : sale.status === "confirmed" ? "secondary" : "outline"}>
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {sale.status === "confirmed" && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkPaid(sale.id)}>
                            <Check className="h-3 w-3 mr-1" /> Mark Paid
                          </Button>
                        )}
                        {sale.status === "paid" && sale.paid_at && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(sale.paid_at), "MMM d")}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sales.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No sales recorded yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Affiliate Dialog */}
      <Dialog open={affDialogOpen} onOpenChange={setAffDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAffiliate ? "Edit Affiliate" : "Add Affiliate"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={affForm.name} onChange={(e) => setAffForm({ ...affForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={affForm.email} onChange={(e) => setAffForm({ ...affForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Referral Code</Label>
              <div className="flex gap-2">
                <Input value={affForm.referral_code} onChange={(e) => setAffForm({ ...affForm, referral_code: e.target.value.toUpperCase() })} />
                <Button variant="outline" type="button" onClick={() => setAffForm({ ...affForm, referral_code: generateCode() })}>
                  Generate
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Commission Rate</Label>
              <Select value={String(affForm.commission_rate)} onValueChange={(v) => setAffForm({ ...affForm, commission_rate: parseFloat(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">10%</SelectItem>
                  <SelectItem value="0.2">20%</SelectItem>
                  <SelectItem value="0.3">30%</SelectItem>
                  <SelectItem value="0.4">40%</SelectItem>
                  <SelectItem value="0.5">50%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSaveAffiliate} disabled={saving}>
              {saving ? "Saving..." : editingAffiliate ? "Update" : "Add Affiliate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record Sale Dialog */}
      <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Affiliate Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Affiliate</Label>
              <Select value={saleForm.affiliate_id} onValueChange={(v) => setSaleForm({ ...saleForm, affiliate_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select affiliate" /></SelectTrigger>
                <SelectContent>
                  {affiliates.filter(a => a.is_active).map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ebook</Label>
              <Select value={saleForm.ebook_title} onValueChange={(v) => setSaleForm({ ...saleForm, ebook_title: v })}>
                <SelectTrigger><SelectValue placeholder="Select ebook" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Your International Guide to Work, Volunteer, and Travel">International Guide ($25)</SelectItem>
                  <SelectItem value="Top Countries for Work Visas">Work Visas Guide ($25)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sale Amount ($)</Label>
              <Input type="number" value={saleForm.sale_amount} onChange={(e) => setSaleForm({ ...saleForm, sale_amount: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>Buyer Email (optional)</Label>
              <Input type="email" value={saleForm.buyer_email} onChange={(e) => setSaleForm({ ...saleForm, buyer_email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input value={saleForm.notes} onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })} />
            </div>
            {saleForm.affiliate_id && (
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p>Commission: <strong>${(saleForm.sale_amount * (affiliates.find(a => a.id === saleForm.affiliate_id)?.commission_rate || 0.5)).toFixed(2)}</strong></p>
              </div>
            )}
            <Button className="w-full" onClick={handleRecordSale} disabled={saving}>
              {saving ? "Recording..." : "Record Sale"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliateAdmin;
