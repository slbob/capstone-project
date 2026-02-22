import { useStats } from "@/hooks/use-activities";
import { useAuth } from "@/hooks/use-auth";
import { StatsCard } from "@/components/StatsCard";
import { ActivityList } from "@/components/ActivityList";
import { LogWalkDialog } from "@/components/LogWalkDialog";
import { 
  Flame, 
  Timer, 
  TrendingUp, 
  Footprints 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useStats();

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-10 pt-20 lg:pt-8 lg:pl-72 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-foreground">
              {greeting}, {user?.firstName || "Walker"}! 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Ready to hit your stride today?
            </p>
          </div>
          <LogWalkDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </>
          ) : (
            <>
              <StatsCard 
                title="Total Minutes" 
                value={stats?.totalMinutes || 0} 
                icon={Timer} 
                trend="All time activity"
                color="blue"
                delay={0}
              />
              <StatsCard 
                title="Current Streak" 
                value={stats?.currentStreak || 0} 
                icon={Flame} 
                trend="Days in a row"
                color="accent"
                delay={100}
              />
              <StatsCard 
                title="Daily Average" 
                value={Math.round(stats?.dailyAverage || 0)} 
                icon={TrendingUp} 
                trend="Minutes per day"
                color="primary"
                delay={200}
              />
              <StatsCard 
                title="Active Days" 
                value={stats?.daysActive || 0} 
                icon={Footprints} 
                trend="Total days walked"
                color="rose"
                delay={300}
              />
            </>
          )}
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <Footprints className="w-5 h-5 text-primary" />
                Recent Activity
              </h2>
            </div>
            <ActivityList />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 animate-in opacity-0 fill-mode-forwards" style={{ animationDelay: '400ms' }}>
              <h3 className="font-heading font-bold text-xl mb-2">Daily Tip 💡</h3>
              <p className="text-primary-foreground/90 text-sm leading-relaxed">
                Consistency beats intensity. A 20-minute walk every day is better than one 2-hour walk once a week. Keep that streak alive!
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm animate-in opacity-0 fill-mode-forwards" style={{ animationDelay: '500ms' }}>
              <h3 className="font-heading font-bold text-lg mb-4">Challenge Progress</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Goal: 30 days</span>
                    <span className="font-bold">{stats?.daysActive || 0}/30</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min(((stats?.daysActive || 0) / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Goal: 1000 mins</span>
                    <span className="font-bold">{stats?.totalMinutes || 0}/1000</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min(((stats?.totalMinutes || 0) / 1000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
