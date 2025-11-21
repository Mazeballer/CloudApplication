"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Car, Search, Filter, Upload, Mail } from "lucide-react";
import { WorkshopNav } from "@/components/workshop-nav";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useWorkshops } from "@/contexts/WorkshopContext";
import { useServiceRecords } from "@/contexts/ServiceRecordContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { currentWorkshop, loading: workshopLoading } = useWorkshops();
  const { recordsByWorkshop, loading, refreshServiceRecords } =
    useServiceRecords();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState({
    totalPrice: "",
    parts: "",
    labor: "",
    notes: "",
  });
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(
    null
  );

  // Fetch REAL data
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
      date: r.serviceDate.slice(0, 10),
      time: new Date(r.serviceDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      workshop: r.workshopName,
      notes: r.remarks || "",
      status: r.status, // Requested | Scheduled | Active | Completed | Cancelled
      createdAt: r.serviceDate,
    }));

    setAppointments(mapped);
  }, [recordsByWorkshop, loading, user, currentWorkshop]);

  const updateStatus = async (id: string, status: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${API_URL}/api/ServiceRecord/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(status), // "Completed"
    });

    if (!res.ok) {
      console.error("Failed to update status", res.status, await res.text());
      return;
    }

    // Update local state
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status, _newStatus: undefined } : apt
      )
    );

    // Show small popup
    setStatusUpdateMessage("Status updated");
    setTimeout(() => setStatusUpdateMessage(null), 2000);

    refreshServiceRecords();
  };

  // Invoice upload (mock extraction)
  const handleInvoiceUpload = async (file: File) => {
    setInvoiceFile(file);

    setTimeout(() => {
      setExtractedData({
        totalPrice: "$" + (Math.random() * 500 + 100).toFixed(2),
        parts: "Oil Filter ($15), Motor Oil 5W-30 ($45), Air Filter ($25)",
        labor: "$60.00",
        notes:
          "Completed full oil change service and replaced air filter as recommended",
      });
    }, 2000);
  };

  // Send invoice to real backend
  const sendInvoiceToCustomer = async () => {
    if (!selectedAppointment) return;
    if (!extractedData.totalPrice) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const payload = {
        bookingId: selectedAppointment.id,
        customerId: selectedAppointment.customerId,
        customerEmail: selectedAppointment.customerEmail,
        totalPrice: extractedData.totalPrice,
        parts: extractedData.parts,
        labor: extractedData.labor,
        notes: extractedData.notes,
        sentAt: new Date().toISOString(),
      };

      await fetch(`${API_URL}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert(`Invoice sent to ${selectedAppointment.customerEmail}`);
    } catch (err) {
      console.error("Failed to send invoice", err);
      alert("Failed to send invoice. Please try again.");
    } finally {
      setSelectedAppointment(null);
      setInvoiceFile(null);
      setExtractedData({
        totalPrice: "",
        parts: "",
        labor: "",
        notes: "",
      });
    }
  };

  // Search + status filter
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
                  {statusFilter && statusFilter !== "All"
                    ? statusFilter
                    : "Filter by status"}
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

          {/* Appointments List */}
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
                      {/* DATE BOX + DETAILS */}
                      <div className="flex items-center gap-6 flex-1">
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
                                <option value="Requested">Requested</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    appointment._newStatus || appointment.status
                                  )
                                }
                                disabled={!hasChanged}
                              >
                                Update
                              </Button>
                            </div>
                          </div>

                          {/* Details */}
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

                      {/* Upload invoice – only when status === 'Completed' */}
                      <div className="flex-shrink-0">
                        <Dialog
                          open={
                            selectedAppointment?.id === appointment.id &&
                            !!selectedAppointment
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setSelectedAppointment(null);
                              setInvoiceFile(null);
                              setExtractedData({
                                totalPrice: "",
                                parts: "",
                                labor: "",
                                notes: "",
                              });
                            } else if (appointment.status === "Completed") {
                              setSelectedAppointment(appointment);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() =>
                                appointment.status === "Completed" &&
                                setSelectedAppointment(appointment)
                              }
                              disabled={appointment.status !== "Completed"}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Invoice
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Upload Invoice for {appointment.customerName}
                              </DialogTitle>
                              <DialogDescription>
                                Upload invoice photo and we will extract details
                              </DialogDescription>
                            </DialogHeader>

                            {/* Invoice upload */}
                            <div className="space-y-6 py-4">
                              <div className="space-y-2">
                                <Label>Invoice Photo</Label>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        handleInvoiceUpload(e.target.files[0]);
                                      }
                                    }}
                                    className="hidden"
                                    id="invoice-upload"
                                  />
                                  <label
                                    htmlFor="invoice-upload"
                                    className="cursor-pointer"
                                  >
                                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Click to upload invoice
                                    </p>
                                    {invoiceFile && (
                                      <p className="text-sm font-medium text-teal-600">
                                        {invoiceFile.name}
                                      </p>
                                    )}
                                  </label>
                                </div>
                              </div>

                              {/* Extracted data */}
                              {invoiceFile && (
                                <div className="space-y-4 border-t pt-4">
                                  <h4 className="font-semibold">
                                    Extracted Invoice Details
                                  </h4>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Total Price</Label>
                                      <Input
                                        value={extractedData.totalPrice}
                                        onChange={(e) =>
                                          setExtractedData({
                                            ...extractedData,
                                            totalPrice: e.target.value,
                                          })
                                        }
                                        placeholder="$0.00"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Labor Cost</Label>
                                      <Input
                                        value={extractedData.labor}
                                        onChange={(e) =>
                                          setExtractedData({
                                            ...extractedData,
                                            labor: e.target.value,
                                          })
                                        }
                                        placeholder="$0.00"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Parts Used</Label>
                                    <Textarea
                                      value={extractedData.parts}
                                      onChange={(e) =>
                                        setExtractedData({
                                          ...extractedData,
                                          parts: e.target.value,
                                        })
                                      }
                                      placeholder="List of parts..."
                                      rows={3}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Service Notes</Label>
                                    <Textarea
                                      value={extractedData.notes}
                                      onChange={(e) =>
                                        setExtractedData({
                                          ...extractedData,
                                          notes: e.target.value,
                                        })
                                      }
                                      placeholder="Service details..."
                                      rows={3}
                                    />
                                  </div>

                                  {/* Send Invoice */}
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
                );
              })}
            </div>
          )}

          {/* Small popup message for status update */}
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
