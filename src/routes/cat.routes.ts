import { Router } from "express";
import { getCatBreeds, getCatBreedById, getCatbreedBySearch } from "../controllers/cat.controller";

const router = Router();

router.get('/breeds', getCatBreeds);

router.get('/breed/:id', getCatBreedById)

router.get('/breeds/search', getCatbreedBySearch)

export default router;