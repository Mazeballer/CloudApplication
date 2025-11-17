import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarCheck, FileText, Bell, Shield } from "lucide-react";

export function ValuePropsSection() {
  const features = [
    {
      icon: CalendarCheck,
      title: "One click bookings",
      description:
        "Book service by date, time and workshop. Choose from available slots with real-time availability.",
    },
    {
      icon: FileText,
      title: "Centralized maintenance history",
      description:
        "View past services, parts replaced, and invoices all in one place. Never lose track of your vehicle's care.",
    },
    {
      icon: Bell,
      title: "Automated reminders",
      description:
        "Get instant notifications for upcoming services, completed jobs, and essential maintenance checks.",
    },
    {
      icon: Shield,
      title: "Secure and scalable",
      description:
        "Built on trusted cloud systems that keep everything safe and running smoothly as your data grows.",
    },
  ];

  return (
    <section
      id="features"
      className="container mx-auto px-18 py-16 md:py-24 bg-muted/30"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          Built for both car owners and workshops
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage vehicle maintenance in one powerful
          platform
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
