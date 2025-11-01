import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder {
  minutesBefore: number;
  method: 'popup' | 'email';
}

export interface IRecurrence {
  rule: string;
  dtstart: Date;
  until?: Date;
  exdates?: Date[];
}

export interface IEvent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  location?: string;
  color?: string;
  allDay: boolean;
  start: Date;
  end: Date;
  recurrence?: IRecurrence;
  reminders?: IReminder[];
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema = new Schema<IReminder>({
  minutesBefore: {
    type: Number,
    required: true,
    min: 0,
  },
  method: {
    type: String,
    enum: ['popup', 'email'],
    required: true,
  },
}, { _id: false });

const RecurrenceSchema = new Schema<IRecurrence>({
  rule: {
    type: String,
    required: true,
  },
  dtstart: {
    type: Date,
    required: true,
  },
  until: {
    type: Date,
    required: false,
  },
  exdates: {
    type: [Date],
    default: [],
  },
}, { _id: false });

const EventSchema = new Schema<IEvent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    default: '#3b82f6',
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  recurrence: {
    type: RecurrenceSchema,
    required: false,
  },
  reminders: {
    type: [ReminderSchema],
    default: [],
  },
}, {
  timestamps: true,
});

EventSchema.index({ userId: 1, start: 1, end: 1 });

const Event = mongoose.model<IEvent>('Event', EventSchema);

export default Event;
