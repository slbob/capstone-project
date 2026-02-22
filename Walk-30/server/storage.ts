import { db } from "./db";
import { 
  users, activities, teams, teamMembers,
  type User, type InsertUser,
  type Activity, type InsertActivity,
  type Team, type InsertTeam,
  type TeamMember
} from "@shared/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  // Auth (delegated)
  getUser(id: string): Promise<User | undefined>;
  
  // Activities
  createActivity(userId: string, activity: InsertActivity): Promise<Activity>;
  getUserActivities(userId: string, limit?: number): Promise<Activity[]>;
  getUserStats(userId: string): Promise<{
    totalMinutes: number;
    currentStreak: number;
    daysActive: number;
    dailyAverage: number;
  }>;

  // Teams
  createTeam(creatorId: string, team: InsertTeam): Promise<Team>;
  getTeamByCode(code: string): Promise<Team | undefined>;
  joinTeam(userId: string, teamId: number): Promise<TeamMember>;
  getUserTeam(userId: string): Promise<Team | undefined>;
  getTeamMembers(teamId: number): Promise<User[]>;
  getAllTeams(): Promise<Team[]>;

  // Leaderboard
  getIndividualLeaderboard(): Promise<Array<{
    rank: number;
    id: string;
    name: string;
    minutes: number;
    avatarUrl?: string;
  }>>;
  getTeamLeaderboard(): Promise<Array<{
    rank: number;
    id: string; // cast to string for consistency
    name: string;
    minutes: number;
  }>>;
}

export class DatabaseStorage implements IStorage {
  // === Auth ===
  async getUser(id: string): Promise<User | undefined> {
    return authStorage.getUser(id);
  }

  // === Activities ===
  async createActivity(userId: string, activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities)
      .values({ ...activity, userId })
      .returning();
    return newActivity;
  }

  async getUserActivities(userId: string, limit = 10): Promise<Activity[]> {
    return db.select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.date))
      .limit(limit);
  }

  async getUserStats(userId: string): Promise<{
    totalMinutes: number;
    currentStreak: number;
    daysActive: number;
    dailyAverage: number;
  }> {
    // 1. Total minutes & Days active
    const stats = await db.select({
      totalMinutes: sql<number>`coalesce(sum(${activities.minutes}), 0)`,
      daysActive: sql<number>`count(distinct date_trunc('day', ${activities.date}))`
    })
    .from(activities)
    .where(eq(activities.userId, userId));

    const totalMinutes = Number(stats[0]?.totalMinutes || 0);
    const daysActive = Number(stats[0]?.daysActive || 0);

    // 2. Daily average
    const dailyAverage = daysActive > 0 ? Math.round(totalMinutes / daysActive) : 0;

    // 3. Current Streak (Simplified calculation)
    // In a real app, this would require a recursive CTE or complex app logic.
    // For MVP, we'll just check consecutive days backwards from today/yesterday.
    const logs = await db.select({ date: activities.date })
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.date));
    
    // De-duplicate dates (multiple logs per day)
    const uniqueDates = Array.from(new Set(logs.map(l => l.date.toISOString().split('T')[0]))).sort().reverse();
    
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (uniqueDates.length > 0) {
      // If the most recent log is not today or yesterday, streak is broken
      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        currentStreak = 1;
        let lastDate = new Date(uniqueDates[0]);
        
        for (let i = 1; i < uniqueDates.length; i++) {
          const curr = new Date(uniqueDates[i]);
          const diffTime = Math.abs(lastDate.getTime() - curr.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) {
            currentStreak++;
            lastDate = curr;
          } else {
            break;
          }
        }
      }
    }

    return { totalMinutes, currentStreak, daysActive, dailyAverage };
  }

  // === Teams ===
  async createTeam(creatorId: string, team: InsertTeam): Promise<Team> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const [newTeam] = await db.insert(teams)
      .values({ ...team, creatorId, code })
      .returning();
    
    // Auto-join creator
    await this.joinTeam(creatorId, newTeam.id);
    
    return newTeam;
  }

  async getTeamByCode(code: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.code, code));
    return team;
  }

  async joinTeam(userId: string, teamId: number): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers)
      .values({ userId, teamId })
      .returning();
    return member;
  }

  async getUserTeam(userId: string): Promise<Team | undefined> {
    const [member] = await db.select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, userId))
      .limit(1);
      
    if (!member) return undefined;

    const [team] = await db.select().from(teams).where(eq(teams.id, member.teamId));
    return team;
  }

  async getTeamMembers(teamId: number): Promise<User[]> {
    const members = await db.select({
      user: users
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId));
    
    return members.map(m => m.user);
  }

  async getAllTeams(): Promise<Team[]> {
    return db.select().from(teams);
  }

  // === Leaderboards ===
  async getIndividualLeaderboard(): Promise<Array<{ rank: number; id: string; name: string; minutes: number; avatarUrl?: string }>> {
    const results = await db.select({
      id: users.id,
      name: sql<string>`coalesce(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`,
      minutes: sql<number>`coalesce(sum(${activities.minutes}), 0)`,
      avatarUrl: users.profileImageUrl
    })
    .from(users)
    .leftJoin(activities, eq(users.id, activities.userId))
    .groupBy(users.id, users.firstName, users.lastName, users.email, users.profileImageUrl)
    .orderBy(desc(sql`sum(${activities.minutes})`))
    .limit(50);

    return results.map((r, index) => ({
      ...r,
      minutes: Number(r.minutes),
      rank: index + 1
    }));
  }

  async getTeamLeaderboard(): Promise<Array<{ rank: number; id: string; name: string; minutes: number }>> {
    const results = await db.select({
      id: teams.id,
      name: teams.name,
      minutes: sql<number>`coalesce(sum(${activities.minutes}), 0)`
    })
    .from(teams)
    .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
    .innerJoin(activities, eq(teamMembers.userId, activities.userId))
    .groupBy(teams.id, teams.name)
    .orderBy(desc(sql`sum(${activities.minutes})`))
    .limit(50);

    return results.map((r, index) => ({
      ...r,
      id: r.id.toString(),
      minutes: Number(r.minutes),
      rank: index + 1
    }));
  }
}

export const storage = new DatabaseStorage();
