import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Gauge, Wrench, AlertTriangle, Bell } from 'lucide-react'
import Link from 'next/link'

const vehicleData: any = {
  "1": {
    make: "Toyota",
    model: "Camry",
    year: 2020,
    plate: "ABC-1234",
    vin: "1HGBH41JXMN109186",
    mileage: 45320,
    nextServiceMileage: 50000,
    purchaseDate: "Jan 15, 2020",
    color: "Silver",
    image: "/placeholder.svg?key=rdv9i",
    healthScore: 85,
    alerts: [
      {
        type: "warning",
        message: "Oil change due in 680 km",
        date: "Due next week"
      }
    ],
    upcomingMaintenance: [
      { service: "Oil Change", dueIn: "680 km", priority: "high" },
      { service: "Tire Rotation", dueIn: "2,180 km", priority: "medium" },
      { service: "Air Filter", dueIn: "4,680 km", priority: "low" }
    ],
    recentServices: [
      { service: "Oil Change", date: "Dec 15, 2024", cost: "$89.99" },
      { service: "Safety Inspection", date: "Oct 5, 2024", cost: "$45.00" }
    ]
  },
  "2": {
    make: "Honda",
    model: "CR-V",
    year: 2021,
    plate: "XYZ-5678",
    vin: "2HKRM4H73DH123456",
    mileage: 28150,
    nextServiceMileage: 32000,
    purchaseDate: "Mar 10, 2021",
    color: "White",
    image: "/placeholder.svg?key=llk7d",
    healthScore: 92,
    alerts: [],
    upcomingMaintenance: [
      { service: "Tire Rotation", dueIn: "3,850 km", priority: "medium" },
      { service: "Brake Inspection", dueIn: "11,850 km", priority: "low" }
    ],
    recentServices: [
      { service: "Brake Pad Replacement", date: "Nov 28, 2024", cost: "$320.00" },
      { service: "Air Filter", date: "Sep 18, 2024", cost: "$78.50" }
    ]
  },
  "3": {
    make: "Ford",
    model: "F-150",
    year: 2019,
    plate: "DEF-9012",
    vin: "1FTFW1E84KFA12345",
    mileage: 68900,
    nextServiceMileage: 68000,
    purchaseDate: "Jun 5, 2019",
    color: "Blue",
    image: "/placeholder.svg?key=31gc5",
    healthScore: 68,
    alerts: [
      {
        type: "critical",
        message: "Service overdue by 900 km",
        date: "Overdue"
      },
      {
        type: "warning",
        message: "Tire pressure low",
        date: "Detected 2 days ago"
      }
    ],
    upcomingMaintenance: [
      { service: "Oil Change", dueIn: "Overdue", priority: "critical" },
      { service: "Tire Rotation", dueIn: "1,100 km", priority: "high" },
      { service: "Transmission Service", dueIn: "11,100 km", priority: "medium" }
    ],
    recentServices: [
      { service: "Tire Rotation", date: "Nov 10, 2024", cost: "$125.00" }
    ]
  }
}

export function VehicleDetails({ vehicleId }: { vehicleId: string }) {
  const vehicle = vehicleData[vehicleId]

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vehicle not found</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const serviceProgress = (vehicle.mileage / vehicle.nextServiceMileage) * 100

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Vehicle Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <img
            src={vehicle.image || "/placeholder.svg"}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full lg:w-80 h-56 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-muted-foreground">{vehicle.plate}</p>
              </div>
              <Button>Book Service</Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">VIN</p>
                <p className="font-medium">{vehicle.vin}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Color</p>
                <p className="font-medium">{vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Purchase Date</p>
                <p className="font-medium">{vehicle.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Mileage</p>
                <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Vehicle Health Score</p>
                <p className="text-2xl font-bold text-primary">{vehicle.healthScore}%</p>
              </div>
              <Progress value={vehicle.healthScore} className="h-3" />
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {vehicle.alerts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold">Active Alerts</h2>
          </div>
          <div className="space-y-3">
            {vehicle.alerts.map((alert: any, index: number) => (
              <Card key={index} className={`p-4 ${alert.type === 'critical' ? 'border-red-500' : 'border-amber-500'}`}>
                <div className="flex items-start gap-3">
                  <Bell className={`h-5 w-5 ${alert.type === 'critical' ? 'text-red-500' : 'text-amber-500'} mt-0.5`} />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.date}</p>
                  </div>
                  <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.type}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Maintenance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Upcoming Maintenance</h2>
          </div>
          <div className="space-y-3">
            {vehicle.upcomingMaintenance.map((item: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{item.service}</h3>
                  <Badge 
                    variant={
                      item.priority === "critical" ? "destructive" : 
                      item.priority === "high" ? "secondary" : 
                      "outline"
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Due in: {item.dueIn}</p>
              </Card>
            ))}
          </div>
        </Card>

        {/* Recent Services */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Recent Services</h2>
          </div>
          <div className="space-y-3">
            {vehicle.recentServices.map((service: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{service.service}</h3>
                  <p className="font-bold text-primary">{service.cost}</p>
                </div>
                <p className="text-sm text-muted-foreground">{service.date}</p>
              </Card>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/history">View Full History</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Maintenance Progress */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Service Interval Progress</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current: {vehicle.mileage.toLocaleString()} km</span>
            <span className="text-muted-foreground">Next service: {vehicle.nextServiceMileage.toLocaleString()} km</span>
          </div>
          <Progress value={Math.min(serviceProgress, 100)} className="h-3" />
          <p className="text-sm text-muted-foreground text-center">
            {vehicle.nextServiceMileage - vehicle.mileage > 0 
              ? `${(vehicle.nextServiceMileage - vehicle.mileage).toLocaleString()} km until next service`
              : "Service overdue"}
          </p>
        </div>
      </Card>
    </div>
  )
}
