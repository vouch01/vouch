"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";

export default function RiderSuccess() {
  return (
    <div className="min-h-dvh bg-background max-w-120 mx-auto w-full flex flex-col shadow-sm">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full bg-[#F0FDF4] rounded-2xl p-10 flex flex-col items-center gap-6 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Scattered dots */}
          {[
            { top: "12%", left: "18%", size: 6 },
            { top: "8%", left: "60%", size: 8 },
            { top: "20%", left: "80%", size: 5 },
            { top: "55%", left: "10%", size: 5 },
            { top: "70%", left: "25%", size: 7 },
            { top: "65%", left: "72%", size: 5 },
            { top: "78%", left: "85%", size: 6 },
          ].map((dot, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#22C55E]"
              style={{
                top: dot.top,
                left: dot.left,
                width: dot.size,
                height: dot.size,
                opacity: i % 2 === 0 ? 0.5 : 0.25,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
            />
          ))}

          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 220,
              damping: 16,
            }}
          >
            <CheckCircle2
              className="text-[#22C55E]"
              strokeWidth={2}
              style={{ width: 80, height: 80 }}
            />
          </motion.div>

          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-foreground">
              Delivery Confirmed
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              The buyer has verified receipt of the package.
              <br />
              Payment has been released to the vendor.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
