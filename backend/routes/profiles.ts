import { Router } from 'express';
import { getAllProfiles, getProfileById, getPlayerAverages } from '../controllers/profile.js';

const router = Router();

router.get('/', getAllProfiles);

router.get('/:playerId/averages', getPlayerAverages);

router.get('/:id', getProfileById);

export default router;