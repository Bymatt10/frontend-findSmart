import axios from 'axios';
import { supabase } from './supabase';

// Use local network IP for iOS simulator or Android emulator depending on setup
// For Android Emulator targeting localhost -> 10.0.2.2
// For iOS Simulator -> localhost
// EXPO_PUBLIC_API_URL should be set in .env
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
});
