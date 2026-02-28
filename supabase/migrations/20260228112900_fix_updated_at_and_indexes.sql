-- Add missing updated_at column with auto-update trigger
ALTER TABLE public.leaderboard 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.leaderboard;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fix misleading index name (was idx_leaderboard_updated_at but used created_at)
DROP INDEX IF EXISTS idx_leaderboard_updated_at;
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON public.leaderboard (created_at DESC);

-- Drop overlapping index (idx_leaderboard_score is enough, composite index too specific)
DROP INDEX IF EXISTS idx_leaderboard_score_cosmetics;

-- Ensure main indexes exist
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard (total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_player_name ON public.leaderboard (player_name);

-- Update existing rows to have updated_at = created_at
UPDATE public.leaderboard SET updated_at = created_at WHERE updated_at IS NULL;

-- Analyze table for query planner
ANALYZE public.leaderboard;
