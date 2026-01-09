import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Save, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const fields = [
  "Technology & IT",
  "Healthcare & Medicine",
  "Education & Research",
  "Business & Finance",
  "Arts & Creative",
  "Engineering",
  "Science",
  "Law & Policy",
  "Non-profit & Social Impact",
  "Agriculture & Environment",
  "Media & Communications",
  "Other"
];

const opportunityTypes = [
  { id: "grant", label: "Grants & Funding" },
  { id: "competition", label: "Competitions" },
  { id: "internship", label: "Internships" },
  { id: "training", label: "Training & Workshops" },
  { id: "conference", label: "Conferences & Events" },
];

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria",
  "Bangladesh", "Belarus", "Belgium", "Bolivia", "Brazil", "Bulgaria", "Cambodia",
  "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia",
  "Cuba", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Germany", "Ghana",
  "Greece", "Guatemala", "Haiti", "Honduras", "Hungary", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Libya", "Lithuania",
  "Malaysia", "Mexico", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Nigeria", "North Korea", "Norway", "Pakistan", "Panama", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia",
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia", "Turkey",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

interface ProfileData {
  display_name: string | null;
  country: string;
  field_of_work: string | null;
  opportunity_interests: string[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    display_name: "",
    country: "",
    field_of_work: "",
    opportunity_interests: [],
  });
  const [customInterest, setCustomInterest] = useState("");

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
    const fetchProfile = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, country, field_of_work, opportunity_interests")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        return;
      }

      if (data) {
        const interests = data.opportunity_interests || [];
        const standardInterests = interests.filter((i: string) => 
          opportunityTypes.some(t => t.id === i)
        );
        const customInterests = interests.filter((i: string) => 
          !opportunityTypes.some(t => t.id === i)
        );

        setProfile({
          display_name: data.display_name || "",
          country: data.country || "",
          field_of_work: data.field_of_work || "",
          opportunity_interests: standardInterests,
        });

        if (customInterests.length > 0) {
          setCustomInterest(customInterests.join(", "));
        }
      }
    };

    fetchProfile();
  }, [session]);

  const handleInterestToggle = (interestId: string, checked: boolean) => {
    if (checked) {
      setProfile(prev => ({
        ...prev,
        opportunity_interests: [...prev.opportunity_interests, interestId]
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        opportunity_interests: prev.opportunity_interests.filter(i => i !== interestId)
      }));
    }
  };

  const handleSave = async () => {
    if (!session) return;

    setSaving(true);

    // Build final interests array
    const finalInterests = customInterest.trim()
      ? [...profile.opportunity_interests, ...customInterest.split(",").map(s => s.trim()).filter(Boolean)]
      : profile.opportunity_interests;

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name?.trim() || null,
        country: profile.country,
        field_of_work: profile.field_of_work || null,
        opportunity_interests: finalInterests,
      })
      .eq("id", session.user.id);

    if (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated successfully!");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-2xl">
          <div className="space-y-6 animate-fade-in">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>

            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                My Profile
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage your personal information and preferences
              </p>
            </div>

            {/* Profile Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile details and opportunity preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.display_name || ""}
                    onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Enter your display name"
                  />
                  <p className="text-sm text-muted-foreground">
                    This name will be shown publicly if you're a founding member
                  </p>
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={session?.user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={profile.country} 
                    onValueChange={(value) => setProfile(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Field of Work */}
                <div className="space-y-2">
                  <Label htmlFor="fieldOfWork">Field of Work</Label>
                  <Select 
                    value={profile.field_of_work || ""} 
                    onValueChange={(value) => setProfile(prev => ({ ...prev, field_of_work: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Opportunity Interests */}
                <div className="space-y-3">
                  <Label>Opportunity Interests</Label>
                  <p className="text-sm text-muted-foreground">
                    Select the types of opportunities you're interested in
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opportunityTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${type.id}`}
                          checked={profile.opportunity_interests.includes(type.id)}
                          onCheckedChange={(checked) => handleInterestToggle(type.id, !!checked)}
                        />
                        <label
                          htmlFor={`interest-${type.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Interests */}
                  <div className="pt-2">
                    <Label htmlFor="customInterest">Other Interests</Label>
                    <Input
                      id="customInterest"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      placeholder="e.g., Fellowships, Scholarships (comma-separated)"
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
