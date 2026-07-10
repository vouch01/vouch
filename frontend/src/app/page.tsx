"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/providers/auth-provider";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/How-it-works";
import WhyVouch from "@/components/WhyVouch";
import BuildFor from "@/components/BuildFor";
import Image from "next/image";
import { FaXTwitter, FaInstagram, FaLinkedin, FaRegCopyright } from "react-icons/fa6";

export default function Home() {
  const router = useRouter();

  const { loading, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/vendor/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-x-hidden font-sans relative">
      {/* Sticky Navbar */}
      <Navbar />

      <main className="w-full">
        {/* Hero Section */}
        <Hero />

        {/* HOW IT WORKS Section */}
        <HowItWorks />

        {/* WHY VOUCH Section */}
        <WhyVouch />

        {/* BUILD FOR Section */}
        <BuildFor />

        {/* SECURITY Section */}
        <section id="security" className="py-24 bg-card border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-bold tracking-wider text-xs uppercase mb-3 block">
                Security
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Bank-grade protection for every deal
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Your funds never touch the vendor until you confirm delivery.
                Every transaction is encrypted end-to-end.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  Icon: Lock,
                  title: "256-bit Encryption",
                  desc: "All payment data is encrypted using the same standard as top banks.",
                },
                {
                  Icon: ShieldCheck,
                  title: "Escrow Vault",
                  desc: "Funds are held in a regulated escrow account, not in transit.",
                },
                {
                  Icon: CheckCircle2,
                  title: "PIN Verification",
                  desc: "A unique delivery PIN ensures only the real buyer can release funds.",
                },
              ].map(({ Icon, title, desc }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center p-8 rounded-2xl border border-border"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-bold tracking-wider text-xs uppercase mb-3 block">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Common questions
              </h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                {
                  q: "How does Vouch protect my money?",
                  a: "Funds are held in a regulated escrow vault and only released once you confirm the item arrived and matches what was ordered.",
                },
                {
                  q: "How long does it take for a vendor to get paid?",
                  a: "Instantly — the moment the buyer confirms delivery, the funds are released to the vendor's bank account.",
                },
                {
                  q: "What if the item never arrives?",
                  a: "Raise a dispute through Vouch. Our team mediates and, where applicable, refunds the buyer in full.",
                },
                {
                  q: "Does Vouch work on WhatsApp and Instagram?",
                  a: "Yes. Vendors generate a secure payment link that buyers can open from any browser — no app download required.",
                },
                {
                  q: "Are there monthly fees?",
                  a: "No. Vouch charges a small per-transaction fee only when a deal is completed. No subscriptions, no hidden costs.",
                },
              ].map(({ q, a }, i) => (
                <details
                  key={i}
                  className="group border border-border rounded-xl p-6 cursor-pointer"
                >
                  <summary className="font-semibold text-foreground flex items-center justify-between list-none">
                    {q}
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 ml-4 rotate-90 group-open:rotate-270 transition-transform" />
                  </summary>
                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-accent relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-primary/5 rounded-3xl p-8 md:p-16 border border-primary/10 text-center md:text-left flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-primary/5 backdrop-blur-sm">
              <div className="flex-1 items-center">
                <span className="text-primary font-bold tracking-wider text-xs uppercase mb-3 flex items-center gap-2">
                  <span>
                    <ShieldCheck size={16} />
                  </span>
                  Ready to get started?
                </span>
                <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4">
                  Start selling and buying with confidence.
                </h2>
                <p className="text-muted-foreground text-[12px] mb-2">
                  Create your first escrow order in less than 2 minutes.
                </p>
              </div>
              <div className="shrink-0 flex flex-col w-full md:w-auto gap-6">
              <Link href={"/signup"}>
               <Button
                  size="lg"
                  className="w-full md:w-auto h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 group"
                >
                  Create Escrow Order
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
                <p className="text-sm text-[#565656] font-medium">
                  No monthly fees, pay only when you transact.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-12 pt-16 pb-8">
        <div className="w-full px-4">
          <div className="flex flex-col md:flex-row gap-8 justify-between w-full">
            <div className="col-span-2 lg:col-span-2 w-full md:w-[18%]">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image
                  src={"/logos/vouch-logo.png"}
                  alt="Vouch logo"
                  width={100}
                  height={100}
                />
              </Link>
              <p className="text-[12px] text-muted-foreground mb-6">
                The escrow platform that builds trust in every social commerce
                transaction.
              </p>
              <div className="flex items-center gap-2">
                {/* Social placeholders */}
                <a
                  href="https://instagram.com/vouchafrica"
                  aria-label="Follow Vouch on LinkedIn"
                  className="text-primary"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://twitter.com/vouchafrica"
                  aria-label="Follow Vouch on Twitter / X"
                  className="text-primary"
                >
                  <FaXTwitter size={24}/>
                </a>
                <a
                  href="https://linkedin.com/company/vouchafrica"
                  aria-label="Follow Vouch on LinkedIn"
                  className="text-primary"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>

            <div className="flex justify-between w-full md:w-[40%]">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Products</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      How it works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      API
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Support</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col md:flex-row items-center justify-between mt-6 md:mt-0 gap-4">
            <span className="text-[12px] text-[#565656] flex items-center gap-2">
              <FaRegCopyright /> <p>{new Date().getFullYear()} Vouch Africa. All rights reserved.</p>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
