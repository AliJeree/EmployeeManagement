import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

export default function  ForgotPassword () {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    let timer;
    if (error) {
        timer = setTimeout(() => setError(''), 5000);
    }
    return () => clearTimeout(timer);
}, [error]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.forgotPassword(email);
      navigate('/verify-otp');
    } catch (error) {
      setError(error.message ||'Invalid email. Please try again.');
    }
  };

  const handleCancelError = () => {
    setError('');
};

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
          <h2 className='text-center m-4'>Forgot Password</h2>
          {error && (
                        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                            <span>{error}</span>
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleCancelError}></button>
                        </div>
                    )}
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>Email</label>
              <input
                type='email'
                className='form-control'
                placeholder='Enter your email'
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="mt-3 text-center">
              <button type='submit' className='btn btn-primary'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

