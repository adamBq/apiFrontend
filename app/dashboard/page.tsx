"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import {
  Copy,
  Key,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Cloud,
  AlertCircle,
} from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/contexts/auth-context"
import { FirebaseStatus } from "@/components/firebase-status"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, hasGeneratedApiKey, setHasGeneratedApiKey, firestoreError } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [hasViewedKey, setHasViewedKey] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
      return
    }
    setIsLoading(false)
  }, [user, router, isLoading])

  const generateApiKey = async (): Promise<void> => {
    if (hasGeneratedApiKey) {
      toast({
        title: "API Key Limit Reached",
        description: "You have already generated the maximum number of API keys allowed (1).",
        variant: "destructive",
      })
      return
    }
    setIsGenerating(true)
    setError(null)

    try {
      // Example endpoint: replace with your actual API
      const response = await fetch("https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/keygen")

      if (!response.ok) {
        throw new Error(`Failed to generate API key: ${response.statusText}`)
      }

      const data = await response.json()
      const newApiKey = data.value
      console.log(data)

      await setHasGeneratedApiKey(true)
      setApiKey(newApiKey)
      setHasViewedKey(false)

      toast({
        title: "API Key Generated",
        description: "Your new API key has been generated. Copy it now as you won't see it again.",
      })
    } catch (error: any) {
      console.error("Error generating API key:", error)
      setError("Failed to generate API key. Please try again later.")
      toast({
        title: "Failed to generate API key",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteApiKey = async (): Promise<void> => {
    try {
      await setHasGeneratedApiKey(false)
      setApiKey(null)
      setHasViewedKey(false)

      toast({
        title: "API Key Deleted",
        description: "Your API key has been deleted successfully.",
      })
    } catch (error: any) {
      console.error("Error deleting API key:", error)
      toast({
        title: "Failed to delete API key",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const copyApiKey = (): void => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setHasViewedKey(true)

      toast({
        title: "API Key Copied",
        description: "Your API key has been copied to clipboard.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with fluid spacing */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex w-full h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold">
            <Cloud className="h-6 w-6" />
            <span>API Portal</span>
          </div>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      {/* Main layout with aside + centered content */}
      <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] px-4">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[250px]">
          <DashboardNav />
        </aside>

        {/* Wrap everything in a max-w container for horizontal centering */}
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">API Key Management</h1>
              <p className="text-muted-foreground">Generate and manage your API key for accessing our microservices.</p>
            </div>

          {/* <FirebaseStatus />  */}

            {firestoreError && (
              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Database Connection Issue</AlertTitle>
                <AlertDescription>
                  We&apos;re having trouble connecting to our database. Your API key management will work,
                  but changes may not be saved permanently. Please contact support.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Main card for API key */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your API Key</CardTitle>
                <CardDescription>
                  You can only have one active API key at a time. The key will only be shown once after generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {apiKey ? (
                  <div className="space-y-4">
                    <div className="relative rounded-md bg-muted p-4 font-mono text-sm">
                      {apiKey}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={copyApiKey}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy API key</span>
                      </Button>
                    </div>
                    <Alert variant="warning">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        This is the only time you&apos;ll see this API key. Make sure to copy it now!
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : hasGeneratedApiKey ? (
                  <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    Your API key is hidden for security. You can delete your current key if you need a new one.
                  </div>
                ) : (
                  <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    You don&apos;t have an API key yet. Generate one to access our microservices.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {hasGeneratedApiKey ? (
                  <>
                    <Button variant="destructive" onClick={deleteApiKey} className="flex items-center gap-1">
                      <Trash2 className="h-4 w-4" />
                      Delete Key
                    </Button>
                    {!apiKey && (
                      <Button
                        onClick={generateApiKey}
                        disabled={isGenerating || hasGeneratedApiKey}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {isGenerating ? "Generating..." : "Regenerate Key"}
                      </Button>
                    )}
                  </>
                ) : (
                  <Button onClick={generateApiKey} disabled={isGenerating} className="flex items-center gap-1">
                    <Key className="h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate API Key"}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Second card */}
            <Card>
              <CardHeader>
                <CardTitle>Using Your API Key</CardTitle>
                <CardDescription>
                  Include your API key in the headers of your requests to authenticate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Example Request</h3>
                    <div className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-sm">
                      {`curl -X GET "https://api.example.com/crime/stats?location=chicago" \\
  -H "x-api-key: YOUR_API_KEY"`}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Available Endpoints</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>
                        <code>/api/crime/*</code> - Crime data and statistics
                      </li>
                      <li>
                        <code>/api/weather/*</code> - Extreme weather alerts and forecasts
                      </li>
                      <li>
                        <code>/api/family/*</code> - Family services and resources
                      </li>
                      <li>
                        <code>/api/livability/*</code> - Livability metrics and comparisons
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/docs">
                  <Button variant="outline">View Full Documentation</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
