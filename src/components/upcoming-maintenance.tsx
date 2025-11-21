"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, Droplet, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

export function UpcomingMaintenance() {
  const [maintenanceItems, setMaintenanceItems] = useState<any[]>([]);

  const loadMaintenance = () => {
    const user = getCurrentUser();
    if (!user) return;

    const bookings = JSON.parse(
      localStorage.getItem("autocare_bookings") || "[]"
    );
    const invoices = JSON.parse(
      localStorage.getItem("autocare_invoices") || "[]"
    );

    // Filter user's bookings that don't have invoices yet (upcoming services)
    const upcomingBookings = bookings
      .filter((b: any) => {
        if (b.customerId !== user.id) return false;
        const hasInvoice = invoices.some((inv: any) => inv.bookingId === b.id);
        return !hasInvoice;
      })
      .map((booking: any) => {
        const bookingDate = new Date(booking.date);
        const today = new Date();
        const daysUntil = Math.ceil(
          (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        let priority = "low";
        if (daysUntil < 0) priority = "critical";
        else if (daysUntil <= 3) priority = "high";
        else if (daysUntil <= 7) priority = "medium";

        return {
          vehicle: booking.vehicle.split("(")[0].trim(),
          service: booking.service,
          date:
            daysUntil < 0
              ? "Overdue"
              : new Date(booking.date).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
          priority,
          icon: booking.service.toLowerCase().includes("oil")
            ? Droplet
            : booking.service.toLowerCase().includes("filter")
            ? Filter
            : Wrench,
        };
      })
      .sort((a: any, b: any) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        );
      });
    setMaintenanceItems(upcomingBookings);
  };

  useEffect(() => {
    loadMaintenance();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadMaintenance();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Upcoming Services</h2>
      </div>

      {maintenanceItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No upcoming services scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {maintenanceItems.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{item.service}</h3>
                    <Badge
                      variant={
                        item.priority === "critical"
                          ? "destructive"
                          : item.priority === "high"
                          ? "secondary"
                          : "outline"
                      }
                      className="shrink-0"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {item.vehicle}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
