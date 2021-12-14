import axios from 'axios';
import * as https from 'https';

export const api = axios.create({
  // baseURL: 'https://localhost:5000',
  baseURL: 'https://172.29.234.48:5000',
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});
