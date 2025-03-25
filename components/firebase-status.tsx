"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"

export function FirebaseStatus() {
  const [authStatus, setAuthStatus] = useState<"loading" | "connected" | "error">("loading")
  const [firestoreStatus, setFirestoreStatus] = useState<"loading" | "connected" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { firestoreError } = useAuth()

  useEffect(() => {
    const checkFirebaseConnection = async (): Promise<void> => {
      try {
        // Check Auth connection
        if (auth) {
          try {
            await auth.app.options
            setAuthStatus("connected")
          } catch (error: any) {
            console.error("Firebase Auth connection error:", error)
            setAuthStatus("error")
            setErrorMessage("Authentication service unavailable")
          }
        } else {
          setAuthStatus("error")
          setErrorMessage("Firebase auth is not initialized")
        }

        // Check Firestore connection
        if (db) {
          try {
            // Try a simple query that should work even with restrictive security rules
            // This just checks if Firestore is accessible, not if we have permissions
            await getDocs(query(collection(db, "system_status"), limit(1)))
            setFirestoreStatus("connected")
          } catch (error: any) {
            console.error("Firebase Firestore connection error:", error)
            // If the error is about permissions, Firestore is still connected
            if (error.message && error.message.includes("permission")) {
              setFirestoreStatus("connected")
            } else {
              setFirestoreStatus("error")
              setErrorMessage(error instanceof Error ? error.message : "Unknown database error")
            }
          }
        } else {
          setFirestoreStatus("error")
          setErrorMessage("Firebase Firestore is not initialized")
        }
      } catch (error: any) {
        console.error("Firebase connection error:", error)
        setAuthStatus("error")
        setFirestoreStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Unknown error")
      }
    }

    checkFirebaseConnection()
  }, [])

  if (authStatus === "loading" || firestoreStatus === "loading") {
    return (
      <Alert className="mb-4">
        <AlertTitle className="flex items-center">Checking Firebase connection...</AlertTitle>
      </Alert>
    )
  }

  if (authStatus === "error") {
    return (
      <Alert variant="destructive" className="mb-4">
        <XCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Firebase Authentication Error</AlertTitle>
        <AlertDescription>
          {errorMessage || "Could not connect to Firebase Authentication. Please try again later."}
        </AlertDescription>
      </Alert>
    )
  }

  if (firestoreStatus === "error" || firestoreError) {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Firebase Database Warning</AlertTitle>
        <AlertDescription>
          Authentication is working, but there may be issues with the database connection. Some features may be limited.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30">
      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
      <AlertTitle className="text-green-600 dark:text-green-400">Firebase Connected</AlertTitle>
      <AlertDescription>Firebase is properly configured and connected.</AlertDescription>
    </Alert>
  )
}

