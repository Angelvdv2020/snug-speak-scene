import { ChevronUp, ChevronDown } from "lucide-react";
import { useVote } from "@/hooks/useVote";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  type: "post" | "comment";
  targetId: string;
  votes: number;
}

const VoteButtons = ({ type, targetId, votes }: VoteButtonsProps) => {
  const { user } = useAuth();
  const { userVote, vote, isPending } = useVote(type, targetId);

  return (
    <div className="flex items-center rounded overflow-hidden border border-border">
      <button
        onClick={() => user && vote(1)}
        disabled={isPending}
        className={cn(
          "px-2 py-1 hover:bg-muted transition-colors",
          userVote?.value === 1 ? "text-vote-up" : "text-muted-foreground hover:text-vote-up"
        )}
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <span className={cn(
        "text-[13px] font-medium px-1 min-w-[28px] text-center",
        votes > 0 ? "text-vote-up" : votes < 0 ? "text-destructive" : "text-foreground"
      )}>
        {votes > 0 ? `+${votes}` : votes}
      </span>
      <button
        onClick={() => user && vote(-1)}
        disabled={isPending}
        className={cn(
          "px-2 py-1 hover:bg-muted transition-colors",
          userVote?.value === -1 ? "text-destructive" : "text-muted-foreground hover:text-destructive"
        )}
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default VoteButtons;
