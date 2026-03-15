import { useState } from "react";
import { Hash, Users } from "lucide-react";
import ChannelSidebar from "@/components/ChannelSidebar";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import MemberList from "@/components/MemberList";
import { channels } from "@/data/forumData";

const Index = () => {
  const [activeChannel, setActiveChannel] = useState("general");
  const channel = channels.find((c) => c.id === activeChannel);

  return (
    <div className="flex h-screen overflow-hidden">
      <ChannelSidebar activeChannel={activeChannel} onChannelSelect={setActiveChannel} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 border-b border-border flex items-center px-4 gap-3">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-display text-sm font-semibold">{channel?.name}</h2>
          <div className="ml-auto">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
        </header>

        <MessageList channelId={activeChannel} />
        <ChatInput channelName={channel?.name || ""} />
      </main>

      <MemberList />
    </div>
  );
};

export default Index;
