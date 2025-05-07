import { User } from '../models/user.model.js';

export const authCallback = async (req, res, next) => {
  try {
    console.log('auth callback');
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if user exists
    const userExists = await User.findOne({ clerkId: id });

    if (!userExists) {
      // signup
      await User.create({
        clerkId: id,
        fullName: `${firstName || ''} ${lastName || ''}`.trim(),
        imageUrl,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
