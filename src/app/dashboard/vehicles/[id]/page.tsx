import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNav } from "@/components/dashboard-nav"
import { VehicleDetails } from "@/components/vehicle-details"

export default function VehicleDetailsPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <DashboardNav />
        
        <main className="container mx-auto px-4 py-8">
          <VehicleDetails vehicleId={params.id} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
