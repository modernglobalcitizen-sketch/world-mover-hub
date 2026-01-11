import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Loader2, Lock, Globe } from "lucide-react";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  field: string;
  is_private: boolean;
}

interface ShareOpportunityDialogProps {
  opportunityId: string;
  opportunityTitle: string;
  trigger?: React.ReactNode;
}

const ShareOpportunityDialog = ({ opportunityId, opportunityTitle, trigger }: ShareOpportunityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [sharing, setSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    checkAuth();
  }, []);

  const fetchRooms = async () => {
    if (!userId) return;
    
    setLoading(true);
    
    // Fetch all public rooms and private rooms user is a member of
    const { data: allRooms, error: roomsError } = await supabase
      .from("breakout_rooms")
      .select("id, name, field, is_private")
      .order("name");

    if (roomsError) {
      console.error("Error fetching rooms:", roomsError);
      setLoading(false);
      return;
    }

    // For private rooms, check membership
    const { data: memberships } = await supabase
      .from("room_members")
      .select("room_id")
      .eq("user_id", userId);

    const memberRoomIds = new Set(memberships?.map(m => m.room_id) || []);

    // Filter: show public rooms + private rooms user is member of
    const accessibleRooms = (allRooms || []).filter(room => 
      !room.is_private || memberRoomIds.has(room.id)
    );

    setRooms(accessibleRooms);
    setLoading(false);
  };

  const handleShare = async () => {
    if (!selectedRoomId || !userId) return;

    setSharing(true);
    const { error } = await supabase.from("room_shared_opportunities").insert({
      room_id: selectedRoomId,
      opportunity_id: opportunityId,
      shared_by: userId,
      message: shareMessage.trim() || null,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("This opportunity has already been shared to this room");
      } else {
        toast.error("Failed to share opportunity");
        console.error(error);
      }
    } else {
      const roomName = rooms.find(r => r.id === selectedRoomId)?.name || "the room";
      toast.success(`Shared to ${roomName}!`);
      setOpen(false);
      setShareMessage("");
      setSelectedRoomId("");
    }
    setSharing(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchRooms();
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share to Breakout Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">{opportunityTitle}</p>
          </div>

          <div className="space-y-2">
            <Label>Select a Room</Label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <p>No rooms available.</p>
                <p className="mt-1">Join a breakout room first to share opportunities.</p>
              </div>
            ) : (
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
              >
                <option value="">Choose a room...</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.is_private ? "🔒 " : "🌐 "}{room.name} ({room.field})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="share-message">Add a message (optional)</Label>
            <Input
              id="share-message"
              placeholder="Why you're sharing this..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleShare}
            disabled={!selectedRoomId || sharing}
          >
            {sharing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Share2 className="h-4 w-4 mr-2" />
            )}
            Share Opportunity
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareOpportunityDialog;
