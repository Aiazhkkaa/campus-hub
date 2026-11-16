/**
 * Where our NestJS backend runs.
 * - On your laptop (localhost) -> the local server on port 3001
 * - On the internet (Vercel)   -> the server deployed on Render
 */
const LOCAL_API = 'http://localhost:3001/api';
const PRODUCTION_API = 'https://campushub-api.onrender.com/api';

export const API_URL = location.hostname === 'localhost' ? LOCAL_API : PRODUCTION_API;
