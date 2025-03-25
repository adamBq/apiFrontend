"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Key, BarChart, FileText, Settings } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "API Keys",
      href: "/dashboard",
      icon: <Key className="mr-2 h-4 w-4" />,
    },
    {
      title: "Usage",
      href: "/dashboard/usage",
      icon: <BarChart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Documentation",
      href: "/docs",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="grid items-start gap-2 py-6">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
          >
            {item.icon}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}

