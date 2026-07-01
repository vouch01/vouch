"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 3 * 60;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function VerifyOtp() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    setError("");
    if (val && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  function handleResend() {
    if (countdown > 0) return;
    setCountdown(RESEND_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastFilled]?.focus();
  }

  function onSubmit() {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Enter all 6 digits.");
      return;
    }
    router.push("/reset-password");
  }

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-[58%] relative flex-col justify-between p-12"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10">
          <span className="text-white text-2xl font-bold tracking-tight">
            Vouch
          </span>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white text-xl font-medium leading-snug max-w-sm">
            "The layer of trust every social commerce transaction has been
            missing."
          </blockquote>
          <p className="mt-3 text-white/60 text-sm">
            Secure escrow. Instant payouts. Zero disputes.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <span className="lg:hidden text-2xl font-bold text-foreground tracking-tight block mb-6">
              Vouch
            </span>
            <h2
              className="text-2xl font-bold text-foreground"
              data-testid="text-heading"
            >
              Verify OTP
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent an OTP to{" "}
              <span className="font-medium text-foreground">
                otp@example.com
              </span>
              <br />
              Enter it below to continue.
            </p>
          </div>

          <div
            className="flex gap-2 justify-center mb-2"
            data-testid="otp-input-group"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="w-11 h-12 text-center text-base font-semibold border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid={`input-otp-${i}`}
              />
            ))}
          </div>

          {error && (
            <p
              className="text-sm text-destructive text-center mb-3"
              data-testid="text-error"
            >
              {error}
            </p>
          )}

          <p className="text-sm text-muted-foreground text-center mb-6">
            {countdown > 0 ? (
              <>Resend available in <span className="font-semibold text-foreground tabular-nums" data-testid="text-countdown">{formatTime(countdown)}</span></>
            ) : (
              <>
                Resend available:{" "}
                <button
                  onClick={handleResend}
                  className="font-semibold text-foreground hover:underline cursor-pointer"
                  data-testid="button-resend-otp"
                >
                  Resend OTP
                </button>
              </>
            )}
          </p>

          <Button
            onClick={onSubmit}
            className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium cursor-pointer"
            data-testid="button-continue"
          >
            Continue
          </Button>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto cursor-pointer"
            data-testid="link-back-to-login"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
