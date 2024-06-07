import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../service/UserService';

export default function  ResetPassword () {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
      
      if (!password.match(passwordRegex)) {
        setError('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        return;
      }
      await UserService.resetPassword(token, password);
      setError('');
      const successMessage = 'Password reset successful. You will be redirected to the login page shortly. Please login with your new password.';
      setSuccess(successMessage);
      setTimeout(() => {
        navigate(`/login?success=${successMessage}`);
      }, 7000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Invalid request. Please check your input and try again.');
      } else {
        const successMessage = 'Password reset successful. You will be redirected to the login page shortly. Please login with your new password.';
        setSuccess(successMessage);
        setTimeout(() => {
          navigate(`/login?success=${successMessage}`);
        }, 7000);
      }
    }
  };

  const handleCancelError = () => {
    setError('');
  };

  const handleCancelSuccess = () => {
    setSuccess('');
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
          <h2 className='text-center m-4'>Reset Password</h2>
          {error && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
              <span>{error}</span>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleCancelError}></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success d-flex justify-content-between align-items-center" role="alert">
              <span>{success}</span>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleCancelSuccess}></button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='newPassword' className='form-label'>New Password</label>
              <input
                type='password'
                className='form-control'
                placeholder='Enter new password'
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {error && <div className="text-danger">{error}</div>}
            </div>
            <div className='mb-3'>
              <label htmlFor='confirmPassword' className='form-label'>Confirm New Password</label>
              <input
                type='password'
                className='form-control'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
            <div className="mt-3 text-center">
              <button type='submit' className='btn btn-outline-primary'>Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

