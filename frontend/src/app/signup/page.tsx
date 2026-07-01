"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signupSchema = z
  .object({
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function Signup() {
    const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { businessName: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(_values: SignupValues) {
    router.push("/welcome");
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
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">Get started</p>
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-heading">
              Create your account
            </h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Business Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your business name"
                        autoComplete="organization"
                        className="rounded-lg border-border h-11 text-sm"
                        data-testid="input-business-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="new-password"
                          className="rounded-lg border-border h-11 text-sm pr-10"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Confirm password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirm password"
                          autoComplete="new-password"
                          className="rounded-lg border-border h-11 text-sm pr-10"
                          data-testid="input-confirm-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          data-testid="button-toggle-confirm-password"
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium cursor-pointer"
                data-testid="button-create-account"
              >
                Create account
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/")}
              className="text-primary font-medium hover:underline cursor-pointer"
              data-testid="link-login"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
