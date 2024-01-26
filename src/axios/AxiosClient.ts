import axios from 'axios';
import queryString from 'query-string';

const API_URL = 'https://binh-online-shopping-be.vinhomes.co.uk/';
// const API_URL_LOCAL = 'http://localhost:8080';

const AxiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

AxiosClient.interceptors.request.use(async config => {
  const token = localStorage.getItem("jwtToken");
  if (token && config.headers !== undefined) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data;
    }
    return response.data;
  },
  error => {
    // Handle errors
    const errorMessage = 'Something went wrong!';

    if (error.response.data) {
      throw error.response.data;
    }
    throw errorMessage;
  },
);
export default AxiosClient;
