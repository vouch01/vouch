import { buildForCards } from "@/constants/buildfor";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

const BuildFor = () => {
  return (
    <section id="security" className="py-20 px-4 md:px-16 border-t border-border">
      <div className="px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold tracking-wider text-xs uppercase mb-3 block">
            Build For
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground w-full">
            Trusted by both sides of the transaction
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 w-full">
          {buildForCards.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`w-full text-center p-8 rounded-2xl border border-${item.accent}/80 bg-${item.accent}/10`}
            >
              <div className="flex flex-col md:flex-row w-full relative">
                <div className="flex w-full md:w-[60%] flex-col gap-8 border-r border-[#DDDDDE] pr-2">
                  <div className="flex gap-3 w-full">
                    <span
                      className={`bg-${item.accent} text-white h-12 w-12 flex justify-center items-center rounded-[6px]`}
                    >
                      {<item.icon size={24} />}
                    </span>
                    <div className="flex flex-col items-start w-[88%]">
                      <h3 className="text-[#1F1F1F] font-medium text-[16px]">
                        {item.title}
                      </h3>
                      <p className="text-start text-[#565656] text-[12px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    {item.points.map((point, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className={`flex justify-center items-center text-${item.accent}`}>
                          <Check size={16}/>
                        </span>
                        <p className="text-[14px] font-normal text-[#565656]">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={"h-67.5 w-full md:w-[40%] scale-x-100"}>
                  <Image 
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-[40%_top]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildFor;
