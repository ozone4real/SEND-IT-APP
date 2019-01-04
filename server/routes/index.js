import { Router } from 'express';
import parcels from './parcels';
import { auth, user } from './user';

const router = Router();

router.use('/parcels', parcels);
router.use('/user', user);
router.use('/auth', auth);

export default router;
