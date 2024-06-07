import React, { useState } from 'react';
import Select from 'react-select';
import UserService from '../service/UserService';

const jobTitles = [
    { value: "", label: "All Users" },
    { value: "Engineer", label: "Engineers" },
    { value: "Teacher", label: "Teachers" },
    { value: "Doctor", label: "Doctors" },
    { value: "Artist", label: "Artists" },
    { value: "Accountant", label: "Accountants" },
    { value: "Designer", label: "Designers" },
    { value: "Writer", label: "Writers" },
    { value: "Developer", label: "Developers" }
    
];

export default function EmailForm() {
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubjectChange = (e) => {
        setEmailSubject(e.target.value);
    };

    const handleBodyChange = (e) => {
        setEmailBody(e.target.value);
    };

    const handleJobChange = (selectedOptions) => {
        setSelectedJobs(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const encodedJobs = selectedJobs.map(job => encodeURIComponent(job.value));
            await UserService.sendEmailToUsersByJob(emailSubject, emailBody, encodedJobs);
            alert('Emails sent successfully!');
            setEmailSubject('');
            setEmailBody('');
            setSelectedJobs([]);
        } catch (error) {
            alert('Error sending emails: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Send Email to Users</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='subject' className='form-label'>Subject</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter subject'
                                name='subject'
                                value={emailSubject}
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
                                value={emailBody}
                                onChange={handleBodyChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Job Titles</label>
                            <Select
                                isMulti
                                options={jobTitles}
                                value={selectedJobs}
                                onChange={handleJobChange}
                                placeholder="Select job titles..."
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
                            <div>Sending emails to {selectedJobs.length === 0 ? 'all users' : selectedJobs.map(job => job.label ).join(', ')}. This may take a while...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
