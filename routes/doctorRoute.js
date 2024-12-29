import express from 'express';
import { getAllDoctors, searchDoctorsBySpecialty } from '../controllers/doctorController.js';

const router = express.Router();

// Route to fetch all doctors
router.get('/', getAllDoctors);

// Route to search doctors by specialty
router.get('/search', searchDoctorsBySpecialty);

export default router;
