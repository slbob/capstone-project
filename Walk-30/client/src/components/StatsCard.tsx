import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "accent" | "blue" | "rose";
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, trend, color = "primary", delay = 0 }: StatsCardProps) {
  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    blue: "bg-blue-500/10 text-blue-600",
    rose: "bg-rose-500/10 text-rose-600",
  };

  return (
    <div 
      className={cn(
        "bg-card rounded-2xl p-6 border border-border/50 shadow-sm card-hover animate-in opacity-0 fill-mode-forwards",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-heading font-bold tracking-tight">{value}</h3>
          {trend && (
            <p className="text-xs text-muted-foreground mt-2">
              {trend}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colorStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
