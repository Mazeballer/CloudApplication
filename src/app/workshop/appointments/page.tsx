"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Car, Search, Filter, Upload, Mail } from 'lucide-react'
import { WorkshopNav } from "@/components/workshop-nav"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Booking {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicle: string
  service: string
  date: string
  time: string
  workshop: string
  notes: string
  status: string
  createdAt: string
}

export default function WorkshopAppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [appointments, setAppointments] = useState<Booking[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null)
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState({
    totalPrice: "",
    parts: "",
    labor: "",
    notes: ""
  })

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('autocare_bookings') || '[]')
    setAppointments(bookings)
  }, [])

  const handleInvoiceUpload = async (file: File) => {
    setInvoiceFile(file)
    
    // Simulate AI extraction after a short delay
    setTimeout(() => {
      // Mock extracted data - in real app, this would call an AI API
      setExtractedData({
        totalPrice: "$" + (Math.random() * 500 + 100).toFixed(2),
        parts: "Oil Filter ($15), Motor Oil 5W-30 ($45), Air Filter ($25)",
        labor: "$60.00",
        notes: "Completed full oil change service and replaced air filter as recommended"
      })
    }, 2000)
  }

  const sendInvoiceToCustomer = () => {
    if (selectedAppointment) {
      const invoices = JSON.parse(localStorage.getItem('autocare_invoices') || '[]')
      invoices.push({
        id: Date.now().toString(),
        bookingId: selectedAppointment.id,
        customerId: selectedAppointment.customerId,
        customerEmail: selectedAppointment.customerEmail,
        ...extractedData,
        sentAt: new Date().toISOString()
      })
      localStorage.setItem('autocare_invoices', JSON.stringify(invoices))
      
      alert(`Invoice sent to ${selectedAppointment.customerEmail}`)
      setSelectedAppointment(null)
      setInvoiceFile(null)
      setExtractedData({
        totalPrice: "",
        parts: "",
        labor: "",
        notes: ""
      })
    }
  }

  const filteredAppointments = appointments.filter(apt => 
    apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <WorkshopNav />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Appointments</h1>
            <p className="text-muted-foreground">
              View bookings from customers and manage services
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, vehicle, or service..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No appointments found. Customer bookings will appear here.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="text-center">
                        <div className="bg-teal-500/10 px-4 py-2 rounded-lg">
                          <p className="text-2xl font-bold text-teal-600">
                            {new Date(appointment.date).getDate()}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{appointment.customerName}</h3>
                          <Badge variant="secondary">
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Car className="h-4 w-4" />
                            <span>{appointment.vehicle}</span>
                          </div>
                          <div className="text-muted-foreground">
                            <span className="font-medium">Service:</span> {appointment.service}
                          </div>
                          <div className="text-muted-foreground">
                            <span className="font-medium">Phone:</span> {appointment.customerPhone}
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedAppointment(appointment)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Invoice
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Upload Invoice for {appointment.customerName}</DialogTitle>
                            <DialogDescription>
                              Upload an invoice photo and we'll automatically extract the details
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6 py-4">
                            {/* Invoice Upload */}
                            <div className="space-y-2">
                              <Label>Invoice Photo</Label>
                              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleInvoiceUpload(e.target.files[0])
                                    }
                                  }}
                                  className="hidden"
                                  id="invoice-upload"
                                />
                                <label htmlFor="invoice-upload" className="cursor-pointer">
                                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Click to upload invoice photo
                                  </p>
                                  {invoiceFile && (
                                    <p className="text-sm font-medium text-teal-600">
                                      {invoiceFile.name}
                                    </p>
                                  )}
                                </label>
                              </div>
                            </div>

                            {/* Extracted Data */}
                            {invoiceFile && (
                              <div className="space-y-4 border-t pt-4">
                                <h4 className="font-semibold">Extracted Invoice Details</h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Total Price</Label>
                                    <Input
                                      value={extractedData.totalPrice}
                                      onChange={(e) => setExtractedData({...extractedData, totalPrice: e.target.value})}
                                      placeholder="$0.00"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Labor Cost</Label>
                                    <Input
                                      value={extractedData.labor}
                                      onChange={(e) => setExtractedData({...extractedData, labor: e.target.value})}
                                      placeholder="$0.00"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Parts Used</Label>
                                  <Textarea
                                    value={extractedData.parts}
                                    onChange={(e) => setExtractedData({...extractedData, parts: e.target.value})}
                                    placeholder="List of parts..."
                                    rows={3}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Service Notes</Label>
                                  <Textarea
                                    value={extractedData.notes}
                                    onChange={(e) => setExtractedData({...extractedData, notes: e.target.value})}
                                    placeholder="Service details..."
                                    rows={3}
                                  />
                                </div>

                                <Button 
                                  className="w-full" 
                                  onClick={sendInvoiceToCustomer}
                                  disabled={!extractedData.totalPrice}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Invoice to Customer
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
