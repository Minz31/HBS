const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      console.log('Testing connection to:', `${API_BASE_URL}/hotels`);
      const response = await fetch(`${API_BASE_URL}/hotels`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      return response.ok;
    } catch (error) {
      console.error('Connection test error:', error);
      return false;
    }
  }

  // Authentication
  async login(email, password) {
    return this.request('/users/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Hotels
  async getHotels() {
    return this.request('/hotels');
  }

  // Bookings
  async getUserBookings() {
    return this.request('/bookings/my-bookings');
  }
}

export default new ApiService();