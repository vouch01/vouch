import { items } from "@/constants/how-it-works";
import { motion } from "framer-motion";
import Image from "next/image";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-accent/30 border-t border-border"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-32">
          <span className="text-primary font-bold tracking-wider text-xs uppercase mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-medium text-foreground">
            Simple. Secure. Transparent.
          </h2>
        </div>

        <div className="w-full hidden md:flex relative -mb-6">
          <Image
            src={"/images/arrow-1.png"}
            alt="arrow"
            width={180}
            height={85}
            className="absolute bottom-0 left-85"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              key={i}
              className="bg-[linear-gradient(179.92deg,#5B4CF0_5.26%,#F5F5F7_64.87%)] border border-[#DDDDDE] rounded-[14px] p-8 relative overflow-hidden group hover:border-primary/50 transition-colors h-[368]"
            >
              {/* <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" /> */}
              <h3 className="text-xl font-medium mb-3 text-[#FEFEFE]">
                {item.title}
              </h3>
              <p className="text-[#FEFEFE] text-[14px]">{item.desc}</p>
              <Image
                src={item.imgUrl}
                alt={item.title}
                fill
                className="object-contain transform-gpu perspective-distant rotate-x-55 -rotate-z-50 scale-120 origin-center translate-x-0 translate-y-36"
              />
            </motion.div>
          ))}
        </div>
        <div className="w-full relative hidden md:flex -mt-6">
          <Image
            src={"/images/arrow-2.png"}
            alt="arrow"
            width={180}
            height={85}
            className="absolute right-80"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
