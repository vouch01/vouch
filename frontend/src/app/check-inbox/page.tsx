"use client";

import { useRouter } from "next/navigation";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckInbox() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-14 rounded-lg bg-primary flex items-center justify-center relative">
            <Mail size={28} className="text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-heading">
          Check your inbox
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          We&apos;ve sent a verification link to
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg bg-muted text-sm font-medium text-foreground mb-5" data-testid="text-email">
          <Mail size={15} className="text-muted-foreground" />
          email@example.com
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Click the link in the email to verify your account.
          <br />
          The link expires in <span className="font-semibold text-foreground">24 hours.</span>
        </p>

        <div className="space-y-3">
          <Button
            className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium gap-2 cursor-pointer"
            data-testid="button-open-email"
          >
            <Mail size={15} />
            Open email app
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 rounded-lg border-border text-sm font-medium gap-2 cursor-pointer"
            data-testid="button-resend"
          >
            <RefreshCw size={14} />
            Resend verification email
          </Button>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">Wrong address?</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <button
            onClick={() => router.push("/signup")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto cursor-pointer"
            data-testid="link-change-email"
          >
            <span aria-hidden>←</span>
            go back and change email
          </button>
        </div>
      </div>
    </div>
  );
}
