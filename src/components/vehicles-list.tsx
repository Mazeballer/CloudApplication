"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Calendar, Gauge } from 'lucide-react'
import Link from 'next/link'
import { AddVehicleDialog } from "./add-vehicle-dialog"
import { getCurrentUser } from "@/lib/auth"

export function VehiclesList() {
  const [vehicles, setVehicles] = useState<any[]>([])

  const loadVehicles = () => {
    const user = getCurrentUser()
    if (!user) return

    console.log('[v0] Loading vehicles for user:', user.id)
    const storedVehicles = JSON.parse(localStorage.getItem('autocare_vehicles') || '[]')
    console.log('[v0] Total vehicles in storage:', storedVehicles.length)
    
    const userVehicles = storedVehicles.filter((v: any) => v.userId === user.id)
    console.log('[v0] User vehicles found:', userVehicles.length)
    
    // Map to display format
    const formattedVehicles = userVehicles.map((v: any) => ({
      id: v.id,
      make: v.make,
      model: v.model,
      year: v.year,
      plate: v.licensePlate,
      mileage: `${v.mileage.toLocaleString()} km`,
      nextService: v.nextService,
      status: v.healthScore > 80 ? "good" : v.healthScore > 60 ? "warning" : "critical",
      image: v.image
    }))
    
    setVehicles(formattedVehicles)
  }

  useEffect(() => {
    loadVehicles()

    // Listen for storage changes
    const handleStorageChange = () => {
      console.log('[v0] Storage event detected, reloading vehicles')
      loadVehicles()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleAddVehicle = (newVehicle: {
    make: string
    model: string
    year: number
    plate: string
    mileage: string
    vin: string
    image?: string
  }) => {
    const user = getCurrentUser()
    if (!user) return

    const storedVehicles = JSON.parse(localStorage.getItem('autocare_vehicles') || '[]')
    
    const vehicle = {
      id: Date.now().toString(),
      userId: user.id,
      make: newVehicle.make,
      model: newVehicle.model,
      year: newVehicle.year,
      licensePlate: newVehicle.plate,
      mileage: parseInt(newVehicle.mileage),
      vin: newVehicle.vin,
      image: newVehicle.image || `/placeholder.svg?height=200&width=300&query=${newVehicle.make} ${newVehicle.model}`,
      lastService: new Date().toISOString().split('T')[0],
      nextService: "Not scheduled",
      healthScore: 90
    }
    
    storedVehicles.push(vehicle)
    localStorage.setItem('autocare_vehicles', JSON.stringify(storedVehicles))
    
    // Update display
    const displayVehicle = {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.licensePlate,
      mileage: `${vehicle.mileage.toLocaleString()} km`,
      nextService: vehicle.nextService,
      status: "good" as const,
      image: vehicle.image
    }
    
    setVehicles([...vehicles, displayVehicle])
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Vehicles</h2>
        <AddVehicleDialog onAddVehicle={handleAddVehicle} />
      </div>

      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No vehicles added yet. Click "Add Vehicle" to get started.</p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Vehicle Image */}
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full sm:w-32 h-24 object-cover rounded-lg"
                />

                {/* Vehicle Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                    </div>
                    <Badge 
                      variant={
                        vehicle.status === "critical" ? "destructive" : 
                        vehicle.status === "warning" ? "secondary" : 
                        "default"
                      }
                    >
                      {vehicle.status === "critical" ? "Action Required" : 
                       vehicle.status === "warning" ? "Service Due" : 
                       "Good Condition"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      {vehicle.mileage}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Next service: {vehicle.nextService}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/book">
                        Book Service
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  )
}
