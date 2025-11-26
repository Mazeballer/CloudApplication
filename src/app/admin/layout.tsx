'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not logged in, redirect to login
      if (!isAuth) {
        router.push('/login');
      }

      // Logged in but not admin, redirect to HOME
      if (user && user.role !== 'Admin') {
        router.push('/');
      }
    }
  }, [isAuth, isLoading, user, router]);

  // Show loader while checking authentication
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  // Block unauthorized users
  if (!isAuth || !user || user.role !== 'Admin') {
    return null;
  }

  return <>{children}</>;
}
