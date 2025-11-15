"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Clock, CheckCircle, MapPin, Star, Phone, DollarSign, Timer } from 'lucide-react'
import { getCurrentUser } from "@/lib/auth"

const getWorkshops = () => {
  if (typeof window === 'undefined') return []
  const workshops = localStorage.getItem('autocare_workshops')
  return workshops ? JSON.parse(workshops) : []
}

export function BookServiceForm() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [vehicles, setVehicles] = useState<any[]>([])
  const [workshops, setWorkshops] = useState<any[]>([])

  useEffect(() => {
    const storedVehicles = JSON.parse(localStorage.getItem('autocare_vehicles') || '[]')
    const storedWorkshops = getWorkshops()
    setVehicles(storedVehicles)
    setWorkshops(storedWorkshops)
  }, [])

  const handleWorkshopSelect = (workshop: any) => {
    setSelectedWorkshop(workshop)
    setSelectedService(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedWorkshop || !selectedService || !selectedVehicle || !selectedDate || !selectedTime) {
      alert("Please fill in all required fields")
      return
    }

    const user = getCurrentUser()
    const booking = {
      id: Date.now().toString(),
      customerId: user?.id,
      customerName: user?.name || "Guest",
      customerEmail: user?.email,
      customerPhone: phone,
      vehicle: selectedVehicle,
      service: selectedService.name,
      servicePrice: selectedService.price,
      date: selectedDate,
      time: selectedTime,
      workshop: selectedWorkshop.name,
      workshopAddress: selectedWorkshop.address,
      notes: notes,
      status: "scheduled",
      createdAt: new Date().toISOString()
    }
    
    const bookings = JSON.parse(localStorage.getItem('autocare_bookings') || '[]')
    bookings.push(booking)
    localStorage.setItem('autocare_bookings', JSON.stringify(bookings))
    
    setSubmitted(true)
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 2000)
  }

  if (submitted) {
    return (
      <Card className="p-12 text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Service Booked Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          Your appointment at {selectedWorkshop?.name} has been confirmed for {selectedDate} at {selectedTime}.
        </p>
        <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
      </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Column: Workshop Selection & Map */}
      <div className="space-y-6">
        {/* Map */}
        <Card className="overflow-hidden h-80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.507640045!3d37.757815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Card>

        {/* Workshop List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Workshop</h3>
          {workshops.map((workshop) => (
            <Card
              key={workshop.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedWorkshop?.id === workshop.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleWorkshopSelect(workshop)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{workshop.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{workshop.address}</span>
                  </div>
                </div>
                <Badge variant="secondary">{workshop.distance}</Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm mt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{workshop.rating}</span>
                  <span className="text-muted-foreground">({workshop.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{workshop.phone}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2">{workshop.hours}</p>

              {selectedWorkshop?.id === workshop.id && (
                <Badge className="mt-3" variant="default">Selected</Badge>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Right Column: Service Details & Booking Form */}
      <div className="space-y-6">
        {/* Service Selection */}
        {selectedWorkshop && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Available Services</h3>
            <div className="space-y-3">
              {selectedWorkshop.services.map((service: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedService?.name === service.name ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${service.price}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>
                    {selectedService?.name === service.name && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Booking Form */}
        {selectedService && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Vehicle Selection */}
              <div className="space-y-2">
                <Label htmlFor="vehicle">Select Vehicle *</Label>
                <Select required value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Choose a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={`${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`}>
                        {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label>Preferred Time *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="w-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific concerns or requests..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{selectedService.duration}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t">
                    <span>Total Price:</span>
                    <span>${selectedService.price}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg">
                Confirm Booking
              </Button>
            </form>
          </Card>
        )}

        {!selectedWorkshop && (
          <Card className="p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Select a Workshop</h3>
            <p className="text-sm text-muted-foreground">
              Choose a workshop from the list to view available services
            </p>
          </Card>
        )}

        {selectedWorkshop && !selectedService && (
          <Card className="p-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Select a Service</h3>
            <p className="text-sm text-muted-foreground">
              Choose a service to continue with your booking
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
