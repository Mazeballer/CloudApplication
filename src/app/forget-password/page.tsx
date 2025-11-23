"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Car } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!email) return;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setEmail("");
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Brand Section */}
      <div className="flex-1 hidden lg:flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 lg:p-12 flex-col justify-between text-white">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-8 w-8 text-teal-400" />
          <span className="text-2xl font-bold">AutoCare+</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Reset your password
            </h1>
            <p className="text-gray-400 text-lg">
              No worries! We'll help you regain access to your dashboard.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-white">Quick & Secure</p>
                <p className="text-sm text-gray-400">
                  Your account security is our priority
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-white">Instant Recovery</p>
                <p className="text-sm text-gray-400">
                  Get back to your dashboard in minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-400/20 rounded flex items-center justify-center">
              <Car className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                Cloud-powered insights
              </p>
              <p className="text-gray-400 text-xs">AWS-backed intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Forgot your password?</CardTitle>
            <CardDescription>
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isSubmitted ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="staff@mail.apu.edu.my"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading || !email}
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="font-semibold text-foreground">
                    Check your email
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to <br />
                    <span className="font-medium">{email}</span>
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    The link expires in 24 hours. If you don't see the email,
                    check your spam folder.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReset}
                  >
                    Use different email
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
