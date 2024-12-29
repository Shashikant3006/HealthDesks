import Patient from '../models/patient.js';
import Doctor from '../models/doctor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerPatient = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        let user = await Patient.findOne({ email });
        if(user){
            res.status(202).json({message: 'This Email Already Registered'});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const patient = new Patient({ name, email, phone, password: hashedPassword });
        await patient.save();
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const registerDoctor = async (req, res) => {
    const { name, email, phone, specialist, registrationNo, password } = req.body;
    try {
        let user = await Doctor.findOne({ email });
        if(user){
            res.status(202).json({message: 'This Email Already Registered'});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const doctor = new Doctor({ name, email, phone, specialist, registrationNo, password: hashedPassword });
        await doctor.save();
        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body; // Role is not taken from the client

    try {
        // Check both Patient and Doctor collections
        let user = await Patient.findOne({ email });
        let role = 'patient'; // Default role

        if (!user) {
            user = await Doctor.findOne({ email });
            role = 'doctor'; // Update role if found in Doctor collection
        }

        // If user is not found in either collection
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a JWT token with user ID and role
        const token = jwt.sign(
            { id: user._id, role }, // Include the role in the token payload
            process.env.SECRET,
            { expiresIn: '1d' } // Token validity: 1 day
        );

        // Respond with the token and user details
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role, // Include the role in the response
            },
        });
    } catch (error) {
        console.error('Error in login API:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
