import { TrendingUp, Star, Flame } from "lucide-react";
import { authors } from "@/data/forumData";

const ForumSidebar = () => {
  return (
    <aside className="w-72 shrink-0 hidden lg:block space-y-4">
      {/* Top authors */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Топ авторов
        </h3>
        <div className="space-y-2.5">
          {authors.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2.5">
              <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-muted text-muted-foreground"
              >
                {a.avatar}
              </div>
              <span className="text-sm text-foreground hover:text-link cursor-pointer flex-1 truncate">
                {a.name}
              </span>
              <span className="text-xs text-accent font-medium">+{a.karma}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-destructive" />
          Сейчас читают
        </h3>
        <div className="space-y-2">
          {[
            "Rust vs Go: честное сравнение в 2026",
            "Новые CSS-функции, о которых все забыли",
            "Как я автоматизировал свой быт с Home Assistant",
          ].map((title) => (
            <p key={title} className="text-sm text-link hover:underline cursor-pointer leading-snug">
              {title}
            </p>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          Статистика
        </h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          {[
            { label: "Статей", value: "24.5K" },
            { label: "Авторов", value: "8.1K" },
            { label: "Комментариев", value: "312K" },
            { label: "Сегодня", value: "47" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ForumSidebar;
