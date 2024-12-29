import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './component.css';

const Reports = () => {
    const [lastVisits, setLastVisits] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);  // Store all appointments
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchLastVisits = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user.id;
            try {
                const response = await axios.get('http://localhost:7000/api/appointments/getLast', {
                    params: { userId },
                });
                setLastVisits(response.data);
            } catch (error) {
                console.error('Error fetching last visits:', error);
            }
        };

        fetchLastVisits();
    }, []);

    const handleHistory = async (doctorId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;

        try {
            const response = await axios.get('http://localhost:7000/api/appointments/get', {
                params: { userId, doctorId },
            });
            setAppointments(response.data);  // Store the appointments in the state
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }

        const doctor = lastVisits.find((visit) => visit._id === doctorId);
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
        setAppointments([]);  // Clear the appointments when closing the modal
    };

    return (
        <div className='container'>
            <table className='report-table'>
                <thead>
                    <tr className='report-table-header'>
                        <th className='report-table-header-cell'>Doctor's Name</th>
                        <th className='report-table-header-cell'>Specialty</th>
                        <th className='report-table-header-cell'>Phone</th>
                        <th className='report-table-header-cell'>Last Visit</th>
                        <th className='report-table-header-cell'>History</th>
                    </tr>
                </thead>
                <tbody>
                    {lastVisits.map((visit) => (
                        <tr key={visit._id}>
                            <td className='doctor-table-cell'>{visit.doctorName}</td>
                            <td className='doctor-table-cell'>{visit.specialist}</td>
                            <td className='doctor-table-cell'>{visit.phone}</td>
                            <td className='doctor-table-cell'>
                                {visit.lastVisit ? new Date(visit.lastVisit).toLocaleDateString('en-IN') : 'Invalid Date'}
                            </td>
                            <td className='doctor-table-cell'>
                                <button
                                    className='doctor-book-button'
                                    onClick={() => handleHistory(visit._id)}
                                >
                                    View History
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for viewing doctor's history */}
            {isModalOpen && selectedDoctor && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>
                            &times; {/* Cross button to close the modal */}
                        </button>
                        <h2>{selectedDoctor.doctorName}</h2>
                        <p>Specialty: {selectedDoctor.specialist}</p>
                        <p>Phone: {selectedDoctor.phone}</p>

                        {/* Table to display appointment history */}
                        {appointments.length > 0 ? (
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date of Appointment</th>
                                        <th>Paid Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment._id}>
                                            <td>{new Date(appointment.date).toLocaleDateString('en-IN')}</td>
                                            <td>{appointment.paidAmount}</td>{/* Display paid amount */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No appointments found for this doctor.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
