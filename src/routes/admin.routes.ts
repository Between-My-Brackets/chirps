import { Router } from 'express';
import { handlerMetrics, handlerReset, healthReadiness } from '../controllers/admin.controller.js';

const router = Router();

// Note: The original file had a wrapper for metrics and reset handlers to catch promises.
// It's a good practice, so we'll keep it.
router.get('/healthz', healthReadiness);

router.get('/metrics', (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next);
});

router.post('/reset', (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next);
});

export default router;
