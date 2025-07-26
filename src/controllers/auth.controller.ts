import { Request, Response } from "express";
import { User } from "../models/user.model";
import { loginUser, registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password, name, age } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  if (!password) {
    return res.status(400).json({ message: "Missing password" });
  }

  try {
    const user = await registerUser(email, password, name, age);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error while user registration", error);
    return res.status(404).json({ message: "Error while user registration", error })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  if (!password) {
    return res.status(400).json({ message: "Missing password" });
  }
  try {
    const user = await loginUser(email, password);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error while login user: ", error);
    return res.status(400).json({ message: "Error login user", error });
  }
}