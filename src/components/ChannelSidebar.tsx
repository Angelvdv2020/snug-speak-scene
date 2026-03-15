import { channels, type Channel } from "@/data/forumData";
import { Hash, ChevronDown } from "lucide-react";

interface ChannelSidebarProps {
  activeChannel: string;
  onChannelSelect: (id: string) => void;
}

const ChannelSidebar = ({ activeChannel, onChannelSelect }: ChannelSidebarProps) => {
  const categories = [...new Set(channels.map((c) => c.category))];

  return (
    <aside className="w-60 shrink-0 bg-sidebar border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h1 className="font-display text-sm font-bold tracking-wider text-primary uppercase">
          /// Форум
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="flex items-center gap-1 px-2 mb-1">
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] font-display font-semibold uppercase tracking-widest text-muted-foreground">
                {cat}
              </span>
            </div>
            {channels
              .filter((c) => c.category === cat)
              .map((ch) => (
                <ChannelItem
                  key={ch.id}
                  channel={ch}
                  active={activeChannel === ch.id}
                  onClick={() => onChannelSelect(ch.id)}
                />
              ))}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-xs font-bold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">user_one</p>
            <p className="text-[11px] text-muted-foreground">В сети</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-online" />
        </div>
      </div>
    </aside>
  );
};

const ChannelItem = ({
  channel,
  active,
  onClick,
}: {
  channel: Channel;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors group ${
      active
        ? "bg-channel-active text-foreground"
        : "text-muted-foreground hover:bg-channel-hover hover:text-foreground"
    }`}
  >
    <Hash className="w-4 h-4 shrink-0 text-muted-foreground" />
    <span className="truncate">{channel.name}</span>
    {channel.unread > 0 && (
      <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full font-display">
        {channel.unread}
      </span>
    )}
  </button>
);

export default ChannelSidebar;
