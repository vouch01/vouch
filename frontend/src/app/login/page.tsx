"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth-shell";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    console.log(values);
    router.push("/");
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

          <h2 className="text-lg font-semibold text-foreground mb-5" data-testid="text-heading">
            Login to your account
          </h2>

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
                          autoComplete="current-password"
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

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                  data-testid="link-forgot-password"
                  onClick={() => router.push("/forgot-password")}
                >
                  Forget Password
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium"
                data-testid="button-login"
              >
                Login
              </Button>
            </form>
          </Form>

          <p className="mt-5 text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-primary font-semibold hover:underline cursor-pointer"
              data-testid="link-signup"
            >
              SignUp
            </button>
          </p>
        </div>
    </AuthShell>
  );
}
