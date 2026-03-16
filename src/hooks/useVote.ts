import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useVote(type: "post" | "comment", targetId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const key = ["vote", type, targetId, user?.id];

  const { data: userVote } = useQuery({
    queryKey: key,
    queryFn: async () => {
      if (!user) return null;
      const col = type === "post" ? "post_id" : "comment_id";
      const { data } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", user.id)
        .eq(col, targetId)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const vote = useMutation({
    mutationFn: async (value: 1 | -1) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.rpc("toggle_vote", {
        p_user_id: user.id,
        p_target_type: type,
        p_target_id: targetId,
        p_value: value,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: type === "post" ? ["posts"] : ["comments"] });
      qc.invalidateQueries({ queryKey: [type, targetId] });
      if (type === "post") qc.invalidateQueries({ queryKey: ["post", targetId] });
    },
  });

  return { userVote, vote: vote.mutate, isPending: vote.isPending };
}
