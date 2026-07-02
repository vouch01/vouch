"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, AlertCircle, CheckCircle } from "lucide-react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Order, useOrders } from "@/hooks/use-orders";

export function CreateOrderModal({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState(1);
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const formSchema = z.object({
    buyerPhone: z.string().optional(),
    itemDescription: z.string().min(3, "Item description is required"),
    amount: z.coerce.number().min(100, "Amount must be at least 100 NGN"),
    deliveryAddress: z.string().min(5, "Delivery address is required"),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyerPhone: "",
      itemDescription: "",
      amount: 0,
      deliveryAddress: "",
      notes: "",
    },
  });

  const handleNextToReview = async () => {
    const valid = await form.trigger();
    if (valid) setStep(2);
  };

  const handleConfirm = () => {
    const values = form.getValues();
    const newOrder = addOrder({
      item: values.itemDescription,
      amount: values.amount,
      buyer: values.buyerPhone || "N/A",
      deliveryAddress: values.deliveryAddress,
      notes: values.notes,
    });
    setCreatedOrder(newOrder as Order);
    setStep(3);
  };

  const resetAndClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setCreatedOrder(null);
      form.reset();
    }, 300);
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({ title: "Copied to clipboard" });
  };

  const values = form.getValues();

  return (
    <Dialog open={open} onOpenChange={(o) => { if(!o) resetAndClose(); }}>
      <DialogContent className="sm:max-w-112.5">
        {step < 3 && (
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
              <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-slate-200'}`}></div>
            </div>
            <p className="text-xs text-muted-foreground font-medium text-center">Step {step} of 3</p>
          </div>
        )}

        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Create Order"}
            {step === 2 && "Review Order"}
            {step === 3 && "Share Payment Link"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <Form {...form}>
            <form className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="buyerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer&apos;s Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="08012345678" {...field} />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">The buyer will receive the payment link on this number</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g iPhone 14 Pro (256GB, Space Black)" {...field} />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">Describe the item the buyer is purchasing</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (NGN)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="150000" {...field} />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">Total purchase amount</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter delivery address" {...field} />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">Where the buyer wants the item delivered</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any special instructions..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 cursor-pointer" onClick={resetAndClose}>Cancel</Button>
                <Button type="button" className="flex-1 cursor-pointer" onClick={handleNextToReview} data-testid="btn-next-review">Next: Review & Confirm</Button>
              </div>
            </form>
          </Form>
        )}

        {step === 2 && (
          <div className="space-y-4 pt-4">
            <div className="bg-slate-50 border rounded-md p-4 space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Item</span>
                <span className="text-sm font-medium">{values.itemDescription}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-medium">₦{Number(values.amount).toLocaleString('en-NG')}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Buyer Phone</span>
                <span className="text-sm font-medium">{values.buyerPhone || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm text-muted-foreground">Delivery Address</span>
                <span className="text-sm font-medium text-right max-w-50 truncate" title={values.deliveryAddress}>{values.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Notes</span>
                <span className="text-sm font-medium text-right max-w-50 truncate">{values.notes || "None"}</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" className="flex-1" onClick={handleConfirm} data-testid="btn-confirm-order">Confirm & Create Link</Button>
            </div>
          </div>
        )}

        {step === 3 && createdOrder && (
          <div className="space-y-6 pt-4 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Share this link with the buyer to receive payment:</p>
            
            <div className="flex items-center gap-2 p-3 bg-secondary border rounded-md text-left">
              <Input readOnly value={`https://vouch.link/pay/${createdOrder.id}`} className="font-mono text-sm bg-transparent border-none focus-visible:ring-0 px-0 h-auto" />
              <Button variant="ghost" size="sm" onClick={() => copyLink(`https://vouch.link/pay/${createdOrder.id}`)}><Copy className="w-4 h-4" /></Button>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10" onClick={() => window.open(`https://wa.me/?text=Pay for ${createdOrder.item} here: https://vouch.link/pay/${createdOrder.id}`)}>
                <SiWhatsapp className="w-4 h-4" /> WhatsApp
              </Button>
              <Button variant="outline" className="flex-1 gap-2 border-pink-500 text-pink-600 hover:bg-pink-50">
                <SiInstagram className="w-4 h-4" /> Instagram DM
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function OrderDetailModal({ order, open, onOpenChange }: { order: Order | null, open: boolean, onOpenChange: (o: boolean) => void }) {
  const { updateOrderStatus } = useOrders();
  const { toast } = useToast();

  if (!order) return null;

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({ title: "Copied to clipboard" });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <Badge variant="secondary">Pending Payment</Badge>;
      case 'PAID_IN_ESCROW': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200">Ready to Ship</Badge>;
      case 'DISPATCHED': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border border-blue-200">Dispatched</Badge>;
      case 'SETTLED': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border border-green-200">Settled</Badge>;
      case 'DISPUTED': return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 border border-pink-200">Disputed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <DialogTitle className="flex items-center gap-3">
            <span>Order {order.id}</span>
            {getStatusBadge(order.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {order.status === 'PENDING' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Awaiting Payment — Send the payment link to the buyer. Payment must be received within 30 minutes.</p>
            </div>
          )}

          {order.status === 'PAID_IN_ESCROW' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Payment confirmed and held in escrow. Now package the item and arrange delivery with a courier.</p>
            </div>
          )}

          {order.status === 'SETTLED' && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm flex gap-2">
              <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />
              <p>Payout Completed — ₦{order.amount.toLocaleString()} transferred to your GTBank account</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm mb-3">Order Details</h4>
            <div className="border rounded-md overflow-hidden text-sm">
              <div className="flex justify-between p-3 border-b bg-slate-50/50">
                <span className="text-muted-foreground">Item</span>
                <span className="font-medium text-right">{order.item}</span>
              </div>
              <div className="flex justify-between p-3 border-b bg-white">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-right">₦{order.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 border-b bg-slate-50/50">
                <span className="text-muted-foreground">Buyer Phone</span>
                <span className="font-medium text-right">{order.buyer}</span>
              </div>
              <div className="flex justify-between p-3 border-b bg-white">
                <span className="text-muted-foreground">Delivery Address</span>
                <span className="font-medium text-right max-w-50 truncate" title={order.deliveryAddress}>{order.deliveryAddress}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50/50">
                <span className="text-muted-foreground">Date Created</span>
                <span className="font-medium text-right">{order.dateCreated}</span>
              </div>
            </div>
          </div>

          {order.status === 'PENDING' && (
            <div>
              <h4 className="font-semibold text-sm mb-3">Resend Payment Link</h4>
              <div className="flex items-center gap-2 p-3 bg-secondary border rounded-md text-left mb-3">
                <Input readOnly value={`https://vouch.link/pay/${order.id}`} className="font-mono text-sm bg-transparent border-none focus-visible:ring-0 px-0 h-auto" />
                <Button variant="ghost" size="sm" onClick={() => copyLink(`https://vouch.link/pay/${order.id}`)}><Copy className="w-4 h-4" /></Button>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
                  <SiWhatsapp className="w-4 h-4" /> WhatsApp
                </Button>
                <Button variant="outline" className="flex-1 gap-2 border-pink-500 text-pink-600 hover:bg-pink-50">
                  <SiInstagram className="w-4 h-4" /> Instagram DM
                </Button>
              </div>
            </div>
          )}

          {order.status === 'PAID_IN_ESCROW' && (
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => {
                  updateOrderStatus(order.id, 'DISPATCHED');
                  onOpenChange(false);
                  toast({ title: "Order marked as dispatched" });
                }}
              >
                Mark as Dispatched
              </Button>
              <Button variant="outline" className="w-full">Contact Support</Button>
            </div>
          )}

          {order.status === 'DISPUTED' && (
            <div>
              <h4 className="font-semibold text-sm mb-3">Reason</h4>
              <div className="mb-3">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Wrong item received</Badge>
              </div>
              <div className="mb-4">
                <span className="text-sm text-muted-foreground mb-1 block">Buyer Note:</span>
                <div className="p-3 bg-slate-50 border rounded-md text-sm italic text-slate-600">
                  &quot;I ordered a black shoe but received a white one.&quot;
                </div>
              </div>
              <Button className="w-full">Accept Dispute & Issue Refund</Button>
            </div>
          )}

          {order.status === 'SETTLED' && (
            <>
              <div>
                <h4 className="font-semibold text-sm mb-3">Payout Details</h4>
                <div className="border rounded-md overflow-hidden text-sm">
                  <div className="flex justify-between p-3 border-b bg-white">
                    <span className="text-muted-foreground">Payout Amount</span>
                    <span className="font-medium text-right">₦{order.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 border-b bg-slate-50/50">
                    <span className="text-muted-foreground">Payout Date</span>
                    <span className="font-medium text-right">{order.dateCreated}</span>
                  </div>
                  <div className="flex justify-between p-3 border-b bg-white">
                    <span className="text-muted-foreground">Bank Account</span>
                    <span className="font-medium text-right">GTBank • 0123456789</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50/50">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-medium text-right font-mono text-xs">TXN-2024-654321</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Delivery Confirmation</h4>
                <div className="border rounded-md overflow-hidden text-sm">
                  <div className="flex justify-between p-3 border-b bg-white">
                    <span className="text-muted-foreground">Confirmed By</span>
                    <span className="font-medium text-right">Buyer</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50/50">
                    <span className="text-muted-foreground">Confirmation Date</span>
                    <span className="font-medium text-right">{order.dateCreated}</span>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RiderLinkModal({ open, onOpenChange, orderId }: { open: boolean, onOpenChange: (o: boolean) => void, orderId: string }) {
  const { toast } = useToast();
  
  const copyLink = () => {
    navigator.clipboard.writeText(`https://vouch.link/verify/${orderId}`);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Rider Verification Link</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">Share this link with your dispatch rider to verify delivery with the buyer.</p>
          <div className="flex items-center gap-2 p-3 bg-secondary border rounded-md text-left mb-6">
            <Input readOnly value={`https://vouch.link/verify/${orderId}`} className="font-mono text-sm bg-transparent border-none focus-visible:ring-0 px-0 h-auto" />
            <Button variant="ghost" size="sm" onClick={copyLink}><Copy className="w-4 h-4" /></Button>
          </div>
          <Button className="w-full" onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
