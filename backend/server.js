import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js'; // Ensure db.js also uses ES module exports
import authRoute from "./routes/authRoute.js"
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: '*', // Replace with specific origin in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Serve static uploads folder
app.use('/uploads', express.static('uploads'));

app.use("/api/auth",authRoute);
app.use("/api/sessions",sessionRoute);
app.use("/api/questions",questionRoute);

app.use('/api/ai/generate-questions',protect, generateInterviewQuestion);
app.use('api/ai/generate-explanations',protect,generateConceptExplanation);

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
