import { Clock, TrendingUp, Users } from "lucide-react";

export function MetricsSection() {
  const metrics = [
    {
      icon: Clock,
      value: "24h",
      label: "Automated reminders",
    },
    {
      icon: TrendingUp,
      value: "99.9%",
      label: "Uptime target",
    },
    {
      icon: Users,
      value: "1000+",
      label: "Multi workshop support",
    },
  ];

  return (
    <section className="container mx-auto px-18 py-12 md:py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <metric.icon className="h-7 w-7 text-primary" />
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-2">
              {metric.value}
            </div>
            <p className="text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
