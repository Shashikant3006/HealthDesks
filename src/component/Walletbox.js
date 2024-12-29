import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './component.css';

const Walletbox = () => {
  const [balance, setBalance] = useState(0); // Initial balance
  const [addAmount, setAddAmount] = useState('');
  const BASE_URL = 'http://localhost:7000';

  const getBalance = async () => {
    try {
      const role = localStorage.getItem('role');
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.id : null; // Fetch userId from localStorage

      if (!userId) {
        alert('User ID is missing!');
        return; // Early return if userId is not found
      }

      let endpoint = '';
      let userIdField = '';
      
      if (role === 'doctor') {
        endpoint = `${BASE_URL}/api/wallet/getbalance`;
        userIdField = 'doctorId';
      } else {
        endpoint = `${BASE_URL}/api/wallet/getbalance`;
        userIdField = 'patientId';
      }
      
      const response = await axios.get(endpoint, { params: { [userIdField]: userId } });
      setBalance(response.data.walletBalance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      alert('Could not fetch wallet balance. Please try again later.');
    }
  };

  // Add money to the wallet
  const handleAddMoney = async () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0 || amount > 2000) {
      alert('Please enter a valid amount (up to ₹2000).');
      return;
    }
  
    const role = localStorage.getItem('role');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.id : null;
  
      if (!userId) {
        alert('User ID is missing!');
        return; // Early return if userId is not found
      }
  
      // Declare response variable
      let response;
  
      if (role === 'doctor') {
        // Send request to backend for doctor
        response = await axios.post(`${BASE_URL}/api/wallet/addmoney`, {
          doctorId: userId,  // Use doctorId for doctors
          amount,
        });
      } else {
        // Send request to backend for patient
        response = await axios.post(`${BASE_URL}/api/wallet/addmoney`, {
          patientId: userId,  // Use patientId for patients
          amount,
        });
      }
  
      // Assuming the response contains walletBalance
      setBalance(response.data.walletBalance);  // Update balance with wallet balance from the backend
      setAddAmount(''); // Reset the input field
      alert(`₹${amount} added successfully!`);
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Could not add money. Please try again later.');
    }
  };
  
  // Fetch balance on component load
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div className="walletbox-container">
      <h3 className="walletbox-heading">Wallet</h3>
      <div className="walletbox-balance">
        <span className="walletbox-label">Current Balance:</span>
        <span className="walletbox-value">₹{balance}</span>
      </div>
      <div className="walletbox-add-money">
        <input
          type="number"
          placeholder="Enter amount (max ₹2000)"
          value={addAmount}
          onChange={(e) => setAddAmount(e.target.value)}
          className="walletbox-input"
        />
        <button onClick={handleAddMoney} className="walletbox-button">
          Add Money
        </button>
      </div>
    </div>
  );
};

export default Walletbox;
