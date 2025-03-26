"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "swagger-ui-react/swagger-ui.css";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Dynamically import swagger-ui-react
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("crime");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex w-full h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            API Portal
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm">
              Login
            </Link>
            <Link href="/signup" className="text-sm">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full px-4 py-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-muted-foreground">Explore our API documentation.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="crime">Crime</TabsTrigger>
              <TabsTrigger value="weather">Extreme Weather</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="livability">Livability</TabsTrigger>
            </TabsList>

            {/* Crime */}
            <TabsContent value="crime" className="mt-6">
              {/* Force white background & dark text on the Card */}
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>NSW Crime Data API</CardTitle>
                  <CardDescription>Provides crime data for NSW suburbs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SwaggerUI url="/resources/swagger/crime-data-api-swagger.yaml" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Extreme Weather */}
            <TabsContent value="weather" className="mt-6">
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>Extreme Weather Data API</CardTitle>
                  <CardDescription>Historical and real-time data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SwaggerUI url="/resources/swagger/extreme-weather-data-api-swagger.yaml" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Family */}
            <TabsContent value="family" className="mt-6">
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>Family Census Data API</CardTitle>
                  <CardDescription>Retrieve family composition and population data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SwaggerUI url="/resources/swagger/family-data-api-swagger.yaml" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Livability */}
            <TabsContent value="livability" className="mt-6">
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>Livability Score API</CardTitle>
                  <CardDescription>Calculate and analyze livability scores.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SwaggerUI url="/resources/swagger/livability-score-api-swagger.yaml" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 API Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
