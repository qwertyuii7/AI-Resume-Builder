import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// import connectDB from './configs/db.js';
import userRouter from './routes/user.routes.js';
import resumeRouter from './routes/resume.routes.js';
import aiRouter from './routes/ai.routes.js';
import contactRouter from './routes/contact.routes.js';
import adminRouter from './routes/admin.routes.js';
import studioRouter from './routes/studio.routes.js';
import systemRouter from './routes/system.routes.js';
import aiStudioRouter from './routes/ai-studio-simple.routes.js';
// import chatbotRouter from './routes/chatbot.routes.js';
import simpleTestRouter from './routes/simple-test.routes.js';

const app = express();

const PORT = process.env.PORT || 3000;

// Database connection
// await connectDB();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

app.get('/', (req, res) => res.send("Server is live..."));
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);
app.use('/api/studio', studioRouter);
app.use('/api/system', systemRouter);
app.use('/api/ai-studio', aiStudioRouter);
app.use('/api/test', simpleTestRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})