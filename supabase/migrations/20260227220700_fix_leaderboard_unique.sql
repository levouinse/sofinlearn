-- Remove old unique constraint
DROP INDEX IF EXISTS idx_leaderboard_player_unique;

-- Add new unique constraint on player_name only
CREATE UNIQUE INDEX idx_leaderboard_player_name ON public.leaderboard (player_name);

-- Update policy to allow updates
DROP POLICY IF EXISTS "Anyone can insert to leaderboard" ON public.leaderboard;

CREATE POLICY "Anyone can insert or update leaderboard"
ON public.leaderboard
FOR ALL
USING (true)
WITH CHECK (true);
