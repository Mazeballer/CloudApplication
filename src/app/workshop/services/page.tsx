"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wrench, Search, Plus, Clock, DollarSign } from "lucide-react";
import { WorkshopNav } from "@/components/workshop-nav";
import { useState } from "react";

const services = [
  {
    id: 1,
    name: "Oil Change",
    category: "Maintenance",
    price: "$49.99",
    duration: "30 mins",
    popularity: "high",
    description: "Complete oil change with filter replacement",
  },
  {
    id: 2,
    name: "Brake Inspection",
    category: "Safety",
    price: "$79.99",
    duration: "45 mins",
    popularity: "high",
    description: "Comprehensive brake system inspection",
  },
  {
    id: 3,
    name: "Tire Rotation",
    category: "Maintenance",
    price: "$39.99",
    duration: "30 mins",
    popularity: "medium",
    description: "Rotate all four tires for even wear",
  },
  {
    id: 4,
    name: "Engine Diagnostics",
    category: "Diagnostics",
    price: "$129.99",
    duration: "1-2 hours",
    popularity: "high",
    description: "Complete engine computer diagnostics scan",
  },
  {
    id: 5,
    name: "Transmission Service",
    category: "Maintenance",
    price: "$199.99",
    duration: "2-3 hours",
    popularity: "medium",
    description: "Fluid change and transmission inspection",
  },
  {
    id: 6,
    name: "Battery Test & Replacement",
    category: "Electrical",
    price: "$89.99",
    duration: "30 mins",
    popularity: "medium",
    description: "Battery health test and replacement if needed",
  },
];

export default function WorkshopServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

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

          {/* Search and Actions */}
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      {service.popularity === "high" && (
                        <Badge variant="default">Popular</Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-amber-500/10 p-3 rounded-lg">
                    <Wrench className="h-5 w-5 text-amber-600" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Price</span>
                    </div>
                    <span className="font-semibold">{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                    <span className="font-semibold">{service.duration}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1">
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
