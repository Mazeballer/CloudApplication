import { ProtectedRoute } from "@/components/protected-route";
import { DashboardNav } from "@/components/dashboard-nav";
import { ServiceStatus } from "@/components/service-status";

export default function ServiceStatusPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <DashboardNav />

        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Service Status</h1>
            <p className="text-muted-foreground">
              Track upcoming and in-progress services for your vehicles.
            </p>
          </div>

          <ServiceStatus />
        </main>
      </div>
    </ProtectedRoute>
  );
}
