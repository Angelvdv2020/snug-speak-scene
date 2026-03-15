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
    <article className="bg-card rounded-lg border border-border">
      <div className="flex">
        {/* Vote column */}
        <div className="flex flex-col items-center py-4 px-3 border-r border-border gap-0.5">
          <button className="p-0.5 text-muted-foreground hover:text-vote-up transition-colors">
            <ChevronUp className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-foreground">{post.votes}</span>
          <button className="p-0.5 text-muted-foreground hover:text-destructive transition-colors">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          {/* Meta line */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-2">
            <span className="font-medium text-link hover:underline cursor-pointer">
              {post.author.name}
            </span>
            <span>·</span>
            <span>{dateStr}</span>
            <span>·</span>
            <span className={difficultyColor[post.difficulty]}>{post.difficulty}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} мин
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views > 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views}
            </span>
          </div>

          {/* Hub */}
          <div className="mb-1">
            <span className="text-xs text-link hover:underline cursor-pointer">
              {post.hub}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-heading text-xl font-bold text-foreground hover:text-link cursor-pointer transition-colors leading-snug mb-2">
            {post.title}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-tag text-tag-foreground text-[11px] px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Preview text */}
          <p className="text-sm text-secondary-foreground leading-relaxed mb-3">
            {post.preview}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button className="flex items-center gap-1 text-link hover:underline font-medium">
              Читать далее →
            </button>
            <div className="flex-1" />
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              {post.comments}
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
