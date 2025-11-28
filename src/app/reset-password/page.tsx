import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordClient } from "@/components/reset-password-client";

export const metadata: Metadata = {
  title: "Reset password | AutoCare+",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params.email ?? "";
  const token = params.token ?? "";

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
