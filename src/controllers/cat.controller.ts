import { Request, Response } from "express";
import { fetchCatBreeds, fetchCatBreedById, fetchCatbreedBySearch } from "../services/cat.service";
import { Breed } from "../models/breeds.model";

export const getCatBreeds = async (req: Request, res: Response) => {
  try {
    const data = await fetchCatBreeds();
    res.json(data)
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ error: 'Error while fetching from Third party' });
    return
  }
}

export const getCatBreedById = async (req: Request, res: Response): Promise<Response<Breed>> => {
  const { id } = req.params;
  try {
    const breed = await fetchCatBreedById(id);
    if (!breed) {
      return res.status(400).json({ message: 'Breed not found' });
    }
    return res.json(breed);
  } catch (error) {
    console.error('Error in controller getCatBreedById:', error);
    return res.status(500).json({ error: 'Error while fetching from Third party' });
  }
}

export const getCatbreedBySearch = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid search term' });
  }
  try {
    const breeds: any[] = await fetchCatbreedBySearch(q);
    if (!breeds || !breeds.length) {
      return res.status(400).json({ message: 'Breeds not found' });
    }
    return res.json(breeds);
  } catch (error) {
    console.error('Error in controller getCatBreedBySearch:', error);
    res.status(500).json({ error: 'Error while fetching from Third party' });
    return;
  }
}

