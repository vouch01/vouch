"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth-shell";

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

  function onSubmit(values: Values) {
    console.log(values);
    router.push("/verify-otp");
  }

  return (
    <AuthShell>
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

        <h2
          className="text-lg font-semibold text-foreground mb-1"
          data-testid="text-heading"
        >
          Forgot Password
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Provide your email to receive an OTP for password reset.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Email
                  </FormLabel>
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
          className="mt-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          data-testid="link-back-to-login"
        >
          <ArrowLeft size={14} />
          Back to Login
        </button>
      </div>
    </AuthShell>
  );
}
