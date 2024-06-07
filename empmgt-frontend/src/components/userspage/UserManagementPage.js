import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';
import { CapitalizeFirstLetter } from '../utils/Capitalize';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedTotalPages, setSearchedTotalPages] = useState(0);
  const usersPerPage = 7;

  const fetchUsers = useCallback(async (page) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getAllUsers(page - 1, usersPerPage, token);
      setUsers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      alert('Error fetching users:', error.message);
    }
  }, [usersPerPage]);

  const fetchSearchResults = useCallback(async (page) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.searchUsers(searchQuery, token, page - 1, usersPerPage);
      setUsers(response.content);
      setSearchedTotalPages(response.totalPages);
    } catch (error) {
      alert('Error fetching search results:', error.message);
    }
  }, [searchQuery, usersPerPage]);

  useEffect(() => {
    if (searching) {
      fetchSearchResults(currentPage);
    } else {
      fetchUsers(currentPage);
    }
  }, [currentPage, fetchSearchResults, fetchUsers, searching]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setSearching(true);
    setCurrentPage(1);
    if (query.trim() === '') {
      setSearching(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this user?');
      const token = localStorage.getItem('token');
      if (confirmDelete) {
        await UserService.deleteUser(userId, token);
        if (searching) {
          fetchSearchResults(currentPage);
        } else {
          fetchUsers(currentPage);
        }
      }
    } catch (error) {
      alert('Error deleting user:', error.message);
    }
  };

  const paginate = (pageNumber, isSearching) => {
    setCurrentPage(pageNumber);
    if (isSearching) {
      fetchSearchResults(pageNumber);
    } else {
      fetchUsers(pageNumber);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    if (searching) {
      fetchSearchResults(1);
    } else {
      fetchUsers(1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < (searching ? searchedTotalPages : totalPages)) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      paginate(nextPage, searching);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      paginate(prevPage, searching);
    }
  };

  const goToLastPage = () => {
    const lastPage = searching ? searchedTotalPages : totalPages;
    setCurrentPage(lastPage);
    paginate(lastPage, searching);
  };

  const displayPageNumbers = [];
  const minPage = Math.max(1, currentPage - 2);
  const maxPage = Math.min(searching ? searchedTotalPages : totalPages, minPage + 4);
  for (let i = minPage; i <= maxPage; i++) {
    displayPageNumbers.push(i);
  }

  return (
    <div className='container'>
      <div className="row mb-4">
        <div className="col-md-6">
          <h2>Users Management Page</h2>
        </div>
        <div className="col-md-6 d-flex justify-content-end align-items-center">
          <form className="form-inline w-100" onSubmit={handleSearch}>
            <div className="input-group w-100">
              <input
                type="text"
                className="form-control rounded-0 rounded-start"
                id="searchInput"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch} // Updated onChange event
              />
              <div className="input-group-append">
                <button type="submit" className="btn btn-outline-primary rounded-0 rounded-end" >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className='py-4'>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Job</th>
              <th scope="col">City</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <th scope="row">{(currentPage - 1) * usersPerPage + index + 1}</th>
                  <td>{CapitalizeFirstLetter(user.firstname)}</td>
                  <td>{CapitalizeFirstLetter(user.lastname)}</td>
                  <td>{CapitalizeFirstLetter(user.email)}</td>
                  <td>{CapitalizeFirstLetter(user.job)}</td>
                  <td>{CapitalizeFirstLetter(user.city)}</td>
                  <td>{CapitalizeFirstLetter(user.role)}</td>
                  <td>
                    <Link className='btn btn-outline-primary mx-2' to={`/update-user/${user.id}`}>
                      Update
                    </Link>
                    <button className='btn btn-danger mx-2' onClick={() => deleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={goToFirstPage}>
                &lt;&lt;
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={goToPrevPage}>
                &lt;
              </button>
            </li>
            {displayPageNumbers.map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(number, searching)}>
                  {number}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === (searching ? searchedTotalPages : totalPages) ? 'disabled' : ''}`}>
              <button className="page-link" onClick={goToNextPage}>
                &gt;
              </button>
            </li>
            <li className={`page-item ${currentPage === (searching ? searchedTotalPages : totalPages) ? 'disabled' : ''}`}>
              <button className="page-link" onClick={goToLastPage}>
                &gt;&gt;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
