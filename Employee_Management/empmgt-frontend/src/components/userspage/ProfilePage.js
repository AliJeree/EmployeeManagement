import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';
import { CapitalizeFirstLetter } from '../utils/Capitalize';

export default function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await UserService.getYourProfile(token);
      setProfileInfo(data.ourUsers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile information. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileInfo || Object.keys(profileInfo).length === 0) {
    return <div>No profile information found.</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">My Details</h2>
          <table className="table">
            <tbody>
              <tr>
                <td><b>First Name:</b></td>
                <td>{CapitalizeFirstLetter(profileInfo.firstname)}</td>
              </tr>
              <tr>
                <td><b>Last Name:</b></td>
                <td>{CapitalizeFirstLetter(profileInfo.lastname)}</td>
              </tr>
              <tr>
                <td><b>Email:</b></td>
                <td>{profileInfo.email}</td>
              </tr>
              <tr>
                <td><b>Job:</b></td>
                <td>{CapitalizeFirstLetter(profileInfo.job)}</td>
              </tr>
              <tr>
                <td><b>City:</b></td>
                <td>{CapitalizeFirstLetter(profileInfo.city)}</td>
              </tr>
              <tr>
                <td><b>Role:</b></td>
                <td>{CapitalizeFirstLetter(profileInfo.role)}</td>
              </tr>
            </tbody>
          </table>
          {profileInfo.role === "ADMIN" && (
            <div className="text-center mt-2">
              <Link className="btn btn-outline-primary mx-2" to={`/update-user/${profileInfo.id}`}>
                Update This Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
