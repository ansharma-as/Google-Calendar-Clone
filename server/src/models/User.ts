import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'month' | 'week' | 'day';
  weekStartsOn: 0 | 1;
  timeFormat: '12h' | '24h';
  defaultEventColor: string;
  defaultEventDuration: number;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const UserPreferencesSchema = new Schema<IUserPreferences>({
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system',
  },
  defaultView: {
    type: String,
    enum: ['month', 'week', 'day'],
    default: 'month',
  },
  weekStartsOn: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  timeFormat: {
    type: String,
    enum: ['12h', '24h'],
    default: '12h',
  },
  defaultEventColor: {
    type: String,
    default: '#3b82f6',
  },
  defaultEventDuration: {
    type: Number,
    default: 60,
    min: 15,
    max: 480,
  },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  preferences: {
    type: UserPreferencesSchema,
    default: () => ({}),
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateAuthToken = function (): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

UserSchema.index({ email: 1 });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
