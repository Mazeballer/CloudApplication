// New and workable ProtectedRoute.tsx

"use client";

import { useEffect, useState } from "react"; // 💡 Import useState
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Loader2 } from "lucide-react"; // 💡 Import Loader icon

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // 💡 Add state to track if the client-side check is complete
  const [isClientCheckComplete, setIsClientCheckComplete] = useState(false);

  useEffect(() => {
    // This only runs on the client
    if (!isAuthenticated()) {
      router.push("/login");
    }
    // Mark the client check as complete, whether authenticated or redirected
    setIsClientCheckComplete(true);
  }, [router]);

  // 🛑 HYDRATION-SAFE RENDER
  // 1. If the client check hasn't run yet (i.e., server render OR initial client render),
  //    render a simple, consistent placeholder HTML.
  if (!isClientCheckComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Now that the client check is complete (meaning we didn't redirect),
  //    we can safely assume the user is authenticated.
  return <>{children}</>;
}
