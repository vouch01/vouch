import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, CheckCircle2, Zap, Lock } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative mt-[22dvh] pb-32 overflow-hidden w-full">
      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 opacity-30 pointer-events-none blur-[100px] rounded-full bg-linear-to-tr from-primary/40 to-accent/40" />

      <div className="flex flex-col lg:flex-row items-center justify-between w-full md:h-132.75 px-8 lg:px-16">
        <div className="flex flex-col items-start h-full lg:w-[40%] w-full">
          <span className="flex items-center gap-2 mb-6 text-sm font-medium text-primary rounded-full bg-[#EFEDFE] w-fit border border-[#DDDDDE] px-4 py-2.5">
            <ShieldCheck className="w-6 h-6 text-primary inline-block mr-2" />
            <p className="text-[14px] font-medium">
              ESCROW PROTECTION FOR SOCIAL COMMERCE
            </p>
          </span>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-[60px] font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Secure every social commerce{" "}
              <span className="text-primary">transaction.</span>
            </h1>
            <p className="text-[14px] md:text-[16px] text-muted-foreground mb-8 leading-relaxed w-full md:w-[80%]">
              Vouch hold payments securely and releases them only when delivery
              is verified. Safe for buyers. Reliable for vendors.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
              <Button
                size="lg"
                className="h-14 px-8 text-base bg-[#5B4CF0] hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 group cursor-pointer"
              >
                Create Escrow Order
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hidden w-[55%] h-full bg-[#5B4CF033] rounded-3xl md:flex items-center justify-center"
        >
          {/* Browser Mockup */}
          <div className="w-full md:w-[97%] h-full md:h-[98%] rounded-3xl overflow-hidden relative p-3.5">
            {/* Browser Header */}
            <Image
              src={"/images/land-img.png"}
              fill
              alt="Hero Image"
              className="object-contain"
            />
          </div>

          {/* Mobile Phone Mockup Floating */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute right-16 bottom-22 overflow-hidden"
          >
            <Image
              src={"/images/land-img-2.png"}
              alt="Hero Image"
              width={170}
              height={400}
              className="object-contain"
            />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:hidden w-full h-[30dvh] bg-[#5B4CF033] rounded-3xl items-center justify-center"
        >
          {/* Browser Mockup */}
          <div className="w-[95%] h-full rounded-3xl overflow-hidden relative">
            {/* Browser Header */}
            <Image
              src={"/images/land-img.png"}
              fill
              alt="Hero Image"
              className="object-contain"
            />
          </div>

          {/* Mobile Phone Mockup Floating */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute right-16 bottom-22 overflow-hidden"
          >
            <Image
              src={"/images/land-img-2.png"}
              alt="Hero Image"
              width={93}
              height={186}
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
      <div className="w-full hidden md:flex px-16 absolute bottom-22">
        <div className="flex items-center justify-between gtext-sm font-medium text-muted-foreground bg-[#FEFEFE] py-2.5 px-4 border border-[#DDDDDE] rounded-[14px] h-16 w-[60%]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" /> Escrow Protected
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Delivery Verified
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-primary" /> Secure Payments
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary" /> Automatic Payouts
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
