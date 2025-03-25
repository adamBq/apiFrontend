import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Cloud } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Cloud className="h-6 w-6" />
            <span>API Portal</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Documentation
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* FIRST SECTION */}
        <section className="w-full py-12 md:py-24 lg:py-32 px-4">
          <div className="mx-auto max-w-[800px] flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Access Powerful Microservices with a Single API Key
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Simplify your development workflow with our suite of specialized
                microservices for crime data, weather alerts, family services,
                and livability metrics.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-1">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SECOND SECTION */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 px-4">
          <div className="mx-auto max-w-[58rem] flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Explore Our Microservices
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our API provides access to four specialized microservices. Browse
              the documentation and test them below.
            </p>
          </div>

          <div className="mx-auto mt-12 w-full max-w-4xl">
            <Tabs defaultValue="crime">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="crime">Crime</TabsTrigger>
                <TabsTrigger value="weather">Extreme Weather</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
                <TabsTrigger value="livability">Livability</TabsTrigger>
              </TabsList>

              {/* CRIME */}
              <TabsContent value="crime" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crime Data Microservice</CardTitle>
                    <CardDescription>
                      Access comprehensive crime statistics and reports for any
                      location.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Our Crime Data API provides detailed information about
                      crime rates, types, and trends across different regions.
                      Perfect for safety analysis, research, and community
                      planning.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <h3 className="mb-2 font-medium">Example Request</h3>
                      <pre className="text-sm text-muted-foreground overflow-x-auto">
                        GET /api/crime/stats?location=chicago&amp;year=2023
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/docs/crime">
                      <Button variant="outline" className="w-full">
                        View Full Documentation
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* WEATHER */}
              <TabsContent value="weather" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Extreme Weather Microservice</CardTitle>
                    <CardDescription>
                      Monitor and predict extreme weather events with precision.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Our Extreme Weather API provides real-time alerts,
                      historical data, and predictive models for severe weather
                      events including hurricanes, floods, wildfires, and more.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <h3 className="mb-2 font-medium">Example Request</h3>
                      <pre className="text-sm text-muted-foreground overflow-x-auto">
                        GET /api/weather/alerts?region=florida&amp;type=hurricane
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/docs/weather">
                      <Button variant="outline" className="w-full">
                        View Full Documentation
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* FAMILY */}
              <TabsContent value="family" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Family Services Microservice</CardTitle>
                    <CardDescription>
                      Connect with family support resources and services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Our Family Services API provides information on childcare
                      facilities, family support programs, educational
                      resources, and community services available in any given
                      area.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <h3 className="mb-2 font-medium">Example Request</h3>
                      <pre className="text-sm text-muted-foreground overflow-x-auto">
                        GET /api/family/resources?location=boston&amp;type=childcare
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/docs/family">
                      <Button variant="outline" className="w-full">
                        View Full Documentation
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* LIVABILITY */}
              <TabsContent value="livability" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Livability Metrics Microservice</CardTitle>
                    <CardDescription>
                      Analyze and compare quality of life metrics across
                      locations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Our Livability API provides comprehensive data on factors
                      that affect quality of life including cost of living,
                      healthcare access, transportation, education quality, and
                      more.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <h3 className="mb-2 font-medium">Example Request</h3>
                      <pre className="text-sm text-muted-foreground overflow-x-auto">
                        GET /api/livability/score?city=austin&amp;state=texas
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/docs/livability">
                      <Button variant="outline" className="w-full">
                        View Full Documentation
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      {/* FOOTER (EMPTY) */}
      <footer className="border-t py-6 md:py-0">
        <div className="px-4" />
      </footer>
    </div>
  )
}
