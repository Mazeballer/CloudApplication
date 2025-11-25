import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordClient } from '@/components/reset-password-client';

export const metadata: Metadata = {
  title: 'Reset password | AutoCare+',
};

type ResetPasswordPageProps = {
  searchParams: {
    email?: string;
    token?: string;
  };
};

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const email = searchParams.email ?? '';
  const token = searchParams.token ?? '';

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">
            Preparing reset password page...
          </p>
        </div>
      }
    >
      <ResetPasswordClient email={email} token={token} />
    </Suspense>
  );
}
