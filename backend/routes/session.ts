import { Router } from 'express';
import { getSession, getPreviousSessionsForPlayer } from '../controllers/session.js';

const router = Router();

router.get('/player/:playerId/sessions', getPreviousSessionsForPlayer);

// GET /api/sessions/:id - Get a single session by ID
router.get('/:id', getSession);

export default router;