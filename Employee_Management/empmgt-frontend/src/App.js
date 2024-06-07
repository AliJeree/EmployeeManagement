import React, { useState, useEffect } from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import FooterComponent from './components/common/Footer';
import UserService from './components/service/UserService'; // Updated import path
import UpdateUser from './components/userspage/UpdateUser';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';
import ResetPassword from './components/reset_password/ResetPassword';
import ForgotPassword from './components/reset_password/ForgotPassword';
import OtpVerification from './components/reset_password/OtpVerification';
import SendEmail from './components/function/SendEmail';

function App() {
  const [email, setEmail] = useState('');

  // Fetch or store the email value when the component mounts or whenever it changes
  useEffect(() => {
    // Example: Fetch email from local storage or session storage
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="d-flex flex-column min-vh-100">
          <main className="flex-grow-1">
            <Routes>
              <Route exact path="/" element={<LoginPage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/forgot-password/verify-email" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* Pass email as a prop to OtpVerification component */}
              <Route path="/verify-otp" element={<OtpVerification email={email} />} />
              {/* Check if user is authenticated and admin before rendering admin-only routes */}
              {UserService.adminOnly() && (
                <>
                  <Route path="/register" element={<RegistrationPage />} />
                  <Route path="/admin/user-management" element={<UserManagementPage />} />
                  <Route path="/update-user/:userId" element={<UpdateUser />} />
                  <Route path="/generate" element={<ProfilePage />} />
                  <Route path="/send-email" element={<SendEmail />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;
