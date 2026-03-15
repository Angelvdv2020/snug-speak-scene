import { Search, Bell, User, Menu, PenSquare, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ForumHeader = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="bg-header text-header-foreground sticky top-0 z-50">
      <div className="max-w-[820px] mx-auto px-4 h-[50px] flex items-center gap-4">
        <button className="md:hidden p-1.5 text-header-foreground/70">
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="font-heading text-[22px] font-black tracking-tight select-none">
          ​Форум
        </Link>

        <div className="h-5 w-px bg-header-foreground/20 hidden md:block" />

        <nav className="hidden md:flex items-center gap-0 text-[13px]">
          <Link to="/" className="px-3 py-1.5 rounded text-header-foreground transition-colors">
            Моя лента
          </Link>
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-0.5">
          {user && (
            <>
              <Link to="/create" className="p-2 rounded text-header-foreground/60 hover:text-header-foreground transition-colors">
                <PenSquare className="w-[18px] h-[18px]" />
              </Link>
              {isAdmin && (
                <Link to="/admin" className="p-2 rounded text-header-foreground/60 hover:text-header-foreground transition-colors">
                  <Shield className="w-[18px] h-[18px]" />
                </Link>
              )}
              <Link to="/profile" className="p-2 rounded text-header-foreground/60 hover:text-header-foreground transition-colors">
                <User className="w-[18px] h-[18px]" />
              </Link>
            </>
          )}
        </div>

        {user ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 border border-header-foreground/30 text-header-foreground px-3 py-1 rounded text-[13px] hover:border-header-foreground/60 transition-colors"
          >
            Выйти
          </button>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-1.5 border border-header-foreground/30 text-header-foreground px-3 py-1 rounded text-[13px] hover:border-header-foreground/60 transition-colors"
          >
            Войти
          </Link>
        )}
      </div>
    </header>
  );
};

export default ForumHeader;
