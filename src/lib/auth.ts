"use client"
import { useState, useEffect } from 'react'

// User data storage
export interface User {
  id: string
  email: string
  name: string
  type: 'driver' | 'workshop'
  // Driver specific fields
  phone?: string
  // Workshop specific fields
  workshopName?: string
  address?: string
}

export async function register(data: any, password: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/api/auth/register-driver`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

export async function registerWorkshop(data: any, password: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/api/auth/register-workshop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      phone: data.phone,
      password: password,
      workshopName: data.workshopName,
      ownerName: data.ownerName,
      address: data.address,
      hours: data.hours,
    }),
  });

  return res.json();
}

export async function login(email: string, password: string, role: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  return res.json();
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) : null
}

// Simple client-side auth helper
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem("isAuthenticated") === "true"
}

export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem("userEmail")
}

export function getUserType(): 'driver' | 'workshop' | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem("userType") as 'driver' | 'workshop' | null
}

export function logout(): void {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userType")
  localStorage.removeItem("currentUser")
}

// ✅ NEW: Custom hook to handle auth state safely
export function useAuth() {
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<'driver' | 'workshop' | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This runs only on the client after hydration
    setIsAuth(isAuthenticated())
    setUser(getCurrentUser())
    setUserType(getUserType())
    setIsLoading(false)
  }, [])

  return { isAuth, user, userType, isLoading }
}
