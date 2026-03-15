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
      const col = type === "post" ? "post_id" : "comment_id";

      if (userVote) {
        if (userVote.value === value) {
          // Remove vote
          await supabase.from("votes").delete().eq("id", userVote.id);
          // Update target score
          const table = type === "post" ? "posts" : "comments";
          const { data: target } = await supabase.from(table).select("votes").eq("id", targetId).single();
          if (target) {
            await supabase.from(table).update({ votes: target.votes - value }).eq("id", targetId);
          }
        } else {
          // Change vote
          await supabase.from("votes").update({ value }).eq("id", userVote.id);
          const table = type === "post" ? "posts" : "comments";
          const { data: target } = await supabase.from(table).select("votes").eq("id", targetId).single();
          if (target) {
            await supabase.from(table).update({ votes: target.votes + value * 2 }).eq("id", targetId);
          }
        }
      } else {
        // New vote
        const insertData: Record<string, unknown> = {
          user_id: user.id,
          value,
          [col]: targetId,
        };
        await supabase.from("votes").insert(insertData as any);
        const table = type === "post" ? "posts" : "comments";
        const { data: target } = await supabase.from(table).select("votes").eq("id", targetId).single();
        if (target) {
          await supabase.from(table).update({ votes: target.votes + value }).eq("id", targetId);
        }
      }
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
