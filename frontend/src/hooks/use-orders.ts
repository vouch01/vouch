import { useState, useCallback } from "react";

export type OrderStatus = "PENDING" | "PAID_IN_ESCROW" | "DISPATCHED" | "SETTLED";

export interface Order {
  id: string;
  item: string;
  amount: number;
  buyer: string;
  status: OrderStatus;
  timeAgo: string;
}

const INITIAL_ORDERS: Order[] = [
  { status: "PENDING", item: '1x Air Jordan 4 Retro', amount: 45000, buyer: '0803321XXXX', id: 'ORD-001', timeAgo: '2m ago' },
  { status: "PENDING", item: '2x Body Butter Set', amount: 8500, buyer: '0817654XXXX', id: 'ORD-002', timeAgo: '14m ago' },
  { status: "PAID_IN_ESCROW", item: '1x Designer Shoe', amount: 15000, buyer: '0901234XXXX', id: 'ORD-003', timeAgo: '1h ago' },
  { status: "PAID_IN_ESCROW", item: '1x Wool Blazer', amount: 32000, buyer: '0809988XXXX', id: 'ORD-004', timeAgo: '3h ago' },
  { status: "DISPATCHED", item: '1x Laptop Stand', amount: 12500, buyer: '0704411XXXX', id: 'ORD-005', timeAgo: '5h ago' },
  { status: "SETTLED", item: '3x Ankara Print Set', amount: 22000, buyer: '0813344XXXX', id: 'ORD-006', timeAgo: '1d ago' },
  { status: "SETTLED", item: '1x Perfume Bundle', amount: 18750, buyer: '0905678XXXX', id: 'ORD-007', timeAgo: '2d ago' },
];

let globalOrders = [...INITIAL_ORDERS];
let listeners: Array<() => void> = [];

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(globalOrders);

  const subscribe = useCallback(() => {
    const listener = () => setOrders([...globalOrders]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  useState(() => subscribe());

  const addOrder = useCallback((order: Omit<Order, "id" | "status" | "timeAgo">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      status: "PENDING",
      timeAgo: "just now",
    };
    globalOrders = [newOrder, ...globalOrders];
    emit();
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    globalOrders = globalOrders.map((o) => (o.id === id ? { ...o, status } : o));
    emit();
  }, []);

  const getOrder = useCallback((id: string) => {
    return globalOrders.find((o) => o.id === id);
  }, []);

  return {
    orders,
    addOrder,
    updateOrderStatus,
    getOrder,
  };
}
