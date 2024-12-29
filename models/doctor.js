import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    specialist:{
        type: String,
        required: true
    },
    registrationNo:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wallet: {
        type: Number,
        default: 0, // Initial balance
    }
    
    // Additional patient details...
});
const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;