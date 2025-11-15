import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Search, Calendar, CarFront, History, CheckCircle, RefreshCw, ScanText, BarChart3 } from 'lucide-react'

export function HowItWorksSection() {
  const driverSteps = [
    { icon: Search, title: "Search nearby workshops", description: "Find trusted workshops in your area" },
    { icon: Calendar, title: "Choose date and service", description: "Pick a time that works for you" },
    { icon: CarFront, title: "Drop off or pick up on site", description: "Convenient service options" },
    { icon: History, title: "Track history and get reminders", description: "Never miss maintenance" },
  ]

  const workshopSteps = [
    { icon: CheckCircle, title: "Accept booking", description: "Manage incoming requests" },
    { icon: RefreshCw, title: "Update job status", description: "Real-time progress tracking" },
    { icon: ScanText, title: "Scan invoice", description: "Auto-extract details" },
    { icon: BarChart3, title: "Sync inventory and analytics", description: "Data-driven insights" },
  ]

  return (
    <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          From booking to service completion
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Simple workflows designed for both car owners and workshop managers
        </p>
      </div>

      {/* Car Owners Flow */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 text-center">For Car Owners</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {driverSteps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
              {index < driverSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border z-10" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-12" />

      {/* Workshop Flow */}
      <div id="workshops">
        <h3 className="text-xl font-semibold mb-6 text-center">For Workshops</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {workshopSteps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full hover:shadow-lg transition-shadow bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                    <step.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
              {index < workshopSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
