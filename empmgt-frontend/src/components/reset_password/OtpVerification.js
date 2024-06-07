import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

export default function  OtpVerification () {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const countdownRef = useRef(null);
  const errorTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);

  useEffect(() => {
    startCountdown();
    return () => {
      clearInterval(countdownRef.current);
      clearTimeout(errorTimeoutRef.current);
      clearTimeout(successTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (error) {
      errorTimeoutRef.current = setTimeout(() => setError(''), 5000);
    }
    if (success) {
      successTimeoutRef.current = setTimeout(() => setSuccess(''), 5000);
    }
    return () => {
      clearTimeout(errorTimeoutRef.current);
      clearTimeout(successTimeoutRef.current);
    };
  }, [error, success]);

  const startCountdown = () => {
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(countdownRef.current);
          return 0;
        }
      });
    }, 1000);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await UserService.verifyOTP(email, otp);
      if (result.token) {
        setSuccess('OTP verified successfully, redirecting to change password. This will only take a second..');
        setError('');
        setTimeout(() => {
          navigate(`/reset-password?token=${result.token}`);
        }, 3000);
      } else {
        setError('Failed to verify OTP');
        setSuccess('');
      }
    } catch (error) {
      setError(error.message || 'Failed to verify OTP. Please try again.');
      setSuccess('');
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email to resend OTP.');
      setSuccess('');
      return;
    }
    try {
      await UserService.forgotPassword(email);
      setSuccess('OTP sent successfully');
      setError('');
      setTimer(30);
      startCountdown();
    } catch (error) {
      setError(error.response?.data || 'Email does not exist.');
      setSuccess('');
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
          <h2 className='text-center m-4'>OTP Verification</h2>
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
          <form onSubmit={handleVerifyOTP}>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>Email</label>
              <input
                type='email'
                className='form-control'
                placeholder='Enter your email'
                name='email'
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='otp' className='form-label'>OTP</label>
              <input
                type='text'
                className='form-control'
                placeholder='Enter OTP'
                name='otp'
                value={otp}
                onChange={handleOTPChange}
                required
              />
            </div>
            <div className="mt-3 text-center">
              <button type='submit' className='btn btn-outline-primary'>Verify OTP</button>
            </div>
            <div className="mt-3 text-center">
              <button
                type='button'
                className={`btn ${timer > 0 ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                onClick={handleResendOTP}
                disabled={timer > 0}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
