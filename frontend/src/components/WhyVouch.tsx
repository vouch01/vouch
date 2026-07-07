import { whys } from "@/constants/why-vouch"
import Image from "next/image";


const WhyVouch = () => {
  return (
    <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-bold tracking-wider text-xs uppercase mb-3 block">Why Vouch</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Built to Protect Every Transaction</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whys.map((feature, i) => (
                <div key={i} className="flex flex-col items-center bg-[#FEFEFE] gap-4 p-6 rounded-xl">
                  <div className="flex items-center justify-center text-primary">
                    <Image alt={feature.title} src={feature.Icon} width={123} height={124} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
  )
}

export default WhyVouch
