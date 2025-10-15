import axios from 'axios';

// Create a mock instance of axios
const mockAxiosInstance = axios.create({
  baseURL: '/api/v1/test', // A dummy base URL for the test environment
});

// Mock implementation of interceptors if needed, but for now, it's empty
mockAxiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Mock common HTTP methods to return a resolved promise
mockAxiosInstance.get = jest.fn().mockResolvedValue({ data: {} });
mockAxiosInstance.post = jest.fn().mockResolvedValue({ data: {} });
mockAxiosInstance.put = jest.fn().mockResolvedValue({ data: {} });
mockAxiosInstance.delete = jest.fn().mockResolvedValue({ data: {} });

export default mockAxiosInstance;