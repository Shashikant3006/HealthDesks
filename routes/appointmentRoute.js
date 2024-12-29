import express from 'express';
import { bookAppointment, getAppointments,getLastVisits, getDetails, getPatientHistory } from '../controllers/appointmentController.js';

const router = express.Router();

// Route to book an appointment
router.post('/book', bookAppointment);

// Route to get appointments (for patient or doctor)
router.get('/get', getDetails);

// Route to update appointment status
router.get('/getPatient',getAppointments);
router.get('/getHistory',getPatientHistory);

router.get('/getLast',getLastVisits)

export default router;
