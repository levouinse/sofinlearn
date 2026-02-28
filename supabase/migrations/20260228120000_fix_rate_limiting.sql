-- Fix rate limiting to use updated_at instead of created_at
DROP TRIGGER IF EXISTS rate_limit_trigger ON public.leaderboard;
DROP FUNCTION IF EXISTS check_update_rate_limit();

CREATE OR REPLACE FUNCTION check_update_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if last update was less than 1 second ago using updated_at
  IF EXISTS (
    SELECT 1 FROM public.leaderboard
    WHERE player_name = NEW.player_name
    AND updated_at > NOW() - INTERVAL '1 second'
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before updating again.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rate_limit_trigger
  BEFORE INSERT OR UPDATE ON public.leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION check_update_rate_limit();
