"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetRiderOrder,
  // getGetRiderOrderQueryKey,
  useVerifyPin,
} from "@/hooks/use-rider";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Rider() {
  const { reference } = useParams<{ reference: string }>();
  const router = useRouter();

  const { data: order, isError, isLoading } = useGetRiderOrder(reference);

  const { mutateAsync: verifyPin, isPending } = useVerifyPin();

  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first box on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError(null);
    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 3);
    inputRefs.current[focusIdx]?.focus();
  };

  const pin = digits.join("");

  const handleVerify = async () => {
    if (pin.length < 4) return;

    setError(null);

    try {
      const result = await verifyPin({
        reference,
        pin,
      });

      if (result.success) {
        router.push(`/rider/${reference}/success`);
      }

      setError("Invalid PIN. Please check and try again.");
      setDigits(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch {
      setError("An error occurred. Please try again.");
      setDigits(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col">
        <Header />
        <div className="p-4 space-y-4 flex-1">
          <div className="h-40 bg-muted animate-pulse rounded-lg" />
          <div className="h-24 bg-muted animate-pulse rounded-lg" />
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground text-center">Order not found.</p>
      </div>
    );
  }

  // Terminal / non-verifiable state gates
  if (order.data?.status === "delivered") {
    return (
      <StatusGate
        title="Already Delivered"
        message="This order has already been confirmed as delivered."
        color="text-[#22C55E]"
      />
    );
  }
  if (order.data?.status === "disputed") {
    return (
      <StatusGate
        title="Order Disputed"
        message="This order is currently under dispute. PIN verification is suspended."
        color="text-[#EF4444]"
      />
    );
  }
  if (order.data?.status === "pending") {
    return (
      <StatusGate
        title="Awaiting Payment"
        message="The buyer's payment has not been confirmed yet. Check back once payment is received."
        color="text-[#D97706]"
      />
    );
  }

  return (
    <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col shadow-sm">
      <Header />

      <main className="flex-1 p-4 space-y-5 overflow-y-auto pb-8">
        {/* Order Details */}
        <div className="bg-card border rounded-xl p-4 space-y-0 divide-y divide-border">
          <div className="pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              ORDER DETAILS
            </h2>
          </div>
          <Row label="Order ID" value={order.data?.id} />
          <Row label="Delivery Address" value={order.data?.delivery_address} />
          <Row label="Status" value={formatStatus(order.data?.status)} />
          <Row label="Merchant" value={order.data.buyer_name} />
        </div>

        {/* Instructions */}
        <div className="border border-[#D97706]/40 bg-[#FFF7ED] rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-[#D97706]">Instructions</h3>
          <ol className="space-y-1 text-sm text-[#92400E] list-none">
            <li>1. Ask the buyer for their delivery PIN.</li>
            <li>2. Enter the 4-digit PIN below.</li>
            <li>3. Tap Verify to confirm delivery.</li>
          </ol>
        </div>

        {/* Error banner */}
        {error && (
          <div className="border border-[#EF4444]/40 bg-[#FEF2F2] rounded-lg px-4 py-3 text-sm font-medium text-[#EF4444]">
            {error}
          </div>
        )}

        {/* PIN Entry */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            Enter Delivery PIN
          </h2>
          <div className="flex justify-center gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="w-14 h-14 text-center text-xl font-semibold border-2 border-border rounded-lg bg-card focus:outline-none focus:border-primary transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Spacer pushes button down */}
        <div className="flex-1" />

        {/* Verify Button */}
        <div className="pt-4">
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleVerify}
            disabled={pin.length < 4 || isPending}
          >
            {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isPending ? "Verifying..." : "Verify PIN"}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Can&apos;t verify? Contact support at{" "}
          <a
            href="mailto:support@vouch.ng"
            className="text-primary underline underline-offset-2"
          >
            support@vouch.ng
          </a>
        </p>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

function StatusGate({
  title,
  message,
  color,
}: {
  title: string;
  message: string;
  color: string;
}) {
  return (
    <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col shadow-sm">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <h2 className={`text-lg font-semibold ${color}`}>{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  const map: Record<string, string> = {
    pending: "Pending",
    payment_confirmed: "Awaiting Verification",
    payment_verified: "Awaiting Verification",
    dispatched: "Dispatched",
    delivered: "Delivered",
    disputed: "Disputed",
  };
  return map[status] ?? status;
}
