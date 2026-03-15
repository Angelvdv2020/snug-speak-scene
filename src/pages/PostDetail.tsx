import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ForumHeader from "@/components/ForumHeader";
import { ChevronUp, ChevronDown, Clock, Eye, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import CommentSection from "@/components/CommentSection";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: author } = useQuery({
    queryKey: ["profile", post?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", post!.user_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!post?.user_id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="max-w-[820px] mx-auto px-4 py-8">
          <div className="bg-card rounded-lg p-8 text-center text-muted-foreground">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="max-w-[820px] mx-auto px-4 py-8">
          <div className="bg-card rounded-lg p-8 text-center text-muted-foreground">Статья не найдена</div>
        </div>
      </div>
    );
  }

  const dateStr = format(new Date(post.created_at), "d MMMM yyyy в HH:mm", { locale: ru });

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <div className="max-w-[820px] mx-auto px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-1 text-[13px] text-link hover:underline mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Вернуться к ленте
        </Link>

        <article className="bg-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-muted text-muted-foreground"
            >
              {author?.username?.slice(0, 2).toUpperCase() || "??"}
            </div>
            <div>
              <span className="text-[13px] text-link">{author?.username || "Аноним"}</span>
              <span className="text-[12px] text-muted-foreground ml-2">{dateStr}</span>
            </div>
          </div>

          <h1 className="font-heading text-[28px] font-bold text-foreground leading-tight mb-3">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-4">
            <span className="text-link">{post.hub}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time} мин</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[12px] text-tag-foreground bg-tag px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
          )}

          <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
            <div className="flex items-center rounded overflow-hidden border border-border">
              <button className="px-2 py-1 hover:bg-muted transition-colors text-muted-foreground hover:text-vote-up">
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="text-[13px] font-medium px-1 min-w-[28px] text-center">{post.votes}</span>
              <button className="px-2 py-1 hover:bg-muted transition-colors text-muted-foreground hover:text-destructive">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>

        <CommentSection postId={post.id} />
      </div>
    </div>
  );
};

export default PostDetail;
