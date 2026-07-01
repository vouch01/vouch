"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DOTS = [
  { top: "8%", left: "38%" },
  { top: "6%", left: "62%" },
  { top: "18%", left: "28%" },
  { top: "22%", left: "72%" },
  { top: "32%", left: "22%" },
  { top: "30%", left: "78%" },
  { top: "44%", left: "18%" },
  { top: "40%", left: "82%" },
];

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="relative flex justify-center mb-10" style={{ height: 160 }}>
          {DOTS.map((d, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-foreground/20"
              style={{ top: d.top, left: d.left }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-full border-2 border-foreground flex items-center justify-center">
              <CheckCircle size={44} strokeWidth={1.5} className="text-foreground" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-heading">
          Welcome to Vouch
        </h2>

        <div className="text-left border-l-4 border-border bg-muted rounded-lg px-4 py-3 mb-5">
          <p className="text-sm text-foreground">
            Sell with confidence. Every transaction is protected by escrow.
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-8">
          Vouch keeps your money safe until the buyer confirms delivery. No more disputes, no more risk.
        </p>

        <Button
          onClick={() => router.push("/")}
          className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium"
          data-testid="button-get-started"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
