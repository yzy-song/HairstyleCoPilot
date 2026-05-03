import { apiClient } from './client';
import type { User, Salon } from '../types';

interface LoginResponse {
  accessToken: string;
}

interface SalonSignUpResponse {
  accessToken: string;
  salon: Salon;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function signUpSalon(email: string, password: string, salonName: string): Promise<SalonSignUpResponse> {
  return apiClient<SalonSignUpResponse>('/auth/signup/salon', {
    method: 'POST',
    body: { email, password, salonName },
  });
}

export function getMe(): Promise<User> {
  return apiClient<User>('/auth/me');
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return apiClient('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return apiClient('/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  });
}
