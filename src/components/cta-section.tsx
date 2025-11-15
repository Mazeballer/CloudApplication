import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl p-8 md:p-12 lg:p-16 text-center border">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
          Take the stress out of car servicing
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Keep your vehicle in top shape with easy bookings, smart reminders,
          and digital service records you can access anytime
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-base">
            Get started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button size="lg" variant="outline" className="text-base">
            Learn more
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Designed for both car owners and workshops to manage service with ease
        </p>
      </div>
    </section>
  );
}
