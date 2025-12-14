-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Groups Table
create table groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  admin_token uuid default gen_random_uuid(),
  status text default 'open', -- 'open', 'matched', 'revealed'
  created_at timestamptz default now()
);

-- 2. Participants Table
create table participants (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  name text not null,
  public_token uuid default gen_random_uuid(),
  target_participant_id uuid references participants(id),
  created_at timestamptz default now()
);

-- Indexes
create index idx_participants_group on participants(group_id);
create index idx_participants_token on participants(public_token);
create index idx_groups_admin_token on groups(admin_token);

-- Disable RLS on tables (we will use RPCs for security)
alter table groups enable row level security;
alter table participants enable row level security;

-- Create policies that deny everything by default (since we use RPCs with security definer)
create policy "Deny all groups" on groups for all using (false);
create policy "Deny all participants" on participants for all using (false);


-- RPC: Create Raffle Group
create or replace function create_raffle_group(
  p_group_name text,
  p_participant_names text[]
)
returns json
language plpgsql security definer
as $$
declare
  v_group_id uuid;
  v_admin_token uuid;
  v_participant_name text;
  v_participant_ids uuid[];
  v_shuffled_ids uuid[];
  i int;
begin
  -- Create Group
  insert into groups (name)
  values (p_group_name)
  returning id, admin_token into v_group_id, v_admin_token;

  -- Create Participants
  foreach v_participant_name in array p_participant_names
  loop
    insert into participants (group_id, name)
    values (v_group_id, v_participant_name);
  end loop;

  -- Perform Matching (Simple Shuffle)
  -- Note: This is a simple shuffle. A robust secret santa needs to ensure no one picks themselves.
  -- For simplicity in SQL, we will try a simple offset shift.
  
  -- Get all IDs again to be sure
  select array_agg(id) into v_participant_ids from participants where group_id = v_group_id;
  
  -- Shuffle
  select array_agg(id order by random()) into v_shuffled_ids from unnest(v_participant_ids) as id;
  
  -- Assign targets (Chain: 1->2, 2->3, ..., N->1)
  for i in 1..array_length(v_shuffled_ids, 1) loop
    update participants
    set target_participant_id = 
      case 
        when i = array_length(v_shuffled_ids, 1) then v_shuffled_ids[1]
        else v_shuffled_ids[i+1]
      end
    where id = v_shuffled_ids[i];
  end loop;

  -- Update group status
  update groups set status = 'matched' where id = v_group_id;

  return json_build_object('group_id', v_group_id, 'admin_token', v_admin_token);
end;
$$;

-- RPC: Get Group by Admin Token
create or replace function get_group_by_admin_token(p_admin_token uuid)
returns setof groups
language sql security definer
as $$
  select * from groups where admin_token = p_admin_token;
$$;

-- RPC: Get Participants by Admin Token
create or replace function get_participants_by_admin_token(p_admin_token uuid)
returns table (
  id uuid,
  name text,
  status text
)
language plpgsql security definer
as $$
declare
  v_group_id uuid;
begin
  select id into v_group_id from groups where admin_token = p_admin_token;
  
  return query
  select p.id, p.name, 'matched'::text as status
  from participants p
  where p.group_id = v_group_id;
end;
$$;

-- RPC: Get Participants Public List (for selection screen)
create or replace function get_participants_public_list(p_group_id uuid)
returns table (
  id uuid,
  name text
)
language sql security definer
as $$
  select id, name from participants where group_id = p_group_id;
$$;

-- RPC: Get Participant Token (Login)
create or replace function get_participant_token(p_participant_id uuid)
returns uuid
language sql security definer
as $$
  select public_token from participants where id = p_participant_id;
$$;

-- RPC: Get My Match (Reveal)
create or replace function get_my_match(p_public_token uuid)
returns json
language plpgsql security definer
as $$
declare
  v_match_name text;
begin
  select p2.name into v_match_name
  from participants p1
  join participants p2 on p1.target_participant_id = p2.id
  where p1.public_token = p_public_token;

  if found then
    return json_build_object('match_name', v_match_name);
  else
    return null;
  end if;
end;
$$;
