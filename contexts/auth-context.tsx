"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasGeneratedApiKey: boolean
  setHasGeneratedApiKey: (value: boolean) => void
  firestoreError: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasGeneratedApiKey, setHasGeneratedApiKey] = useState(false)
  const [firestoreError, setFirestoreError] = useState(false)
  const router = useRouter()

  // Function to safely interact with Firestore
  const safeFirestoreOperation = async <T,>(operation: () => Promise<T>): Promise<T | null> => {
    try {
      return await operation()
    } catch (error) {
      console.error("Firestore operation error:", error)
      setFirestoreError(true)
      return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        // Use local storage as a fallback for API key status
        const localApiKeyStatus = localStorage.getItem(`apiKey_${currentUser.uid}`)

        // Try to get user data from Firestore, but don't block authentication if it fails
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists()) {
            // If we can read from Firestore, update the API key status
            setHasGeneratedApiKey(userDoc.data().hasGeneratedApiKey || false)
            // Also update local storage for fallback
            localStorage.setItem(`apiKey_${currentUser.uid}`, userDoc.data().hasGeneratedApiKey ? "true" : "false")
            setFirestoreError(false)
          } else {
            // If the document doesn't exist but we can read from Firestore,
            // try to create it but don't block if it fails
            try {
              await setDoc(doc(db, "users", currentUser.uid), {
                email: currentUser.email,
                name: currentUser.displayName,
                hasGeneratedApiKey: localApiKeyStatus === "true",
                createdAt: new Date().toISOString(),
              })
              setFirestoreError(false)
            } catch (writeError) {
              console.error("Error creating user document:", writeError)
              setFirestoreError(true)
            }

            // Use local storage value if available
            if (localApiKeyStatus) {
              setHasGeneratedApiKey(localApiKeyStatus === "true")
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setFirestoreError(true)

          // Fall back to local storage if Firestore fails
          if (localApiKeyStatus) {
            setHasGeneratedApiKey(localApiKeyStatus === "true")
          }
        }
      } else {
        // Reset state when user logs out
        setHasGeneratedApiKey(false)
        setFirestoreError(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
      }

      // Initialize local storage for API key status
      localStorage.setItem(`apiKey_${userCredential.user.uid}`, "false")
    } catch (error) {
      throw error
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    setUser(null)
    await signOut(auth)
    router.push("/login")
  }

  const updateHasGeneratedApiKey = async (value: boolean): Promise<void> => {
    setHasGeneratedApiKey(value)

    if (user) {
      // Always update local storage
      localStorage.setItem(`apiKey_${user.uid}`, value ? "true" : "false")

      // Try to update Firestore, but don't block if it fails
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            hasGeneratedApiKey: value,
            apiKeyUpdatedAt: new Date().toISOString(),
          },
          { merge: true },
        )
        setFirestoreError(false)
      } catch (error) {
        console.error("Error updating API key status:", error)
        setFirestoreError(true)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        hasGeneratedApiKey,
        setHasGeneratedApiKey: updateHasGeneratedApiKey,
        firestoreError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

