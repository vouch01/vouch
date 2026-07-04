import { Order, OrderStatus } from "@/types/orders";
import { useState, useCallback } from "react";

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-001234', status: 'PENDING', item: 'iPhone 14 Pro (256GB)', amount: 500000, buyer: '080x xxx xxxx', deliveryAddress: 'Lekki, Lagos', dateCreated: 'Dec 15, 2024', timeAgo: '2m ago', notes: '' },
  { id: 'ORD-001233', status: 'PAID_IN_ESCROW', item: 'Samsung Galaxy S24', amount: 450000, buyer: '090x xxx xxxx', deliveryAddress: 'Victoria Island, Lagos', dateCreated: 'Dec 14, 2024 at 2:15 PM', timeAgo: '1h ago', notes: '' },
  { id: 'ORD-001232', status: 'DISPUTED', item: 'MacBook Air M2', amount: 900000, buyer: '090x xxx xxxx', deliveryAddress: 'Banana Island, Lagos', dateCreated: 'Dec 13, 2024 at 2:15 PM', timeAgo: '5h ago', notes: '' },
  { id: 'ORD-001231', status: 'SETTLED', item: 'iPad Pro 12.9', amount: 400000, buyer: '090x xxx xxxx', deliveryAddress: 'Ogudu, Lagos', dateCreated: 'Dec 12, 2024', timeAgo: '1d ago', notes: '' },
  { id: 'ORD-001230', status: 'PAID_IN_ESCROW', item: 'AirPods Pro Max', amount: 300000, buyer: '080x xxx xxxx', deliveryAddress: 'Ikeja, Lagos', dateCreated: 'Dec 11, 2024', timeAgo: '2d ago', notes: '' },
  { id: 'ORD-001229', status: 'DISPATCHED', item: 'Sony WH-1000XM5', amount: 250000, buyer: '080x xxx xxxx', deliveryAddress: 'Surulere, Lagos', dateCreated: 'Dec 10, 2024', timeAgo: '3d ago', notes: '' },
  { id: 'ORD-001228', status: 'DISPATCHED', item: 'Nintendo Switch OLED', amount: 180000, buyer: '070x xxx xxxx', deliveryAddress: 'Yaba, Lagos', dateCreated: 'Dec 9, 2024', timeAgo: '4d ago', notes: '' },
  { id: 'ORD-001227', status: 'PENDING', item: 'Apple Watch Series 9', amount: 220000, buyer: '081x xxx xxxx', deliveryAddress: 'Ajah, Lagos', dateCreated: 'Dec 8, 2024', timeAgo: '5d ago', notes: '' }
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

  const addOrder = useCallback((order: Omit<Order, "id" | "status" | "timeAgo" | "dateCreated">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      status: "PENDING",
      timeAgo: "just now",
      dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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