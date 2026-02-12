import { Router } from 'express';
import { createChirpController, getChirpsController, getChirpByIdController, deleteChirpController } from '../controllers/chirp.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, async (req, res, next) => {
    try {
        await createChirpController(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await getChirpsController(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/:chirpId', async (req, res, next) => {
    try {
        await getChirpByIdController(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/:chirpId', authenticate, async (req, res, next) => {
    try {
        await deleteChirpController(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;
