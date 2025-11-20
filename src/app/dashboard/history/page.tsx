import { ProtectedRoute } from "@/components/protected-route";
import { DashboardNav } from "@/components/dashboard-nav";
import { ServiceHistory } from "@/components/service-history";

export default function ServiceHistoryPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <DashboardNav />

        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Service History</h1>
            <p className="text-muted-foreground">
              Complete record of all maintenance and repairs for your vehicles
            </p>
          </div>

          <ServiceHistory />
        </main>
      </div>
    </ProtectedRoute>
  );
}
