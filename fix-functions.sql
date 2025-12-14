-- Script para corrigir todas as funções RPC no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Corrigir create_raffle_group
CREATE OR REPLACE FUNCTION create_raffle_group(
  p_group_name text,
  p_participant_names text[]
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_group_id uuid;
  v_admin_token uuid;
  v_participant_name text;
  v_participant_ids uuid[];
  v_shuffled_ids uuid[];
  i int;
BEGIN
  -- Create Group
  INSERT INTO groups (name)
  VALUES (p_group_name)
  RETURNING id, admin_token INTO v_group_id, v_admin_token;

  -- Create Participants
  FOREACH v_participant_name IN ARRAY p_participant_names
  LOOP
    INSERT INTO participants (group_id, name)
    VALUES (v_group_id, v_participant_name);
  END LOOP;

  -- Get all participant IDs
  SELECT array_agg(id) INTO v_participant_ids 
  FROM participants 
  WHERE group_id = v_group_id;
  
  -- Shuffle
  SELECT array_agg(id ORDER BY random()) INTO v_shuffled_ids 
  FROM unnest(v_participant_ids) AS id;
  
  -- Assign targets (Chain: 1->2, 2->3, ..., N->1)
  FOR i IN 1..array_length(v_shuffled_ids, 1) LOOP
    UPDATE participants
    SET target_participant_id = 
      CASE 
        WHEN i = array_length(v_shuffled_ids, 1) THEN v_shuffled_ids[1]
        ELSE v_shuffled_ids[i+1]
      END
    WHERE id = v_shuffled_ids[i];
  END LOOP;

  -- Update group status
  UPDATE groups SET status = 'matched' WHERE id = v_group_id;

  RETURN json_build_object('group_id', v_group_id, 'admin_token', v_admin_token);
END;
$$;

-- 2. Corrigir get_participants_by_admin_token
DROP FUNCTION IF EXISTS get_participants_by_admin_token(uuid);

CREATE OR REPLACE FUNCTION get_participants_by_admin_token(p_admin_token uuid)
RETURNS TABLE (
  id uuid,
  name text,
  group_id uuid,
  public_token uuid,
  target_participant_id uuid,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_group_id uuid;
BEGIN
  -- Get group_id from admin_token
  SELECT g.id INTO v_group_id 
  FROM groups g 
  WHERE g.admin_token = p_admin_token;
  
  -- Return all participants for this group
  RETURN QUERY
  SELECT 
    p.id, 
    p.name,
    p.group_id,
    p.public_token,
    p.target_participant_id,
    p.created_at
  FROM participants p
  WHERE p.group_id = v_group_id;
END;
$$;
