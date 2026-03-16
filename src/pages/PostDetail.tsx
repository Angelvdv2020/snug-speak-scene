import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import ForumHeader from "@/components/ForumHeader";
import VoteButtons from "@/components/VoteButtons";
import { Eye, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import CommentSection from "@/components/CommentSection";
import { useEffect, useRef } from "react";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const viewIncremented = useRef(false);

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

  useEffect(() => {
    if (id && !viewIncremented.current) {
      const key = `viewed_${id}`;
      if (!sessionStorage.getItem(key)) {
        viewIncremented.current = true;
        sessionStorage.setItem(key, "1");
        supabase.rpc("increment_post_views", { post_id: id });
      }
    }
  }, [id]);

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
          <div className="bg-card rounded-lg p-8 text-center text-muted-foreground">Тема не найдена</div>
        </div>
      </div>
    );
  }

  const dateStr = format(new Date(post.created_at), "d MMMM yyyy в HH:mm", { locale: ru });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} — Форум</title>
        <meta name="description" content={post.preview.slice(0, 155)} />
      </Helmet>

      <ForumHeader />
      <div className="max-w-[820px] mx-auto px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-1 text-[13px] text-link hover:underline mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Назад к форуму
        </Link>

        <article className="bg-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-muted text-muted-foreground">
              {author?.username?.slice(0, 2).toUpperCase() || "??"}
            </div>
            <div>
              <span className="text-[13px] text-link">{author?.username || "Аноним"}</span>
              <span className="text-[12px] text-muted-foreground ml-2">{dateStr}</span>
            </div>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-auto">
              {post.hub}
            </span>
          </div>

          <h1 className="font-heading text-[24px] font-bold text-foreground leading-tight mb-3">
            {post.title}
          </h1>

          <div className="text-[14px] text-foreground/85 leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </div>

          {(post as any).image_url && (
            <img
              src={(post as any).image_url}
              alt=""
              className="w-full max-h-[500px] object-contain rounded-lg border border-border mb-4"
            />
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border text-[12px] text-muted-foreground">
            <VoteButtons type="post" targetId={post.id} votes={post.votes} />
            <div className="flex-1" />
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />{post.views}
            </span>
          </div>
        </article>

        <CommentSection postId={post.id} />
      </div>
    </div>
  );
};

export default PostDetail;
