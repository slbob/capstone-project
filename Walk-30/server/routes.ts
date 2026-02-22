import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes, isAuthenticated, authStorage } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // 2. Protected Routes (require auth)
  
  // === Activities ===
  app.post(api.activities.log.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.activities.log.input.parse(req.body);
      // @ts-ignore - req.user is added by passport
      const userId = req.user!.claims.sub;
      
      const activity = await storage.createActivity(userId, input);
      res.status(201).json(activity);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.activities.list.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user!.claims.sub;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const activities = await storage.getUserActivities(userId, limit);
    res.json(activities);
  });

  app.get(api.activities.getStats.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user!.claims.sub;
    const stats = await storage.getUserStats(userId);
    res.json(stats);
  });

  // === Teams ===
  app.post(api.teams.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.teams.create.input.parse(req.body);
      // @ts-ignore
      const userId = req.user!.claims.sub;
      const team = await storage.createTeam(userId, input);
      res.status(201).json(team);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.teams.join.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.teams.join.input.parse(req.body);
      const team = await storage.getTeamByCode(input.code);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      // @ts-ignore
      const userId = req.user!.claims.sub;
      
      // Check if already in a team
      const existingTeam = await storage.getUserTeam(userId);
      if (existingTeam) {
        return res.status(400).json({ message: "You are already in a team" });
      }

      await storage.joinTeam(userId, team.id);
      res.json(team);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.teams.getMyTeam.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user!.claims.sub;
    const team = await storage.getUserTeam(userId);
    
    if (team) {
        const members = await storage.getTeamMembers(team.id);
        res.json({ ...team, members });
    } else {
        res.json(null);
    }
  });

  // === Leaderboards ===
  app.get(api.leaderboard.get.path, isAuthenticated, async (req, res) => {
    const type = req.query.type as 'individual' | 'team' || 'individual';
    
    if (type === 'team') {
      const leaderboard = await storage.getTeamLeaderboard();
      res.json(leaderboard);
    } else {
      const leaderboard = await storage.getIndividualLeaderboard();
      res.json(leaderboard);
    }
  });

  // Seed Data (if empty)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const teams = await storage.getAllTeams();
  if (teams.length === 0) {
    console.log("Seeding database...");
    
    // Create a demo user (if Replit Auth doesn't provide one, we can't really "create" one easily 
    // without a valid token, but we can manually insert one for testing if needed. 
    // However, Replit Auth users are created upon login. 
    // We will just seed teams for now, and maybe some activities if we can mock a user.)
    
    // For now, let's just log that we are ready. 
    // Real seeding of activities requires a userId which we only get after login.
    // We could potentially insert a "demo" user directly into the DB.
    
    try {
        // Insert a demo user directly to attach data to
        const demoUserId = "demo-user-1";
        await authStorage.upsertUser({
            id: demoUserId,
            email: "demo@example.com",
            firstName: "Demo",
            lastName: "Walker",
        });

        // Create a team
        const team = await storage.createTeam(demoUserId, {
            name: "The Walkie Talkies",
        });
        
        // Log some activities
        const today = new Date();
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            await storage.createActivity(demoUserId, {
                date: date,
                minutes: 30 + Math.floor(Math.random() * 30),
                notes: `Walk day ${i + 1}`,
            });
        }
        console.log("Database seeded successfully!");
    } catch (e) {
        console.error("Error seeding database:", e);
    }
  }
}
