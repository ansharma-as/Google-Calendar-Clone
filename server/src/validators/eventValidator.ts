import { z } from 'zod';

const ReminderSchema = z.object({
  minutesBefore: z.number().min(0, 'Minutes before must be non-negative'),
  method: z.enum(['popup', 'email']),
});

const RecurrenceSchema = z.object({
  rule: z.string().min(1, 'Recurrence rule is required'),
  dtstart: z.string().datetime().or(z.date()),
  until: z.string().datetime().or(z.date()).optional(),
  exdates: z.array(z.string().datetime().or(z.date())).optional(),
});

export const CreateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  location: z.string().max(500, 'Location too long').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  allDay: z.boolean().default(false),
  start: z.string().datetime().or(z.date()),
  end: z.string().datetime().or(z.date()),
  recurrence: RecurrenceSchema.optional(),
  reminders: z.array(ReminderSchema).optional(),
}).refine(
  (data) => {
    const start = new Date(data.start);
    const end = new Date(data.end);
    return end > start;
  },
  {
    message: 'End time must be after start time',
    path: ['end'],
  }
);

export const UpdateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().max(5000, 'Description too long').optional(),
  location: z.string().max(500, 'Location too long').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  allDay: z.boolean().optional(),
  start: z.string().datetime().or(z.date()).optional(),
  end: z.string().datetime().or(z.date()).optional(),
  recurrence: RecurrenceSchema.optional(),
  reminders: z.array(ReminderSchema).optional(),
});

export const QueryParamsSchema = z.object({
  start: z.string().datetime('Invalid start date format'),
  end: z.string().datetime('Invalid end date format'),
}).refine(
  (data) => {
    const start = new Date(data.start);
    const end = new Date(data.end);
    return end > start;
  },
  {
    message: 'End date must be after start date',
    path: ['end'],
  }
);

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type QueryParamsInput = z.infer<typeof QueryParamsSchema>;
