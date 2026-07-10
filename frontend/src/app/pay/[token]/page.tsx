/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";


import { Header } from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCheckoutOrder } from "@/hooks/use-checkout";
import { GoShieldLock } from "react-icons/go";

export default function Checkout() {
  const router = useRouter();
  const { toast } = useToast();

  const { token } = useParams<{
  token: string;
}>();

const {
  data,
  isLoading,
  isError,
} = useCheckoutOrder(token);

const payment = data?.data.paymentDetails;
const order = data?.data.orderDetails;

  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [copySuccess, setCopySuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCopyAccount = () => {
    if (!payment) return;
    navigator.clipboard.writeText(payment.bankAccountNumber);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    toast({
      title: "Account number copied",
      description: "Copied to clipboard.",
    });
  };

  const handleConfirmPayment = async () => {
    if (!payment) return;
  };

  const expiry = payment?.expiryDate;

  useEffect(() => {
  if (!expiry) return;

  const interval = setInterval(() => {
    const remaining = Math.max(
      0,
      Math.floor(
        (new Date(expiry).getTime() - Date.now()) / 1000
      )
    );

    setTimeLeft(remaining);
  }, 1000);

  return () => clearInterval(interval);
}, [expiry]);

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col">
        <Header />
        <div className="p-4 space-y-4 flex-1">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-16 bg-muted animate-pulse rounded-lg" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground text-center">Failed to load order details.</p>
      </div>
    );
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-dvh bg-background mx-auto w-full flex justify-center">
      <div className="w-full max-w-120 flex flex-col rounded-[14px] overflow-hidden mt-8 shadow-[0px_16px_24px_2px_#00000024] bg-[#FEFEFE]">
      <Header />
      
      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        
        {/* Order Details Card */}
        <Card className="bg-[muted/50] border-none shadow-none">
          <CardContent className="p-4 flex flex-col gap-1 items-center text-center bg-[#F5F5F7] rounded-[14px] border border-[#DDDDDE]">
            <span className="text-sm text-[#939394] font-normal">{order.businessName}</span>
            <span className="text-sm text-[#444444] font-medium">{order.buyer_phone}</span>
            <span className="text-sm text-[#444444] font-medium">{order.item_name}</span>
            <span className="text-[16px] text-[#1F1F1F]">{order.item_description}</span>
            <div className="mt-2 text-[24px] font-medium tracking-tight text-foreground">
              ₦{order.formattedAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col w-full items-center gap-3.5 bg-card rounded-lg border shadow-sm p-6">
            <div className="rounded-md text-[#000000]">
              <GoShieldLock className="h-4 w-4" />
            </div>
            <span className="text-xs font-normal w-full text-center">Escrow Protected</span>
          </div>
          <div className="flex flex-col items-center gap-3.5 bg-card p-6 rounded-lg border shadow-sm">
            <div className="text-[#000000]">
              <Check className="h-4 w-4" />
            </div>
            <span className="text-xs font-normal">Delivery Protected</span>
          </div>
        </div>

        {/* How Vouch Works */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-normal text-[#000000] text-[24px]">How Vouch Works</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-sm">
                <span className="bg-[#CCC8FA] text-primary font-medium text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0">1</span>
                <span className="text-muted-foreground">Pay securely into escrow</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="bg-[#CCC8FA] text-primary font-medium text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0">2</span>
                <span className="text-muted-foreground">Seller ships your item</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="bg-[#CCC8FA] text-primary font-medium text-xs h-6 w-6 rounded-full flex items-center justify-center shrink-0">3</span>
                <span className="text-muted-foreground">Funds released after delivery verification</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-normal text-[#1F1F1F] text-[24px]">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex flex-col items-start">
                <span className="text-[16px] text-[#939394]">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-regular text-[#1F1F1F]">{payment?.bankAccountNumber}</span>
                  <button 
                  onClick={handleCopyAccount} 
                  className="text-primary hover:bg-secondary p-1 rounded-md transition-colors cursor-pointer">
                    {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[16px] text-[#939394]">Bank Name</span>
                <span className="text-sm font-regular text-[#1F1F1F]">Nomba X</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[16px] text-[#939394]">Account Name</span>
                <span className="text-sm font-regular text-[#1F1F1F]">{payment?.bankAccountName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countdown */}
        <Card className="bg-muted/50 border-none shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Payment expires in</span>
            <span className="text-3xl font-bold tabular-nums text-foreground">{timeString}</span>
          </CardContent>
        </Card>

        {/* Refund & Protection Notice */}
        <div className="border-l-4 border-l-[#C47E09] bg-warning-bg py-2 px-4 rounded-[14px] flex gap-3 items-start">
          {/* <Info className="h-5 w-5 text-warning shrink-0 mt-0.5" /> */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#C47E09] text-sm tracking-tight">Refund & Protection</h4>
            <p className="text-[12px] text-[#565656] leading-relaxed">
              Your funds remain protected until delivery confirmation. If you don&apos;t receive your item or it arrives damaged, you&apos;re eligible for a full refund.
            </p>
          </div>
        </div>

        <div className="pt-2 pb-6">
          <Button 
            className="w-full h-12 text-base font-semibold"
            // onClick={handleConfirmPayment}
            disabled={paymentStatus === "loading" || timeLeft <= 0}
          >
            {paymentStatus === "loading" && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {paymentStatus === "loading" ? "Checking payment..." : 
             paymentStatus === "error" ? "Check again" : 
             "I've Made Payment"}
          </Button>
        </div>

      </main>
    </div>
    </div>
  );
};

