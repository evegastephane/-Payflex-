import axios from 'axios';

// Single axios instance so switching from mock to real API is painless.
const baseURL = process.env.EXPO_PUBLIC_API_URL ?? '';

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

