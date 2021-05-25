import express, { Request, Response } from 'express';
import { requireAuth, Routes } from '../common';
import { Post, PostDoc } from '../models/post';

const router = express.Router();

router.get(Routes.posts, requireAuth, async (req: Request, res: Response) => {
  const following = req.currentUser!.following;
  following.push({ userId: req.currentUser!.id });

  let posts = [];
  for (const user of following) {
    const userPosts = await Post.find({ userId: user.userId });

    if (userPosts) {
      for (const post of userPosts) {
        posts.push(post);
      }
    }
  }

  res.send(posts);
});

export { router as indexPostRouter };
