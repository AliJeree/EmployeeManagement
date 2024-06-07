import React, { useState } from 'react';
import UserService from '../service/UserService';

const SendEmail = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    try {
      await UserService.sendEmailToAllUsers(subject, body); // No need to store response
      setLoading(false);
      setSuccess('Emails were successfully sent');
      setError(''); // Clear error message
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Failed to send emails. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
          <h2 className='text-center m-4'>Send Email to All Users</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="alert">{success}</div>}
          <form onSubmit={handleSendEmail}>
            <div className='mb-3'>
              <label htmlFor='subject' className='form-label'>Subject</label>
              <input
                type='text'
                className='form-control'
                placeholder='Enter subject'
                name='subject'
                value={subject}
                onChange={handleSubjectChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='body' className='form-label'>Body</label>
              <textarea
                className='form-control'
                placeholder='Enter email body'
                name='body'
                value={body}
                onChange={handleBodyChange}
                required
              />
            </div>
            <div className="mt-3 text-center">
              <button type='submit' className='btn btn-outline-primary' disabled={loading}>
                {loading ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>
          {loading && (
            <div className="text-center mt-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Sending emails to all users. This may take a while...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
