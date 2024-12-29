import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // State to store user role
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const specialist = localStorage.getItem('specialist'); // Get specialist field
    const registrationNo = localStorage.getItem('registrationNo'); // Get doctor's registration number

    // Verify token to determine if logged in
    setIsLoggedIn(!!token);

    // Determine role based on `specialist` and `doctorRegistrationNo`
    if (specialist && registrationNo) {
      setUserRole('doctor');
    } else {
      setUserRole('patient'); // Default to patient if doctor fields are missing
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('specialist');
    localStorage.removeItem('registrationNo');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Health Desk
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        ) : (
          <>
            {/* Render links based on user role */}
            {userRole === 'doctor' && (
              <>
              <li>
                <Link to="/patients">Patients</Link>
              </li>
               <li>
               <Link to="/wallet">Wallet</Link>
             </li>
             </>
            )}
            {userRole === 'patient' && (
              <>
                <li>
                  <Link to="/doctors">Doctors</Link>
                </li>
                <li>
                  <Link to="/wallet">Wallet</Link>
                </li>
                <li>
                  <Link to="/report">Reports</Link>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
