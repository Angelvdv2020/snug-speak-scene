import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ForumHeader from "@/components/ForumHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

const hubs = ["Фронтенд", "Архитектура", "Машинное обучение", "DevOps", "Бэкенд"];

const CreatePost = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [hub, setHub] = useState(hubs[0]);
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const createPost = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title,
          hub,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          preview,
          content,
          user_id: user!.id,
          published: true,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => navigate(`/post/${data.id}`),
    onError: (e) => setError(e.message),
  });

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <div className="max-w-[820px] mx-auto px-4 py-4">
        <div className="bg-card rounded-lg p-6">
          <h1 className="font-heading text-[24px] font-bold text-foreground mb-6">Новая статья</h1>

          <div className="space-y-4">
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Заголовок</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название статьи" />
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Хаб</label>
              <select
                value={hub}
                onChange={(e) => setHub(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {hubs.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Теги (через запятую)</label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, typescript" />
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Превью</label>
              <Textarea value={preview} onChange={(e) => setPreview(e.target.value)} placeholder="Краткое описание статьи..." />
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Содержание</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Текст статьи..."
                className="min-h-[300px]"
              />
            </div>

            {error && <p className="text-destructive text-[13px]">{error}</p>}

            <Button onClick={() => createPost.mutate()} disabled={!title || !preview || !content || createPost.isPending}>
              {createPost.isPending ? "Публикация..." : "Опубликовать"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
