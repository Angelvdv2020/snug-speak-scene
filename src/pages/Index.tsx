import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ForumHeader from "@/components/ForumHeader";
import PostCard from "@/components/PostCard";
import HubFilter from "@/components/HubFilter";

const Index = () => {
  const [activeHub, setActiveHub] = useState("Все");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", activeHub],
    queryFn: async () => {
      let query = supabase.
      from("posts").
      select("*").
      eq("published", true).
      order("created_at", { ascending: false });

      if (activeHub !== "Все") {
        query = query.eq("hub", activeHub);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const userIds = [...new Set(posts.map((p) => p.user_id))];

  const { data: profiles = [] } = useQuery({
    queryKey: ["post-profiles", userIds.join(",")],
    queryFn: async () => {
      if (userIds.length === 0) return [];
      const { data, error } = await supabase.
      from("profiles").
      select("*").
      in("user_id", userIds);
      if (error) throw error;
      return data;
    },
    enabled: userIds.length > 0
  });

  const getProfile = (userId: string) =>
  profiles.find((p) => p.user_id === userId);

  return (
    <div className="min-h-screen bg-neutral-300">
      <ForumHeader />

      <div className="max-w-[820px] mx-auto px-4 py-4">
        <div className="space-y-3">
          <HubFilter activeHub={activeHub} onSelect={setActiveHub} />

          {isLoading &&
          <div className="bg-card rounded-lg p-10 text-center text-muted-foreground text-sm">
              Загрузка...
            </div>
          }

          {posts.map((post) =>
          <PostCard key={post.id} post={post} author={getProfile(post.user_id)} />
          )}

          {!isLoading && posts.length === 0 &&
          <div className="bg-card rounded-lg p-10 text-center text-muted-foreground text-sm">
              Нет статей в этом хабе
            </div>
          }
        </div>
      </div>
    </div>);

};

export default Index;