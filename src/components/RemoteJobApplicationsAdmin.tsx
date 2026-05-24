import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Mail, FileText } from "lucide-react";

const STATUS_OPTIONS = ["new", "viewed", "contacted", "on hold", "resolved"] as const;
import { toast } from "sonner";
import { format } from "date-fns";
import { openTalentPoolFile } from "@/lib/talentPoolFiles";

interface JobApplication {
  id: string;
  name: string;
  email: string;
  details: string | null;
  status: string;
  created_at: string;
  resume_url: string | null;
  country: string | null;
}

const RemoteJobApplicationsAdmin = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("remote_job_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load applications");
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("remote_job_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
      toast.success("Status updated");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const { error } = await supabase
      .from("remote_job_applications")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      setApplications(applications.filter(a => a.id !== id));
      toast.success("Application deleted");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "viewed": return "bg-slate-100 text-slate-800 border-slate-200";
      case "contacted": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "on hold": return "bg-orange-100 text-orange-800 border-orange-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      default: return "";
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  if (applications.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No applications yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {applications.filter(a => a.status === "new").length} new application(s)
        </p>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell>
                  <a href={`mailto:${app.email}`} className="text-primary hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {app.email}
                  </a>
                </TableCell>
                <TableCell className="text-sm">{app.country || "—"}</TableCell>
                <TableCell>
                  {app.resume_url ? (
                    <button type="button" onClick={() => openTalentPoolFile(app.resume_url)} className="text-primary hover:underline inline-flex items-center gap-1 text-sm">
                      <FileText className="h-3 w-3" />
                      View
                    </button>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[400px] whitespace-pre-wrap break-words text-sm">{app.details || "—"}</TableCell>
                <TableCell>
                  <Select value={app.status} onValueChange={(v) => handleUpdateStatus(app.id, v)}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue>
                        <Badge className={statusColor(app.status)}>{app.status}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm">{format(new Date(app.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(app.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RemoteJobApplicationsAdmin;
