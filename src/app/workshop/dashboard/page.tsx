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
  TrendingUp,
  Wrench,
  Users,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { initializeDemoData } from "@/lib/demo-data";

export default function WorkshopDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    activeServices: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);

  useEffect(() => {
    initializeDemoData();

    const bookings = JSON.parse(
      localStorage.getItem("autocare_bookings") || "[]"
    );
    const invoices = JSON.parse(
      localStorage.getItem("autocare_invoices") || "[]"
    );

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Count today's appointments
    const todayAppts = bookings.filter((b: any) => b.date === today);

    // Count active services (scheduled bookings)
    const activeServices = bookings.filter(
      (b: any) => b.status === "scheduled"
    ).length;

    // Count unique customers
    const uniqueCustomers = new Set(bookings.map((b: any) => b.customerId));

    // Calculate monthly revenue from invoices
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyRevenue = invoices.reduce((sum: number, inv: any) => {
      const invDate = new Date(inv.sentAt);
      if (
        invDate.getMonth() === thisMonth &&
        invDate.getFullYear() === thisYear
      ) {
        const price = parseFloat(inv.totalPrice.replace("$", ""));
        return sum + (isNaN(price) ? 0 : price);
      }
      return sum;
    }, 0);

    setStats({
      todayAppointments: todayAppts.length,
      activeServices,
      totalCustomers: uniqueCustomers.size,
      monthlyRevenue,
    });

    // Set today's schedule
    setTodaySchedule(todayAppts.slice(0, 4));
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        {/* Navigation */}
        <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
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
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">Logout</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Workshop Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your workshop operations and appointments
            </p>
          </div>

          {/* Stats Grid */}
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
                  <p className="text-sm text-muted-foreground mt-2">
                    {stats.todayAppointments === 0
                      ? "No bookings yet"
                      : "Active today"}
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
                  <p className="text-sm text-muted-foreground mt-2">
                    Scheduled bookings
                  </p>
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
                  <p className="text-sm text-muted-foreground mt-2">
                    Unique customers
                  </p>
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
                  <p className="text-sm text-muted-foreground mt-2">
                    From invoices
                  </p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
              {todaySchedule.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySchedule.map((appointment, index) => (
                    <Card
                      key={index}
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
                                {appointment.customerName}
                              </p>
                              <Badge variant="secondary">
                                {appointment.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {appointment.service}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {appointment.vehicle}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {appointment.time}
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

            {/* Quick Actions & Alerts */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button className="w-full" variant="default" asChild>
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
