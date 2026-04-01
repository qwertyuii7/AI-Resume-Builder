import express from 'express';
import cors from 'cors';

const router = express.Router();

// Simple test route
router.post('/test', async (req, res) => {
  try {
    console.log('Test route hit:', req.body);
    res.json({ success: true, message: 'Test route working' });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
