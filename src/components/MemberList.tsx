import { users } from "@/data/forumData";

const MemberList = () => {
  const onlineUsers = users.filter((u) => u.online);
  const offlineUsers = users.filter((u) => !u.online);

  return (
    <aside className="w-52 shrink-0 bg-sidebar border-l border-border hidden lg:flex flex-col h-full p-3">
      <Section title="В сети" count={onlineUsers.length}>
        {onlineUsers.map((u) => (
          <MemberItem key={u.id} name={u.name} avatar={u.avatar} id={u.id} online />
        ))}
      </Section>
      <Section title="Не в сети" count={offlineUsers.length}>
        {offlineUsers.map((u) => (
          <MemberItem key={u.id} name={u.name} avatar={u.avatar} id={u.id} />
        ))}
      </Section>
    </aside>
  );
};

const Section = ({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <p className="text-[11px] font-display font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
      {title} — {count}
    </p>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const MemberItem = ({
  name,
  avatar,
  id,
  online,
}: {
  name: string;
  avatar: string;
  id: string;
  online?: boolean;
}) => (
  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-channel-hover transition-colors cursor-pointer">
    <div className="relative">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center font-display text-[10px] font-bold"
        style={{
          backgroundColor: `hsl(${(id.charCodeAt(0) * 73) % 360}, 50%, 25%)`,
          color: `hsl(${(id.charCodeAt(0) * 73) % 360}, 70%, 70%)`,
        }}
      >
        {avatar}
      </div>
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-online rounded-full border-2 border-sidebar" />
      )}
    </div>
    <span className={`text-sm truncate ${online ? "text-foreground" : "text-muted-foreground"}`}>
      {name}
    </span>
  </div>
);

export default MemberList;
