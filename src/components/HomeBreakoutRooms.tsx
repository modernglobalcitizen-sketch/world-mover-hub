import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Users, ArrowRight, Globe, Briefcase, LogIn } from "lucide-react";

interface Room {
  id: string;
  name: string;
  field: string;
  description: string | null;
  is_private: boolean;
}

const FIELD_COLORS: Record<string, string> = {
  "Technology": "bg-blue-500/10 text-blue-600",
  "Healthcare": "bg-green-500/10 text-green-600",
  "Finance": "bg-amber-500/10 text-amber-600",
  "Education": "bg-purple-500/10 text-purple-600",
  "Marketing": "bg-pink-500/10 text-pink-600",
  "Legal": "bg-slate-500/10 text-slate-600",
  "Engineering": "bg-orange-500/10 text-orange-600",
  "Arts & Design": "bg-rose-500/10 text-rose-600",
  "Consulting": "bg-teal-500/10 text-teal-600",
  "Research": "bg-indigo-500/10 text-indigo-600",
};

const HomeBreakoutRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase
        .from("breakout_rooms")
        .select("id, name, field, description, is_private")
        .eq("is_private", false)
        .order("created_at", { ascending: false })
        .limit(6);

      setRooms(data || []);
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (room: Room) => {
    if (isAuthenticated) {
      navigate("/breakout-rooms");
    } else {
      setSelectedRoom(room);
      setShowLoginPrompt(true);
    }
  };

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    navigate("/auth", { state: { returnTo: "/breakout-rooms" } });
  };

  if (loading) {
    return null;
  }

  if (rooms.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 gap-1">
            <MessageCircle className="h-3 w-3" />
            Community
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline mb-4">
            Join Breakout Rooms
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with professionals in your field, share opportunities, and build meaningful relationships
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
              onClick={() => handleRoomClick(room)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {room.name}
                  </CardTitle>
                  <Badge variant="outline" className="shrink-0 gap-1">
                    <Globe className="h-3 w-3" />
                    Public
                  </Badge>
                </div>
                <Badge 
                  className={`w-fit gap-1 ${FIELD_COLORS[room.field] || "bg-muted text-muted-foreground"}`}
                >
                  <Briefcase className="h-3 w-3" />
                  {room.field}
                </Badge>
              </CardHeader>
              <CardContent>
                {room.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {room.description}
                  </p>
                )}
                <Button variant="ghost" size="sm" className="gap-2 group-hover:bg-primary/10">
                  <Users className="h-4 w-4" />
                  Join Room
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => isAuthenticated ? navigate("/breakout-rooms") : setShowLoginPrompt(true)}
            className="gap-2"
          >
            View All Breakout Rooms
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Join the Conversation
            </DialogTitle>
            <DialogDescription>
              {selectedRoom 
                ? `Sign in or create an account to join "${selectedRoom.name}" and connect with other professionals in ${selectedRoom.field}.`
                : "Sign in or create an account to access breakout rooms and connect with professionals in your field."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={handleLoginClick} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In / Sign Up
            </Button>
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HomeBreakoutRooms;
