import { hubs } from "@/data/forumData";

interface HubFilterProps {
  activeHub: string;
  onSelect: (hub: string) => void;
}

const HubFilter = ({ activeHub, onSelect }: HubFilterProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-3">
      <div className="flex flex-wrap gap-1">
        {hubs.map((hub) => (
          <button
            key={hub}
            onClick={() => onSelect(hub)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeHub === hub
                ? "bg-primary text-primary-foreground"
                : "text-secondary-foreground hover:bg-muted"
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
