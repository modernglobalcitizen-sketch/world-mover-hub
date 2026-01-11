import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  ExternalLink,
  Plus,
  Lock,
  Globe,
  UserPlus,
  UserMinus,
  Circle,
  Crown
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  field: string;
  description: string;
  is_private: boolean;
  created_by: string | null;
  max_members: number | null;
}

interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: {
    display_name: string | null;
    email: string | null;
  };
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

interface PresenceState {
  [key: string]: {
    user_id: string;
    display_name: string;
    online_at: string;
  }[];
}

const FIELD_OPTIONS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "Legal",
  "Engineering",
  "Arts & Design",
  "Consulting",
  "Research",
  "Other"
];

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
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomField, setNewRoomField] = useState("");
  const [newRoomMaxMembers, setNewRoomMaxMembers] = useState(10);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const presenceChannelRef = useRef<any>(null);
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
        .order("is_private", { ascending: true })
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

  // Presence tracking for the selected room
  useEffect(() => {
    if (!selectedRoom || !user || !userProfile) return;

    const channelName = `presence-room-${selectedRoom.id}`;
    const presenceChannel = supabase.channel(channelName);
    presenceChannelRef.current = presenceChannel;

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState() as PresenceState;
        const onlineUserIds = new Set<string>();
        Object.values(state).forEach((presences) => {
          presences.forEach((presence) => {
            onlineUserIds.add(presence.user_id);
          });
        });
        setOnlineUsers(onlineUserIds);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          newPresences.forEach((p: any) => updated.add(p.user_id));
          return updated;
        });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          leftPresences.forEach((p: any) => updated.delete(p.user_id));
          return updated;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            display_name: userProfile?.display_name || userProfile?.email?.split('@')[0] || 'Anonymous',
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      presenceChannel.unsubscribe();
      presenceChannelRef.current = null;
    };
  }, [selectedRoom, user, userProfile]);

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

    const fetchRoomMembers = async () => {
      if (!selectedRoom.is_private) {
        setRoomMembers([]);
        return;
      }
      
      const { data: membersData, error } = await supabase
        .from("room_members")
        .select("*")
        .eq("room_id", selectedRoom.id)
        .order("joined_at", { ascending: true });

      if (!error && membersData) {
        const userIds = [...new Set(membersData.map(m => m.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, display_name, email")
          .in("id", userIds);
        
        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        
        const membersWithProfiles = membersData.map(member => ({
          ...member,
          profiles: profilesMap.get(member.user_id) || null
        }));
        
        setRoomMembers(membersWithProfiles as RoomMember[]);
      }
    };

    fetchMessages();
    fetchSharedOpportunities();
    fetchRoomMembers();

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

    // Subscribe to room members changes (for private rooms)
    const membersChannel = supabase
      .channel(`room-members-${selectedRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_members",
          filter: `room_id=eq.${selectedRoom.id}`,
        },
        () => {
          fetchRoomMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(opportunitiesChannel);
      supabase.removeChannel(membersChannel);
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

  const fetchAllProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, email")
      .order("display_name");
    setAllProfiles(data || []);
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

  const handleCreatePrivateRoom = async () => {
    if (!newRoomName.trim() || !newRoomField || !user) return;

    setCreatingRoom(true);
    
    // Create the private room
    const { data: roomData, error: roomError } = await supabase
      .from("breakout_rooms")
      .insert({
        name: newRoomName.trim(),
        description: newRoomDescription.trim() || null,
        field: newRoomField,
        is_private: true,
        created_by: user.id,
        max_members: newRoomMaxMembers,
      })
      .select()
      .single();

    if (roomError) {
      toast({
        title: "Failed to create room",
        description: roomError.message,
        variant: "destructive",
      });
      setCreatingRoom(false);
      return;
    }

    // Add creator as a member with 'owner' role
    await supabase.from("room_members").insert({
      room_id: roomData.id,
      user_id: user.id,
      role: "owner",
    });

    toast({
      title: "Room created!",
      description: "Your private room has been created successfully.",
    });

    // Refresh rooms list
    const { data: updatedRooms } = await supabase
      .from("breakout_rooms")
      .select("*")
      .order("is_private", { ascending: true })
      .order("name");
    setRooms(updatedRooms || []);

    setCreateRoomDialogOpen(false);
    setNewRoomName("");
    setNewRoomDescription("");
    setNewRoomField("");
    setNewRoomMaxMembers(10);
    setCreatingRoom(false);
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !selectedRoom || !user) return;

    setInviting(true);

    // Find user by email
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", inviteEmail.trim().toLowerCase())
      .single();

    if (profileError || !profileData) {
      toast({
        title: "User not found",
        description: "No user found with that email address.",
        variant: "destructive",
      });
      setInviting(false);
      return;
    }

    // Check if already a member
    const existingMember = roomMembers.find(m => m.user_id === profileData.id);
    if (existingMember) {
      toast({
        title: "Already a member",
        description: "This user is already a member of this room.",
        variant: "destructive",
      });
      setInviting(false);
      return;
    }

    // Check max members
    if (selectedRoom.max_members && roomMembers.length >= selectedRoom.max_members) {
      toast({
        title: "Room is full",
        description: `This room has reached its maximum of ${selectedRoom.max_members} members.`,
        variant: "destructive",
      });
      setInviting(false);
      return;
    }

    // Check if already invited
    const { data: existingInvite } = await supabase
      .from("room_invitations")
      .select("id, status")
      .eq("room_id", selectedRoom.id)
      .eq("invited_user_id", profileData.id)
      .single();

    if (existingInvite) {
      toast({
        title: existingInvite.status === "pending" ? "Already invited" : "Previously invited",
        description: existingInvite.status === "pending" 
          ? "This user already has a pending invitation."
          : `This user has already ${existingInvite.status} an invitation.`,
        variant: "destructive",
      });
      setInviting(false);
      return;
    }

    // Create invitation instead of direct membership
    const { error: inviteError } = await supabase.from("room_invitations").insert({
      room_id: selectedRoom.id,
      invited_by: user.id,
      invited_user_id: profileData.id,
      status: "pending",
    });

    if (inviteError) {
      toast({
        title: "Failed to send invitation",
        description: inviteError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Invitation sent!",
        description: "The user will be notified and can accept or decline from their dashboard.",
      });
      setInviteDialogOpen(false);
      setInviteEmail("");
    }
    setInviting(false);
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (!selectedRoom || !user) return;

    // Can't remove owner
    const member = roomMembers.find(m => m.id === memberId);
    if (member?.role === "owner") {
      toast({
        title: "Cannot remove owner",
        description: "The room owner cannot be removed.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("room_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      toast({
        title: "Failed to remove member",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Member removed",
        description: "The member has been removed from the room.",
      });
    }
  };

  const handleLeaveRoom = async () => {
    if (!selectedRoom || !user) return;

    const { error } = await supabase
      .from("room_members")
      .delete()
      .eq("room_id", selectedRoom.id)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Failed to leave room",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Left room",
        description: "You have left the private room.",
      });
      setSelectedRoom(null);
      
      // Refresh rooms list
      const { data: updatedRooms } = await supabase
        .from("breakout_rooms")
        .select("*")
        .order("is_private", { ascending: true })
        .order("name");
      setRooms(updatedRooms || []);
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom || !user || selectedRoom.created_by !== user.id) return;

    const { error } = await supabase
      .from("breakout_rooms")
      .delete()
      .eq("id", selectedRoom.id);

    if (error) {
      toast({
        title: "Failed to delete room",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Room deleted",
        description: "The private room has been deleted.",
      });
      setSelectedRoom(null);
      
      // Refresh rooms list
      const { data: updatedRooms } = await supabase
        .from("breakout_rooms")
        .select("*")
        .order("is_private", { ascending: true })
        .order("name");
      setRooms(updatedRooms || []);
    }
  };

  const getUserDisplayName = (profiles: { display_name: string | null; email: string | null } | undefined) => {
    if (!profiles) return "Anonymous";
    return profiles.display_name || profiles.email?.split("@")[0] || "Anonymous";
  };

  const isRoomOwner = selectedRoom?.created_by === user?.id;
  const publicRooms = rooms.filter(r => !r.is_private);
  const privateRooms = rooms.filter(r => r.is_private);

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

            {/* Create Private Room Button */}
            <div className="flex justify-end mb-6">
              <Dialog open={createRoomDialogOpen} onOpenChange={setCreateRoomDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Private Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Private Room</DialogTitle>
                    <DialogDescription>
                      Create a private breakout room for focused group discussions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Room Name *</label>
                      <Input
                        placeholder="e.g., Tech Leadership Circle"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        placeholder="Describe what this room is about..."
                        value={newRoomDescription}
                        onChange={(e) => setNewRoomDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Field *</label>
                      <select
                        className="w-full p-2 border rounded-md bg-background"
                        value={newRoomField}
                        onChange={(e) => setNewRoomField(e.target.value)}
                      >
                        <option value="">Select a field...</option>
                        {FIELD_OPTIONS.map((field) => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Members</label>
                      <Input
                        type="number"
                        min={2}
                        max={50}
                        value={newRoomMaxMembers}
                        onChange={(e) => setNewRoomMaxMembers(parseInt(e.target.value) || 10)}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleCreatePrivateRoom}
                      disabled={!newRoomName.trim() || !newRoomField || creatingRoom}
                    >
                      {creatingRoom ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Lock className="h-4 w-4 mr-2" />
                      )}
                      Create Private Room
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Public Rooms */}
            <div className="mb-12">
              <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                <Globe className="h-6 w-6 text-muted-foreground" />
                Public Rooms
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicRooms.map((room) => (
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
            </div>

            {/* Private Rooms */}
            {privateRooms.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                  Private Rooms
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {privateRooms.map((room) => (
                    <Card 
                      key={room.id} 
                      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                      onClick={() => setSelectedRoom(room)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            {room.name}
                          </CardTitle>
                          {room.created_by === user?.id && (
                            <Crown className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{room.field}</Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Max {room.max_members}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedRoom(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                    {selectedRoom.is_private && <Lock className="h-5 w-5" />}
                    {selectedRoom.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                </div>
              </div>
              
              {/* Online Users Indicator */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                  <span>{onlineUsers.size} online</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
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
                                <div className="flex items-center gap-2 mb-1">
                                  {onlineUsers.has(msg.user_id) && (
                                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                                  )}
                                  <p className="text-xs font-medium opacity-70">
                                    {msg.user_id === user?.id ? "You" : getUserDisplayName(msg.profiles)}
                                  </p>
                                </div>
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

              {/* Members Section (for private rooms) / Online Users (for public rooms) */}
              <div>
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {selectedRoom.is_private ? "Members" : "Online"}
                      </CardTitle>
                      {selectedRoom.is_private && isRoomOwner && (
                        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Invite Member</DialogTitle>
                              <DialogDescription>
                                Add a member to your private room by their email address.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Email Address</label>
                                <Input
                                  type="email"
                                  placeholder="member@example.com"
                                  value={inviteEmail}
                                  onChange={(e) => setInviteEmail(e.target.value)}
                                />
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={handleInviteMember}
                                disabled={!inviteEmail.trim() || inviting}
                              >
                                {inviting ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <UserPlus className="h-4 w-4 mr-2" />
                                )}
                                Invite
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full p-4">
                      {selectedRoom.is_private ? (
                        <div className="space-y-2">
                          {roomMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-xs font-medium">
                                      {getUserDisplayName(member.profiles).charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  {onlineUsers.has(member.user_id) && (
                                    <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium flex items-center gap-1">
                                    {getUserDisplayName(member.profiles)}
                                    {member.role === "owner" && (
                                      <Crown className="h-3 w-3 text-amber-500" />
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {member.role}
                                  </p>
                                </div>
                              </div>
                              {isRoomOwner && member.user_id !== user?.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleRemoveMember(member.id, member.user_id)}
                                >
                                  <UserMinus className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          ))}
                          
                          {/* Room Actions */}
                          <div className="pt-4 mt-4 border-t space-y-2">
                            {!isRoomOwner && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-destructive"
                                onClick={handleLeaveRoom}
                              >
                                Leave Room
                              </Button>
                            )}
                            {isRoomOwner && (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full"
                                onClick={handleDeleteRoom}
                              >
                                Delete Room
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-4">
                            {onlineUsers.size} {onlineUsers.size === 1 ? 'user' : 'users'} online in this room
                          </p>
                          {Array.from(onlineUsers).map((userId) => (
                            <div
                              key={userId}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                            >
                              <div className="relative">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                                </div>
                              </div>
                              <p className="text-sm">
                                {userId === user?.id ? "You" : "Anonymous User"}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
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
