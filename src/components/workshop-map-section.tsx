import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Wrench } from 'lucide-react';

export function WorkshopMapSection() {
  const workshops = [
    {
      name: 'ProTech Auto Service',
      rating: 4.8,
      reviews: 124,
      specialty: 'Air cond specialist',
      status: 'Open now',
      distance: '1.2 km away',
    },
    {
      name: 'QuickFix Motors',
      rating: 4.6,
      reviews: 89,
      specialty: 'Tyre and alignment',
      status: 'Slots available',
      distance: '2.5 km away',
    },
    {
      name: 'Elite Car Care',
      rating: 4.9,
      reviews: 156,
      specialty: 'Full service',
      status: 'Open now',
      distance: '3.8 km away',
    },
  ];

  return (
    <section className="container mx-auto px-18 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          Help drivers discover your workshop
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get found by customers in your area with our integrated mapping and
          rating system
        </p>
      </div>

      <Card className="shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Map Placeholder */}
          <div className="relative h-[400px] lg:h-auto bg-linear-to-br from-primary/10 via-muted to-accent/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">
                  Interactive Map Integration
                </p>
                <div className="flex gap-3 mt-6 justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
                  <div className="h-8 w-8 rounded-full bg-accent/20 animate-pulse delay-75" />
                  <div className="h-8 w-8 rounded-full bg-primary/30 animate-pulse delay-150" />
                </div>
              </div>
            </div>
          </div>

          {/* Workshop List */}
          <CardContent className="p-6 space-y-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl">Nearby Workshops</CardTitle>
            </CardHeader>
            {workshops.map((workshop, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{workshop.name}</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{workshop.rating}</span>
                      <span className="text-muted-foreground">
                        ({workshop.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      <Wrench className="h-3 w-3 mr-1" />
                      {workshop.specialty}
                    </Badge>
                    <Badge className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                      <Clock className="h-3 w-3 mr-1" />
                      {workshop.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {workshop.distance}
                  </p>
                </CardContent>
              </Card>
            ))}
            <div className="pt-4 mt-2 border-t">
              <p className="text-sm text-center text-muted-foreground">
                Real-time availability
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}
