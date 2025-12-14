import type { Group, Participant } from "../types";
import { supabase } from "./supabase";

// Helper types for RPC returns
type CreateRaffleResult = {
  group_id: string;
  admin_token: string;
};

type MatchResult = {
  match_name: string;
};

type ParticipantPublic = {
  id: string;
  name: string;
};

// Typed RPC calls
export async function createRaffleGroup(
  groupName: string,
  participantNames: string[],
): Promise<CreateRaffleResult> {
  // @ts-expect-error - Supabase types are not properly inferred
  const { data, error } = await supabase.rpc("create_raffle_group", {
    p_group_name: groupName,
    p_participant_names: participantNames,
  });

  if (error) throw error;
  if (!data) throw new Error("No data returned");

  return data as CreateRaffleResult;
}

export async function getGroupByAdminToken(adminToken: string): Promise<Group> {
  // @ts-expect-error - Supabase types are not properly inferred
  const { data, error } = await supabase.rpc("get_group_by_admin_token", {
    p_admin_token: adminToken,
  });

  if (error) throw error;
  if (!data || (data as Group[]).length === 0) {
    throw new Error("Group not found");
  }

  return (data as Group[])[0];
}

export async function getParticipantsByAdminToken(
  adminToken: string,
): Promise<Participant[]> {
  const { data, error } = await supabase.rpc(
    "get_participants_by_admin_token",
    // @ts-expect-error - Supabase types are not properly inferred
    {
      p_admin_token: adminToken,
    },
  );

  if (error) throw error;
  return (data as Participant[]) || [];
}

export async function getParticipantsPublicList(
  groupId: string,
): Promise<ParticipantPublic[]> {
  // @ts-expect-error - Supabase types are not properly inferred
  const { data, error } = await supabase.rpc("get_participants_public_list", {
    p_group_id: groupId,
  });

  if (error) throw error;
  return (data as ParticipantPublic[]) || [];
}

export async function getParticipantToken(
  participantId: string,
): Promise<string> {
  // @ts-expect-error - Supabase types are not properly inferred
  const { data, error } = await supabase.rpc("get_participant_token", {
    p_participant_id: participantId,
  });

  if (error) throw error;
  if (!data) throw new Error("No token found");

  return data as string;
}

export async function getMyMatch(publicToken: string): Promise<string> {
  // @ts-expect-error - Supabase types are not properly inferred
  const { data, error } = await supabase.rpc("get_my_match", {
    p_public_token: publicToken,
  });

  if (error) throw error;
  if (!data) throw new Error("Match not found");

  return (data as MatchResult).match_name;
}
