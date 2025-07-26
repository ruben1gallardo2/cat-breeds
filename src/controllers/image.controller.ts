import { Request, Response } from "express";
import { Breed } from "../models/breeds.model";
import { fetchCatBreedById } from "../services/cat.service";
import { fetchImageByBreedId } from "../services/image.service";
import { Image } from "../models/image.model";



export const getImageByBreedId = async (req: Request, res: Response) => {
  let breedById: Breed | null = null;
  let image: Image;
  const { id } = req.params;

  try {
    breedById = await fetchCatBreedById(id);
  } catch (error) {
    console.error('Error in controller getImageByBreedId:', error);
    return res.status(500).json({ error: 'Error while fetching from Third party' });
  }

  if (!breedById) {
    return res.status(400).json({ message: 'Breed not found' });
  }

  try {
    image = await fetchImageByBreedId(breedById?.reference_image_id)
  } catch (error) {
    console.error('Error in controller getImageByBreedId fetching image:', error);
    return res.status(500).json({ error: 'Error while fetching from Third party images' });
  }

  if (!image) {
    return res.status(400).json({ message: `Image for Breed: ${breedById.name} not found` });
  }

  return res.json(image);
}