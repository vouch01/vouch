// import { useParams, useRouter } from "next/navigation";
// import { Header } from "@/components/Header";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Info, Copy, Check } from "lucide-react";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useToast } from "@/components/ui/use-toast";

// export default function Success() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const { toast } = useToast();

//   // const { data: transaction, isLoading, isError } = useGetTransaction(id || "", {
//   //   query: {
//   //     enabled: !!id,
//   //     queryKey: getGetTransactionQueryKey(id || ""),
//   //   }
//   // });

//   const [copySuccess, setCopySuccess] = useState(false);

//   const handleCopyPin = () => {
//     if (!transaction?.deliveryPin) return;
//     navigator.clipboard.writeText(transaction.deliveryPin);
//     setCopySuccess(true);
//     setTimeout(() => setCopySuccess(false), 2000);
//     toast({
//       title: "PIN copied",
//       description: "Delivery PIN copied to clipboard.",
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col">
//         <Header />
//         <div className="p-4 space-y-4 flex-1">
//           <div className="h-48 bg-muted animate-pulse rounded-lg" />
//           <div className="h-32 bg-muted animate-pulse rounded-lg" />
//         </div>
//       </div>
//     );
//   }

//   if (isError || !transaction) {
//     return (
//       <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col items-center justify-center p-4">
//         <p className="text-muted-foreground text-center">Failed to load transaction details.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col shadow-sm">
//       <Header />
      
//       <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        
//         {/* Success Card */}
//         <Card className="bg-success-bg border-success/20 overflow-hidden relative">
//           <CardContent className="p-8 flex flex-col items-center text-center gap-3">
//             <motion.div 
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", stiffness: 200, damping: 20 }}
//               className="h-16 w-16 bg-success rounded-full flex items-center justify-center text-success-foreground relative mb-2"
//             >
//               <Check className="h-8 w-8 text-white" strokeWidth={3} />
              
//               {/* Particles */}
//               {[...Array(6)].map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="absolute h-1.5 w-1.5 bg-success rounded-full"
//                   initial={{ x: 0, y: 0, opacity: 1 }}
//                   animate={{
//                     x: (Math.random() - 0.5) * 60,
//                     y: (Math.random() - 0.5) * 60,
//                     opacity: 0
//                   }}
//                   transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
//                 />
//               ))}
//             </motion.div>
            
//             <h2 className="text-xl font-bold text-success-foreground tracking-tight">Payment Successful</h2>
//             <p className="text-sm text-success-foreground/80 font-medium">Your Payment Is Securely Held In Escrow</p>
//           </CardContent>
//         </Card>

//         {/* PIN Card */}
//         {transaction.deliveryPin && (
//           <Card className="border shadow-sm">
//             <CardContent className="p-6 flex flex-col items-center gap-3">
//               <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Your Delivery PIN</span>
//               <div className="text-4xl font-bold tracking-widest text-foreground bg-muted/50 px-6 py-3 rounded-lg border border-border/50">
//                 {transaction.deliveryPin}
//               </div>
//               <Button 
//                 variant="secondary" 
//                 size="sm" 
//                 onClick={handleCopyPin}
//                 className="mt-2 text-primary font-semibold"
//               >
//                 {copySuccess ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
//                 {copySuccess ? "Copied" : "Copy PIN"}
//               </Button>
//             </CardContent>
//           </Card>
//         )}

//         {/* Important Notice */}
//         <div className="border border-warning bg-warning-bg p-4 rounded-lg flex gap-3 items-start shadow-sm">
//           <Info className="h-5 w-5 text-warning shrink-0 mt-0.5" />
//           <div className="space-y-1">
//             <h4 className="font-bold text-warning-foreground text-sm uppercase tracking-wider">Important</h4>
//             <p className="text-xs text-warning-foreground/90 leading-relaxed font-medium">
//               Only share this PIN with the delivery personnel <span className="font-bold">AFTER</span> you have received and inspected your package. Sharing it confirms you are satisfied.
//             </p>
//           </div>
//         </div>

//         {/* Summary Rows */}
//         <div className="bg-card rounded-lg border shadow-sm divide-y">
//           <div className="flex justify-between items-center p-4">
//             <span className="text-sm text-muted-foreground">Seller</span>
//             <span className="text-sm font-semibold text-right">{transaction.sellerName}</span>
//           </div>
//           <div className="flex justify-between items-center p-4">
//             <span className="text-sm text-muted-foreground">Product</span>
//             <span className="text-sm font-semibold text-right">{transaction.productName}</span>
//           </div>
//           <div className="flex justify-between items-center p-4">
//             <span className="text-sm text-muted-foreground">Amount Paid</span>
//             <span className="text-base font-bold text-right">₦{transaction.productPrice.toLocaleString()}</span>
//           </div>
//         </div>

//         <div className="pt-2 pb-6">
//           <Button 
//             className="w-full h-12 text-base font-semibold"
//             onClick={() => router.push(`/tracker/${id}`)}
//           >
//             Track Order
//           </Button>
//         </div>

//       </main>
//     </div>
//   );
// }

// import React from 'react'

const Page = () => {
  return (
    <div>
      
    </div>
  )
}

export default Page;

