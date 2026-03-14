import { Router } from 'express';
import { getAppointmentsForCoach } from '../controllers/appointments.js';

const router = Router();

router.get('/coach/:coachName', getAppointmentsForCoach);

export default router;