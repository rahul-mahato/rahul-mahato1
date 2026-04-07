"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "./SectionHeading";

const services = [
  {
    title: "Hair Styling",
    description:
      "From precision cuts to transformative colour, our stylists craft looks that reflect your individuality with timeless elegance.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path
          d="M24 4C18 4 14 10 14 16C14 22 18 26 24 26C30 26 34 22 34 16C34 10 30 4 24 4Z"
          stroke="#C5A059"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M20 26L16 44" stroke="#C5A059" strokeWidth="1.5" />
        <path d="M28 26L32 44" stroke="#C5A059" strokeWidth="1.5" />
        <circle cx="16" cy="44" r="2" fill="#C5A059" />
        <circle cx="32" cy="44" r="2" fill="#C5A059" />
      </svg>
    ),
    features: ["Precision Cuts", "Balayage & Highlights", "Keratin Treatments", "Blow Dry Bar"],
  },
  {
    title: "Skin Care",
    description:
      "Advanced facial therapies and treatments that restore your skin's natural radiance, leaving you luminous and refreshed.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="20" r="14" stroke="#C5A059" strokeWidth="1.5" fill="none" />
        <path d="M24 6V8" stroke="#C5A059" strokeWidth="1.5" />
        <path d="M24 32V34" stroke="#C5A059" strokeWidth="1.5" />
        <path d="M10 20H12" stroke="#C5A059" strokeWidth="1.5" />
        <path d="M36 20H38" stroke="#C5A059" strokeWidth="1.5" />
        <circle cx="24" cy="20" r="6" stroke="#C5A059" strokeWidth="1" fill="none" />
        <path d="M18 38L24 44L30 38" stroke="#C5A059" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    features: ["HydraFacial", "Chemical Peels", "Microdermabrasion", "LED Light Therapy"],
  },
  {
    title: "Bridal",
    description:
      "Your most important day deserves perfection. Our bridal packages ensure you look breathtaking from ceremony to celebration.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path
          d="M24 4L28 16H36L30 24L32 36L24 30L16 36L18 24L12 16H20L24 4Z"
          stroke="#C5A059"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M16 40H32" stroke="#C5A059" strokeWidth="1.5" />
        <path d="M18 44H30" stroke="#C5A059" strokeWidth="1.5" />
      </svg>
    ),
    features: ["Bridal Makeup", "Pre-Wedding Packages", "Mehendi", "Hair Styling"],
  },
  {
    title: "Makeup",
    description:
      "From subtle day looks to dramatic evening artistry, our makeup artists enhance your features with flawless technique.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="18" y="4" width="12" height="32" rx="6" stroke="#C5A059" strokeWidth="1.5" fill="none" />
        <path d="M18 30H30" stroke="#C5A059" strokeWidth="1" />
        <path d="M22 36V44" stroke="#C5A059" strokeWidth="1.5" />
        <path d="M26 36V44" stroke="#C5A059" strokeWidth="1.5" />
        <path d="M18 44H30" stroke="#C5A059" strokeWidth="1.5" />
        <circle cx="24" cy="16" r="3" stroke="#C5A059" strokeWidth="1" fill="none" />
      </svg>
    ),
    features: ["Party Makeup", "Editorial Looks", "Airbrush Makeup", "Lash Extensions"],
  },
  {
    title: "Nail Art",
    description:
      "Exquisite nail artistry and luxurious manicure treatments that bring elegance to your fingertips.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path
          d="M16 8C16 8 14 20 14 28C14 36 18 40 24 40C30 40 34 36 34 28C34 20 32 8 32 8"
          stroke="#C5A059"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M16 8H32" stroke="#C5A059" strokeWidth="1.5" />
        <path d="M18 20H30" stroke="#C5A059" strokeWidth="1" />
      </svg>
    ),
    features: ["Gel Extensions", "Nail Art", "Luxury Manicure", "Spa Pedicure"],
  },
  {
    title: "Spa & Wellness",
    description:
      "Indulge in restorative body treatments designed to relax, rejuvenate, and renew your sense of well-being.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path
          d="M24 8C20 14 12 18 12 26C12 34 17 40 24 40C31 40 36 34 36 26C36 18 28 14 24 8Z"
          stroke="#C5A059"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M24 24V34" stroke="#C5A059" strokeWidth="1" />
        <path d="M20 28L24 24L28 28" stroke="#C5A059" strokeWidth="1" fill="none" />
      </svg>
    ),
    features: ["Deep Tissue Massage", "Aromatherapy", "Body Wraps", "Steam & Sauna"],
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={`glass glow-border rounded-2xl p-8 cursor-default transition-all duration-500 hover:scale-[1.03] ${
        isInView ? "in-view" : ""
      }`}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.setProperty("-webkit-backdrop-filter", "blur(40px)");
        el.style.backdropFilter = "blur(40px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.setProperty("-webkit-backdrop-filter", "blur(20px)");
        el.style.backdropFilter = "blur(20px)";
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="mb-6">{service.icon}</div>
      <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#3A3A3A] mb-3">
        {service.title}
      </h3>
      <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6">
        {service.description}
      </p>
      <ul className="space-y-2">
        {service.features.map((feature) => (
          <li
            key={feature}
            className="text-xs text-[#8B8B8B] flex items-center gap-2"
          >
            <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          subtitle="What We Offer"
          title="Our Services"
          description="Each treatment is thoughtfully designed to enhance your natural beauty with precision, care, and an unwavering attention to detail."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
