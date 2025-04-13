import { Marquee } from "@/components/marquee"
import { partnersAndImages } from "@/constants/images"

export function PartnersSection() {


  return (
    <section className="py-16">
      <Marquee pauseOnHover speed={30}>
        {partnersAndImages.map((partner) => (
          <div key={partner.name} className="flex items-center justify-center w-48 h-16">
            <img
              src={partner.logoUrl} 
              alt={partner.name}
              width={partner.width}
              height={40}
              className="opacity-50 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </Marquee>
    </section>
  )
}
