import { ChevronUp, ChevronDown, Clock, Eye, MessageSquare, Bookmark } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    user_id: string;
    hub: string;
    tags: string[] | null;
    preview: string;
    votes: number;
    views: number;
    read_time: number;
    difficulty: string;
    created_at: string;
  };
  author?: {
    username: string;
    karma: number;
  } | null;
}

const difficultyColor: Record<string, string> = {
  "Простой": "text-accent",
  "Средний": "text-primary",
  "Сложный": "text-destructive",
};

const PostCard = ({ post, author }: PostCardProps) => {
  const dateStr = format(new Date(post.created_at), "d MMM в HH:mm", { locale: ru });

  return (
    <article className="bg-card rounded-lg overflow-hidden">
      <div className="px-6 pt-5 pb-4">
        <div className="mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-link">Статья</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{
              backgroundColor: `hsl(${((author?.username || "?").charCodeAt(0) * 47) % 360}, 40%, 85%)`,
              color: `hsl(${((author?.username || "?").charCodeAt(0) * 47) % 360}, 50%, 35%)`,
            }}
          >
            {(author?.username || "??").slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[13px] text-link hover:underline cursor-pointer">
            {author?.username || "Аноним"}
          </span>
          <span className="text-[13px] text-muted-foreground">{dateStr}</span>
        </div>

        <Link to={`/post/${post.id}`}>
          <h2 className="font-heading text-[22px] font-bold text-foreground hover:text-link cursor-pointer transition-colors leading-[1.3] mb-1.5">
            {post.title}
          </h2>
        </Link>

        <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-2">
          <span className={`flex items-center gap-1 ${difficultyColor[post.difficulty] || "text-primary"}`}>
            ⬤ {post.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />{post.read_time} мин
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views > 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-3 text-[12px]">
          <span className="text-muted-foreground">{post.hub}</span>
          {post.tags?.map((tag) => (
            <span key={tag} className="text-tag-foreground hover:text-link cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[14px] text-foreground/80 leading-[1.65] mb-4">{post.preview}</p>

        <Link to={`/post/${post.id}`}>
          <button className="border border-border text-foreground/70 hover:text-foreground hover:border-foreground/30 px-4 py-1.5 rounded text-[13px] transition-colors mb-4">
            Читать далее
          </button>
        </Link>

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
          <button className="flex items-center gap-1 text-muted-foreground hover:text-link transition-colors px-2 py-1">
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
