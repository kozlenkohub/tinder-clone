import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:4411/api',
  withCredentials: true,
});
