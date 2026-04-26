import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Users, CheckCircle, X, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const industries = [
  "Technology / IT",
  "Healthcare / Medical",
  "Finance / Banking",
  "Education / Teaching",
  "Engineering",
  "Marketing / Advertising",
  "Sales / Business Development",
  "Creative / Design",
  "Hospitality / Tourism",
  "Agriculture",
  "Construction",
  "Manufacturing",
  "Legal",
  "Non-Profit / NGO",
  "Government / Public Sector",
  "Energy / Green Energy",
  "Transportation / Logistics",
  "Media / Communications",
  "Retail / E-commerce",
  "Other",
];

const experienceLevels = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

const educationLevels = [
  "High School / GED",
  "Some College",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate / PhD",
  "Professional Certification",
  "Trade / Vocational Training",
];

const desiredRoleOptions = [
  "Remote Project Manager",
  "Software Developer / Engineer",
  "Data Analyst / Scientist",
  "Digital Marketing Specialist",
  "Customer Support / Success",
  "UX / UI Designer",
  "Content Writer / Copywriter",
  "Virtual Assistant",
  "Sales Representative",
  "HR / Recruiter",
  "Financial Analyst",
  "Healthcare Professional",
  "Teacher / Educator",
  "Operations Manager",
  "Other",
];


const TalentPool = () => {
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [roleDesiredOther, setRoleDesiredOther] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    industry: "",
    years_of_experience: "",
    role_current: "",
    role_desired: [] as string[],
    skills: "",
    education_level: "",
    linkedin_url: "",
    portfolio_url: "",
    salary_expectation: "",
    additional_notes: "",
  });

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("talent-pool")
      .upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from("talent-pool")
      .getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.industry || !formData.years_of_experience || !formData.education_level) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.role_desired.length === 0) {
      toast.error("Please select at least one desired role");
      return;
    }

    if (formData.role_desired.includes("Other") && !roleDesiredOther.trim()) {
      toast.error("Please specify your desired role for 'Other'");
      return;
    }

    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    if (!coverLetterFile) {
      toast.error("Please upload your cover letter");
      return;
    }

    setSubmitting(true);

    try {
      let resume_url = null;
      let cover_letter_url = null;

      if (resumeFile) {
        resume_url = await uploadFile(resumeFile, "resumes");
      }
      if (coverLetterFile) {
        cover_letter_url = await uploadFile(coverLetterFile, "cover-letters");
      }

      const { data: { session } } = await supabase.auth.getSession();

      const { error } = await supabase.from("talent_pool").insert({
        user_id: session?.user?.id ?? null,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        industry: formData.industry,
        years_of_experience: formData.years_of_experience,
        role_current: formData.role_current.trim() || null,
        role_desired: formData.role_desired.length > 0
          ? formData.role_desired.map(r => r === "Other" ? `Other: ${roleDesiredOther.trim()}` : r).join(", ")
          : null,
        skills: formData.skills.trim() || null,
        education_level: formData.education_level,
        work_authorization: "N/A",
        linkedin_url: formData.linkedin_url.trim() || null,
        portfolio_url: formData.portfolio_url.trim() || null,
        availability: "N/A",
        salary_expectation: formData.salary_expectation.trim() || null,
        resume_url,
        cover_letter_url,
        additional_notes: formData.additional_notes.trim() || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Your profile has been submitted to our talent pool!");
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 md:py-24">
          <div className="container max-w-2xl mx-auto text-center space-y-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <h1 className="text-3xl font-display font-bold text-headline">Thank You!</h1>
            <p className="text-lg text-muted-foreground">
              Your profile has been submitted to our talent pool. We'll review your information and get back to you within 48 business hours if there's a match for opportunities that fit your background.
            </p>
            <Button onClick={() => window.location.href = "/"}>Back to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Users className="h-4 w-4" />
              Join Our Talent Pool
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-headline">
              Submit Your Profile
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join our talent pool and get matched with international career opportunities. Upload your resume, tell us about your experience, and let us connect you with the right roles.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" required maxLength={255} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 8900" maxLength={20} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input id="linkedin" value={formData.linkedin_url} onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." maxLength={255} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio / Website</Label>
                  <Input id="portfolio" value={formData.portfolio_url} onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })} placeholder="https://yourwebsite.com" maxLength={255} />
                </div>
              </CardContent>
            </Card>

            {/* Work History */}
            <Card>
              <CardHeader>
                <CardTitle>Work History & Experience</CardTitle>
                <CardDescription>Help us understand your professional background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry *</Label>
                    <Select value={formData.industry} onValueChange={v => setFormData({ ...formData, industry: v })}>
                      <SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger>
                      <SelectContent>
                        {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience *</Label>
                    <Select value={formData.years_of_experience} onValueChange={v => setFormData({ ...formData, years_of_experience: v })}>
                      <SelectTrigger><SelectValue placeholder="Select experience" /></SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentRole">Current / Most Recent Role</Label>
                    <Input id="currentRole" value={formData.role_current} onChange={e => setFormData({ ...formData, role_current: e.target.value })} placeholder="e.g. Marketing Manager" maxLength={100} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Desired Role(s) *</Label>
                  {formData.role_desired.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.role_desired.map(role => (
                        <span key={role} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {role}
                          <button type="button" onClick={() => setFormData({ ...formData, role_desired: formData.role_desired.filter(r => r !== role) })}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {desiredRoleOptions.map(role => (
                      <label key={role} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent rounded px-1 py-0.5">
                        <Checkbox
                          checked={formData.role_desired.includes(role)}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              role_desired: checked
                                ? [...formData.role_desired, role]
                                : formData.role_desired.filter(r => r !== role),
                            });
                            if (role === "Other" && !checked) setRoleDesiredOther("");
                          }}
                        />
                        {role}
                      </label>
                    ))}
                  </div>
                  {formData.role_desired.includes("Other") && (
                    <Input
                      value={roleDesiredOther}
                      onChange={e => setRoleDesiredOther(e.target.value)}
                      placeholder="Please specify your desired role"
                      maxLength={100}
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Key Skills</Label>
                  <Textarea id="skills" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="List your top skills separated by commas (e.g. Project Management, Python, Digital Marketing)" maxLength={500} />
                </div>
                <div className="space-y-2">
                  <Label>Education Level *</Label>
                  <Select value={formData.education_level} onValueChange={v => setFormData({ ...formData, education_level: v })}>
                    <SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger>
                    <SelectContent>
                      {educationLevels.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>


            {/* File Uploads */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Upload your resume and cover letter (PDF, DOC, DOCX accepted)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume / CV *</Label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent transition-colors text-sm">
                      <Upload className="h-4 w-4" />
                      {resumeFile ? resumeFile.name : "Choose file"}
                      <input
                        id="resume"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={e => setResumeFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    {resumeFile && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setResumeFile(null)}>Remove</Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter *</Label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent transition-colors text-sm">
                      <Upload className="h-4 w-4" />
                      {coverLetterFile ? coverLetterFile.name : "Choose file"}
                      <input
                        id="coverLetter"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={e => setCoverLetterFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    {coverLetterFile && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setCoverLetterFile(null)}>Remove</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Anything else you'd like us to know?</Label>
                  <Textarea id="notes" value={formData.additional_notes} onChange={e => setFormData({ ...formData, additional_notes: e.target.value })} placeholder="Tell us about any special circumstances, preferences, or questions..." maxLength={1000} rows={4} />
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button type="submit" size="lg" disabled={submitting} className="px-12">
                {submitting ? "Submitting..." : "Submit to Talent Pool"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TalentPool;
