'use server'

const BACKEND_API_URL = process.env.BACKEND_API_URL

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  username: string // Full name (first + last)
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  messageKey?: string
  user?: {
    id?: number
    username: string
    email: string
  }
  error?: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      cache: 'no-store',
    })

    if (res.ok) {
      const user = await res.json()
      return {
        success: true,
        messageKey: 'auth.login.success',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      }
    } else {
      const errorData = await res.json()
      return {
        success: false,
        messageKey: 'auth.login.invalid',
        error: errorData.error || 'Invalid email or password',
      }
    }
  } catch (error) {
    console.error('Error logging in:', error)
    return {
      success: false,
      messageKey: 'auth.login.serverError',
      error: 'Server error. Please try again later.',
    }
  }
}

export async function signup(data: SignupData): Promise<AuthResponse> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/users/addUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    })

    if (res.ok) {
      const user = await res.json()
      return {
        success: true,
        messageKey: 'auth.signup.success',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      }
    } else {
      const errorData = await res.json().catch(() => ({}))
      if (res.status === 409 || res.status === 400) {
        return {
          success: false,
          messageKey: 'auth.signup.emailExists',
          error: errorData.error || 'Email already exists',
        }
      }
      return {
        success: false,
        messageKey: 'auth.signup.serverError',
        error: errorData.error || 'Server error. Please try again later.',
      }
    }
  } catch (error) {
    console.error('Error signing up:', error)
    return {
      success: false,
      messageKey: 'auth.signup.serverError',
      error: 'Server error. Please try again later.',
    }
  }
}