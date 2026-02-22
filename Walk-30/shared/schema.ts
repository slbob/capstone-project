import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References users.id (which is varchar)
  date: timestamp("date").notNull(),
  minutes: integer("minutes").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // Join code
  creatorId: text("creator_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: text("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// === RELATIONS ===

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  creator: one(users, {
    fields: [teams.creatorId],
    references: [users.id],
  }),
  members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertActivitySchema = createInsertSchema(activities).omit({ 
  id: true, 
  createdAt: true,
  userId: true 
});

export const insertTeamSchema = createInsertSchema(teams).omit({ 
  id: true, 
  createdAt: true, 
  creatorId: true,
  code: true // Generated server-side
});

export const joinTeamSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

// === EXPLICIT API CONTRACT TYPES ===

export type Activity = typeof activities.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

// Request types
export type CreateActivityRequest = InsertActivity;
export type CreateTeamRequest = InsertTeam;
export type JoinTeamRequest = z.infer<typeof joinTeamSchema>;

// Response types
export type ActivityResponse = Activity;
export type TeamResponse = Team & { memberCount?: number };
export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  minutes: number;
  teamName?: string;
};
export type UserStatsResponse = {
  totalMinutes: number;
  currentStreak: number;
  daysActive: number;
  dailyAverage: number;
};
