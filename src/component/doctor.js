import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './component.css'; // Updated CSS file

const Doctors = () => {
    const [doctors, setDoctors] = useState([]); // State to store doctors
    const [search, setSearch] = useState('');  // State for search query

    const BASE_URL = 'http://localhost:7000/api/doctors';

    // Fetch all doctors on component load
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(BASE_URL);
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    // Search doctors based on specialty
    const handleSearch = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/search?specialist=${search}`);
            setDoctors(response.data);
        } catch (error) {
            console.error('Error searching doctors:', error);
        }
    };

    const handleBookAppointment = async (doctorId) => {
        const confirmBooking = window.confirm(
            `Are you sure you want to book an appointment with this doctor ?`
        );

        if (!confirmBooking) {
            return; // Exit if the user cancels
        }
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const patientId = user ? user.id : null;
    
            if (!patientId) {
                alert('User ID is missing! Please log in again.');
                return;
            }
    
            // Get the current date and time
            const now = new Date();
            const date = now.toISOString().split('T')[0]; // Extract date
            const time = now.toISOString().split('T')[1].split('.')[0]; // Extract time
    
            const response = await axios.post(`http://localhost:7000/api/appointments/book`, {
                patientId,
                doctorId,
                date,
                time,
            });
    
            alert(`Appointment booked successfully for ${date} at ${time}!`);
            console.log('Appointment Response:', response.data);
        } catch (error) {
            console.error('Error in booking appointment:', error);
            alert(error.response.data);
        }
    };
    
    return (
        <div className='container'>
            <h1 className='doctor-heading'>Doctors List</h1>

            {/* Search Bar */}
            <div className='doctor-search-bar'>
                <input
                    type="text"
                    className='doctor-search-input'
                    placeholder="Search by specialty"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className='doctor-search-button' onClick={handleSearch}>
                    Search
                </button>
            </div>

            {/* Doctors Table */}
            <table className='doctor-table'>
                <thead>
                    <tr className='doctor-table-header'>
                        <th className='doctor-table-header-cell'>Name</th>
                        <th className='doctor-table-header-cell'>Phone</th>
                        <th className='doctor-table-header-cell'>Specialty</th>
                        <th className='doctor-table-header-cell'>Fee</th>
                        <th className='doctor-table-header-cell'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor._id} className='doctor-table-row'>
                            <td className='doctor-table-cell'>{doctor.name}</td>
                            <td className='doctor-table-cell'>{doctor.phone}</td>
                            <td className='doctor-table-cell'>{doctor.specialist}</td>
                            <td className='doctor-table-cell'>₹500</td>
                            <td className='doctor-table-cell'>
                                <button
                                    className='doctor-book-button'
                                    onClick={() => handleBookAppointment(doctor._id)}
                                >
                                    Book Appointment
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Doctors;
