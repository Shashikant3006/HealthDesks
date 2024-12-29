import React, { useState } from 'react';
import axios from 'axios';
import '../Auth.css'; // Add your custom styles here

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 'patient', // Default user type is patient
    specialist: '', // For doctors
    registrationNo: '', // For doctors
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('All fields are required!');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long.');
      return;
    }

    if (formData.userType === 'doctor' && (!formData.specialist || !formData.registrationNo)) {
      setErrorMessage('Please provide both specialty and registration number for doctors.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      // Determine the API endpoint
      const apiEndpoint =
        formData.userType === 'patient'
          ? 'http://localhost:7000/api/auth/v1/register-patient'
          : 'http://localhost:7000/api/auth/v1/register-doctor';

      const response = await axios.post(apiEndpoint, formData);

      if (response.status === 201) {
        alert('Registration successful!');
        window.location.href = '/login';
      }else{
        setErrorMessage('Email Already registered');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
            <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            </div>
          
            <div className="form-group">
          <label>User Type</label>
          <div>
            <input
              type="radio"
              id="patient"
              name="userType"
              value="patient"
              checked={formData.userType === 'patient'}
              onChange={handleChange}
            />
            <label htmlFor="patient">Patient</label>

            <input
              type="radio"
              id="doctor"
              name="userType"
              value="doctor"
              checked={formData.userType === 'doctor'}
              onChange={handleChange}
            />
            <label htmlFor="doctor">Doctor</label>
          </div>
        </div>


        {/* Additional fields for doctors */}
        {formData.userType === 'doctor' && (
          <>
            <div className="form-group">
              <label htmlFor="specialist">Specialist</label>
              <input
                type="text"
                id="specialist"
                name="specialist"
                value={formData.specialist}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="registrationNo">Registration No.</label>
              <input
                type="text"
                id="registrationNo"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
