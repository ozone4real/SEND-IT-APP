import { Router } from 'express';
import parcels from './parcels';
import { auth, users } from './users';

const router = Router();

router.use('/parcels', parcels);
router.use('/users', users);
router.use('/auth', auth);
router.all('*', (req, res) => {
  res.status(404).json({
    message: 'Welcome to SENDIT. How are you doing?'
  });
});

export default router;
