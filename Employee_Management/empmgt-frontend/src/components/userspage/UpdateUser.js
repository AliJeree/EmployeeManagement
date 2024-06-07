import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserService from '../service/UserService';

export default function UpdateUser() {
  const navigate = useNavigate();
  const { userId } = useParams();


  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    city: '',
    job: '',
  });

  useEffect(() => {
    fetchUserDataById(userId); 
  }, [userId]); 

  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getUserById(userId, token); 
      const { firstname, lastname, email, role, city, job } = response.ourUsers;
      setUserData({ firstname, lastname, email, role, city, job });
    } catch (error) {
      alert(error)
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirmDelete = window.confirm('Are you sure you want to edit this user?');
      if (confirmDelete) {
        const token = localStorage.getItem('token');
        await UserService.updateUser(userId, userData, token);
        navigate("/admin/user-management")
      }

    } catch (error) {
      alert(error)
    }
  };
  return (
    <div className='container'>
        <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Edit Employee</h2>
                <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='Firstname' className='form-label'>
                        First Name
                    </label>
                    <input
                    type={"text"}
                    className='form-control'
                    placeholder='Enter First Name'
                    name='firstname'
                    value={userData.firstname} 
                    onChange={handleInputChange}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='Lastname' className='form-label'>
                        Last Name
                    </label>
                    <input
                    type={"text"}
                    className='form-control'
                    placeholder='Enter Last Name'
                    name='lastname'
                    value={userData.lastname} 
                    onChange={handleInputChange}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='Email' className='form-label'>
                        Email
                    </label>
                    <input
                    type={"text"}
                    className='form-control'
                    placeholder='Enter Email Address'
                    name='email'
                    value={userData.email} 
                    onChange={handleInputChange}
                    />
                </div>
                <div className='mb-3'>
  <label htmlFor='Role' className='form-label'>
    Role
  </label>
  <select
    className='form-select'
    id='role'
    name='role'
    value={userData.role}
    onChange={handleInputChange}
  >
    <option value=''>Select Role</option>
    <option value='ADMIN'>ADMIN</option>
    <option value='USER'>USER</option>
  </select>
</div>

                <div className='mb-3'>
                    <label htmlFor='City' className='form-label'>
                        City
                    </label>
                    <input
                    type={"text"}
                    className='form-control'
                    placeholder='Enter City'
                    name='city'
                    value={userData.city} 
                    onChange={handleInputChange}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='Job' className='form-label'>
                        Job
                    </label>
                    <input
                    type={"text"}
                    className='form-control'
                    placeholder='Enter Job'
                    name='job'
                    value={userData.job} 
                    onChange={handleInputChange}
                    />
                </div>
                
                <button type='submit' className='btn btn-outline-primary'>Submit</button>
                <Link type='submit' className='btn btn-outline-danger mx-2' to="/profile">Cancel</Link>
                </form>
            </div>
        </div>
    </div>
  )
}
