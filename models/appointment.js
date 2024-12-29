import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    discountUsed: { type: Boolean, default: false },
    paidAmount: {
        type: Number,  // Ensure this is a number
        required: true,
    },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
