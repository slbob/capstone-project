import { useActivities } from "@/hooks/use-activities";
import { formatDistanceToNow, format } from "date-fns";
import { Footprints, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ActivityList() {
  const { data: activities, isLoading } = useActivities(5); // Last 5

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!activities?.length) {
    return (
      <div className="text-center py-12 bg-secondary/30 rounded-2xl border border-dashed border-border">
        <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Footprints className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No walks logged yet</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Time to lace up those shoes!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div 
          key={activity.id} 
          className="group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all hover:bg-secondary/20 animate-in opacity-0 fill-mode-forwards"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <span className="font-heading font-bold text-lg">{activity.minutes}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium truncate">
                {activity.notes || "Walking Session"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(activity.date), "MMM d, yyyy • h:mm a")}</span>
            </div>
          </div>

          <div className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-secondary px-2 py-1 rounded-lg">
            {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
}
