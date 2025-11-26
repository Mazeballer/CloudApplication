'use client';
import { useState, useEffect } from 'react';

// User data storage
export interface User {
  id: string;
  email: string;
  name: string;
  // role from backend, used for redirects
  role: 'Driver' | 'Workshop' | 'Admin';
  // Driver specific fields
  phone?: string;
  // Workshop specific fields
  workshopName?: string;
  address?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Driver registration
export async function register(data: any, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register-driver`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password,
    }),
  });

  return res.json();
}

// Workshop registration
export async function registerWorkshop(data: any, password: string) {
  console.log('Data: ', data);

  const res = await fetch(`${API_URL}/api/auth/register-workshop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      phone: data.phone,
      password: password,
      workshopName: data.workshopName,
      ownerName: data.ownerName,
      address: data.address,
      operatingHours: data.operatingHours,
    }),
  });

  return res.json();
}

// Login
export async function login(email: string, password: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error('Login failed. Raw response from API:', text);

    // Try to parse JSON if server sent structured error
    try {
      const data = JSON.parse(text);
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    } catch {
      // Not JSON, probably an exception page
      return {
        success: false,
        error: 'Server error while logging in',
      };
    }
  }

  // Success path, response should be JSON
  try {
    const data = JSON.parse(text);
    return data;
  } catch {
    console.error('Login success response was not valid JSON:', text);
    return {
      success: false,
      error: 'Invalid response from server.',
    };
  }
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('currentUser');
  return user ? (JSON.parse(user) as User) : null;
}

// Simple client side auth helper
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
}

export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userEmail');
}

export function getUserType(): 'Driver' | 'Workshop' | 'Admin' | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userType') as
    | 'Driver'
    | 'Workshop'
    | 'Admin'
    | null;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userType');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('UserId');
}

// Custom hook to handle auth state safely
export function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<
    'Driver' | 'Workshop' | 'Admin' | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setUser(getCurrentUser());
    setUserType(getUserType());
    setIsLoading(false);
  }, []);

  return { isAuth, user, userType, isLoading };
}
