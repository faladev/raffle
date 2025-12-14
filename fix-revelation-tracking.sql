-- Script para adicionar rastreamento de revelações
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Criar tabela de logs de revelação
CREATE TABLE IF NOT EXISTS revelation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT NOW(),
  ip_address text,
  user_agent text,
  device_info jsonb
);

-- Index para busca rápida por participante
CREATE INDEX IF NOT EXISTS idx_revelation_logs_participant ON revelation_logs(participant_id);

-- 2. Adicionar coluna revealed_at na tabela participants (primeira visualização)
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS revealed_at timestamptz;

-- Adicionar coluna para contar visualizações
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- 3. Atualizar função get_my_match para registrar a revelação com logs
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

  -- Get match name
  SELECT p2.name INTO v_match_name
  FROM participants p1
  JOIN participants p2 ON p1.target_participant_id = p2.id
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

    -- Insert log entry
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

    RETURN json_build_object('match_name', v_match_name);
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- 4. Atualizar função get_participants_by_admin_token para retornar revealed_at e view_count
DROP FUNCTION IF EXISTS get_participants_by_admin_token(uuid);

CREATE OR REPLACE FUNCTION get_participants_by_admin_token(p_admin_token uuid)
RETURNS TABLE (
  id uuid,
  name text,
  group_id uuid,
  public_token uuid,
  target_participant_id uuid,
  created_at timestamptz,
  revealed_at timestamptz,
  view_count integer
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
    p.revealed_at,
    COALESCE(p.view_count, 0) as view_count
  FROM participants p
  WHERE p.group_id = v_group_id
  ORDER BY p.created_at;
END;
$$;

-- 5. Criar função para buscar logs de visualização de um participante
CREATE OR REPLACE FUNCTION get_revelation_logs(p_participant_id uuid)
RETURNS TABLE (
  id uuid,
  viewed_at timestamptz,
  ip_address text,
  user_agent text,
  device_info jsonb
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    viewed_at,
    ip_address,
    user_agent,
    device_info
  FROM revelation_logs
  WHERE participant_id = p_participant_id
  ORDER BY viewed_at DESC;
$$;

-- 6. Habilitar RLS na tabela revelation_logs
ALTER TABLE revelation_logs ENABLE ROW LEVEL SECURITY;

-- Criar policy que nega tudo (usamos RPCs com security definer)
CREATE POLICY "Deny all revelation_logs" ON revelation_logs FOR ALL USING (false);
