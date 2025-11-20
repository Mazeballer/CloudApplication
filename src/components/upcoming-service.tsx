"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, Droplet, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useServiceRecords } from "@/contexts/ServiceRecordContext";
import { useAuth } from "@/lib/auth";

type Priority = "critical" | "high" | "medium" | "low";

export function UpcomingService() {
  const { user } = useAuth();
  const { recordsByUser, loading } = useServiceRecords();
  const [serviceItems, setServiceItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user || loading) return;

    const userRecords = recordsByUser[user.id] || [];

    const upcoming = userRecords
      .filter((r) => r.status === "Scheduled")
      .map((r) => {
        const serviceDate = new Date(r.serviceDate);
        const now = new Date();

        const daysUntil = Math.ceil(
          (serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Priority calculation
        let priority: Priority = "low";
        if (daysUntil < 0) priority = "critical";
        else if (daysUntil <= 3) priority = "high";
        else if (daysUntil <= 7) priority = "medium";

        // Select icon by service NAME
        const name = r.serviceName.toLowerCase();
        let icon = Wrench;
        if (name.includes("oil")) icon = Droplet;
        else if (name.includes("filter")) icon = Filter;

        return {
          service: r.serviceName, // ✔ now using actual name
          vehicle: r.vehicleName, // ✔ now using actual name
          workshop: r.workshopName, // (You can show this later if needed)
          date:
            daysUntil < 0
              ? "Overdue"
              : serviceDate.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
          priority,
          icon,
        };
      })
      .sort((a, b) => {
        const ranks: Record<Priority, number> = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
        };

        return ranks[a.priority] - ranks[b.priority];
      });

    setServiceItems(upcoming);
  }, [recordsByUser, loading, user]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Upcoming Services</h2>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : serviceItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No upcoming services scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {serviceItems.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm">{item.service}</h3>
                    <Badge
                      variant={
                        item.priority === "critical"
                          ? "destructive"
                          : item.priority === "high"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {item.priority}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Vehicle: {item.vehicle}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Location: {item.workshop}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Date: {item.date}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
