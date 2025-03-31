const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  
  // Vehicle endpoints
  vehicles: `${API_URL}/vehicles`,
  vehicleById: (id) => `${API_URL}/vehicles/${id}`,
  
  // User endpoints
  userProfile: `${API_URL}/users/profile`,
  updateProfile: `${API_URL}/users/profile`,
};

export default api; 