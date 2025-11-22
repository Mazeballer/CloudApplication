"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Car, Search, Filter, Eye, FileDown } from "lucide-react";
import { WorkshopNav } from "@/components/workshop-nav";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useWorkshops } from "@/contexts/WorkshopContext";
import { useServiceRecords } from "@/contexts/ServiceRecordContext";

const STATUS_FILTER_OPTIONS = [
  "All",
  "Requested",
  "Scheduled",
  "Active",
  "Completed",
  "Cancelled",
];

export default function WorkshopAppointmentsPage() {
  const { user } = useAuth();
  const { currentWorkshop } = useWorkshops();
  const { recordsByWorkshop, loading, refreshServiceRecords } =
    useServiceRecords();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(
    null
  );

  // Fetch REAL service records
  useEffect(() => {
    if (!user || loading) return;

    const workshopId = currentWorkshop?.id;
    const workshopRecords = recordsByWorkshop[workshopId ?? ""] || [];

    const mapped = workshopRecords.map((r) => ({
      id: r.id,
      customerId: r.userId,
      customerName: r.userName,
      customerEmail: r.userEmail,
      customerPhone: r.userPhone,
      vehicle: r.vehicleName,
      service: r.serviceName,
      serviceId: r.serviceId,
      invoiceId: r.invoiceId, // ⭐ REQUIRED FOR INVOICE FLOW

      date: r.serviceDate.slice(0, 10),
      time: new Date(r.serviceDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      workshop: r.workshopName,
      notes: r.remarks || "",
      status: r.status,
      createdAt: r.serviceDate,
    }));

    setAppointments(mapped);
  }, [recordsByWorkshop, loading, user, currentWorkshop]);

  // Update status handler
  const updateStatus = async (id: string, status: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${API_URL}/api/ServiceRecord/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(status),
    });

    if (!res.ok) {
      console.error("Failed to update status");
      return;
    }

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status, _newStatus: undefined } : apt
      )
    );

    setStatusUpdateMessage("Status updated");
    setTimeout(() => setStatusUpdateMessage(null), 2000);

    refreshServiceRecords();
  };

  // ================================
  //  Invoice: Generate
  // ================================
  const generateInvoice = async (appointment: any) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const payload = {
      serviceRecordId: appointment.id,
      userId: appointment.customerId,
      workshopId: currentWorkshop?.id,
    };

    const res = await fetch(`${API_URL}/api/Invoice/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to generate invoice");
      return;
    }

    const data = await res.json();

    // Update invoiceId in UI
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointment.id ? { ...apt, invoiceId: data.id } : apt
      )
    );

    refreshServiceRecords();
    alert("Invoice generated successfully.");
  };

  // ================================
  //  Invoice: View in new tab
  // ================================

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const viewInvoice = (invoiceId: string) => {
    window.open(`${API_URL}/invoices/${invoiceId}.pdf`, "_blank");
  };

  // ================================
  //  Invoice: Download PDF
  // ================================
  const downloadPdf = async (invoiceId: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/api/Invoice/${invoiceId}`);

    if (!res.ok) {
      alert("Unable to fetch invoice");
      return;
    }

    const invoice = await res.json();
    if (!invoice.pdfUrl) {
      alert("Invoice PDF not available");
      return;
    }

    window.open(`${API_URL}${invoice.pdfUrl}`, "_blank");
  };

  // SEARCH + FILTER
  const filteredAppointments = appointments.filter((apt) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      apt.customerName.toLowerCase().includes(q) ||
      apt.vehicle.toLowerCase().includes(q) ||
      apt.service.toLowerCase().includes(q);

    const matchesStatus =
      !statusFilter || statusFilter === "All" || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <WorkshopNav />

        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Appointments</h1>
            <p className="text-muted-foreground">
              View bookings from customers and manage services
            </p>
          </div>

          {/* Search + Filter */}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter || "Filter by status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUS_FILTER_OPTIONS.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() =>
                      setStatusFilter(status === "All" ? null : status)
                    }
                  >
                    {status === "All" ? "All statuses" : status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* LIST */}
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No appointments found.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const draftStatus =
                  appointment._newStatus ?? appointment.status;
                const hasChanged = appointment._newStatus
                  ? appointment._newStatus !== appointment.status
                  : false;

                return (
                  <Card
                    key={appointment.id}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-6">
                      {/* Left Side */}
                      <div className="flex items-center gap-6 flex-1">
                        {/* DATE */}
                        <div className="text-center">
                          <div className="bg-teal-500/10 px-4 py-2 rounded-lg">
                            <p className="text-2xl font-bold text-teal-600">
                              {new Date(appointment.date).getDate()}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase">
                              {new Date(appointment.date).toLocaleDateString(
                                "en-US",
                                { month: "short" }
                              )}
                            </p>
                          </div>
                        </div>

                        {/* DETAILS */}
                        <div className="flex-1">
                          {/* Customer + Status */}
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-lg">
                              {appointment.customerName}
                            </h3>

                            <div className="flex items-center gap-2">
                              <select
                                className="border rounded px-2 py-1 text-sm"
                                value={draftStatus}
                                onChange={(e) => {
                                  appointment._newStatus = e.target.value;
                                  setAppointments([...appointments]);
                                }}
                              >
                                {STATUS_FILTER_OPTIONS.filter(
                                  (s) => s !== "All"
                                ).map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>

                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={!hasChanged}
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    appointment._newStatus || appointment.status
                                  )
                                }
                              >
                                Update
                              </Button>
                            </div>
                          </div>

                          {/* Fields */}
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
                              <span className="font-medium">Service:</span>{" "}
                              {appointment.service}
                            </div>
                            <div className="text-muted-foreground">
                              <span className="font-medium">Phone:</span>{" "}
                              {appointment.customerPhone}
                            </div>
                          </div>

                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <span className="font-medium">Notes:</span>{" "}
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Side — Invoice */}
                      <div className="flex flex-col gap-2">
                        {appointment.status === "Completed" && (
                          <>
                            {!appointment.invoiceId ? (
                              <Button
                                size="sm"
                                className="bg-teal-600 text-white"
                                onClick={() => generateInvoice(appointment)}
                              >
                                Generate Invoice
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    viewInvoice(appointment.invoiceId)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Invoice
                                </Button>

                                <Button
                                  size="sm"
                                  onClick={() =>
                                    downloadPdf(appointment.invoiceId)
                                  }
                                >
                                  <FileDown className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Status Update Message */}
          {statusUpdateMessage && (
            <div className="fixed bottom-4 right-4 rounded-md bg-emerald-500 text-white px-4 py-2 shadow-lg text-sm">
              {statusUpdateMessage}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
