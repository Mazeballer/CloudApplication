"use client"

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

// Get all users from localStorage
function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem('autocare_users') // Changed from 'users' to 'autocare_users'
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  localStorage.setItem('autocare_users', JSON.stringify(users)) // Changed from 'users' to 'autocare_users'
}

// Register a new user
export function register(userData: Omit<User, 'id'>, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    return { success: false, error: 'Email already exists' }
  }
  
  // Create new user
  const newUser: User = {
    ...userData,
    id: Date.now().toString()
  }
  
  users.push(newUser)
  saveUsers(users)
  
  // Save password separately (in real app, this would be hashed)
  const passwords = JSON.parse(localStorage.getItem('passwords') || '{}')
  passwords[userData.email] = password
  localStorage.setItem('passwords', JSON.stringify(passwords))
  
  return { success: true }
}

function initializeDemoAccounts(): void {
  if (typeof window === 'undefined') return
  
  const usersKey = 'autocare_users' // Changed from 'users' to 'autocare_users' to match demo-data.ts
  const users = JSON.parse(localStorage.getItem(usersKey) || '[]')
  const passwords = JSON.parse(localStorage.getItem('passwords') || '{}')
  
  // Check if demo accounts already exist
  const demoDriverExists = users.find(u => u.email === 'demo@autocare.com')
  const demoWorkshopExists = users.find(u => u.email === 'workshop@autocare.com')
  
  // Create demo driver account if it doesn't exist
  if (!demoDriverExists) {
    const demoDriver: User = {
      id: 'demo-driver-1',
      email: 'demo@autocare.com',
      name: 'Demo User',
      type: 'driver',
      phone: '+1 234 567 8900'
    }
    users.push(demoDriver)
    passwords['demo@autocare.com'] = 'demo123'
  }
  
  // Create demo workshop account if it doesn't exist
  if (!demoWorkshopExists) {
    const demoWorkshop: User = {
      id: 'demo-workshop-1',
      email: 'workshop@autocare.com',
      name: 'Demo Workshop',
      type: 'workshop',
      workshopName: 'AutoCare Demo Workshop',
      address: '123 Main Street, City',
      phone: '+1 234 567 8901'
    }
    users.push(demoWorkshop)
    passwords['workshop@autocare.com'] = 'workshop123'
  }
  
  // Save if we added any accounts
  if (!demoDriverExists || !demoWorkshopExists) {
    localStorage.setItem(usersKey, JSON.stringify(users)) // Use autocare_users key
    localStorage.setItem('passwords', JSON.stringify(passwords))
  }
}

// Login user
export function login(email: string, password: string, type: 'driver' | 'workshop'): { success: boolean; error?: string; user?: User } {
  initializeDemoAccounts()
  
  const users = getUsers()
  const passwords = JSON.parse(localStorage.getItem('passwords') || '{}')
  
  const user = users.find(u => u.email === email && u.type === type)
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' }
  }
  
  if (passwords[email] !== password) {
    return { success: false, error: 'Invalid credentials' }
  }
  
  // Set current user in session
  localStorage.setItem('currentUser', JSON.stringify(user))
  localStorage.setItem("isAuthenticated", "true")
  localStorage.setItem("userEmail", email)
  localStorage.setItem("userType", type)
  
  return { success: true, user }
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
