import Image from "next/image";
import { LOCAL_IMAGES } from "@/lib/constants";

export function HomeBrandSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/15">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="relative h-64 lg:h-96 min-h-[280px]">
              <Image
                src={LOCAL_IMAGES.events[0]}
                alt="BMW Club Uganda event"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/40 lg:to-background/20" />
            </div>
            <div className="p-8 lg:p-12">
              <div className="relative w-20 h-20 mb-6 rounded-full overflow-hidden border border-white/20">
                <Image
                  src={LOCAL_IMAGES.logo}
                  alt="BMW Club Uganda"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold">
                Built for <span className="text-bmw-blue-light">BMW</span> enthusiasts in{" "}
                <span className="text-bmw-red">Uganda</span>
              </h2>
              <p className="mt-4 text-white/65 leading-relaxed">
                From Kampala meetups to cross-country drives, BMW Club Uganda brings together
                owners, partners, and passionate drivers who live the ultimate driving machine lifestyle.
              </p>
              <div className="bmw-m-stripe h-1 w-full max-w-xs mt-8 rounded-full opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
