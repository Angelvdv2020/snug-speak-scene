import { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";

interface ChatInputProps {
  channelName: string;
}

const ChatInput = ({ channelName }: ChatInputProps) => {
  const [value, setValue] = useState("");

  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2.5">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Написать в #${channelName}...`}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Smile className="w-4 h-4" />
        </button>
        <button
          className={`p-1.5 rounded-md transition-colors ${
            value.trim()
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
