import express from 'express';
import { getUserById, getUsersResumes, sendLoginOTP, verifyOTP, googleLogin } from '../controllers/user.controller.js';
import protect from '../middlewares/authMiddleware.js';

const userRouter = express.Router();


userRouter.post('/send-otp', sendLoginOTP);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/google-login', googleLogin);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUsersResumes);

export default userRouter;