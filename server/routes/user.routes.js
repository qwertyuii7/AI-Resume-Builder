import express from 'express';
import { getUserById, getUsersResumes, loginUser, registerUser } from '../controllers/user.controller.js';
import protect from '../middlewares/authMiddleware.js';

const userRouter = express.Router();


userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUsersResumes);

export default userRouter;