import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Navbar from './pages/navbar';
import Doctors from './component/doctor';
import Walletbox from './component/Walletbox';
import Reports from './component/Reports';
import Patient from './component/patient';



const App = () => {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/doctors" element={<Doctors/>} />
        <Route path="/wallet" element={<Walletbox/>} />
        <Route path="/report" element={<Reports/>} />
        <Route path="/patients" element={<Patient/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
