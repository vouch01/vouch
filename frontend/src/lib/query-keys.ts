export const QUERY_KEYS = {
  USER: ["user"],
  
  ORDER: ["order"],

  SINGLE_ORDER: (id: string) => ["orders", id],

  ORDERS: ["orders"],

  ORDER_PIN: (checkoutToken: string) => [
    "order-pin",
    checkoutToken,
  ],
};
