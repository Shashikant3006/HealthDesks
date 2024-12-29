import Appointment from '../models/appointment.js';
import Patient from '../models/patient.js';
import Doctor from '../models/doctor.js';
import mongoose from 'mongoose';

// Controller to book an appointment
export const bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time } = req.body;

        if (!patientId || !doctorId || !date || !time) {
            return res.status(400).send("All fields (patientId, doctorId, date, time) are required.");
        }

        // Log date and time for debugging
        // console.log("Date:", date, "Time:", time);

        // Proceed with the existing logic
        const patient = await Patient.findById(patientId);
        const doctor = await Doctor.findById(doctorId);

        if (!patient || !doctor) {
            return res.status(404).send("Invalid Patient or Doctor ID.");
        }

        const isFirstVisit = !await Appointment.exists({ patientId, doctorId });
        const baseFee = 500;
        const discountedFee = isFirstVisit ? baseFee * 0.5 : baseFee;

        if (patient.wallet < discountedFee) {
            return res.status(400).send("Insufficient wallet balance.");
        }

        patient.wallet -= discountedFee;
        doctor.wallet += discountedFee;

        await patient.save();
        await doctor.save();

        const appointment = new Appointment({
            patientId,
            doctorId,
            date,
            time,
            discountUsed: isFirstVisit,
            paidAmount:discountedFee,
        });

        await appointment.save();

        res.status(201).send({
            message: `Appointment booked successfully. Fee: ₹${discountedFee}`,
            isFirstVisit,
            appointment,
        });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).send("An error occurred while booking the appointment.");
    }
};


// Controller to get appointments by patient or doctor
export const getDetails = async (req, res) => {
    const { userId, doctorId } = req.query;

    try {
        // Assuming you have a schema for appointments with patientId and doctorId
        const appointments = await Appointment.find({
            patientId: userId,
            doctorId: doctorId
        }).populate('doctorId', 'doctorName specialty phone');  // Populate doctor details if needed

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Server error');
    }
};

// Controller to update appointment status
export const getAppointments = async (req, res) => {
    try {
        const { userId, userType } = req.query; // Expect query params
        
        if (!userId || !userType) {
            return res.status(400).send("UserId and UserType are required.");
        }

        // Apply filter based on userType
        const filter = userType === 'patient'
            ? { patientId: userId }  // Filter by patient ID if the user is a patient
            : { doctorId: userId };   // Filter by doctor ID if the user is a doctor

        // Fetch appointments, including doctor and patient details
        const appointments = await Appointment.find(filter)
            .populate('doctorId', 'name email phone specialist') // Populate doctor details
            .populate('patientId', 'name email phone')           // Populate patient details
            .select('date time doctorId patientId paidAmount');  // Include 'paidAmount' field here

        // Check if appointments were found
        if (!appointments || appointments.length === 0) {
            return res.status(404).send("No appointments found.");
        }

        // Send the appointments as a response
        res.status(200).send(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).send("An error occurred while fetching appointments.");
    }
};


// Get Patient History
export const getPatientHistory= async(req,res)=>{
    try {
        const { userId, patientId } = req.query;
        // console.log(`Received userId: ${userId}, patientId: ${patientId}`);  

        // Verify that the patientId and userId are valid
        if (!userId || !patientId) {
            return res.status(400).send('Missing required parameters');
        }

        // Logic to fetch the patient's history from the database
        const history = await Appointment.find({ doctorId: userId, patientId: patientId });

        if (!history.length) {
            return res.status(404).send('No history found for the patient');
        }

        res.json(history);
    } catch (error) {
        console.error('Error fetching patient history:', error);  // Log full error for debugging
        res.status(500).send('Error fetching patient history');
    }
}



export const getLastVisits = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).send("UserId is required.");
        }

        const lastVisits = await Appointment.aggregate([
            { $match: { patientId: new mongoose.Types.ObjectId(userId), date: { $type: "date" } } }, // Filter by patientId and valid date
            {
                $group: {
                    _id: "$doctorId", // Group by doctorId
                    lastVisit: { $max: "$date" }, // Get the latest date for each doctor
                },
            },
            {
                $lookup: {
                    from: "doctors", // Join with the Doctor collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "doctorDetails",
                },
            },
            {
                $unwind: "$doctorDetails", // Flatten doctorDetails array
            },
            {
                $project: {
                    doctorName: "$doctorDetails.name",
                    specialist: "$doctorDetails.specialist",
                    phone:"$doctorDetails.phone",
                    lastVisit: 1,
                },
            },
        ]);

        res.status(200).send(lastVisits);
    } catch (error) {
        console.error("Error fetching last visits:", error);
        res.status(500).send("An error occurred while fetching last visits.");
    }
};
