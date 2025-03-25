"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("crime")

  const crimeDocs = `openapi: 3.0.0
info:
  title: NSW Crime Data API
  description: Provides historical and recent crime data for NSW suburbs using statistics from the NSW BOCSAR open data website.
  version: 1.1.0
servers:
  - url: https://favnlumox2.execute-api.us-east-1.amazonaws.com/test?suburb={suburb}&detailed=boolean
    description: Production Server

paths:
  /crime/{suburb}:
    get:
      summary: Retrieve crime statistics and trends for a given suburb
      description: Returns crime statistics and historical trends for the requested suburb from the DynamoDB \`CrimeData\` table.
      operationId: getCrimeBySuburb
      parameters:
        - name: suburb
          in: path
          required: true
          description: Name of the suburb (case-insensitive)
          schema:
            type: string
            example: "Kensington"
        - name: detailed
          in: query
          required: false
          description: If \`true\`, returns full crime data. If \`false\`, removes per-year and per-month breakdown.
          schema:
            type: boolean
            example: true
      responses:
        "200":
          description: Crime statistics and trends for the requested suburb
          content:
            application/json:
              schema:
                type: object
                properties:
                  suburb:
                    type: string
                    example: "Kensington"
                  totalNumCrimes:
                    type: integer
                    example: 500
                  crimeSummary:
                    type: object
                    additionalProperties:
                      type: object
                      properties:
                        totalNum:
                          type: integer
                          example: 250
                        subCrimeType:
                          type: object
                          additionalProperties:
                            type: object
                            properties:
                              totalNum:
                                type: integer
                                example: 100
                  crimeTrends:
                    type: object
                    additionalProperties:
                      type: object
                      properties:
                        trendSlope:
                          type: number
                          example: -0.5
                        trendPercentage:
                          type: number
                          example: -12.5
                        movingAvg:
                          type: number
                          example: 45
                        trendCategory:
                          type: string
                          example: "Decreasing"
        "400":
          description: Missing required parameter \`suburb\`
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Missing required parameter: suburb"
        "404":
          description: Suburb not found in the dataset.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "No data found for suburb: {suburb}"
        "500":
          description: Internal server error
`

  const weatherDocs = `openapi: 3.0.0
info:
  title: Extreme Weather Data API
  description: Provides historical and real-time extreme weather data based on NSW natural disaster declarations.
  version: 1.0.0
servers:
  - url: https://r69rgp99vg.execute-api.ap-southeast-2.amazonaws.com/dev
    description: Production Server

paths:
  /suburb:
    post:
      summary: Retrieve extreme weather trends for a given suburb
      description: >
        Returns disaster occurrence data and relevant natural disasters for the requested suburb.
        The request body must include a JSON payload with a \`suburb\` key and an optional \`includeHighest\` flag.
      operationId: getSuburbData
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                suburb:
                  type: string
                  description: The name of the suburb (case-insensitive).
                  example: "Sydney"
                includeHighest:
                  type: boolean
                  description: >
                    If true, the response will also include the suburb with the highest number of disaster occurrences.
                  example: true
                  default: false
      responses:
        "200":
          description: Extreme weather trends for the requested suburb.
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "success"
                  message:
                    type: string
                    example: "Data found for suburb 'Sydney'."
                  requestedSuburbData:
                    type: object
                    description: Details of the requested suburb.
                    properties:
                      suburb:
                        type: string
                        example: "Sydney"
                      occurrences:
                        type: integer
                        example: 12
                      disasterNames:
                        type: array
                        items:
                          type: string
                        example:
                          - "NSW Flooding from 14 September 2022 onwards"
                          - "NSW severe weather and flooding 9 November 2021 onwards"
                  highestSuburbData:
                    type: object
                    description: >
                      (Optional) Data for the suburb with the highest number of occurrences, returned only if \`includeHighest\` is true.
                    properties:
                      suburb:
                        type: string
                        example: "Newcastle"
                      occurrences:
                        type: integer
                        example: 20
                      disasterNames:
                        type: array
                        items:
                          type: string
                        example:
                          - "NSW severe weather and flooding 9 November 2021 onwards"
        "400":
          description: Bad request (e.g., no suburb specified in the request).
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "No suburb specified in the request."
        "404":
          description: Resource not found (e.g., the aggregated file could not be found in S3).
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Could not find nsw_suburb_disaster_rankings.json in bucket fy18-19-to-fy23-24-nsw-disasters."
        "500":
          description: Internal server error.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Error reading nsw_suburb_disaster_rankings.json from S3."
`

  const familyDocs = `openapi: 3.0.0
info:
  title: Family Census Data API
  description: >
    API for retrieving family composition and population data for a given suburb,
    and for triggering the data collection of ABS DataPacks for NSW.
  version: 1.1.0
servers:
  - url: https://tzeks84nk6.execute-api.ap-southeast-2.amazonaws.com/test/family/
    description: Production Server

paths:
  /family/{suburb}:
    get:
      summary: Get family composition data for a given suburb
      parameters:
        - name: suburb
          in: path
          required: true
          schema:
            type: string
          description: The suburb for which family composition data is requested.
      responses:
        200:
          description: Successful response with family composition data
          content:
            application/json:
              schema:
                type: object
                properties:
                  suburb:
                    type: string
                  total_families:
                    type: string
                  couple_family_with_no_children:
                    type: string
                  couple_family_with_children_under_15:
                    type: string
                  couple_family_with_children_over_15:
                    type: string
                  total_couple_families:
                    type: string
                  one_parent_with_children_under_15:
                    type: string
                  one_parent_with_children_over_15:
                    type: string
                  total_one_parent_families:
                    type: string
                  other_family:
                    type: string
              example:
                suburb: "Strathfield"
                total_families: "11,545"
                couple_family_with_no_children: "4,258"
                couple_family_with_children_under_15: "3,573"
                couple_family_with_children_over_15: "1,953"
                total_couple_families: "5,528"
                one_parent_with_children_under_15: "469"
                one_parent_with_children_over_15: "931"
                total_one_parent_families: "1,399"
                other_family: "360"
        "400":
          description: Bad Request – e.g., suburb not provided or invalid.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "No suburb provided in event"
        "404":
          description: Not Found – The provided suburb was not found.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Suburb not found"
        "500":
          description: Internal Server Error – An unexpected error occurred.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "An error occurred: <detailed error message>"

  /family/population/{suburb}:
    get:
      summary: Get population data for a given suburb
      parameters:
        - name: suburb
          in: path
          required: true
          schema:
            type: string
          description: The suburb for which population data is requested.
      responses:
        200:
          description: Successful response with population data
          content:
            application/json:
              schema:
                type: object
                properties:
                  suburb:
                    type: string
                  total_population:
                    type: string
                  male:
                    type: string
                  female:
                    type: string
              example:
                suburb: "Strathfield"
                total_population: "45,593"
                male: "23,365"
                female: "22,229"
        "400":
          description: Bad Request – e.g., suburb not provided or invalid.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "No suburb provided in event"
        "404":
          description: Not Found – The suburb was not found.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Suburb not found"
        "500":
          description: Internal Server Error – An unexpected error occurred.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "An error occurred: <detailed error message>"

  /collector:
    post:
      summary: Trigger the ABS datapack collector
      description: >
        Triggers the collector function which downloads the most recent ABS DataPack
        for suburb and localities (SAL) for NSW and uploads the ZIP file to S3.
      responses:
        200:
          description: Data collection and processing completed successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
              example:
                message: "Successfully downloaded and uploaded the ABS datapack to s3"
        "400":
          description: Bad Request – e.g., required parameters missing (if applicable).
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Missing required parameters."
        "500":
          description: Internal Server Error – An error occurred during data collection.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Error processing the datapack: <detailed error message>"
`

  const livabilityDocs = `openapi: 3.0.0
info:
  title: Livability Score API
  description: >
    The Livability Score API aggregates statistics based on a provided address or suburb
    and weighted inputs for crime, weather (disaster risks), access to public transportation,
    shopping centers, and family demographics. The API calculates an overall livability score
    and returns a detailed breakdown for each category.
  version: "1.0.0"
servers:
  - url: https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/
paths:
  /livability_score:
    post:
      summary: Calculate Livability Score
      description: >
        Calculate the overall livability score for a given address or suburb by providing
        the importance weights for the following factors: crime, weather, public transportation,
        shopping centers, and family demographics. The response includes an overall score along
        with a detailed breakdown per factor.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: string
                  description: "Full address or suburb name to calculate livability."
                  example: "123 Main St, Anytown"
                weights:
                  type: object
                  description: "Importance weights for various livability factors (values between 0 and 1)."
                  properties:
                    crime:
                      type: number
                      description: "Weight for crime statistics."
                      example: 0.8
                    weather:
                      type: number
                      description: "Weight for weather/disaster risks."
                      example: 0.7
                    publicTransportation:
                      type: number
                      description: "Weight for access to public transportation."
                      example: 0.6
                    familyDemographics:
                      type: number
                      description: "Weight for family demographics suitability."
                      example: 0.9
              required:
                - address
                - weights
      responses:
        "200":
          description: Livability score successfully calculated.
          content:
            application/json:
              schema:
                type: object
                properties:
                  overall_score:
                    type: number
                    description: "Aggregated livability score based on provided inputs."
                    example: 7.53
                  breakdown:
                    type: object
                    description: "Detailed score breakdown for each factor."
                    properties:
                      crimeScore:
                        type: number
                        description: "Score for crime statistics."
                        example: 7.22
                      weatherScore:
                        type: number
                        description: "Score for weather/disaster risk."
                        example: 8.01
                      transportScore:
                        type: number
                        description: "Score for public transportation access."
                        example: 6.53
                      familyScore:
                        type: number
                        description: "Score for family demographics suitability."
                        example: 8.57
        "400":
          description: Invalid input parameters.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    description: "Error message describing the invalid input."
        "500":
          description: Internal server error.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    description: "Error message describing the server error."
                    
  /health:
    get:
      summary: Health Check
      description: "Returns a simple status to verify that the API is running."
      responses:
        "200":
          description: API is healthy.
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"
components:
  schemas:
    LivabilityRequest:
      type: object
      properties:
        address:
          type: string
          description: "The full address or suburb name."
        weights:
          type: object
          properties:
            crime:
              type: number
              description: "Importance weight for crime statistics (0-1)."
            weather:
              type: number
              description: "Importance weight for weather/disaster risks (0-1)."
            public_transportation:
              type: number
              description: "Importance weight for public transportation (0-1)."
            shopping:
              type: number
              description: "Importance weight for shopping centers (0-1)."
            family_demographics:
              type: number
              description: "Importance weight for family demographics (0-1)."
      required:
        - address
        - weights
    LivabilityResponse:
      type: object
      properties:
        overall_score:
          type: number
          description: "The calculated overall livability score."
        breakdown:
          type: object
          properties:
            crime:
              type: number
            weather:
              type: number
            public_transportation:
              type: number
            shopping:
              type: number
            family_demographics:
              type: number
`

  return (
    <div className="flex min-h-screen flex-col">
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
      <main className="flex-1 w-full px-4 py-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-muted-foreground">Explore our API documentation.</p>
          </div>
          <Tabs defaultValue="crime" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="crime">Crime</TabsTrigger>
              <TabsTrigger value="weather">Extreme Weather</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="livability">Livability</TabsTrigger>
            </TabsList>
            <TabsContent value="crime" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>NSW Crime Data API</CardTitle>
                  <CardDescription>Provides crime data for NSW suburbs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto p-4 text-sm">{crimeDocs}</pre>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="weather" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Extreme Weather Data API</CardTitle>
                  <CardDescription>Provides extreme weather data based on NSW natural disaster declarations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto p-4 text-sm">{weatherDocs}</pre>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="family" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Family Census Data API</CardTitle>
                  <CardDescription>Retrieve family composition and population data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto p-4 text-sm">{familyDocs}</pre>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="livability" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Livability Score API</CardTitle>
                  <CardDescription>Calculate and analyze livability scores.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto p-4 text-sm">{livabilityDocs}</pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
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
  )
}
