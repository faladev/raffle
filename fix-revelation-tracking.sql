-- Script para adicionar rastreamento de revelações
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Adicionar coluna revealed_at na tabela participants
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS revealed_at timestamptz;

-- 2. Atualizar função get_my_match para registrar a revelação
CREATE OR REPLACE FUNCTION get_my_match(p_public_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_match_name text;
  v_participant_id uuid;
BEGIN
  -- Get participant ID
  SELECT id INTO v_participant_id
  FROM participants
  WHERE public_token = p_public_token;

  -- Get match name
  SELECT p2.name INTO v_match_name
  FROM participants p1
  JOIN participants p2 ON p1.target_participant_id = p2.id
  WHERE p1.public_token = p_public_token;

  IF FOUND THEN
    -- Register that the participant revealed their match
    UPDATE participants
    SET revealed_at = NOW()
    WHERE id = v_participant_id
    AND revealed_at IS NULL; -- Only set once

    RETURN json_build_object('match_name', v_match_name);
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- 3. Atualizar função get_participants_by_admin_token para retornar revealed_at
DROP FUNCTION IF EXISTS get_participants_by_admin_token(uuid);

CREATE OR REPLACE FUNCTION get_participants_by_admin_token(p_admin_token uuid)
RETURNS TABLE (
  id uuid,
  name text,
  group_id uuid,
  public_token uuid,
  target_participant_id uuid,
  created_at timestamptz,
  revealed_at timestamptz
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
    p.created_at,
    p.revealed_at
  FROM participants p
  WHERE p.group_id = v_group_id
  ORDER BY p.created_at;
END;
$$;
