import { z } from 'zod';

export const SignupSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  defaultView: z.enum(['month', 'week', 'day']).optional(),
  weekStartsOn: z.union([z.literal(0), z.literal(1)]).optional(),
  timeFormat: z.enum(['12h', '24h']).optional(),
  defaultEventColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  defaultEventDuration: z.number().min(15).max(480).optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UserPreferencesInput = z.infer<typeof UserPreferencesSchema>;
