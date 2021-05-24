import express, { Request, Response } from 'express';
import { requireAuth, Routes } from '../common';
import { Post } from '../models/post';

const router = express.Router();

router.get(Routes.posts, requireAuth, async (req: Request, res: Response) => {
  
});

export { router as indexPostRouter };
