"use client";

import { WorkshopApprovalList } from "@/components/workshop-approval-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car } from "lucide-react";

export default function WorkshopApprovalsPage() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Add your actual logout logic here (clear tokens, etc.)
    console.log("Logging out...");
    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  <Car className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">AutoCare+</span>
                </Link>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-semibold text-foreground">
              Workshop Applications
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              Review Queue
            </span>
          </div>
          <p className="text-muted-foreground">
            Review and manage workshop registration requests
          </p>
        </div>

        <WorkshopApprovalList />
      </main>
    </div>
  );
}
