"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Car, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "For Workshops", href: "/workshop/login" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Resources", href: "#resources" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AutoCare+</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Book a service</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex items-center gap-2 mb-8 mt-4 ml-4">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AutoCare+</span>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </a>
              ))}

              <div className="mt-8 pt-6 border-t space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-center h-11"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full justify-center h-11">
                  Book a service
                </Button>
              </div>
            </nav>
            {/* </CHANGE> */}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
