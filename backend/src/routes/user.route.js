import { Router } from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getAllUsers, getMessages } from '../controllers/user.controller.js';

const router = Router();

router.get('/', protectRoute, getAllUsers);
router.get('/message/:userId', protectRoute, getMessages);

export default router;
