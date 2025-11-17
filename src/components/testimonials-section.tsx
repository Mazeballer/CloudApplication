import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Car Owner",
    image: "/diverse-woman-smiling.png",
    rating: 5,
    text: "AutoCare+ has completely transformed how I maintain my car. The predictive maintenance alerts saved me from a major engine issue. I get reminders before anything becomes a problem!",
  },
  {
    name: "Mike Chen",
    role: "Workshop Manager",
    image: "/mechanic-professional.jpg",
    rating: 5,
    text: "Managing appointments used to be chaos. Now with AutoCare+, everything is automated. My team knows exactly what's coming, and our efficiency has improved by 40%.",
  },
  {
    name: "Emma Davis",
    role: "Fleet Manager",
    image: "/professional-woman-diverse.png",
    rating: 5,
    text: "Tracking maintenance for 15 vehicles was a nightmare. AutoCare+ gives me a complete overview, sends alerts, and keeps detailed service history. Worth every penny!",
  },
  {
    name: "James Rodriguez",
    role: "AutoCare Workshop Owner",
    image: "/business-owner-man.jpg",
    rating: 5,
    text: "The platform brought us into the digital age. Customers love the convenience of booking online, and the automated reminders keep them coming back. Revenue is up 30%.",
  },
  {
    name: "Lisa Anderson",
    role: "Busy Professional",
    image: "/businesswoman-confident.jpg",
    rating: 5,
    text: "As someone who travels constantly, AutoCare+ is a lifesaver. I never miss oil changes, and I can book services while I'm at the airport. My car has never been in better shape.",
  },
  {
    name: "Tom Wilson",
    role: "Service Technician",
    image: "/technician-happy.jpg",
    rating: 5,
    text: "The diagnostic insights are incredible. Before I even start working on a car, I have its full history and AI-powered recommendations. Makes my job so much easier.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-18">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Loved by car owners and workshops alike
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands who trust AutoCare+ for their vehicle maintenance
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
