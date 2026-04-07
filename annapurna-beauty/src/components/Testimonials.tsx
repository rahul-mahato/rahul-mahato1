"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "./SectionHeading";

const testimonials = [
  {
    name: "Priya Sharma",
    service: "Bridal Package",
    text: "Annapurna made my wedding day absolutely perfect. The attention to detail in my bridal makeup was extraordinary—I felt like the most beautiful version of myself.",
    initials: "PS",
  },
  {
    name: "Ritu Verma",
    service: "Hair Styling",
    text: "I've been coming here for over two years now. The stylists truly understand my hair and always deliver results that exceed my expectations. It's my sanctuary.",
    initials: "RV",
  },
  {
    name: "Anita Gupta",
    service: "Skin Care",
    text: "The HydraFacial treatment completely transformed my skin. The team is knowledgeable, gentle, and the environment is so calming. A truly premium experience.",
    initials: "AG",
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="glass rounded-2xl p-8 md:p-10"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Quote mark */}
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8 mb-6 opacity-20"
        fill="#C5A059"
      >
        <path d="M0 20.8V32h11.2V20.8H6.4C6.4 15.2 9.6 12.8 14.4 12.8V4C6.4 4 0 9.6 0 20.8zm17.6 0V32h11.2V20.8h-4.8C24 15.2 27.2 12.8 32 12.8V4C24 4 17.6 9.6 17.6 20.8z" />
      </svg>

      <p className="text-[#5A5A5A] text-sm md:text-base leading-relaxed mb-8 italic font-[family-name:var(--font-inter)]">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 flex items-center justify-center">
          <span className="text-[#C5A059] text-xs font-medium">
            {testimonial.initials}
          </span>
        </div>
        <div>
          <p className="text-[#3A3A3A] text-sm font-medium">
            {testimonial.name}
          </p>
          <p className="text-[#9B9B9B] text-xs">{testimonial.service}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          subtitle="Kind Words"
          title="What Our Clients Say"
          description="The trust our clients place in us is our greatest reward."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
