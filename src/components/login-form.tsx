"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";

interface LoginFormProps {
  type: "driver" | "workshop";
}

export function LoginForm({ type }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! Please login.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password, type);

    if (result.success) {
      // Save user in session or localStorage
      localStorage.setItem("currentUser", JSON.stringify(result.user));
      localStorage.setItem("UserId", result.user.id);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", result.user.email);
      localStorage.setItem("userType", result.user.role);
      setIsLoading(false);

      if (type === "workshop") {
        router.push("/workshop/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  };

  const signupLink = type === "workshop" ? "/workshop/signup" : "/signup";

  return (
    <Card className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Sign in</h2>
        <p className="text-muted-foreground">
          {type === "workshop"
            ? "Access your workshop dashboard"
            : "Access your vehicle dashboard"}
        </p>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href={signupLink}
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </Link>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {type === "driver" ? (
          <>
            Are you a workshop?{" "}
            <Link
              href="/workshop/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in as workshop
            </Link>
          </>
        ) : (
          <>
            Are you a car owner?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in as car owner
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}
