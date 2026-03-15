import { Search, Bell, MessageSquare, User, PenSquare } from "lucide-react";

const ForumHeader = () => {
  return (
    <header className="bg-header text-header-foreground sticky top-0 z-50">
      <div className="max-w-[1100px] mx-auto px-4 h-12 flex items-center gap-6">
        <h1 className="font-heading text-xl font-bold tracking-tight">Форум</h1>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {["Статьи", "Новости", "Хабы", "Авторы"].map((item) => (
            <button
              key={item}
              className="px-3 py-1.5 rounded-md text-header-foreground/70 hover:text-header-foreground hover:bg-header-foreground/10 transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-md text-header-foreground/70 hover:text-header-foreground hover:bg-header-foreground/10 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md text-header-foreground/70 hover:text-header-foreground hover:bg-header-foreground/10 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
          <button className="p-2 rounded-md text-header-foreground/70 hover:text-header-foreground hover:bg-header-foreground/10 transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md text-header-foreground/70 hover:text-header-foreground hover:bg-header-foreground/10 transition-colors">
            <User className="w-4 h-4" />
          </button>
          <button className="ml-2 flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <PenSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Написать</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ForumHeader;
