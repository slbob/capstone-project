import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Activity, type InsertActivity } from "@shared/schema"; // Assuming types are exported from schema as per instructions
import { useToast } from "@/hooks/use-toast";

// Types derived from the schema/routes provided in prompt
export type StatsResponse = {
  totalMinutes: number;
  currentStreak: number;
  daysActive: number;
  dailyAverage: number;
};

// GET /api/activities
export function useActivities(limit?: number) {
  return useQuery({
    queryKey: ["/api/activities", limit],
    queryFn: async () => {
      const url = limit ? `/api/activities?limit=${limit}` : "/api/activities";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activities");
      return await res.json() as Activity[];
    },
  });
}

// GET /api/stats
export function useStats() {
  return useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json() as StatsResponse;
    },
  });
}

// POST /api/activities
export function useLogActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertActivity) => {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to log activity");
      }
      return await res.json() as Activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] }); // Updates leaderboard immediately
      toast({
        title: "Walk logged!",
        description: "Great job keeping up the streak.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error logging walk",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
