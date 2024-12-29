import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './component.css';

const Patient = () => {
    const [appointments, setAppointments] = useState([]);  // Store all appointments
    const [selectedPatient, setSelectedPatient] = useState(null);  // Store the selected patient
    const [patientHistory, setPatientHistory] = useState([]);  // Store patient appointment history
    const [isModalOpen, setIsModalOpen] = useState(false);  // Track modal open state

    // Fetch the patient's appointments when the component loads
    useEffect(() => {
        const fetchAppointments = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const id = user.id;
            const type = localStorage.getItem('role');
            try {
                const response = await axios.get('http://localhost:7000/api/appointments/getPatient', {
                    params: { userId: id, userType: type }, // Send patient ID and role
                });
                setAppointments(response.data);  // Set appointments data
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    // Handle clicking "View History" button for a patient
    const handleHistory = async (patientId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;
        
        console.log(`userId: ${userId}, patientId: ${patientId}`);  // Log the IDs to ensure they are correct
        
        try {
            const response = await axios.get('http://localhost:7000/api/appointments/getHistory', {
                params: { userId, patientId },
            });
            setPatientHistory(response.data);  // Set patient history from the response
            
            // Find the selected patient from appointments and set it
            const selectedPatient = appointments.find((appointment) => appointment.patientId._id === patientId);
            setSelectedPatient(selectedPatient);  // Set the selected patient details
            setIsModalOpen(true);  // Open the modal after setting selectedPatient
        } catch (error) {
            console.error('Error fetching patient history:', error.response ? error.response.data : error.message);
        }
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
        setPatientHistory([]);  // Clear the patient history when closing the modal
    };

    return (
        <div className="container">
            <table className="report-table">
                <thead>
                    <tr className="report-table-header">
                        <th className="report-table-header-cell">Patient's Name</th>
                        <th className="report-table-header-cell">Phone</th>
                        <th className="report-table-header-cell">Date</th>
                        <th className="report-table-header-cell">History</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                            <td className="doctor-table-cell">{appointment.patientId.name}</td>
                            <td className="doctor-table-cell">{appointment.patientId.phone}</td>
                            <td className="doctor-table-cell">
                                {new Date(appointment.date).toLocaleDateString('en-IN')}
                            </td>
                            <td className="doctor-table-cell">
                                <button
                                    className="doctor-book-button"
                                    onClick={() => handleHistory(appointment.patientId._id)}
                                >
                                    View History
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for viewing patient's history */}
            {isModalOpen && selectedPatient && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>
                            &times; {/* Cross button to close the modal */}
                        </button>
                        <h2>{selectedPatient.patientId.name}</h2>
                        <p>Phone: {selectedPatient.patientId.phone}</p>

                        {/* Table to display patient history */}
                        {patientHistory.length > 0 ? (
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date of Appointment</th>
                                        <th>Paid Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientHistory.map((history) => (
                                        <tr key={history._id}>
                                            <td>{new Date(history.date).toLocaleDateString('en-IN')}</td>
                                            <td>{history.paidAmount ? `₹${history.paidAmount}` : 'Not Paid'}</td>{/* Display paid amount */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No history found for this patient.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patient;
