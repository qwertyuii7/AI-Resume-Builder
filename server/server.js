import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/user.routes.js';
import resumeRouter from './routes/resume.routes.js';
import aiRouter from './routes/ai.routes.js';
import contactRouter from './routes/contact.routes.js';
import adminRouter from './routes/admin.routes.js';
import paymentRouter from './routes/payment.routes.js';

const app = express();

const PORT = process.env.PORT || 3000;


// Database connection
await connectDB();

app.use(express.json());
app.use(cors({
    origin: ["https://resumefy-pied.vercel.app", "http://localhost:5173"],
    credentials: true
}));

app.get('/', (req, res) => res.send("Server is live..."));
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentRouter);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})