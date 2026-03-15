import { useState } from "react";
import ForumHeader from "@/components/ForumHeader";
import PostCard from "@/components/PostCard";
import HubFilter from "@/components/HubFilter";
import { posts } from "@/data/forumData";

const Index = () => {
  const [activeHub, setActiveHub] = useState("Все");

  const filtered = activeHub === "Все" ? posts : posts.filter((p) => p.hub === activeHub);

  return (
    <div className="min-h-screen bg-[#cfcfcf]">
      <ForumHeader />

      <div className="max-w-[820px] mx-auto px-4 py-4">
        <div className="space-y-3">
          <HubFilter activeHub={activeHub} onSelect={setActiveHub} />
          {filtered.map((post) =>
          <PostCard key={post.id} post={post} />
          )}
          {filtered.length === 0 &&
          <div className="bg-card rounded-lg p-10 text-center text-muted-foreground text-sm">
              Нет статей в этом хабе
            </div>
          }
        </div>
      </div>
    </div>);

};

export default Index;