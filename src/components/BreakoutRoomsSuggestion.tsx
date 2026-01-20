import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, ArrowRight, Lock, Globe } from "lucide-react";

interface Room {
  id: string;
  name: string;
  field: string;
  description: string | null;
  is_private: boolean;
  created_by: string | null;
}

interface BreakoutRoomsSuggestionProps {
  userField: string | null;
  userId: string;
}

const BreakoutRoomsSuggestion = ({ userField, userId }: BreakoutRoomsSuggestionProps) => {
  const navigate = useNavigate();
  const [suggestedRooms, setSuggestedRooms] = useState<Room[]>([]);
  const [userRoomIds, setUserRoomIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch rooms the user is already a member of
      const { data: memberData } = await supabase
        .from("room_members")
        .select("room_id")
        .eq("user_id", userId);

      const memberRoomIds = new Set(memberData?.map(m => m.room_id) || []);

      // Fetch rooms created by the user
      const { data: createdData } = await supabase
        .from("breakout_rooms")
        .select("id")
        .eq("created_by", userId);

      createdData?.forEach(r => memberRoomIds.add(r.id));
      setUserRoomIds(memberRoomIds);

      // Fetch public rooms matching user's field
      if (userField) {
        const { data: rooms } = await supabase
          .from("breakout_rooms")
          .select("*")
          .eq("is_private", false)
          .ilike("field", `%${userField}%`)
          .limit(3);

        // Filter out rooms user is already in
        const filteredRooms = (rooms || []).filter(r => !memberRoomIds.has(r.id));
        setSuggestedRooms(filteredRooms);
      }

      setLoading(false);
    };

    fetchData();
  }, [userField, userId]);

  if (loading || suggestedRooms.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-soft border-blue-500/20 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Suggested Breakout Rooms
        </CardTitle>
        <CardDescription>
          Join rooms in your field: <span className="font-medium text-foreground">{userField}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestedRooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background border gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{room.name}</h4>
                  <Badge variant="outline" className="gap-1">
                    <Globe className="h-3 w-3" />
                    Public
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{room.field}</p>
                {room.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {room.description}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => navigate("/breakout-rooms")}
                className="gap-1 shrink-0"
              >
                <Users className="h-4 w-4" />
                Join
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          className="w-full mt-4 gap-2"
          onClick={() => navigate("/breakout-rooms")}
        >
          View All Breakout Rooms
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BreakoutRoomsSuggestion;
