"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
    <div
      className="min-h-screen relative flex items-center justify-end"
      style={{
        backgroundImage: "url('/images/auth-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md mx-6 lg:mr-20 my-10">
        <div className="bg-white rounded-2xl shadow-2xl px-10 py-10">
          <div className="flex flex-col items-center mb-7">
            {/* <img src={vouchLogo} alt="Vouch" className="h-8 w-auto mb-3" /> */}
            <Image
              src={"/logos/vouch-logo.png"}
              alt="Vouch"
              width={100}
              height={100}
              className="mb-3"
            />
            <p className="text-sm text-muted-foreground text-center">
              A trusted payment layer for social commerce.
            </p>
          </div>

          <div className="text-center mb-6">
            <h2
              className="text-lg font-semibold text-foreground mb-1"
              data-testid="text-heading"
            >
              Verify OTP
            </h2>
            <p className="text-sm text-muted-foreground">
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
              <>
                Resend available in{" "}
                <span
                  className="font-semibold text-foreground tabular-nums"
                  data-testid="text-countdown"
                >
                  {formatTime(countdown)}
                </span>
              </>
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
            className="mt-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto cursor-pointer"
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
