import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function IndexPage() {
  return (
    <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[url(/images/bg.jpg)] z-0" />
        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and helped me deliver stunning designs every
              time. I highly recommend it to anyone looking to streamline their design process and create beautiful,
              consistent user interfaces.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis, Design Lead</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 1-6 0V6a3 3 0 1 1 6 0z" />
              </svg>
              <span className="font-bold">Acme Corp</span>
            </Link>
            <ModeToggle />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Create an account</h1>
            <p className="text-muted-foreground">Enter your email below to create your account</p>
          </div>
          <div className="grid gap-6">
            <button className={cn(buttonVariants())}>Sign up with Email</button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), "gap-2 w-full")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M9 19c-1.3 0-2.5-.3-3.6-.8L3 21l.4-1.9C2.3 17.3 2 16.2 2 15V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v10c0 1.1-.9 2-2 2h-3" />
                <path d="M16 11.3c0 1.8-1.5 3.2-3.3 3.2-1.8 0-3.3-1.4-3.3-3.2 0-1.8 1.5-3.2 3.3-3.2 1.8 0 3.3 1.4 3.3 3.2z" />
              </svg>
              Google
            </button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By continuing, you are agreeing to our{" "}
            <Link href="/terms" className="hover:text-foreground underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:text-foreground underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

