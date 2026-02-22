import { useLeaderboard, type LeaderboardEntry } from "@/hooks/use-teams";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, User, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leaderboard() {
  const [type, setType] = useState<'individual' | 'team'>('individual');
  const { data: leaderboard, isLoading } = useLeaderboard(type);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-10 pt-20 lg:pt-8 lg:pl-72 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">See who's leading the pack.</p>
          </div>
          
          <div className="bg-secondary p-1 rounded-xl flex gap-1">
            <Button
              variant={type === 'individual' ? 'default' : 'ghost'}
              onClick={() => setType('individual')}
              className={cn("rounded-lg", type === 'individual' && "shadow-md")}
            >
              <User className="w-4 h-4 mr-2" />
              Individuals
            </Button>
            <Button
              variant={type === 'team' ? 'default' : 'ghost'}
              onClick={() => setType('team')}
              className={cn("rounded-lg", type === 'team' && "shadow-md")}
            >
              <Users className="w-4 h-4 mr-2" />
              Teams
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in opacity-0 fill-mode-forwards" style={{ animationDelay: '150ms' }}>
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="divide-y divide-border">
              {leaderboard.map((entry: LeaderboardEntry, index) => (
                <div 
                  key={entry.id} 
                  className={cn(
                    "flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors",
                    entry.rank <= 3 && "bg-gradient-to-r from-primary/5 to-transparent"
                  )}
                >
                  <div className="w-10 flex justify-center font-heading font-bold text-muted-foreground">
                    {entry.rank === 1 ? (
                      <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    ) : entry.rank === 2 ? (
                      <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />
                    ) : entry.rank === 3 ? (
                      <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />
                    ) : (
                      `#${entry.rank}`
                    )}
                  </div>

                  <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                    <AvatarImage src={entry.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {entry.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{entry.name}</h3>
                    {type === 'individual' && entry.teamName && (
                      <p className="text-xs text-muted-foreground truncate">{entry.teamName}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="font-heading font-bold text-lg tabular-nums text-primary">
                      {entry.minutes.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Mins</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No activity recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
