import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { User as UserModel } from '../models/user.model'
import dotenv from "dotenv"

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

export const registerUser = async (email: string, password: string, name: string, age: string) => {
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error("Email already in use");
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPwd, name, age });
  await user.save();
  return { id: user.id, email: user.email, name: user.name, age: user.age };
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const matchPwd = await bcrypt.compare(password, user.password);
  if (!matchPwd) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, email: user.email, name: user.name, age: user.age }, JWT_SECRET, {
    expiresIn: '10m',
  });

  return { token, user: { id: user.id, email: user.email } };
}