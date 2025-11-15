"use client"

import { Button } from "@/components/ui/button"
import { Wrench } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from "@/lib/auth"

export function WorkshopNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navItems = [
    { href: '/workshop/dashboard', label: 'Dashboard' },
    { href: '/workshop/appointments', label: 'Appointments' },
    { href: '/workshop/customers', label: 'Customers' },
    { href: '/workshop/services', label: 'Services' }
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-500 p-2 rounded-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AutoCare+ Workshop</span>
          </div>
          
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
