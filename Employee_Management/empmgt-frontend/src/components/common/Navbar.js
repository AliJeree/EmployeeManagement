import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());
    const navigate = useNavigate();

    useEffect(() => {
        // Whenever authentication changes, update the state
        setIsAuthenticated(UserService.isAuthenticated());
        setIsAdmin(UserService.isAdmin());
    }, [isAuthenticated, isAdmin]);

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            UserService.logout();
            setIsAuthenticated(false);
            setIsAdmin(false);
            navigate('/');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    {isAuthenticated ? (
                        <Link className="navbar-brand" to="/profile">Employee Management System</Link>
                    ) : (
                        <Link className="navbar-brand" to="/">Employee Management System</Link>
                    )}

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                        {isAdmin &&
                            <Link className="btn btn-outline-light mx-2" to="/register">Add User</Link>
                        }
                        {isAuthenticated &&
                            <Link className="btn btn-outline-light mx-2" to="/profile">Profile</Link>
                        }
                        {isAdmin &&
                            <Link className="btn btn-outline-light mx-2" to="/admin/user-management">User Management</Link>
                        }
                        {isAdmin &&
                            <Link className="btn btn-outline-light mx-2" to="/send-email">Send Emails</Link>
                        }
                        {isAuthenticated &&
                            <Link className="btn btn-outline-danger mx-2" to="/" onClick={handleLogout}>Logout</Link>
                        }
                    </div>
                </div>
            </nav>
        </div>

    );

}
