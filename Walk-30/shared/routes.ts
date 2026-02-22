import { z } from 'zod';
import { insertActivitySchema, insertTeamSchema, joinTeamSchema, activities, teams } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  activities: {
    log: {
      method: 'POST' as const,
      path: '/api/activities' as const,
      input: insertActivitySchema,
      responses: {
        201: z.custom<typeof activities.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/activities' as const,
      input: z.object({
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    getStats: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          totalMinutes: z.number(),
          currentStreak: z.number(),
          daysActive: z.number(),
          dailyAverage: z.number(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  teams: {
    create: {
      method: 'POST' as const,
      path: '/api/teams' as const,
      input: insertTeamSchema,
      responses: {
        201: z.custom<typeof teams.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    join: {
      method: 'POST' as const,
      path: '/api/teams/join' as const,
      input: joinTeamSchema,
      responses: {
        200: z.custom<typeof teams.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/teams' as const,
      responses: {
        200: z.array(z.custom<typeof teams.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    getMyTeam: {
        method: 'GET' as const,
        path: '/api/teams/me' as const,
        responses: {
            200: z.custom<typeof teams.$inferSelect>().nullable(),
            401: errorSchemas.unauthorized
        }
    }
  },
  leaderboard: {
    get: {
      method: 'GET' as const,
      path: '/api/leaderboard' as const,
      input: z.object({
        type: z.enum(['individual', 'team']).default('individual'),
      }).optional(),
      responses: {
        200: z.array(z.object({
          rank: z.number(),
          id: z.string(), // userId or teamId
          name: z.string(),
          minutes: z.number(),
          avatarUrl: z.string().optional(),
        })),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
