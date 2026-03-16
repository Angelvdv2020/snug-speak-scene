import { Eye, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";
import VoteButtons from "@/components/VoteButtons";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    user_id: string;
    hub: string;
    preview: string;
    votes: number;
    views: number;
    created_at: string;
    image_url?: string | null;
  };
  author?: {
    username: string;
    karma: number;
  } | null;
  commentCount?: number;
}

const PostCard = ({ post, author, commentCount }: PostCardProps) => {
  const dateStr = format(new Date(post.created_at), "d MMM в HH:mm", { locale: ru });

  return (
    <article className="bg-card rounded-lg overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{
              backgroundColor: `hsl(${((author?.username || "?").charCodeAt(0) * 47) % 360}, 40%, 85%)`,
              color: `hsl(${((author?.username || "?").charCodeAt(0) * 47) % 360}, 50%, 35%)`,
            }}
          >
            {(author?.username || "??").slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[13px] text-link">{author?.username || "Аноним"}</span>
          <span className="text-[12px] text-muted-foreground">· {dateStr}</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{post.hub}</span>
        </div>

        <Link to={`/post/${post.id}`}>
          <h2 className="font-heading text-[18px] font-bold text-foreground hover:text-link cursor-pointer transition-colors leading-snug mb-1.5">
            {post.title}
          </h2>
        </Link>

        <p className="text-[13px] text-foreground/70 leading-relaxed mb-2 line-clamp-2">
          {post.preview}
        </p>

        {(post as any).image_url && (
          <Link to={`/post/${post.id}`}>
            <img
              src={(post as any).image_url}
              alt=""
              className="w-full max-h-[300px] object-cover rounded-lg mb-2 cursor-pointer"
              loading="lazy"
            />
          </Link>
        )}

        <div className="flex items-center gap-1 pt-2 border-t border-border">
          <VoteButtons type="post" targetId={post.id} votes={post.votes} />
          <Link
            to={`/post/${post.id}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 text-[12px]"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {commentCount ?? 0}
          </Link>
          <div className="flex-1" />
          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
            <Eye className="w-3 h-3" />
            {post.views > 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
