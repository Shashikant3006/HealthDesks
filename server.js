import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js'; 
import doctorRoute from './routes/doctorRoute.js';
import appointmentRoutes from './routes/appointmentRoute.js';
import walletRoute from './routes/walletRoute.js';
import connectDB from './config/db.js';

import cors from 'cors';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Adjust to your frontend URL
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the appointment system!');
});

app.use("/api/auth/v1", authRoute);
app.use('/api/doctors', doctorRoute);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/wallet', walletRoute); // Remove the extra '/' at the end

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
