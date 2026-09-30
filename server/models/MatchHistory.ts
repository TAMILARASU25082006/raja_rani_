import mongoose, { Schema, Document } from 'mongoose';

export interface IMatchHistory extends Document {
  roomCode: string;
  totalPlayers: number;
  durationSeconds: number;
  policeSuccess: boolean;
  thiefCaught: boolean;
  royalWinner: string; // King's nickname
  players: Array<{
    userId?: string;
    nickname: string;
    roleId: number;
    roleName: string;
    score: number;
  }>;
  createdAt: Date;
}

const MatchHistorySchema: Schema = new Schema(
  {
    roomCode: { type: String, required: true },
    totalPlayers: { type: Number, required: true },
    durationSeconds: { type: Number, required: true },
    policeSuccess: { type: Boolean, required: true },
    thiefCaught: { type: Boolean, required: true },
    royalWinner: { type: String, required: true },
    players: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        nickname: { type: String, required: true },
        roleId: { type: Number, required: true },
        roleName: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MatchHistory = mongoose.model<IMatchHistory>('MatchHistory', MatchHistorySchema);
