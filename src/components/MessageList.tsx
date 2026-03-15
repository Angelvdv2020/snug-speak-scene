import { messages, type Message } from "@/data/forumData";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface MessageListProps {
  channelId: string;
}

const MessageList = ({ channelId }: MessageListProps) => {
  const channelMessages = messages.filter((m) => m.channelId === channelId);

  if (channelMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p className="font-display text-sm">Пока нет сообщений в этом канале</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
      {channelMessages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
};

const MessageItem = ({ message }: { message: Message }) => {
  const timeStr = format(message.timestamp, "HH:mm", { locale: ru });

  return (
    <div className="group flex gap-3 px-3 py-2 rounded-lg hover:bg-message-hover transition-colors">
      <div
        className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-display text-sm font-bold mt-0.5"
        style={{
          backgroundColor: `hsl(${(message.user.id.charCodeAt(0) * 73) % 360}, 50%, 25%)`,
          color: `hsl(${(message.user.id.charCodeAt(0) * 73) % 360}, 70%, 70%)`,
        }}
      >
        {message.user.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-sm font-semibold text-foreground">
            {message.user.name}
          </span>
          <span className="text-[11px] text-muted-foreground">{timeStr}</span>
        </div>
        <p className="text-sm text-secondary-foreground mt-0.5 leading-relaxed">
          {message.content}
        </p>
        {message.replies && message.replies > 0 && (
          <button className="mt-1.5 flex items-center gap-1.5 text-primary text-xs font-medium hover:underline">
            <MessageSquare className="w-3 h-3" />
            {message.replies} ответов
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageList;
