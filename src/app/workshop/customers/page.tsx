"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, Phone, Mail, Search, Receipt } from "lucide-react";
import { WorkshopNav } from "@/components/workshop-nav";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useServiceRecords } from "@/contexts/ServiceRecordContext";
import { useWorkshops } from "@/contexts/WorkshopContext";

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;

  active: number;
  completed: number;
  cancelled: number;

  lastService: string | null;

  invoices: any[];
}

export default function WorkshopCustomersPage() {
  const { user } = useAuth();
  const { currentWorkshop } = useWorkshops();
  const { recordsByWorkshop, loading } = useServiceRecords();

  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);

  useEffect(() => {
    if (!currentWorkshop || loading) return;

    const workshopId = currentWorkshop.id;
    const workshopRecords = recordsByWorkshop[workshopId] || [];

    // Load invoices from localStorage (temporary)
    const invoices = JSON.parse(
      localStorage.getItem("autocare_invoices") || "[]"
    );

    // Group by userId
    const customerMap = new Map<string, CustomerSummary>();

    workshopRecords.forEach((r: any) => {
      if (!customerMap.has(r.userId)) {
        customerMap.set(r.userId, {
          id: r.userId,
          name: r.userName,
          email: r.userEmail,
          phone: r.userPhone,

          active: 0,
          completed: 0,
          cancelled: 0,

          lastService: null,
          invoices: [],
        });
      }

      const c = customerMap.get(r.userId)!;

      // Status grouping
      if (r.status === "Scheduled" || r.status === "Active") c.active++;
      if (r.status === "Completed") c.completed++;
      if (r.status === "Cancelled") c.cancelled++;

      // Last service (based on completed dates)
      if (r.status === "Completed") {
        if (
          !c.lastService ||
          new Date(r.serviceDate) > new Date(c.lastService)
        ) {
          c.lastService = r.serviceDate;
        }
      }
    });

    // Attach invoices
    invoices.forEach((inv: any) => {
      const c = customerMap.get(inv.customerId);
      if (c) c.invoices.push(inv);
    });

    setCustomers(Array.from(customerMap.values()));
  }, [recordsByWorkshop, currentWorkshop, loading]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <WorkshopNav />

        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Customers</h1>
            <p className="text-muted-foreground">
              View customers who have used your workshop services
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex mb-6">
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

          {/* No Customers */}
          {filteredCustomers.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No customers yet. They will appear once they book a service.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <Card
                  key={customer.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {customer.name}
                      </h3>
                      <Badge>
                        {customer.completed + customer.active >= 3
                          ? "Regular"
                          : "New"}
                      </Badge>
                    </div>
                    <div className="bg-teal-500/10 p-3 rounded-lg">
                      <Car className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                  </div>

                  {/* SERVICE SUMMARY */}
                  <div className="border-t pt-4 mb-4 text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Active</span>
                      <span>{customer.active}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Completed</span>
                      <span>{customer.completed}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Cancelled</span>
                      <span>{customer.cancelled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Last Service</span>
                      <span>
                        {customer.lastService
                          ? new Date(customer.lastService).toLocaleDateString(
                              "en-GB",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <a href={`mailto:${customer.email}`}>Contact</a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
