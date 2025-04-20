"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Create context
const AuthContext = createContext(null)

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
    avatar: null,
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("bgRemover_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("bgRemover_user")
      }
    }
  }, [])

  // Login function
  const login = async (email, password) => {
    // Find user
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!foundUser || foundUser.password !== password) {
      throw new Error("Invalid email or password")
    }

    // Create session user (without password)
    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      avatar: foundUser.avatar,
    }

    // Store in localStorage
    localStorage.setItem("bgRemover_user", JSON.stringify(sessionUser))

    // Update state
    setUser(sessionUser)
    setIsAuthenticated(true)

    return sessionUser
  }

  // Signup function
  const signup = async (name, email, password) => {
    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (existingUser) {
      throw new Error("Email already in use")
    }

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
      avatar: null,
    }

    // Add to mock database
    mockUsers.push(newUser)

    // Create session user (without password)
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    }

    // Store in localStorage
    localStorage.setItem("bgRemover_user", JSON.stringify(sessionUser))

    // Update state
    setUser(sessionUser)
    setIsAuthenticated(true)

    return sessionUser
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("bgRemover_user")
    setUser(null)
    setIsAuthenticated(false)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  // Context value
  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
