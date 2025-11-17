"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, Gauge } from "lucide-react";
import Link from "next/link";
import { AddVehicleDialog } from "./add-vehicle-dialog";
import { useVehicles } from "@/contexts/VehiclesContext";

export function VehiclesList() {
  const { vehicles, loading, error, refreshVehicles } = useVehicles();

  const handleAddVehicle = async () => {
    await refreshVehicles(); // refresh the context after adding
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading vehicles...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Vehicles</h2>
        <AddVehicleDialog onAddVehicle={handleAddVehicle} />
      </div>

      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No vehicles added yet. Click "Add Vehicle" to get started.</p>
          </div>
        ) : (
          vehicles.map((vehicle: any) => (
            <Card
              key={vehicle.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Vehicle Image */}
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full sm:w-32 h-24 object-cover rounded-lg"
                />

                {/* Vehicle Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.plate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        vehicle.status === "critical"
                          ? "destructive"
                          : vehicle.status === "warning"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {vehicle.status === "critical"
                        ? "Action Required"
                        : vehicle.status === "warning"
                        ? "Service Due"
                        : "Good Condition"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      {vehicle.mileage}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Next service: {vehicle.nextService}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/book">Book Service</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
}
