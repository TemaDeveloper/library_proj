'use client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  username: string
  email: string
  password: string
}

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthResponse {
  success: boolean
  messageKey?: string
  user?: User
  error?: string
}

const STORAGE_KEY = 'library_users'
const CURRENT_USER_KEY = 'current_user'

// Get all users from localStorage
function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

// Get current logged-in user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(CURRENT_USER_KEY)
  return stored ? JSON.parse(stored) : null
}

// Set current logged-in user
export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// Logout user
export function logout(): void {
  setCurrentUser(null)
}

// Login function
export function login(credentials: LoginCredentials): AuthResponse {
  try {
    const users = getUsers()
    const user = users.find(
      (u) => u.email === credentials.email && 
      // In a real app, passwords should be hashed. For frontend-only, we'll store them plain (not secure!)
      // Check password (simple comparison for demo purposes)
      localStorage.getItem(`user_password_${u.id}`) === credentials.password
    )

    if (user) {
      setCurrentUser(user)
      return {
        success: true,
        messageKey: 'auth.login.success',
        user,
      }
    } else {
      return {
        success: false,
        messageKey: 'auth.login.invalid',
        error: 'Invalid email or password',
      }
    }
  } catch (error) {
    console.error('Error logging in:', error)
    return {
      success: false,
      messageKey: 'auth.login.serverError',
      error: 'Error during login. Please try again.',
    }
  }
}

// Signup function
export function signup(data: SignupData): AuthResponse {
  try {
    const users = getUsers()
    
    // Check if email already exists
    const existingUser = users.find((u) => u.email === data.email)
    if (existingUser) {
      return {
        success: false,
        messageKey: 'auth.signup.emailExists',
        error: 'Email already exists',
      }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(), // Simple ID generation
      username: data.username,
      email: data.email,
    }

    // Save user
    users.push(newUser)
    saveUsers(users)

    // Store password separately (in a real app, this would be hashed on the backend!)
    // WARNING: This is just for frontend-only demo. In production, never store plain passwords!
    localStorage.setItem(`user_password_${newUser.id}`, data.password)

    // Auto-login after signup
    setCurrentUser(newUser)

    return {
      success: true,
      messageKey: 'auth.signup.success',
      user: newUser,
    }
  } catch (error) {
    console.error('Error signing up:', error)
    return {
      success: false,
      messageKey: 'auth.signup.serverError',
      error: 'Error during signup. Please try again.',
    }
  }
}
