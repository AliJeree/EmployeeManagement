import React, { useState } from 'react';
import UserService from '../service/UserService';
import { Link, useNavigate } from 'react-router-dom';

export default function AddUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: '',
        city: '',
        job: ''
    });
    const [emailError, setEmailError] = useState('');

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email') {
            try {
                const isUnique = await UserService.checkEmailUnique(value);
                setEmailError(isUnique ? '' : 'Email already exists');
            } catch (error) {
                setEmailError('Email already exists');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) {
            alert(emailError);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await UserService.register(formData, token);
            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                role: '',
                city: '',
                job: ''
            });
            alert('User registered successfully');
            navigate('/admin/user-management');
        } catch (error) {
            alert('An error occurred while registering user');
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add Employee</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Firstname' className='form-label'>First Name</label>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Enter First Name'
                                name='firstname'
                                value={formData.firstname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Lastname' className='form-label'>Last Name</label>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Enter Last Name'
                                name='lastname'
                                value={formData.lastname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Email' className='form-label'>Email</label>
                            <input
                                type="text"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                placeholder='Enter Email Address'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Job' className='form-label'>Job</label>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Enter Job'
                                name='job'
                                value={formData.job}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='City' className='form-label'>City</label>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Enter City'
                                name='city'
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input
                                type="password"
                                className='form-control'
                                placeholder='Enter Password'
                                name='password'
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='role' className='form-label'>Role</label>
                            <select
                                className='form-select'
                                id='role'
                                name='role'
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value=''>Select Role</option>
                                <option value='ADMIN'>ADMIN</option>
                                <option value='USER'>USER</option>
                            </select>
                        </div>

                        <button type='submit' className='btn btn-outline-primary'>Submit</button>
                        <Link className='btn btn-outline-danger mx-2' to="/profile">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
