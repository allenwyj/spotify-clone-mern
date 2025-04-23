import { Router } from 'express';
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
} from '../controllers/admin.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

// middleware to protect routes
router.use(protectRoute, requireAdmin);

router.get('/check', checkAdmin);

router.post('/songs', createSong);
router.delete('/songs/:id', deleteSong);

router.post('/albums', createAlbum);
router.delete('/albums/:id', deleteAlbum);

export default router;
