-- Add indexes for cosmetic filtering (future-proofing)
-- These indexes will help if we add features to filter leaderboard by cosmetics

CREATE INDEX IF NOT EXISTS idx_leaderboard_badge ON public.leaderboard (badge) WHERE badge != 'none';
CREATE INDEX IF NOT EXISTS idx_leaderboard_frame ON public.leaderboard (frame) WHERE frame != 'none';
CREATE INDEX IF NOT EXISTS idx_leaderboard_name_effect ON public.leaderboard (name_effect) WHERE name_effect != 'none';

-- Composite index for common query pattern (score + cosmetics)
CREATE INDEX IF NOT EXISTS idx_leaderboard_score_badge ON public.leaderboard (total_score DESC, badge) WHERE badge != 'none';

-- Analyze table to update query planner statistics
ANALYZE public.leaderboard;

COMMENT ON INDEX idx_leaderboard_badge IS 'Partial index for filtering by badge (excludes none)';
COMMENT ON INDEX idx_leaderboard_frame IS 'Partial index for filtering by frame (excludes none)';
COMMENT ON INDEX idx_leaderboard_name_effect IS 'Partial index for filtering by name effect (excludes none)';
