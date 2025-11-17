"use client";

import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardOverview } from "@/components/dashboard-overview";
import { VehiclesList } from "@/components/vehicles-list";
import { UpcomingMaintenance } from "@/components/upcoming-maintenance";
// import { DemoDataInitializer } from "@/components/demo-data-initializer";

export default function DashboardPage() {
  const { isAuth, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <ProtectedRoute>
      {/* <DemoDataInitializer /> */}
      <div className="min-h-screen bg-muted/30">
        <DashboardNav />

        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your vehicles and maintenance
              schedule.
            </p>
          </div>

          {/* Dashboard Overview Stats */}
          <DashboardOverview />

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Vehicles List - Takes 2 columns */}
            <div className="lg:col-span-2">
              <VehiclesList />
            </div>

            {/* Upcoming Maintenance - Takes 1 column */}
            <div>
              <UpcomingMaintenance />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
