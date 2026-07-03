import { useDashboard } from "@/hooks/use-dashboard";
import { useState } from "react";
import { AppShell } from "./app-shell";
import { Button } from "./ui/button";
import { Order } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { data, isPending, error } = useDashboard();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error occurred while loading dashboard data.</p>;
  }

  const dashboard = data.data;

  const vendor = dashboard.vendor;

  const stats = dashboard.stats;

  const recentOrders = dashboard.recentOrders;

  const recentActivities = dashboard.recentActivities;

  const handleOrderClick = (order: Order) => {
      setSelectedOrder(order);
      setOrderModalOpen(true);
    };

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

  return (
    <AppShell pageTitle="Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome Back {vendor.firstName || "John"}!
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

      </div>
    </AppShell>
  );
};

export default Dashboard;
