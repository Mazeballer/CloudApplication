import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ScanLine, Lightbulb, Check } from "lucide-react";

export function CloudFeaturesSection() {
  const platformFeatures = [
    {
      name: "Automated Alerts",
      description:
        "Timely reminders for upcoming services and important updates",
    },
    {
      name: "Smart Document Handling",
      description: "Secure storage for invoices, photos, and service history",
    },
    {
      name: "Intelligent Processing",
      description: "Fast extraction of details from uploaded records",
    },
    {
      name: "Performance Monitoring",
      description: "Stable and responsive experience at all times",
    },
    {
      name: "Scalable System",
      description: "Reliable performance even as your data grows",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          Cloud powered intelligence
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Smart features that simplify car care and give you full visibility of
          your vehicle’s health
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Feature Cards */}
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-6 w-6 text-primary mt-1" />
                <div>
                  <CardTitle className="text-xl mb-2">
                    Predictive mileage and maintenance
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    Identifies the best time for your next service using your
                    driving patterns. Helps you stay ahead of potential issues
                    before they become problems.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <ScanLine className="h-6 w-6 text-primary mt-1" />
                <div>
                  <CardTitle className="text-xl mb-2">
                    Maintenance record scanner
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    Upload any service invoice and AutoCare+ automatically pulls
                    out key information such as replaced parts, costs, and
                    service dates. No manual typing required.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-primary mt-1" />
                <div>
                  <CardTitle className="text-xl mb-2">
                    Service recommendations
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    Get useful recommendations for brake checks, spark plug
                    replacements, or fluid changes based on your vehicle’s usage
                    and past services.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Right: Platform Features Panel */}
        <div className="lg:sticky lg:top-24">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Smart cloud platform</CardTitle>
              <CardDescription>
                Designed for reliability, data safety, and seamless performance
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {platformFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-background/60 rounded-lg"
                >
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-1">
                      {feature.name}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-4 mt-4 border-t">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every feature is built to work together to give you a smooth,
                  secure, and intelligent car maintenance experience.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
