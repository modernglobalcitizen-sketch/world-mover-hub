-- Create breakout rooms table (one per field)
CREATE TABLE public.breakout_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  field TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room messages table
CREATE TABLE public.room_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.breakout_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shared opportunities in rooms
CREATE TABLE public.room_shared_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.breakout_rooms(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.breakout_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_shared_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for breakout_rooms (authenticated users can view all rooms)
CREATE POLICY "Authenticated users can view rooms"
ON public.breakout_rooms FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for room_messages
CREATE POLICY "Authenticated users can view messages"
ON public.room_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can send messages"
ON public.room_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON public.room_messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for room_shared_opportunities
CREATE POLICY "Authenticated users can view shared opportunities"
ON public.room_shared_opportunities FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can share opportunities"
ON public.room_shared_opportunities FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can delete their shares"
ON public.room_shared_opportunities FOR DELETE
TO authenticated
USING (auth.uid() = shared_by);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_shared_opportunities;

-- Insert default rooms for each field
INSERT INTO public.breakout_rooms (name, field, description) VALUES
('Technology & IT Hub', 'Technology & IT', 'Connect with tech professionals and share opportunities'),
('Healthcare Network', 'Healthcare & Medicine', 'Network with healthcare professionals'),
('Education Circle', 'Education & Research', 'Collaborate with educators and researchers'),
('Business Forum', 'Business & Finance', 'Discuss business opportunities and trends'),
('Creative Collective', 'Arts & Creative', 'Share creative opportunities and projects'),
('Engineering Lab', 'Engineering', 'Connect with fellow engineers'),
('Science Hub', 'Science', 'Collaborate on scientific opportunities'),
('Legal & Policy Network', 'Law & Policy', 'Discuss policy and legal opportunities'),
('Impact Community', 'Non-profit & Social Impact', 'Connect for social good'),
('Green Network', 'Agriculture & Environment', 'Environmental and agricultural opportunities'),
('Media Hub', 'Media & Communications', 'Media and communications networking'),
('Open Forum', 'Other', 'General discussions and opportunities');