import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["comment-profiles", postId],
    queryFn: async () => {
      const userIds = [...new Set(comments.map((c) => c.user_id))];
      if (userIds.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);
      if (error) throw error;
      return data;
    },
    enabled: comments.length > 0,
  });

  const addComment = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user!.id,
        content: text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const getProfile = (userId: string) =>
    profiles.find((p) => p.user_id === userId);

  return (
    <div className="mt-4">
      <div className="bg-card rounded-lg p-6">
        <h3 className="font-heading text-[18px] font-bold mb-4">
          Комментарии ({comments.length})
        </h3>

        {user ? (
          <div className="mb-6">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Написать комментарий..."
              className="mb-2"
            />
            <Button
              size="sm"
              onClick={() => addComment.mutate()}
              disabled={!text.trim() || addComment.isPending}
            >
              Отправить
            </Button>
          </div>
        ) : (
          <p className="text-[13px] text-muted-foreground mb-4">
            <a href="/auth" className="text-link hover:underline">Войдите</a>, чтобы оставить комментарий
          </p>
        )}

        <div className="space-y-4">
          {comments.map((comment) => {
            const profile = getProfile(comment.user_id);
            return (
              <div key={comment.id} className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                    {profile?.username?.slice(0, 2).toUpperCase() || "??"}
                  </div>
                  <span className="text-[13px] text-link">{profile?.username || "Аноним"}</span>
                  <span className="text-[12px] text-muted-foreground">
                    {format(new Date(comment.created_at), "d MMM в HH:mm", { locale: ru })}
                  </span>
                </div>
                <p className="text-[14px] text-foreground/85 leading-relaxed">{comment.content}</p>
              </div>
            );
          })}
          {comments.length === 0 && (
            <p className="text-[13px] text-muted-foreground">Пока нет комментариев</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
