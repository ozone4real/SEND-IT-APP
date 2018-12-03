import { Router } from 'express';
import parcels from './parcels';
import { auth, user } from './user';

const router = Router();

router.use('/parcels', parcels);
router.use('/user', user);
router.use('/auth', auth);
router.all('*', (req, res) => {
  res.status(200).json({
    message: 'Welcome to SENDIT. How are you doing?'
  });
});

export default router;
