// Frontend API configuration
// Frontend API configuration (Vite)
// Vite exposes env vars via import.meta.env. Prefix custom vars with VITE_.
const API_BASE = import.meta.env.VITE_API_BASE || 'https://plp-hms.onrender.com';
export default API_BASE;
