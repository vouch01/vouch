"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type Values = z.infer<typeof schema>;

export default function ForgotPassword() {
  const router = useRouter();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  function onSubmit(_values: Values) {
    router.push("/verify-otp");
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
          <span className="text-white text-2xl font-bold tracking-tight">Vouch</span>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white text-xl font-medium leading-snug max-w-sm">
            "The layer of trust every social commerce transaction has been missing."
          </blockquote>
          <p className="mt-3 text-white/60 text-sm">Secure escrow. Instant payouts. Zero disputes.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <span className="lg:hidden text-2xl font-bold text-foreground tracking-tight block mb-6">Vouch</span>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">Password reset</p>
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-heading">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Provide your email to receive an OTP for password reset.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="rounded-lg border-border h-11 text-sm"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium cursor-pointer" 
                data-testid="button-continue"
              >
                Continue
              </Button>
            </form>
          </Form>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
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
