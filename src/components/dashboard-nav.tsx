"use client";

import { Button } from "@/components/ui/button";
import { Car, LogOut, Menu, Bell, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, getUserEmail } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function DashboardNav() {
  const router = useRouter();
  const userEmail = getUserEmail();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Vehicles", href: "/dashboard/vehicles" },
    { label: "Service History", href: "/dashboard/history" },
    { label: "Book Service", href: "/dashboard/book" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-18">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AutoCare+</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted">
            <User className="h-4 w-4" />
            <span className="text-sm">{userEmail}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-6">
              <div className="p-3 rounded-lg bg-muted mb-4">
                <p className="text-sm font-medium">{userEmail}</p>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}