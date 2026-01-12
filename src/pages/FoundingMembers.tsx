import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, Globe, Star, Rocket, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FoundingMember {
  id: string;
  country: string;
  founding_member_number: number | null;
  display_name: string | null;
  created_at: string;
}

const FoundingMembers = () => {
  const [members, setMembers] = useState<FoundingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; hasDisplayName: boolean; isFoundingMember: boolean } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, display_name, is_founding_member")
          .eq("id", session.user.id)
          .single();
        
        if (profile) {
          setCurrentUser({
            id: profile.id,
            hasDisplayName: !!profile.display_name && profile.display_name.trim() !== "",
            isFoundingMember: profile.is_founding_member
          });
        }
      }
    };
    checkCurrentUser();
  }, []);

  useEffect(() => {
    const fetchFoundingMembers = async () => {
      // Use the secure RPC function that excludes email addresses
      const { data, error } = await supabase.rpc("get_founding_members_public");

      if (!error && data) {
        setMembers(data);
      }
      setLoading(false);
    };

    fetchFoundingMembers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 mb-6">
              <Crown className="h-4 w-4" />
              <span className="text-sm font-medium">Exclusive First 100</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-headline mb-4">
              Founding Members
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              These pioneers were the first to believe in our mission. As founding members, 
              they have exclusive first access to the community fund and special benefits.
            </p>
            <Button variant="hero" size="lg" className="group" asChild>
              <Link to="/auth">
                <Rocket className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Become a Founding Member
              </Link>
            </Button>
          </div>

          {/* Display Name Prompt for Founding Members */}
          {currentUser?.isFoundingMember && !currentUser?.hasDisplayName && (
            <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
              <UserCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-foreground">
                  <strong>Set your display name!</strong> As a founding member, your name will appear on this public page. 
                  Add a display name to personalize your listing.
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4 shrink-0"
                  onClick={() => navigate("/profile")}
                >
                  Update Profile
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <Card className="shadow-soft text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                    <Crown className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-headline">{members.length}</p>
                <p className="text-sm text-muted-foreground">Founding Members</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-headline">{100 - members.length}</p>
                <p className="text-sm text-muted-foreground">Spots Remaining</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-headline">
                  {new Set(members.map(m => m.country)).size}
                </p>
                <p className="text-sm text-muted-foreground">Countries Represented</p>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <Card className="shadow-soft mb-12 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-600" />
                Founding Member Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-foreground">First Access to Fund</p>
                    <p className="text-sm text-muted-foreground">Priority consideration for community fund support</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-foreground">Exclusive Badge</p>
                    <p className="text-sm text-muted-foreground">Permanent founding member recognition</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-foreground">Community Voting Rights</p>
                    <p className="text-sm text-muted-foreground">Vote on major fund decisions and initiatives</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold mt-0.5">4</div>
                  <div>
                    <p className="font-medium text-foreground">Legacy Recognition</p>
                    <p className="text-sm text-muted-foreground">Featured on our founding members wall forever</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Members List */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>The First 100</CardTitle>
              <CardDescription>
                Our founding members in order of joining
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading founding members...
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Be the first founding member!</p>
                  <p className="text-sm mt-2">Sign up now to claim your spot.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 font-bold text-sm">
                        #{member.founding_member_number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">
                          {member.display_name || `Founding Member #${member.founding_member_number}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {member.country}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FoundingMembers;