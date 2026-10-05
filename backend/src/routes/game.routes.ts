import { Router } from 'express';
import { getGames, getGameBySlug } from '../controllers/game.controller.ts';

const router = Router();

router.get('/', getGames);
router.get('/:slug', getGameBySlug);

export default router;
