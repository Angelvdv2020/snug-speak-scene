import { hubs } from "@/data/forumData";
import { Settings2 } from "lucide-react";

interface HubFilterProps {
  activeHub: string;
  onSelect: (hub: string) => void;
}

const HubFilter = ({ activeHub, onSelect }: HubFilterProps) => {
  return (
    <div className="bg-card rounded-lg px-5 py-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[18px] font-bold text-foreground">Моя лента</h2>
        <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-[13px]">
          <Settings2 className="w-3.5 h-3.5" />
          Настройки
        </button>
      </div>
      <div className="flex flex-wrap gap-0.5 mt-2">
        {hubs.map((hub) => (
          <button
            key={hub}
            onClick={() => onSelect(hub)}
            className={`px-3 py-1 rounded text-[13px] transition-colors ${
              activeHub === hub
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {hub}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HubFilter;
