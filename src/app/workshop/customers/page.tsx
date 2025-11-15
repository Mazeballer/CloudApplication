"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Phone, Mail, Search, Receipt } from 'lucide-react'
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

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalBookings: number
  lastService: string
  invoices: any[]
}

export default function WorkshopCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('autocare_bookings') || '[]')
    const invoices = JSON.parse(localStorage.getItem('autocare_invoices') || '[]')
    
    // Group bookings by customer
    const customerMap = new Map<string, Customer>()
    
    bookings.forEach((booking: any) => {
      if (!customerMap.has(booking.customerId)) {
        customerMap.set(booking.customerId, {
          id: booking.customerId,
          name: booking.customerName,
          email: booking.customerEmail,
          phone: booking.customerPhone,
          totalBookings: 0,
          lastService: booking.date,
          invoices: []
        })
      }
      
      const customer = customerMap.get(booking.customerId)!
      customer.totalBookings++
      
      // Update last service date if this booking is more recent
      if (new Date(booking.date) > new Date(customer.lastService)) {
        customer.lastService = booking.date
      }
    })
    
    // Add invoices to customers
    invoices.forEach((invoice: any) => {
      const customer = Array.from(customerMap.values()).find(c => c.id === invoice.customerId)
      if (customer) {
        customer.invoices.push(invoice)
      }
    })
    
    setCustomers(Array.from(customerMap.values()))
  }, [])

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  )

  const calculateTotalSpent = (customer: Customer) => {
    const total = customer.invoices.reduce((sum, inv) => {
      const price = parseFloat(inv.totalPrice.replace('$', ''))
      return sum + (isNaN(price) ? 0 : price)
    }, 0)
    return `$${total.toFixed(2)}`
  }

  const getLastServiceText = (date: string) => {
    const serviceDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - serviceDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <WorkshopNav />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Customers</h1>
            <p className="text-muted-foreground">
              View customers who have booked services with your workshop
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Customers Grid */}
          {filteredCustomers.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No customers yet. Customers who book services will appear here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{customer.name}</h3>
                      <Badge variant={customer.totalBookings >= 3 ? "default" : "secondary"}>
                        {customer.totalBookings >= 3 ? "Regular" : "New"}
                      </Badge>
                    </div>
                    <div className="bg-teal-500/10 p-3 rounded-lg">
                      <Car className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-teal-600">{customer.totalBookings}</p>
                      <p className="text-xs text-muted-foreground">Bookings</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{getLastServiceText(customer.lastService)}</p>
                      <p className="text-xs text-muted-foreground">Last Visit</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{calculateTotalSpent(customer)}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`mailto:${customer.email}`}>
                        Contact
                      </a>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex-1" onClick={() => setSelectedCustomer(customer)}>
                          <Receipt className="h-4 w-4 mr-2" />
                          Invoices
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Invoices for {customer.name}</DialogTitle>
                          <DialogDescription>
                            View all invoices sent to this customer
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                          {customer.invoices.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No invoices sent yet</p>
                          ) : (
                            customer.invoices.map((invoice) => (
                              <Card key={invoice.id} className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-semibold text-lg">{invoice.totalPrice}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(invoice.sentAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge>Sent</Badge>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Labor:</span> {invoice.labor}
                                  </div>
                                  <div>
                                    <span className="font-medium">Parts:</span>
                                    <p className="text-muted-foreground">{invoice.parts}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Notes:</span>
                                    <p className="text-muted-foreground">{invoice.notes}</p>
                                  </div>
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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
