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
import { EditServiceDialog } from "@/components/edit-service";
import { AddServiceDialog } from "@/components/AddServiceDialog";
import { useWorkshops } from "@/contexts/WorkshopContext";
import { useServices } from "@/contexts/ServiceContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function WorkshopServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { currentWorkshop, loading: workshopLoading } = useWorkshops();

  const {
    servicesForCurrentWorkshop,
    loading: servicesLoading,
    refreshCurrentWorkshopServices,
  } = useServices();

  const loading = workshopLoading || servicesLoading;

  // Filter: only Active OR match search query
  const filteredServices = servicesForCurrentWorkshop
    .filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.status.localeCompare(b.status)); // Show Active first

  const formatDuration = (totalMinutes: number) => {
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

  const handleActivate = async (serviceId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${serviceId}/activate`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (data.success) {
        refreshCurrentWorkshopServices();
      }
    } catch (err) {
      console.error("Activate error:", err);
    }
  };

  const handleDeactivate = async (serviceId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${serviceId}/deactivate`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (data.success) {
        refreshCurrentWorkshopServices();
      }
    } catch (err) {
      console.error("Deactivate error:", err);
    }
  };

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <WorkshopNav />

        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Service Catalog</h1>
            <p className="text-muted-foreground">
              Manage your workshop services and pricing
            </p>
          </div>

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

            <AddServiceDialog
              workshopId={currentWorkshop.id}
              onServiceAdded={refreshCurrentWorkshopServices}
            />
          </div>

          {filteredServices.length === 0 && (
            <p className="text-muted-foreground">
              No services found. Try adjusting your search or add a service.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className={`p-6 flex flex-col hover:shadow-lg transition-shadow min-h-[350px] ${
                  service.status === "Inactive" ? "opacity-50" : ""
                }`}
              >
                {/* HEADER */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{service.name}</h3>

                    <div className="flex gap-2 items-center">
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

                      {service.status === "Inactive" && (
                        <Badge className="bg-red-600 text-white">
                          Inactive
                        </Badge>
                      )}
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

                {/* DESCRIPTION */}
                <p className="text-sm text-muted-foreground mb-4 flex-1 overflow-hidden">
                  {service.description}
                </p>

                {/* FOOTER */}
                <div className="mt-auto">
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

                  <div className="flex gap-2">
                    <EditServiceDialog
                      service={{
                        id: service.id,
                        name: service.name,
                        category: service.category,
                        description: service.description,
                        price: service.price,
                        durationMinutes: service.durationMinutes,

                        componentTypes: (service as any).componentTypes ?? [],
                      }}
                      onUpdated={refreshCurrentWorkshopServices}
                    />

                    {service.status === "Active" ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Deactivate
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Deactivate Service?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The service will be
                              marked as inactive.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeactivate(service.id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" size="sm">
                            Activate
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Activate Service?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              The service will become active and available for
                              workshops.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleActivate(service.id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
