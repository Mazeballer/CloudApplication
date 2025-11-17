import { ProtectedRoute } from "@/components/protected-route";
import { DashboardNav } from "@/components/dashboard-nav";
import { VehiclesList } from "@/components/vehicles-list";

export default function VehiclesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <DashboardNav />

        <main className="container mx-auto px-18 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Vehicles</h1>
            <p className="text-muted-foreground">
              Manage and monitor all your vehicles in one place
            </p>
          </div>

          <VehiclesList />
        </main>
      </div>
    </ProtectedRoute>
  );
}
