import axios from 'axios';

export default class UserService {
    static BASE_URL = "http://localhost:1010";

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async register(userData, token) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async forgotPassword(email) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/forgot-password`, null, {
                params: { email }
            });
            return response.data;
        } catch (err) {
            throw err.response ? err.response.data : new Error('An error occurred');
        }
    }

    static async verifyOTP(email, otp) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/verify-otp`, null, {
                params: { email, otp }
            });
            return response.data;
        } catch (err) {
            throw err.response ? err.response.data : new Error('An error occurred');
        }
    }

    static async sendEmailToAllUsers(subject, body) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                `${UserService.BASE_URL}/admin/send-email-to-all`,
                { subject, body },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return response.data;
        } catch (err) {
            throw err.response ? err.response.data : new Error('An error occurred');
        }
    }

    static async sendEmailToUsersByJob(subject, body, jobTitles) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.post(
                `${UserService.BASE_URL}/admin/send-emails`,
                { subject, body, jobTitles }, 
                { headers }
            );
    
            return response.data;
        } catch (err) {
            throw err.response ? err.response.data : new Error('An error occurred');
        }
    }
    

    static async sendOTP(email) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/send-otp`, null, {
                params: { email }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }


    static async getYourProfile(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getUserById(userId, token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async updateUser(userId, userData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async deleteUser(userId, token) {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getAllUsers(page, size, token) {
        try {
          const response = await axios.get(`${this.BASE_URL}/users`, {
            params: { page, size },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
        } catch (err) {
          throw err;
        }
      }
    
      static async searchUsers(query, token, page, size) {
        try {
          const response = await axios.get(`${this.BASE_URL}/admin/search-users`, {
            params: { query, page, size },
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
        } catch (err) {
          throw err;
        }
      }
      

    static async resetPassword(token, newPassword) {
        try {
            if (!token || !newPassword) {
                throw new Error('Token and newPassword must be provided.');
            }

            const response = await axios.post(`${UserService.BASE_URL}/auth/reset-password`, {
                token,
                newPassword
            });

            await UserService.invalidateToken(token);

            if (response.data.message === "successful") {
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            throw err;
        }
    }

    static async resendOTP(email) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/resend-otp`, null, {
                params: { email }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async checkEmailUnique(email) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }
    
            const response = await axios.get(`${this.BASE_URL}/admin/check-email`, {
                params: { email },
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
    

    /** AUTHENTICATION CHECKER, know which url to show to the user */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}
