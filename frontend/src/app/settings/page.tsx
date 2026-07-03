"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AppShell } from "@/components/app-shell";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessEmail: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  bankName: z.string().min(1, "Bank is required"),
  accountNumber: z.string().length(10, "Account number must be 10 digits"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  notifyPayment: z.boolean(),
  notifyDelivery: z.boolean(),
  notifyPayout: z.boolean(),
  notifyDispute: z.boolean(),
});

export default function SettingsPage() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "TechHub Store",
      businessEmail: "owner@techhub.com",
      phoneNumber: "080x xxx xxxx xxx",
      bankName: "gtbank",
      accountNumber: "",
      accountHolderName: "",
      notifyPayment: false,
      notifyDelivery: true,
      notifyPayout: true,
      notifyDispute: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    toast({
      title: "Settings saved.",
      description: "Your business and payout settings have been updated.",
    });
  };

  return (
    <AppShell 
      pageTitle="Settings"
      headerRight={
        <Button onClick={form.handleSubmit(onSubmit)} className="shadow-sm cursor-pointer">
          Save Changes
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            
            {/* Section: Business Information */}
            <div className="bg-white border rounded-lg px-6 py-2 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4 border-b border-[#D9D9D9] py-3">Business Information</h2>
              <div className="flex flex-col gap-6">
                <FormField control={form.control} name="businessName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <p className="text-[11px] text-muted-foreground">Your business name as it appears on invoices</p>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="businessEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <p className="text-[11px] text-muted-foreground">We&apos;ll send order updates to this email</p>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <p className="text-[11px] text-muted-foreground">For buyer inquiries and support</p>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left col: Payout Account */}
              <div className="bg-white border rounded-lg p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-foreground">Payout Account</h2>
                
                <div className="bg-amber-50 border border-amber-200 text-[#565656] p-3 rounded-md text-sm">
                  Funds from successful escrow transactions will be sent to this account after delivery confirmation.
                </div>

                <div className="space-y-4">
                  <FormField control={form.control} name="bankName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gtbank">Guaranty Trust Bank</SelectItem>
                          <SelectItem value="zenith">Zenith Bank</SelectItem>
                          <SelectItem value="firstbank">First Bank of Nigeria</SelectItem>
                          <SelectItem value="access">Access Bank</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="accountNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl><Input placeholder="10-digit account number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="accountHolderName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="pt-2">
                  <span className="text-sm font-medium text-foreground mb-2 block">Account Verification Status</span>
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Account verified and active</p>
                      <p className="text-xs opacity-90 mt-0.5">Verified on Dec 10, 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right col: Notification Preferences */}
              <div className="bg-white border rounded-lg p-6 shadow-sm flex flex-col">
                <h2 className="text-lg font-bold text-foreground mb-6">Notification Preferences</h2>
                
                <div className="space-y-6 flex-1">
                  <FormField control={form.control} name="notifyPayment" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">Payment Received</FormLabel>
                        <p className="text-sm text-muted-foreground">When buyer completes payment</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="notifyDelivery" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">Delivery Confirmed</FormLabel>
                        <p className="text-sm text-muted-foreground">When buyer confirms delivery</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="notifyPayout" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">Payout Released</FormLabel>
                        <p className="text-sm text-muted-foreground">When funds are sent to your account</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="notifyDispute" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">Dispute Raised</FormLabel>
                        <p className="text-sm text-muted-foreground">When buyer raises a dispute</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <div className="bg-amber-50 border border-amber-200 text-[#565656] p-3 rounded-md text-sm mt-6">
                  Notifications are sent via email to owner@techhub.com.
                </div>
              </div>
            </div>
            
          </form>
        </Form>
      </div>
    </AppShell>
  );
}
