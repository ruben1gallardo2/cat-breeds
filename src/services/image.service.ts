import { Request, Response } from "express";
import { Image } from "../models/image.model";
import dotenv from "dotenv"

dotenv.config();

const headers = {
	'Content-Type': 'application/json',
	'x-api-key': process.env.API_KEY || '',
};

export const fetchImageByBreedId = async (imageId: string): Promise<Image> => {
  const response = await fetch(`https://api.thecatapi.com/v1/images/${imageId}`, {
    method: 'GET',
    headers
  })

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to fetch image id by breed ${response.statusText}`);
  }
  return data;
}