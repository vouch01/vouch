"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppShell } from "@/components/app-shell";
import {
  CreateOrderModal,
  OrderDetailModal,
  RiderLinkModal,
} from "@/components/modals";
import { useOrders } from "@/hooks/use-orders";
import { Order } from "@/types/orders";
import { useMe } from "@/hooks/use-me";
import Loading from "@/components/Loading";

export default function VendorDashboard() {
  const { data: vendorOrders, isLoading } = useOrders();

  const orders = vendorOrders?.data ?? [];
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [riderModalOpen, setRiderModalOpen] = useState(false);
  const [riderOrderId, setRiderOrderId] = useState("");

  const { data } = useMe();

  const vendor = data?.data;

  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING_PAYMENT",
  ).length;
  const readyOrders = orders.filter(
    (o) => o.status === "PAID_IN_ESCROW",
  ).length;
  const settledOrders = orders.filter((o) => o.status === "SETTLED").length;

  const recentOrders = orders.slice(0, 3);
  const recentActivity = [
    "Payment received for order ORD-001233 / 2 hours ago",
    "Rider verification completed for order ORD-001232 / 5 hours ago",
    "Payout released - ₦400,000 to your bank account / Yesterday at 2:30 PM",
  ];

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            Pending Payment
          </Badge>
        );
      case "PAID_IN_ESCROW":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Ready to Ship
          </Badge>
        );
      case "DISPATCHED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Dispatched
          </Badge>
        );
      case "SETTLED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Settled
          </Badge>
        );
      case "DISPUTED":
        return (
          <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">
            Disputed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if(isLoading) {
    <Loading />
  }

  return (
    <AppShell pageTitle="Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section 1 - Welcome bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome Back {vendor?.business_name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your escrow transactions and track payments
            </p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="shadow-sm"
          >
            + Create Order
          </Button>
        </div>

        {/* Section 2 - Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border p-5 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Orders
            </p>
            <p className="text-3xl font-bold">24</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </div>
          <div className="bg-white border p-5 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Pending Payment
            </p>
            <p className="text-3xl font-bold">{pendingOrders}</p>
            <p className="text-xs text-muted-foreground mt-1">₦1,250,000</p>
          </div>
          <div className="bg-white border p-5 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Ready to Ship
            </p>
            <p className="text-3xl font-bold">{readyOrders}</p>
            <p className="text-xs text-muted-foreground mt-1">₦800,000</p>
          </div>
          <div className="bg-white border p-5 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Settled Orders
            </p>
            <p className="text-3xl font-bold">{settledOrders}</p>
            <p className="text-xs text-green-600 font-medium mt-1">Completed</p>
          </div>
        </div>

        {/* Section 3 - Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
            <Link
              href="/vendor/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Buyer Phone</TableHead>
                  <TableHead>Item Description</TableHead>
                  <TableHead>Amount (₦)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleOrderClick(order)}
                  >
                    <TableCell className="font-mono text-primary font-medium">
                      {order.id}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {order.buyer_phone}
                    </TableCell>
                    <TableCell className="max-w-50 truncate">
                      {order.item_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.amount_paid.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {order.created_at}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === "DISPATCHED" ? (
                        <span
                          className="text-sm font-medium text-primary hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRiderOrderId(order.id);
                            setRiderModalOpen(true);
                          }}
                        >
                          Track
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-primary hover:underline">
                          View
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Section 4 - Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          <div className="bg-white border rounded-lg overflow-hidden">
            {recentActivity.map((activity, i) => {
              const [desc, time] = activity.split(" / ");
              return (
                <div
                  key={i}
                  className="p-4 border-b last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm text-foreground">{desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">{time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CreateOrderModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <OrderDetailModal orderId={selectedOrder?.id} open={orderModalOpen} onOpenChange={setOrderModalOpen} />
      <RiderLinkModal
        open={riderModalOpen}
        onOpenChange={setRiderModalOpen}
        orderId={riderOrderId}
      />
    </AppShell>
  );
}
