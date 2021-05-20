import express from 'express';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  Routes,
  validateRequest,
} from '../common';
import { User } from '../models/user';

const router = express.Router();

router.get(
  `${Routes.follow}/:userId`,
  requireAuth,
  validateRequest,
  async (req, res) => {
    const { userId } = req.params;

    if (userId === req.currentUser!.id) {
      throw new BadRequestError('Cannot follow yourself');
    }

    const userFollow = await User.findById(userId);
    const userFollowing = await User.findById(req.currentUser!.id);

    if (!userFollow || !userFollowing) {
      throw new NotFoundError();
    }

    userFollow.update({
      '$push': {
        'followers': { userId: userFollowing.id },
      },
    });
    await userFollow.save();

    userFollowing.update({
      '$push': {
        'following': { userId: userFollow.id },
      },
    });
    await userFollowing.save();

    res.send(userFollowing);
  },
);

export { router as followRouter };
