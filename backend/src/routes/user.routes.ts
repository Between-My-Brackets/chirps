import { Router } from 'express';
import { createUserController, updateUserController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/', createUserController);
router.put('/', authenticate, updateUserController);

export default router;
