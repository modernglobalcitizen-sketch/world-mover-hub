import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MessageCircle, 
  Send, 
  Users, 
  Share2, 
  ArrowLeft,
  Loader2,
  Briefcase,
  ExternalLink
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  field: string;
  description: string;
}

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name: string | null;
    email: string | null;
  };
}

interface SharedOpportunity {
  id: string;
  room_id: string;
  opportunity_id: string;
  shared_by: string;
  message: string | null;
  created_at: string;
  opportunities?: {
    title: string;
    category: string;
    deadline: string | null;
  };
  profiles?: {
    display_name: string | null;
    email: string | null;
  };
}

interface Opportunity {
  id: string;
  title: string;
  category: string;
  deadline: string | null;
}

const BreakoutRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sharedOpportunities, setSharedOpportunities] = useState<SharedOpportunity[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>("");
  const [sharingOpportunity, setSharingOpportunity] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setUserProfile(profile);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("breakout_rooms")
        .select("*")
        .order("name");
      
      if (error) {
        toast({
          title: "Error loading rooms",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setRooms(data || []);
      }
      setLoading(false);
    };
    fetchRooms();
  }, [toast]);

  useEffect(() => {
    if (!selectedRoom) return;

    const fetchMessages = async () => {
      const { data: messagesData, error } = await supabase
        .from("room_messages")
        .select("*")
        .eq("room_id", selectedRoom.id)
        .order("created_at", { ascending: true });

      if (!error && messagesData) {
        // Fetch profiles for all unique user ids
        const userIds = [...new Set(messagesData.map(m => m.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, display_name, email")
          .in("id", userIds);
        
        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        
        const messagesWithProfiles = messagesData.map(msg => ({
          ...msg,
          profiles: profilesMap.get(msg.user_id) || null
        }));
        
        setMessages(messagesWithProfiles as Message[]);
      }
    };

    const fetchSharedOpportunities = async () => {
      const { data: sharedData, error } = await supabase
        .from("room_shared_opportunities")
        .select("*")
        .eq("room_id", selectedRoom.id)
        .order("created_at", { ascending: false });

      if (!error && sharedData) {
        // Fetch opportunities
        const oppIds = [...new Set(sharedData.map(s => s.opportunity_id))];
        const { data: oppsData } = await supabase
          .from("opportunities")
          .select("id, title, category, deadline")
          .in("id", oppIds);
        
        // Fetch profiles
        const userIds = [...new Set(sharedData.map(s => s.shared_by))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, display_name, email")
          .in("id", userIds);
        
        const oppsMap = new Map(oppsData?.map(o => [o.id, o]) || []);
        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        
        const sharedWithDetails = sharedData.map(shared => ({
          ...shared,
          opportunities: oppsMap.get(shared.opportunity_id) || null,
          profiles: profilesMap.get(shared.shared_by) || null
        }));
        
        setSharedOpportunities(sharedWithDetails as SharedOpportunity[]);
      }
    };

    fetchMessages();
    fetchSharedOpportunities();

    // Subscribe to realtime messages
    const messagesChannel = supabase
      .channel(`room-messages-${selectedRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${selectedRoom.id}`,
        },
        async (payload) => {
          const newMsg = payload.new as any;
          // Fetch the profile for this user
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, display_name, email")
            .eq("id", newMsg.user_id)
            .single();
          
          const messageWithProfile = {
            ...newMsg,
            profiles: profileData || null
          };
          
          setMessages((prev) => [...prev, messageWithProfile as Message]);
        }
      )
      .subscribe();

    // Subscribe to shared opportunities
    const opportunitiesChannel = supabase
      .channel(`room-opportunities-${selectedRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_shared_opportunities",
          filter: `room_id=eq.${selectedRoom.id}`,
        },
        async (payload) => {
          const newShared = payload.new as any;
          
          // Fetch opportunity details
          const { data: oppData } = await supabase
            .from("opportunities")
            .select("id, title, category, deadline")
            .eq("id", newShared.opportunity_id)
            .single();
          
          // Fetch profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, display_name, email")
            .eq("id", newShared.shared_by)
            .single();
          
          const sharedWithDetails = {
            ...newShared,
            opportunities: oppData || null,
            profiles: profileData || null
          };
          
          setSharedOpportunities((prev) => [sharedWithDetails as SharedOpportunity, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(opportunitiesChannel);
    };
  }, [selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchOpportunities = async () => {
    const { data } = await supabase
      .from("opportunities")
      .select("id, title, category, deadline")
      .eq("is_active", true)
      .order("title");
    setOpportunities(data || []);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || !user) return;

    setSendingMessage(true);
    const { error } = await supabase.from("room_messages").insert({
      room_id: selectedRoom.id,
      user_id: user.id,
      content: newMessage.trim(),
    });

    if (error) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
    setSendingMessage(false);
  };

  const handleShareOpportunity = async () => {
    if (!selectedOpportunityId || !selectedRoom || !user) return;

    setSharingOpportunity(true);
    const { error } = await supabase.from("room_shared_opportunities").insert({
      room_id: selectedRoom.id,
      opportunity_id: selectedOpportunityId,
      shared_by: user.id,
      message: shareMessage.trim() || null,
    });

    if (error) {
      toast({
        title: "Failed to share opportunity",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Opportunity shared!",
        description: "The opportunity has been shared with the room.",
      });
      setShareDialogOpen(false);
      setShareMessage("");
      setSelectedOpportunityId("");
    }
    setSharingOpportunity(false);
  };

  const getUserDisplayName = (profiles: { display_name: string | null; email: string | null } | undefined) => {
    if (!profiles) return "Anonymous";
    return profiles.display_name || profiles.email?.split("@")[0] || "Anonymous";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!selectedRoom ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                Breakout Rooms
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with professionals in your field, share opportunities, and grow together.
                {userProfile?.field_of_work && (
                  <span className="block mt-2">
                    Your field: <Badge variant="secondary">{userProfile.field_of_work}</Badge>
                  </span>
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card 
                  key={room.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                    userProfile?.field_of_work === room.field ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                    <Badge variant="outline">{room.field}</Badge>
                    {userProfile?.field_of_work === room.field && (
                      <Badge className="ml-2" variant="default">Your Field</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" onClick={() => setSelectedRoom(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {selectedRoom.name}
                </h1>
                <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chat Section */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Chat
                      </CardTitle>
                      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              fetchOpportunities();
                              setShareDialogOpen(true);
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Opportunity
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Share an Opportunity</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Select Opportunity</label>
                              <select
                                className="w-full p-2 border rounded-md bg-background"
                                value={selectedOpportunityId}
                                onChange={(e) => setSelectedOpportunityId(e.target.value)}
                              >
                                <option value="">Choose an opportunity...</option>
                                {opportunities.map((opp) => (
                                  <option key={opp.id} value={opp.id}>
                                    {opp.title} ({opp.category})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Add a message (optional)</label>
                              <Input
                                placeholder="Why you're sharing this..."
                                value={shareMessage}
                                onChange={(e) => setShareMessage(e.target.value)}
                              />
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={handleShareOpportunity}
                              disabled={!selectedOpportunityId || sharingOpportunity}
                            >
                              {sharingOpportunity ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Share2 className="h-4 w-4 mr-2" />
                              )}
                              Share
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No messages yet. Start the conversation!</p>
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${
                                msg.user_id === user?.id ? "items-end" : "items-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.user_id === user?.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p className="text-xs font-medium mb-1 opacity-70">
                                  {msg.user_id === user?.id ? "You" : getUserDisplayName(msg.profiles)}
                                </p>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <span className="text-xs text-muted-foreground mt-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sendingMessage}
                      />
                      <Button type="submit" disabled={sendingMessage || !newMessage.trim()}>
                        {sendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Shared Opportunities Section */}
              <div>
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Shared Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full p-4">
                      <div className="space-y-4">
                        {sharedOpportunities.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <Share2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p className="text-sm">No opportunities shared yet.</p>
                          </div>
                        ) : (
                          sharedOpportunities.map((shared) => (
                            <Card key={shared.id} className="p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">
                                    {shared.opportunities?.title}
                                  </h4>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {shared.opportunities?.category}
                                  </Badge>
                                  {shared.message && (
                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                      "{shared.message}"
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Shared by {getUserDisplayName(shared.profiles)}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="shrink-0"
                                  onClick={() => navigate("/opportunities")}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BreakoutRooms;