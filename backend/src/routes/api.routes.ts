import { Router } from 'express';
import chirpRouter from './chirp.routes.js';
import userRouter from './user.routes.js';
import authRouter from './auth.routes.js';
import polkaRouter from './polka.routes.js';
import { healthReadiness } from '../controllers/health.controller.js';

const router = Router();

router.get('/healthz', healthReadiness);
router.use('/chirps', chirpRouter);
router.use('/users', userRouter);
router.use('/', authRouter); // for /login, /refresh, /revoke
router.use('/polka', polkaRouter);

export default router;
