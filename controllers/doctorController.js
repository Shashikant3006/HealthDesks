import Doctor from '../models/doctor.js';

// Fetch all doctors
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}, { name: 1, phone: 1, specialist: 1 });
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
};

// Search doctors by specialty
export const searchDoctorsBySpecialty = async (req, res) => {
    const { specialist } = req.query;
    try {
        const doctors = await Doctor.find({ specialist: { $regex: specialist, $options: 'i' } });
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error searching doctors', error });
    }
};
