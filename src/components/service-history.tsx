"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Wrench, DollarSign, FileText, Download, Receipt } from 'lucide-react'
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"

export function ServiceHistory() {
  const [bookings, setBookings] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [combinedRecords, setCombinedRecords] = useState<any[]>([])

  const loadHistory = () => {
    const user = getCurrentUser()
    if (!user) return

    console.log('[v0] Loading service history for user:', user.id)
    const allBookings = JSON.parse(localStorage.getItem('autocare_bookings') || '[]')
    const allInvoices = JSON.parse(localStorage.getItem('autocare_invoices') || '[]')

    // Filter bookings by current user
    const userBookings = allBookings.filter((b: any) => b.customerId === user.id)
    const userInvoices = allInvoices.filter((i: any) => i.customerId === user.id)

    console.log('[v0] User bookings:', userBookings.length)
    console.log('[v0] User invoices:', userInvoices.length)

    setBookings(userBookings)
    setInvoices(userInvoices)

    // Combine bookings with their invoices
    const combined = userBookings.map((booking: any) => {
      const invoice = userInvoices.find((inv: any) => inv.bookingId === booking.id)
      return {
        ...booking,
        invoice,
        hasInvoice: !!invoice
      }
    })

    setCombinedRecords(combined)
  }

  useEffect(() => {
    loadHistory()

    // Listen for storage changes
    const handleStorageChange = () => {
      console.log('[v0] Storage event detected, reloading service history')
      loadHistory()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const totalSpent = invoices.reduce((sum, inv) => {
    const price = parseFloat(inv.totalPrice.replace('$', ''))
    return sum + (isNaN(price) ? 0 : price)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <p className="text-3xl font-bold">{bookings.length}</p>
          <p className="text-sm text-muted-foreground">Total Bookings</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total Spent</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-3xl font-bold">{invoices.length}</p>
          <p className="text-sm text-muted-foreground">Invoices Received</p>
        </Card>
      </div>

      {/* Service Records */}
      <Card className="p-6">
        {combinedRecords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No service history yet. Book a service to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {combinedRecords.map((record) => (
              <ServiceRecordCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function ServiceRecordCard({ record }: { record: any }) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{record.service}</h3>
            <Badge variant={record.hasInvoice ? "default" : "secondary"}>
              {record.hasInvoice ? "Completed" : record.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{record.vehicle}</p>
          <p className="text-sm text-muted-foreground">{record.workshop}</p>
        </div>
        {record.invoice && (
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{record.invoice.totalPrice}</p>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Time:</span>
          <span className="font-medium">{record.time}</span>
        </div>
      </div>

      {record.notes && (
        <div className="flex items-start gap-2 mb-4">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">{record.notes}</p>
        </div>
      )}

      {record.invoice && (
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-semibold text-sm">Invoice Details</h4>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Labor Cost:</span>
              <span className="font-medium ml-2">{record.invoice.labor}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium ml-2">{record.invoice.totalPrice}</span>
            </div>
          </div>
          {record.invoice.parts && (
            <div>
              <span className="text-muted-foreground text-sm">Parts Used:</span>
              <p className="text-sm mt-1">{record.invoice.parts}</p>
            </div>
          )}
          {record.invoice.notes && (
            <div>
              <span className="text-muted-foreground text-sm">Service Notes:</span>
              <p className="text-sm mt-1">{record.invoice.notes}</p>
            </div>
          )}
        </div>
      )}

      {!record.invoice && (
        <p className="text-sm text-muted-foreground">Waiting for workshop to complete service and send invoice.</p>
      )}
    </Card>
  )
}
