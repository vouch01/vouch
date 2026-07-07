/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";


import { Header } from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Check, Copy, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useOrder } from "@/hooks/use-order";

export default function Checkout() {
  const { referenceId } = useParams<{ referenceId: string }>();
  const router = useRouter();
  const { toast } = useToast();

  // const reference = params.reference as string;

  const {
    data,
    isPending,
    isError,
  } = useOrder(referenceId);

  const order = data?.data;

  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [copySuccess, setCopySuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // const handleCopyAccount = () => {
  //   if (!transaction) return;
  //   navigator.clipboard.writeText(transaction.accountNumber);
  //   setCopySuccess(true);
  //   setTimeout(() => setCopySuccess(false), 2000);
  //   toast({
  //     title: "Account number copied",
  //     description: "Copied to clipboard.",
  //   });
  // };

  // const handleConfirmPayment = async () => {
  //   if (!transaction) return;
  // };

  if (isPending) {
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
    <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col shadow-sm">
      <Header />
      
      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        
        {/* Order Details Card */}
        <Card className="bg-muted/50 border-none shadow-none">
          <CardContent className="p-4 flex flex-col gap-1 items-center text-center">
            <span className="text-sm text-muted-foreground font-medium">{order.businessName}</span>
            <span className="text-xs text-muted-foreground/80 mb-2">{order.buyerPhone}</span>
            <span className="text-base font-semibold text-foreground">{order.itemDescription}</span>
            <span className="text-sm text-muted-foreground">{order.itemDescription}</span>
            <div className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              ₦{order.amount.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-card p-3 rounded-lg border shadow-sm">
            <div className="bg-secondary p-1.5 rounded-md">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-semibold">Escrow<br/>Protected</span>
          </div>
          <div className="flex items-center gap-2 bg-card p-3 rounded-lg border shadow-sm">
            <div className="bg-success-bg p-1.5 rounded-md">
              <Check className="h-4 w-4 text-success" />
            </div>
            <span className="text-xs font-semibold">Delivery<br/>Protected</span>
          </div>
        </div>

        {/* How Vouch Works */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">How Vouch Works</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-sm">
                <span className="bg-secondary text-primary font-medium text-xs h-5 w-5 rounded-full flex items-center justify-center shrink-0">1</span>
                <span className="text-muted-foreground">Pay securely into escrow</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="bg-secondary text-primary font-medium text-xs h-5 w-5 rounded-full flex items-center justify-center shrink-0">2</span>
                <span className="text-muted-foreground">Seller ships your item</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="bg-secondary text-primary font-medium text-xs h-5 w-5 rounded-full flex items-center justify-center shrink-0">3</span>
                <span className="text-muted-foreground">Funds released after delivery verification</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-sm">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">000000000000000</span>
                  <button 
                  // onClick={handleCopyAccount} 
                  className="text-primary hover:bg-secondary p-1 rounded-md transition-colors">
                    {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bank Name</span>
                <span className="text-sm font-semibold">Nomba X</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account Name</span>
                <span className="text-sm font-semibold">Vouch</span>
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
        <div className="border-l-4 border-l-warning bg-warning-bg p-4 rounded-r-lg flex gap-3 items-start">
          <Info className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-warning text-sm tracking-tight">Refund & Protection</h4>
            <p className="text-xs text-warning-foreground/80 leading-relaxed">
              Your funds are held securely in escrow. If the seller fails to deliver or the item is completely different, your money will be refunded.
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
  );
};

