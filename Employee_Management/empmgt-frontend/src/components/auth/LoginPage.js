import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';


export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await UserService.login(email, password)
            if (userData.token) {
                localStorage.setItem('token', userData.token)
                localStorage.setItem('role', userData.role)
                navigate('/profile')
                window.location.reload();
            } else {
                setError(userData.message)
            }

        } catch (error) {
            setError(error.message)
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Login</h2>
                    {error && <div class="alert alert-danger" role="alert">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Email' className='form-label'>
                                Email
                            </label>
                            <input
                                type={"text"}
                                className='form-control'
                                placeholder='Enter Email Address'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Password' className='form-label'>
                                Password
                            </label>
                            <input
                                type={"password"}
                                className='form-control'
                                placeholder='Enter Password'
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-3 text-center">
                            <button type='submit' className='btn btn-outline-primary'>Login</button>
                        </div>
                        <div className="mt-1 text-center">
                            <Link to="/forgot-password/verify-email">Forgot Password?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
