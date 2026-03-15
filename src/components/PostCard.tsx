import { ChevronUp, ChevronDown, Clock, Eye, MessageSquare, Bookmark } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { Post } from "@/data/forumData";

interface PostCardProps {
  post: Post;
}

const difficultyColor: Record<string, string> = {
  "Простой": "text-accent",
  "Средний": "text-primary",
  "Сложный": "text-destructive",
};

const PostCard = ({ post }: PostCardProps) => {
  const dateStr = format(post.createdAt, "d MMM в HH:mm", { locale: ru });

  return (
    <article className="bg-card rounded-lg overflow-hidden">
      <div className="px-6 pt-5 pb-4">
        {/* Type label */}
        <div className="mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-link">
            Статья
          </span>
        </div>

        {/* Author line */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{
              backgroundColor: `hsl(${(post.author.name.charCodeAt(0) * 47) % 360}, 40%, 85%)`,
              color: `hsl(${(post.author.name.charCodeAt(0) * 47) % 360}, 50%, 35%)`,
            }}
          >
            {post.author.avatar}
          </div>
          <span className="text-[13px] text-link hover:underline cursor-pointer">
            {post.author.name}
          </span>
          <span className="text-[13px] text-muted-foreground">{dateStr}</span>
        </div>

        {/* Title */}
        <h2 className="font-heading text-[22px] font-bold text-foreground hover:text-link cursor-pointer transition-colors leading-[1.3] mb-1.5">
          {post.title}
        </h2>

        {/* Difficulty + time + views */}
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-2">
          <span className={`flex items-center gap-1 ${difficultyColor[post.difficulty]}`}>
            ⬤ {post.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime} мин
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views > 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views}
          </span>
        </div>

        {/* Hub + Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-3 text-[12px]">
          <span className="text-muted-foreground">{post.hub}</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-tag-foreground hover:text-link cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Preview */}
        <p className="text-[14px] text-foreground/80 leading-[1.65] mb-4">
          {post.preview}
        </p>

        {/* Read more button */}
        <button className="border border-border text-foreground/70 hover:text-foreground hover:border-foreground/30 px-4 py-1.5 rounded text-[13px] transition-colors mb-4">
          Читать далее
        </button>

        {/* Footer */}
        <div className="flex items-center gap-1 pt-3 border-t border-border">
          <div className="flex items-center rounded overflow-hidden border border-border">
            <button className="px-2 py-1 hover:bg-muted transition-colors text-muted-foreground hover:text-vote-up">
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="text-[13px] font-medium text-foreground px-1 min-w-[28px] text-center">
              {post.votes}
            </span>
            <button className="px-2 py-1 hover:bg-muted transition-colors text-muted-foreground hover:text-destructive">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1" />

          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-link transition-colors px-2 py-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {post.comments}
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-link transition-colors px-2 py-1">
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
