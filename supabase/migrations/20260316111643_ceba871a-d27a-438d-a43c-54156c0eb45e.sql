
-- Add unique constraints to prevent duplicate votes
CREATE UNIQUE INDEX IF NOT EXISTS votes_user_post_unique ON public.votes (user_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS votes_user_comment_unique ON public.votes (user_id, comment_id) WHERE comment_id IS NOT NULL;

-- Atomic vote function that handles insert/update/delete and score recalculation
CREATE OR REPLACE FUNCTION public.toggle_vote(
  p_user_id uuid,
  p_target_type text,  -- 'post' or 'comment'
  p_target_id uuid,
  p_value smallint     -- 1 or -1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_existing_value smallint;
  v_existing_id uuid;
  v_diff int;
BEGIN
  -- Find existing vote
  IF p_target_type = 'post' THEN
    SELECT id, value INTO v_existing_id, v_existing_value
    FROM votes WHERE user_id = p_user_id AND post_id = p_target_id;
  ELSE
    SELECT id, value INTO v_existing_id, v_existing_value
    FROM votes WHERE user_id = p_user_id AND comment_id = p_target_id;
  END IF;

  IF v_existing_id IS NOT NULL THEN
    IF v_existing_value = p_value THEN
      -- Same vote => remove it
      DELETE FROM votes WHERE id = v_existing_id;
      v_diff := -p_value;
    ELSE
      -- Different vote => flip it
      UPDATE votes SET value = p_value WHERE id = v_existing_id;
      v_diff := p_value * 2;
    END IF;
  ELSE
    -- New vote
    IF p_target_type = 'post' THEN
      INSERT INTO votes (user_id, post_id, value) VALUES (p_user_id, p_target_id, p_value);
    ELSE
      INSERT INTO votes (user_id, comment_id, value) VALUES (p_user_id, p_target_id, p_value);
    END IF;
    v_diff := p_value;
  END IF;

  -- Update target score atomically
  IF p_target_type = 'post' THEN
    UPDATE posts SET votes = votes + v_diff WHERE id = p_target_id;
  ELSE
    UPDATE comments SET votes = votes + v_diff WHERE id = p_target_id;
  END IF;
END;
$$;
