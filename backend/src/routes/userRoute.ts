import { Router } from 'express';
const router = Router();

// Example route
router.get('/signup', (req, res) => {
  res.send('User registration');
});

export default router; 
