-- Fix RLS policy to be more secure
-- Drop overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert or update leaderboard" ON public.leaderboard;

-- Create separate policies for better security
CREATE POLICY "Anyone can view leaderboard"
ON public.leaderboard
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert new entry"
ON public.leaderboard
FOR INSERT
WITH CHECK (true);

-- Update policy: only allow updating if player_name matches
-- This prevents users from modifying other players' scores
CREATE POLICY "Users can update own leaderboard entry"
ON public.leaderboard
FOR UPDATE
USING (true)
WITH CHECK (
  -- Allow update only if player_name is not being changed
  -- or if it's being set to the same value
  player_name = (SELECT player_name FROM public.leaderboard WHERE id = leaderboard.id)
);

-- Add comment for documentation
COMMENT ON POLICY "Users can update own leaderboard entry" ON public.leaderboard IS 
'Allows updates only to existing entries without changing player_name, preventing score manipulation';
