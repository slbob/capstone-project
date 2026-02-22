import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Team, InsertTeam, JoinTeamRequest, TeamResponse } from "@shared/schema";

// GET /api/teams/me
export function useMyTeam() {
  return useQuery({
    queryKey: ["/api/teams/me"],
    queryFn: async () => {
      const res = await fetch("/api/teams/me", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch team");
      const data = await res.json();
      return (data || null) as TeamResponse | null;
    },
  });
}

// POST /api/teams
export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTeam) => {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create team");
      }
      return await res.json() as Team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams/me"] });
      toast({
        title: "Team created!",
        description: "Invite your friends with your team code.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create team",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// POST /api/teams/join
export function useJoinTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: JoinTeamRequest) => {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to join team");
      }
      return await res.json() as Team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams/me"] });
      toast({
        title: "Team joined!",
        description: "Let's walk together!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to join team",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// GET /api/leaderboard
export type LeaderboardEntry = {
  rank: number;
  id: string;
  name: string;
  minutes: number;
  avatarUrl?: string;
};

export function useLeaderboard(type: 'individual' | 'team' = 'individual') {
  return useQuery({
    queryKey: ["/api/leaderboard", type],
    queryFn: async () => {
      const res = await fetch(`/api/leaderboard?type=${type}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return await res.json() as LeaderboardEntry[];
    },
  });
}
