import express from 'express';
import { getPreferences, updatePreferences, updateProfile } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

router.put('/profile', updateProfile);

export default router;
