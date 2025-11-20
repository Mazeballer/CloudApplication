// WorkshopServicesPage.tsx

"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  Search,
  Clock,
  DollarSign,
  Loader2,
  Zap,
  Hammer,
} from "lucide-react";
import { WorkshopNav } from "@/components/workshop-nav";
import { useState } from "react";

import { AddServiceDialog } from "@/components/AddServiceDialog";
import { useWorkshops } from "@/contexts/WorkshopContext";
import { useServices } from "@/contexts/ServiceContext";

export default function WorkshopServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Current workshop info
  const { currentWorkshop, loading: workshopLoading } = useWorkshops();

  // Services for this workshop
  const {
    servicesForCurrentWorkshop,
    loading: servicesLoading,
    refreshCurrentWorkshopServices,
  } = useServices();

  const loading = workshopLoading || servicesLoading;

  // Search filter
  const filteredServices = servicesForCurrentWorkshop.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (totalMinutes: any) => {
    if (totalMinutes === 0) return "0 mins";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let parts = [];
    if (hours > 0) {
      parts.push(`${hours} hr`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} mins`);
    }

    return parts.join(" ");
  };

  // 🛑 HYDRATION-SAFE LOADING CHECK 🛑
  // If the component is loading or the necessary workshop data isn't ready,
  // we render a simple, static loading state to avoid complex component tree mismatches.
  if (loading || !currentWorkshop) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">
            Loading workshop data...
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  // Once loading is complete and data is present, render the full page
  return (
    <ProtectedRoute>
      {/* This DIV is the one causing the conflict in the screenshot */}
      <div className="min-h-screen bg-muted/30">
        <WorkshopNav />

        <main className="container mx-auto px-18 py-8">
          {/* ... (rest of your existing content) ... */}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Service Catalog</h1>
            <p className="text-muted-foreground">
              Manage your workshop services and pricing
            </p>
          </div>

          {/* Search + Add Service */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ADD SERVICE */}
            <AddServiceDialog
              // Ensure workshopId is guaranteed to be a string here due to the check above
              workshopId={currentWorkshop.id}
              onServiceAdded={refreshCurrentWorkshopServices}
            />
          </div>

          {/* No Services */}
          {filteredServices.length === 0 && (
            <p className="text-muted-foreground">
              No services available. Click 'Add Service' to begin.
            </p>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                // 🛑 Key Fix: Make Card a flex column container and ensure min-height for structure
                className="p-6 flex flex-col hover:shadow-lg transition-shadow min-h-[350px]"
              >
                {/* 1. Header (Name, Badge, Icon) */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                    <div className="flex gap-2">
                      <Badge
                        className={
                          service.category === "Maintenance"
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : service.category === "Diagnostics"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : service.category === "Repair"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-500 text-white hover:bg-gray-600"
                        }
                      >
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className={
                      service.category === "Maintenance"
                        ? "bg-green-500/10 p-3 rounded-lg"
                        : service.category === "Diagnostics"
                        ? "bg-blue-500/10 p-3 rounded-lg"
                        : service.category === "Repair"
                        ? "bg-red-500/10 p-3 rounded-lg"
                        : "bg-gray-500/10 p-3 rounded-lg"
                    }
                  >
                    {service.category === "Maintenance" && (
                      <Wrench className="h-5 w-5 text-green-600" />
                    )}
                    {service.category === "Diagnostics" && (
                      <Zap className="h-5 w-5 text-blue-600" />
                    )}
                    {service.category === "Repair" && (
                      <Hammer className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>

                {/* 2. Description (The variable height element) */}
                <p className="text-sm text-muted-foreground mb-4 flex-1 overflow-hidden">
                  {/* 🛑 Optional: Clamp the description to 4 lines for extremely long text */}
                  {/* If you want to limit the lines, add: line-clamp-4 */}
                  {service.description}
                </p>

                {/* 3. Footer (Stats and Button) - Pushed to the bottom */}
                <div className="mt-auto">
                  {" "}
                  {/* 🛑 Key Fix: mt-auto pushes this section to the bottom */}
                  {/* Price and Duration Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>Price</span>
                      </div>
                      <span className="font-semibold">
                        RM {service.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Duration</span>
                      </div>
                      <span className="font-semibold">
                        {formatDuration(service.durationMinutes)}
                      </span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {" "}
                    {/* Changed to flex gap-2 for consistency */}
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
