import axios from 'axios';

// Define la URL base de tu API backend
const API_URL = import.meta.env.VITE_API_URL || 'https://carwash-backend-hrpl.onrender.com/api';

// Crea una instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;