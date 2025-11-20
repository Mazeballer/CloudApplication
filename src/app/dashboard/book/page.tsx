"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardNav } from "@/components/dashboard-nav";
import { BookServiceForm } from "@/components/book-service-form";

export default function BookServicePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <DashboardNav />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
            <p className="text-muted-foreground">
              Find nearby workshops and schedule your vehicle maintenance
            </p>
          </div>

          <BookServiceForm />
        </main>
      </div>
    </ProtectedRoute>
  );
}
