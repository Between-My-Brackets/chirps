import { Router } from 'express';
import { polkaWebhookController } from '../controllers/polka.controller.js';

const router = Router();

router.post('/webhooks', polkaWebhookController);

export default router;
