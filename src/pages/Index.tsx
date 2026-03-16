import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import ForumHeader from "@/components/ForumHeader";
import PostCard from "@/components/PostCard";
import HubFilter from "@/components/HubFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const POSTS_PER_PAGE = 20;

const Index = () => {
  const [activeHub, setActiveHub] = useState("Все");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", activeHub, search, page],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

      if (activeHub !== "Все") {
        query = query.eq("hub", activeHub);
      }
      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { posts: data ?? [], count: count ?? 0 };
    },
  });

  const posts = data?.posts ?? [];
  const totalPages = Math.ceil((data?.count ?? 0) / POSTS_PER_PAGE);
  const userIds = [...new Set(posts.map((p) => p.user_id))];
  const postIds = posts.map((p) => p.id);

  const { data: profiles = [] } = useQuery({
    queryKey: ["post-profiles", userIds.join(",")],
    queryFn: async () => {
      if (userIds.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);
      if (error) throw error;
      return data;
    },
    enabled: userIds.length > 0,
  });

  // Get comment counts for posts
  const { data: commentCounts = [] } = useQuery({
    queryKey: ["comment-counts", postIds.join(",")],
    queryFn: async () => {
      if (postIds.length === 0) return [];
      const { data, error } = await supabase
        .from("comments")
        .select("post_id")
        .in("post_id", postIds);
      if (error) throw error;
      return data;
    },
    enabled: postIds.length > 0,
  });

  const getProfile = (userId: string) =>
    profiles.find((p) => p.user_id === userId);

  const getCommentCount = (postId: string) =>
    commentCounts.filter((c) => c.post_id === postId).length;

  return (
    <div className="min-h-screen text-primary-foreground bg-[#1838c9]">
      <Helmet>
        <title>Форум — обсуждения и темы</title>
        <meta name="description" content="Форум: обсуждения, вопросы, новости и творчество." />
      </Helmet>

      <ForumHeader />

      <div className="max-w-[820px] mx-auto px-4 py-4">
        <div className="space-y-3">
          <HubFilter
            activeHub={activeHub}
            onSelect={(h) => { setActiveHub(h); setPage(0); }}
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Поиск по темам..."
              className="pl-9 bg-card"
            />
          </div>

          {isLoading && (
            <div className="bg-card rounded-lg p-10 text-center text-muted-foreground text-sm">
              Загрузка...
            </div>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              author={getProfile(post.user_id)}
              commentCount={getCommentCount(post.id)}
            />
          ))}

          {!isLoading && posts.length === 0 && (
            <div className="rounded-lg p-10 text-center text-muted-foreground text-sm bg-card">
              Нет тем{search ? ` по запросу «${search}»` : " в этом разделе"}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-1 pt-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-3 py-1.5 rounded text-[13px] transition-colors ${
                    page === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
