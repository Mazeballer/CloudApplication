"use client"

import { Card } from "@/components/ui/card"
import { Car, Wrench, AlertTriangle, CheckCircle } from 'lucide-react'
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    servicesDue: 0,
    activeBookings: 0,
    servicesCompleted: 0
  })

  const loadStats = () => {
    const user = getCurrentUser()
    if (!user) return

    console.log('[v0] Loading stats for user:', user.id)
    const vehicles = JSON.parse(localStorage.getItem('autocare_vehicles') || '[]')
    const bookings = JSON.parse(localStorage.getItem('autocare_bookings') || '[]')
    const invoices = JSON.parse(localStorage.getItem('autocare_invoices') || '[]')

    const userVehicles = vehicles.filter((v: any) => v.userId === user.id)
    const userBookings = bookings.filter((b: any) => b.customerId === user.id)
    const userInvoices = invoices.filter((i: any) => i.customerId === user.id)

    console.log('[v0] User vehicles:', userVehicles.length)
    console.log('[v0] User bookings:', userBookings.length)
    console.log('[v0] User invoices:', userInvoices.length)

    // Count scheduled (not yet completed) bookings
    const activeBookings = userBookings.filter((b: any) => {
      const hasInvoice = userInvoices.some((inv: any) => inv.bookingId === b.id)
      return !hasInvoice
    }).length

    setStats({
      totalVehicles: userVehicles.length,
      servicesDue: activeBookings,
      activeBookings: activeBookings,
      servicesCompleted: userInvoices.length
    })
  }

  useEffect(() => {
    loadStats()

    // Listen for storage changes
    const handleStorageChange = () => {
      console.log('[v0] Storage event detected, reloading stats')
      loadStats()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const statItems = [
    {
      label: "Total Vehicles",
      value: stats.totalVehicles.toString(),
      icon: Car,
      color: "text-primary"
    },
    {
      label: "Services Due",
      value: stats.servicesDue.toString(),
      icon: Wrench,
      color: "text-amber-500"
    },
    {
      label: "Active Bookings",
      value: stats.activeBookings.toString(),
      icon: AlertTriangle,
      color: "text-red-500"
    },
    {
      label: "Services Completed",
      value: stats.servicesCompleted.toString(),
      icon: CheckCircle,
      color: "text-green-500"
    }
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
          <p className="text-3xl font-bold mb-1">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </Card>
      ))}
    </div>
  )
}
