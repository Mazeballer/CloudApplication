import { ProtectedRoute } from "@/components/protected-route";
import { DashboardNav } from "@/components/dashboard-nav";
import { VehicleDetails } from "@/components/vehicle-details";

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <DashboardNav />
        <main className="container mx-auto px-18 py-8">
          <VehicleDetails vehicleId={id} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
