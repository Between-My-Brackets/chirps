import { Router } from 'express';
import { loginController, refreshController, revokeController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/revoke', revokeController);

export default router;
