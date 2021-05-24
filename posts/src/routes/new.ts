import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, Routes, validateRequest } from '../common';
import { Post } from '../models/post';

const router = express.Router();

router.post(
  Routes.posts,
  requireAuth,
  [
    body('content').not().isEmpty().withMessage('Content is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { content } = req.body;

    const post = await Post.build({
      content,
      userId: req.currentUser!.id,
    });

    await post.save();

    res.status(201).send(post);
  },
);

export { router as newPostRouter };
