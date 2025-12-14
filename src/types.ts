export interface Group {
  id: string;
  name: string;
  admin_token: string;
  status: "open" | "matched" | "revealed";
  created_at: string;
}

export interface Participant {
  id: string;
  group_id: string;
  name: string;
  public_token: string;
  target_participant_id: string | null;
  created_at: string;
  revealed_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: Group;
        Insert: Omit<Group, "id" | "created_at">;
        Update: Partial<Omit<Group, "id" | "created_at">>;
      };
      participants: {
        Row: Participant;
        Insert: Omit<Participant, "id" | "created_at">;
        Update: Partial<Omit<Participant, "id" | "created_at">>;
      };
    };
    Functions: {
      create_raffle_group: {
        Args: {
          p_group_name: string;
          p_participant_names: string[];
        };
        Returns: {
          group_id: string;
          admin_token: string;
        };
      };
      get_group_by_admin_token: {
        Args: {
          p_admin_token: string;
        };
        Returns: Group[];
      };
      get_participants_by_admin_token: {
        Args: {
          p_admin_token: string;
        };
        Returns: Participant[];
      };
      get_my_match: {
        Args: {
          p_public_token: string;
        };
        Returns: {
          match_name: string;
        };
      };
      get_participants_public_list: {
        Args: {
          p_group_id: string;
        };
        Returns: {
          id: string;
          name: string;
        }[];
      };
      get_participant_token: {
        Args: {
          p_participant_id: string;
        };
        Returns: string;
      };
    };
  };
}
