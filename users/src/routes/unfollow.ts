import express from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  Routes,
  validateRequest,
} from '../common';
import { User } from '../models/user';

const router = express.Router();

router.get(
  `${Routes.unfollow}/:userId`,
  requireAuth,
  validateRequest,
  async (req, res) => {
    const { userId } = req.params;

    if (userId === req.currentUser!.id) {
      throw new BadRequestError('Cannot unfollow yourself');
    }

    const userUnfollow = await User.findById(userId);
    const userUnfollowing = await User.findById(req.currentUser!.id);

    if (!userUnfollow || !userUnfollowing) {
      throw new NotFoundError();
    }

    await User.updateOne({
      _id: userUnfollow.id,
    }, {
      '$pull': {
        'followers': {
          userId: userUnfollowing.id,
        },
      },
    });
   
    await User.updateOne({
      _id: userUnfollowing.id,
    }, {
      '$pull': {
        'following': {
          userId: userUnfollow.id,
        },
      },
    });

    const result = await User.findById(req.currentUser!.id);

    res.send(result);
  },
);

export { router as unFollowRouter };
