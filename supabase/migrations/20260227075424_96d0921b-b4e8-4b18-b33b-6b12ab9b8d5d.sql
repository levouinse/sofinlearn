
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL UNIQUE,
  total_score INTEGER NOT NULL DEFAULT 0,
  badge TEXT DEFAULT 'none',
  frame TEXT DEFAULT 'none',
  name_effect TEXT DEFAULT 'none',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard"
ON public.leaderboard
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert to leaderboard"
ON public.leaderboard
FOR INSERT
WITH CHECK (true);

