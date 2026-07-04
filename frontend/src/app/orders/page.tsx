"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppShell } from "@/components/app-shell";
import { OrderDetailModal, RiderLinkModal } from "@/components/modals";
import { useOrders } from "@/hooks/use-orders";
import { Order } from "@/types/orders";

export default function OrdersPage() {
  const { orders } = useOrders();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [riderModalOpen, setRiderModalOpen] = useState(false);
  const [riderOrderId, setRiderOrderId] = useState("");

  const filteredOrders = orders.filter((o) => {
    if (filter !== "All" && filter !== o.status) {
      if (filter === "Ready to Ship" && o.status !== "PAID_IN_ESCROW") return false;
      if (filter === "Pending Payment" && o.status !== "PENDING") return false;
      if (filter === "Dispatched" && o.status !== "DISPATCHED") return false;
      if (filter === "Settled" && o.status !== "SETTLED") return false;
    }
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.item.toLowerCase().includes(search.toLowerCase()) && !o.buyer.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Pending Payment</Badge>;
      case 'PAID_IN_ESCROW': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Ready to Ship</Badge>;
      case 'DISPATCHED': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Dispatched</Badge>;
      case 'SETTLED': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Settled</Badge>;
      case 'DISPUTED': return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">Disputed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const tabs = [
    { label: "All", value: "All", count: orders.length },
    { label: "Pending Payment", value: "Pending Payment", count: orders.filter(o => o.status === 'PENDING').length },
    { label: "Ready to Ship", value: "Ready to Ship", count: orders.filter(o => o.status === 'PAID_IN_ESCROW').length },
    { label: "Dispatched", value: "Dispatched", count: orders.filter(o => o.status === 'DISPATCHED').length },
    { label: "Settled", value: "Settled", count: orders.filter(o => o.status === 'SETTLED').length },
  ];

  return (
    <AppShell 
      pageTitle="Orders" 
      headerRight={
        <Button variant="outline" size="sm" className="gap-2 bg-primary text-white hover:bg-primary/90 cursor-pointer">
          <Download className="w-4 h-4" /> Export
        </Button>
      }
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your escrow transactions and track payments</p>
        </div>

        <div className="flex gap-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`pb-3 text-sm font-medium transition-colors relative ${filter === tab.value ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setFilter(tab.value)}
            >
              {tab.label} <span className="ml-1 text-xs opacity-60">({tab.count})</span>
              {filter === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search order" 
              className="pl-9 bg-white" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-35 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger className="w-35 bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by: Newest</SelectItem>
                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                <SelectItem value="amount_high">Amount: High-Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white border p-6 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F7] border-none py-4 px-6">
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer Phone</TableHead>
                <TableHead>Item Description</TableHead>
                <TableHead>Amount (₦)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="px-8 border-none">
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No orders found.</TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50" onClick={() => { setSelectedOrder(order); setOrderModalOpen(true); }}>
                    <TableCell className="font-mono text-primary font-medium">{order.id}</TableCell>
                    <TableCell className="font-mono text-sm">{order.buyer}</TableCell>
                    <TableCell className="max-w-50 truncate">{order.item}</TableCell>
                    <TableCell className="font-medium">{order.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{order.dateCreated}</TableCell>
                    <TableCell className="text-right">
                      {order.status === 'DISPATCHED' ? (
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
                        <span className="text-sm font-medium text-primary hover:underline">View</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <OrderDetailModal order={selectedOrder} open={orderModalOpen} onOpenChange={setOrderModalOpen} />
      <RiderLinkModal open={riderModalOpen} onOpenChange={setRiderModalOpen} orderId={riderOrderId} />
    </AppShell>
  );
}
