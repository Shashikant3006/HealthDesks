// Import necessary modules
import Patient from '../models/patient.js';  // Adjust the path to your Patient model
import Doctor from '../models/doctor.js';    // Adjust the path to your Doctor model


// Controller function to fetch wallet balance for patient or doctor
export const getWalletMoney = async (req, res) => {
  const { patientId, doctorId } = req.query;

  try {
    let user;
    
    if (patientId) {
      // For patient
    //   console.log('Fetching wallet for patient ID:', patientId);
      user = await Patient.findById(patientId);
      if (!user) return res.status(404).json({ message: 'Patient not found.' });
      return res.status(200).json({ walletBalance: user.wallet });
    }

    if (doctorId) {
      // For doctor
      console.log('Fetching wallet for doctor ID:', doctorId);
      user = await Doctor.findById(doctorId);
      if (!user) return res.status(404).json({ message: 'Doctor not found.' });
      return res.status(200).json({ walletBalance: user.wallet });
    }

    return res.status(400).json({ message: 'Invalid request. Patient ID or Doctor ID required.' });
  } catch (error) {
    console.error('Error fetching wallet money:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};


export const addWalletMoney = async (req, res) => {
    const { amount, patientId, doctorId } = req.body;  // Assuming the amount and IDs are sent in the request body
  
    console.log('Received request data:', req.body);  // Log request body for debugging
  
    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount. Please provide a valid amount greater than zero.' });
    }
  
    try {
      let user;
  
      // Fetch patient data
      if (patientId) {
        user = await Patient.findById(patientId);
        if (!user) return res.status(404).json({ message: 'Patient not found.' });
  
        // Add money to the patient's wallet
        user.wallet += amount;
        await user.save();  // Save the updated user
  
        return res.status(200).json({ walletBalance: user.wallet });  // Return the updated wallet balance
      }
  
      // Fetch doctor data
      if (doctorId) {
        user = await Doctor.findById(doctorId);
        if (!user) return res.status(404).json({ message: 'Doctor not found.' });
  
        // Add money to the doctor's wallet
        user.wallet += amount;
        await user.save();  // Save the updated user
  
        return res.status(200).json({ walletBalance: user.wallet });  // Return the updated wallet balance
      }
  
      // Return error if neither patientId nor doctorId is provided
      return res.status(400).json({ message: 'Invalid request. Patient ID or Doctor ID required.' });
    } catch (error) {
      console.error('Error adding money to wallet:', error);
      res.status(500).json({ message: 'Internal Server Error.' });
    }
  };