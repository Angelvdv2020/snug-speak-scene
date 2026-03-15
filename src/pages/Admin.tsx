import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ForumHeader from "@/components/ForumHeader";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, Users, FileText } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"posts" | "users">("posts");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  const { data: posts = [] } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("posts").update({ published: !published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  if (loading) return null;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <div className="max-w-[820px] mx-auto px-4 py-4">
        <div className="bg-card rounded-lg p-6">
          <h1 className="font-heading text-[24px] font-bold text-foreground mb-4">
            Панель администратора
          </h1>

          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === "posts" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("posts")}
            >
              <FileText className="w-4 h-4 mr-1" />
              Статьи ({posts.length})
            </Button>
            <Button
              variant={tab === "users" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("users")}
            >
              <Users className="w-4 h-4 mr-1" />
              Пользователи ({users.length})
            </Button>
          </div>

          {tab === "posts" && (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center gap-3 p-3 rounded border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {post.hub} · {format(new Date(post.created_at), "d MMM yyyy", { locale: ru })}
                      {!post.published && " · Черновик"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePublish.mutate({ id: post.id, published: post.published })}
                    title={post.published ? "Скрыть" : "Опубликовать"}
                  >
                    {post.published ? <Eye className="w-4 h-4 text-accent" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { if (confirm("Удалить статью?")) deletePost.mutate(post.id); }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-[13px] text-muted-foreground text-center py-8">Нет статей</p>
              )}
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded border border-border">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground">
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-foreground">{u.username}</p>
                    <p className="text-[12px] text-muted-foreground">
                      Карма: {u.karma} · {format(new Date(u.created_at), "d MMM yyyy", { locale: ru })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
