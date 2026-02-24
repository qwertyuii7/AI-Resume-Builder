import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { clonePublicResume, createResume, deleteResume, getPublicResumeById, getPublicResumes, getResumeById, updateResume } from '../controllers/resumeController.js';
import upload from '../configs/multer.js';

const resumeRouter = express.Router();


resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public', getPublicResumes);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
resumeRouter.post('/public/:resumeId/clone', protect, clonePublicResume);

export default resumeRouter;