import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  email: string,
  password: string,
  name: string,
  age: number
}

const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true},
  name: { type: String },
  age: { type: Number },
  password: { type: String, required: true }
});

export default mongoose.model<User>('User', UserSchema);