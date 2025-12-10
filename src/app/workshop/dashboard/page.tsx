"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Car,
  Clock,
  DollarSign,
  Users,
  Wrench,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useServiceRecords } from "@/contexts/ServiceRecordContext";
import { useWorkshops } from "@/contexts/WorkshopContext";

/* ============================================================
   ASP.NET BACKEND BASE URL
============================================================ */
const API_BASE = "https://localhost:7255";

/* ============================================================
   Dashboard Component
============================================================ */
export default function WorkshopDashboard() {
  const { user } = useAuth();
  const { currentWorkshop, loading: workshopLoading } = useWorkshops();
  const { recordsByWorkshop, loading } = useServiceRecords();

  const [stats, setStats] = useState({
    todayAppointments: 0,
    activeServices: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
  });

  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);

  /* ============================================================
     Fetch Service by ID (ASP.NET)
============================================================ */
  async function fetchService(serviceId: string) {
    try {
      const res = await fetch(`${API_BASE}/api/Services/${serviceId}`);
      if (!res.ok) {
        console.warn("Service not found:", serviceId);
        return null;
      }
      return res.json();
    } catch (err) {
      console.error("Service fetch error:", err);
      return null;
    }
  }

  /* ============================================================
     Fetch Service Items (ASP.NET)
============================================================ */
  async function fetchServiceItems(recordId: string) {
    try {
      const res = await fetch(
        `${API_BASE}/api/ServiceItem/by-record/${recordId}`
      );
      if (!res.ok) {
        console.warn("Service items not found:", recordId);
        return [];
      }
      return res.json();
    } catch (err) {
      console.error("Service item fetch error:", err);
      return [];
    }
  }

  /* ============================================================
     Revenue Calculation Logic
============================================================ */
  async function calculateMonthlyRevenue(records: any[]) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    let sum = 0;

    for (const record of records) {
      if (record.status !== "Completed") continue;

      const date = new Date(record.serviceDate);
      if (date.getMonth() !== month || date.getFullYear() !== year) continue;

      try {
        const [service, items] = await Promise.all([
          fetchService(record.serviceId),
          fetchServiceItems(record.id),
        ]);

        const basePrice = Number(service?.price ?? 0);

        const itemsTotal = Array.isArray(items)
          ? items.reduce(
              (acc, item) =>
                acc + Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0),
              0
            )
          : 0;

        sum += basePrice + itemsTotal;
      } catch (err) {
        console.error("Revenue calculation error for record:", record.id, err);
      }
    }

    return sum;
  }

  /* ============================================================
     Main Effect — Load Dashboard Metrics
============================================================ */
  useEffect(() => {
    if (!user || loading || workshopLoading || !currentWorkshop) return;

    const workshopId = currentWorkshop.id;
    const workshopRecords = recordsByWorkshop[workshopId] || [];

    const todayStr = new Date().toISOString().slice(0, 10);

    const todays = workshopRecords.filter(
      (r: any) =>
        r.status === "Scheduled" &&
        typeof r.serviceDate === "string" &&
        r.serviceDate.slice(0, 10) === todayStr
    );

    const active = workshopRecords.filter(
      (r: any) => r.status === "Scheduled" || r.status === "Active"
    ).length;

    const customers = new Set(workshopRecords.map((r: any) => r.userId));

    (async () => {
      const revenue = await calculateMonthlyRevenue(workshopRecords);

      setStats({
        todayAppointments: todays.length,
        activeServices: active,
        totalCustomers: customers.size,
        monthlyRevenue: revenue,
      });

      setTodaySchedule(todays.slice(0, 4));
    })();
  }, [user, loading, workshopLoading, currentWorkshop, recordsByWorkshop]);

  /* ============================================================
     UI Rendering
============================================================ */
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        {/* NAVBAR */}
        <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-18">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-teal-500 p-2 rounded-lg">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">AutoCare+ Workshop</span>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/workshop/dashboard"
                  className="text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/workshop/appointments"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Appointments
                </Link>
                <Link
                  href="/workshop/customers"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Customers
                </Link>
                <Link
                  href="/workshop/services"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Services
                </Link>
                <Link
                  href="/workshop/operating-hours"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Operating Hours
                </Link>

                <Button variant="outline" size="sm" asChild>
                  <Link href="/">Logout</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Workshop Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your workshop operations and appointments
            </p>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Today's Appointments
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.todayAppointments}
                  </p>
                </div>
                <div className="bg-teal-500/10 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Active Services
                  </p>
                  <p className="text-3xl font-bold">{stats.activeServices}</p>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-lg">
                  <Wrench className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Customers
                  </p>
                  <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Revenue (Month)
                  </p>
                  <p className="text-3xl font-bold">
                    ${stats.monthlyRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* TODAY'S Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>

              {todaySchedule.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySchedule.map((appointment: any) => (
                    <Card
                      key={appointment.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="bg-teal-500/10 p-2 rounded-lg">
                            <Clock className="h-5 w-5 text-teal-600" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">
                                {appointment.serviceName}
                              </p>
                              <Badge variant="secondary">
                                {appointment.status}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {appointment.vehicleName}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {appointment.workshopName}
                            </p>
                          </div>

                          <p className="text-sm font-medium">
                            {new Date(
                              appointment.serviceDate
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <Button size="sm" variant="outline" asChild>
                          <Link href="/workshop/appointments">View</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {/* QUICK ACTIONS */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/workshop/appointments">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Appointments
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/workshop/customers">
                      <Users className="h-4 w-4 mr-2" />
                      View Customers
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/workshop/services">
                      <Wrench className="h-4 w-4 mr-2" />
                      Service Catalog
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">System Status</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">System Online</p>
                      <p className="text-xs text-muted-foreground">
                        All systems operational
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Bookings Active</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.activeServices} pending services
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
