// /app/utils/auth.js - Enhanced client-side auth utilities
export const isAuthenticated = () => {
  // Check if user is authenticated by making a request to /api/auth/me
  return fetch('/api/auth/me')
    .then(response => response.json())
    .then(data => data.success)
    .catch(() => false)
}

export const getCurrentUser = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include', // Important for cookies
    })
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export const logout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Important for cookies
    })
    const data = await response.json()
    
    if (data.success) {
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('authChanged'))
    }
    
    return data
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, message: 'An error occurred' }
  }
}

export const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (data.success) {
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('authChanged'))
    }

    return data
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, message: 'An error occurred during login' }
  }
}

export const register = async (name, email, phone, password) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ name, email, phone, password }),
    })

    const data = await response.json()

    if (data.success) {
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('authChanged'))
    }

    return data
  } catch (error) {
    console.error('Register error:', error)
    return { success: false, message: 'An error occurred during registration' }
  }
}