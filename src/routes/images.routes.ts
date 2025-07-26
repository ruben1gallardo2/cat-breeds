import { Router } from "express";
import { getImageByBreedId } from "../controllers/image.controller";

const router = Router();

router.get('/breed/:id', getImageByBreedId);

export default router;