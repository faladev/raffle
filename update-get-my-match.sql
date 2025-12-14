-- Atualização da função get_my_match para incluir o nome do grupo
-- Execute este script no SQL Editor do Supabase Dashboard

CREATE OR REPLACE FUNCTION get_my_match(
  p_public_token uuid,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_device_info jsonb DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_match_name text;
  v_group_name text;
  v_participant_id uuid;
  v_is_first_view boolean;
BEGIN
  -- Get participant ID
  SELECT id INTO v_participant_id
  FROM participants
  WHERE public_token = p_public_token;

  IF v_participant_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get match name and group name
  SELECT p2.name, g.name INTO v_match_name, v_group_name
  FROM participants p1
  JOIN participants p2 ON p1.target_participant_id = p2.id
  JOIN groups g ON p1.group_id = g.id
  WHERE p1.public_token = p_public_token;

  IF FOUND THEN
    -- Check if this is the first view
    SELECT (revealed_at IS NULL) INTO v_is_first_view
    FROM participants
    WHERE id = v_participant_id;

    -- Update participant record
    UPDATE participants
    SET 
      revealed_at = COALESCE(revealed_at, NOW()),
      view_count = view_count + 1
    WHERE id = v_participant_id;

    -- Insert log entry (only if revelation_logs table exists)
    INSERT INTO revelation_logs (
      participant_id,
      ip_address,
      user_agent,
      device_info
    ) VALUES (
      v_participant_id,
      p_ip_address,
      p_user_agent,
      p_device_info
    );

    RETURN json_build_object('match_name', v_match_name, 'group_name', v_group_name);
  ELSE
    RETURN NULL;
  END IF;
END;
$$;
