"use client";

import { Button } from "@/components/ui/button";
import {
  Car,
  LogOut,
  Menu,
  Bell,
  User,
  X,
  ChevronRight,
  BellRing,
  BellDot,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, getUserEmail } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

function getBellState() {
  const requested =
    localStorage.getItem("userEmailNotificationsRequested") === "true";
  const confirmed =
    localStorage.getItem("userEmailNotificationConfirmed") === "true";

  if (!requested) return "off";
  if (requested && !confirmed) return "pending";
  return "on";
}

export function DashboardNav() {
  const router = useRouter();
  const userEmail = getUserEmail();
  const [isOpen, setIsOpen] = useState(false);

  const [bellState, setBellState] = useState<"off" | "pending" | "on">("off");
  const [loadingNotif, setLoadingNotif] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function syncNotificationStatus() {
      try {
        const res = await fetch(`${API_URL}/api/notifications/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        });

        if (!res.ok) return;

        const data = await res.json();

        localStorage.setItem(
          "userEmailNotificationsRequested",
          data.requested ? "true" : "false"
        );
        localStorage.setItem(
          "userEmailNotificationConfirmed",
          data.confirmed ? "true" : "false"
        );

        setBellState(getBellState());
      } catch (err) {
        console.error("Failed to sync notification status", err);
      }
    }

    syncNotificationStatus();
  }, []);

  const toggleNotification = async () => {
    if (loadingNotif) return;
    setLoadingNotif(true);

    try {
      if (bellState === "off") {
        // Turn ON
        await fetch(`${API_URL}/api/notifications/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        });

        localStorage.setItem("userEmailNotificationsRequested", "true");
        localStorage.setItem("userEmailNotificationConfirmed", "false");
      } else {
        // Turn OFF (also handles pending)
        await fetch(`${API_URL}/api/notifications/unsubscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        });

        localStorage.setItem("userEmailNotificationsRequested", "false");
        localStorage.setItem("userEmailNotificationConfirmed", "false");
      }

      setBellState(getBellState());
    } catch (err) {
      console.error("Notification toggle failed", err);
      alert("Failed to update notification preference");
    } finally {
      setLoadingNotif(false);
    }
  };

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
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-teal-700" />
          <span className="text-xl font-bold">AutoCare+</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
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
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleNotification}
            disabled={loadingNotif}
            className={
              bellState === "on"
                ? "text-primary"
                : bellState === "pending"
                ? "text-yellow-500"
                : "text-muted-foreground"
            }
          >
            {bellState === "on" && <BellRing className="h-5 w-5" />}
            {bellState === "pending" && <BellDot className="h-5 w-5" />}
            {bellState === "off" && <Bell className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{userEmail}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-md p-0 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-teal-700" />
                <h2 className="text-2xl font-bold">AutoCare+</h2>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 divide-y overflow-y-auto">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-6 py-5 text-gray-900 font-medium text-base hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              ))}
            </nav>

            {/* Bottom Section */}
            <div className="border-t p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{userEmail}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
