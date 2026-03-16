import { hubs } from "@/data/forumData";

interface HubFilterProps {
  activeHub: string;
  onSelect: (hub: string) => void;
}

const HubFilter = ({ activeHub, onSelect }: HubFilterProps) => {
  return (
    <div className="bg-card rounded-lg px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-heading text-[18px] font-bold text-foreground">Форум</h2>
      </div>
      <div className="flex flex-wrap gap-0.5">
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
