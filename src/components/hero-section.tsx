import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Wrench } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="container mx-auto px-18 py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Smart vehicle servicing for busy drivers
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            AutoCare+ lets car owners book service, track maintenance history,
            and get automatic reminders while workshops manage jobs, invoices,
            and parts in one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="text-base" asChild>
              <Link href="/login">Get started as a Car Owner</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <Link href="/login?type=workshop">For workshops</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Backed by scalable cloud architecture designed for high uptime
          </p>
        </div>

        {/* Right Column - Dashboard Mockup */}
        <div>
          <Card className="shadow-xl min-h-[600px]">
            <CardContent className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming service</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            Oil change & filter replacement
                          </span>
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                            Confirmed
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Nov 18, 2025 at 10:00 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            Brake inspection
                          </span>
                          <Badge variant="secondary">In progress</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Nov 20, 2025 at 2:00 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            Tire rotation & alignment
                          </span>
                          <Badge variant="outline">Scheduled</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Nov 25, 2025 at 9:00 AM
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Simple Chart Preview */}
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-3">
                      Service History (Last 6 months)
                    </p>
                    <div className="flex items-end justify-between h-24 gap-2">
                      {[45, 62, 38, 75, 55, 82].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/20 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="upcoming" className="mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Your next service is in 23 days</p>
                  </div>
                </TabsContent>
                <TabsContent value="invoices" className="mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">2 invoices pending review</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
