import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const STATUS_OPTIONS = ["new", "contacted", "intro made", "closed"] as const;

interface IntroRequest {
  id: string;
  talent_id: string;
  requester_name: string;
  requester_email: string;
  requester_company: string | null;
  message: string;
  status: string;
  created_at: string;
}

const TalentIntroRequestsAdmin = () => {
  const [rows, setRows] = useState<IntroRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("talent_intro_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load intro requests");
    else setRows((data as IntroRequest[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("talent_intro_requests").update({ status }).eq("id", id);
    if (error) toast.error("Failed to update");
    else {
      setRows(rows.map(r => r.id === id ? { ...r, status } : r));
      toast.success("Updated");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this intro request?")) return;
    const { error } = await supabase.from("talent_intro_requests").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      setRows(rows.filter(r => r.id !== id));
      toast.success("Deleted");
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted": return "bg-purple-100 text-purple-800 border-purple-200";
      case "intro made": return "bg-green-100 text-green-800 border-green-200";
      case "closed": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "";
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading…</div>;
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">No intro requests yet.</p>;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requester</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Talent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="font-medium">{r.requester_name}</div>
                <a href={`mailto:${r.requester_email}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {r.requester_email}
                </a>
              </TableCell>
              <TableCell className="text-sm">{r.requester_company || "—"}</TableCell>
              <TableCell className="text-sm max-w-md whitespace-pre-wrap">{r.message}</TableCell>
              <TableCell>
                <Link
                  to={`/admin?tab=talent-pool&highlight=${r.talent_id}`}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  View profile <ExternalLink className="h-3 w-3" />
                </Link>
              </TableCell>
              <TableCell>
                <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue>
                      <Badge className={statusColor(r.status)}>{r.status}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-sm">{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TalentIntroRequestsAdmin;
