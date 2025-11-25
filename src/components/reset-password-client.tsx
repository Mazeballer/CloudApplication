'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Car } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ResetPasswordClientProps = {
  email: string;
  token: string;
};

export function ResetPasswordClient({
  email,
  token,
}: ResetPasswordClientProps) {
  const router = useRouter();

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');

  const hasValidParams = Boolean(email && token);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setServerError('');

    if (!hasValidParams) {
      setPasswordError('Reset link is invalid or has expired');
      return;
    }

    if (!password || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!API_BASE_URL) {
      console.error('NEXT_PUBLIC_API_URL is not set');
      setServerError('Configuration error. Please contact support.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          newPassword: password,
          confirmPassword,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('Reset password failed', text);
        setServerError(
          'Failed to reset password. The link may be invalid or expired.'
        );
        return;
      }

      setIsSubmitted(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setServerError('Something went wrong. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto redirect after success, with cleanup
  useEffect(() => {
    if (!isSubmitted) return;
    const timeoutId = setTimeout(() => {
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isSubmitted, router]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left brand section */}
      <div className="flex-1 hidden lg:flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 lg:p-12 flex-col justify-between text-white">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-8 w-8 text-teal-400" />
          <span className="text-2xl font-bold">AutoCare+</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Create a new password
            </h1>
            <p className="text-gray-400 text-lg">
              Secure your account with a strong password and get back to your
              dashboard.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Strong security</p>
                <p className="text-sm text-gray-400">
                  Your password is encrypted and protected
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Instant access</p>
                <p className="text-sm text-gray-400">
                  Log in immediately after resetting
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
                Cloud powered insights
              </p>
              <p className="text-gray-400 text-xs">AWS backed intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form section */}
      <div className="w-full lg:flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Create a new password</CardTitle>
            <CardDescription>
              {isSubmitted
                ? 'Your password has been reset successfully'
                : hasValidParams
                ? 'Enter a strong password to secure your account'
                : 'This reset link is invalid or has expired'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isSubmitted && hasValidParams ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    New password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-muted pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirm-password"
                    className="text-sm font-medium"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-muted pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password requirements */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                    Password requirements:
                  </p>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <li
                      className={
                        password.length >= 8 ? 'line-through opacity-50' : ''
                      }
                    >
                      ✓ At least 8 characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(password) ? 'line-through opacity-50' : ''
                      }
                    >
                      ✓ One uppercase letter
                    </li>
                    <li
                      className={
                        /[a-z]/.test(password) ? 'line-through opacity-50' : ''
                      }
                    >
                      ✓ One lowercase letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(password) ? 'line-through opacity-50' : ''
                      }
                    >
                      ✓ One number
                    </li>
                  </ul>
                </div>

                {/* Validation error */}
                {passwordError && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
                    <p className="text-sm text-red-900 dark:text-red-300">
                      {passwordError}
                    </p>
                  </div>
                )}

                {/* Server error */}
                {serverError && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                    <p className="text-sm text-amber-900 dark:text-amber-300">
                      {serverError}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={
                    isLoading ||
                    !password ||
                    !confirmPassword ||
                    !hasValidParams
                  }
                >
                  {isLoading ? 'Resetting...' : 'Reset password'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => router.push('/login')}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Button>
              </form>
            ) : !hasValidParams ? (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="font-semibold text-foreground">
                    Reset link is invalid
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The reset link is missing or has expired. Please request a
                    new password reset email.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/forgot-password')}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Request new reset link
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
                    Password reset successful
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your password has been changed. You can now log in with your
                    new password.
                  </p>
                </div>

                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Go to sign in
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
