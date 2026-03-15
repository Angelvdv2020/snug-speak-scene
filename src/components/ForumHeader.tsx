import { Search, Bell, User, PenSquare, Menu } from "lucide-react";

const ForumHeader = () => {
  return (
    <header className="bg-header text-header-foreground sticky top-0 z-50">
      <div className="max-w-[820px] mx-auto px-4 h-[50px] flex items-center gap-4">
        <button className="md:hidden p-1.5 text-header-foreground/70">
          <Menu className="w-5 h-5" />
        </button>

        <span className="font-heading text-[22px] font-black tracking-tight cursor-pointer select-none">
          Habr
        </span>

        <div className="h-5 w-px bg-header-foreground/20 hidden md:block" />

        <nav className="hidden md:flex items-center gap-0 text-[13px]">
          {["Моя лента", "Все потоки"].map((item, i) => (
            <button
              key={item}
              className={`px-3 py-1.5 rounded transition-colors ${
                i === 0
                  ? "text-header-foreground"
                  : "text-header-foreground/60 hover:text-header-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-0.5">
          <button className="p-2 rounded text-header-foreground/60 hover:text-header-foreground transition-colors">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <button className="p-2 rounded text-header-foreground/60 hover:text-header-foreground transition-colors relative">
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <button className="p-2 rounded text-header-foreground/60 hover:text-header-foreground transition-colors">
            <User className="w-[18px] h-[18px]" />
          </button>
        </div>

        <button className="flex items-center gap-1.5 border border-header-foreground/30 text-header-foreground px-3 py-1 rounded text-[13px] hover:border-header-foreground/60 transition-colors">
          Войти
        </button>
      </div>
    </header>
  );
};

export default ForumHeader;
