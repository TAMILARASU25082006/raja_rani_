import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  nickname: string;
  email: string;
  passwordHash: string;
  gamesPlayed: number;
  totalScore: number;
  wins: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    nickname: {
      type: String,
      required: [true, 'Nickname is required'],
      trim: true,
      minlength: [2, 'Nickname must be at least 2 characters'],
      maxlength: [20, 'Nickname cannot exceed 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    wins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
