import { useState } from "react";
import ForumHeader from "@/components/ForumHeader";
import PostCard from "@/components/PostCard";
import HubFilter from "@/components/HubFilter";
import ForumSidebar from "@/components/ForumSidebar";
import { posts } from "@/data/forumData";

const Index = () => {
  const [activeHub, setActiveHub] = useState("Все");

  const filtered = activeHub === "Все" ? posts : posts.filter((p) => p.hub === activeHub);

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />

      <div className="max-w-[1100px] mx-auto px-4 py-5">
        <div className="flex gap-5">
          {/* Main feed */}
          <div className="flex-1 min-w-0 space-y-4">
            <HubFilter activeHub={activeHub} onSelect={setActiveHub} />
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {filtered.length === 0 && (
              <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
                Нет статей в этом хабе
              </div>
            )}
          </div>

          {/* Sidebar */}
          <ForumSidebar />
        </div>
      </div>
    </div>
  );
};

export default Index;
