import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
          <h2 className='text-center m-4'>Forgot Password</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
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

export default ForgotPassword;
