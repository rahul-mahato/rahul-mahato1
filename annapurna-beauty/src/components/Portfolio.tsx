"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import SectionHeading from "./SectionHeading";

const portfolioItems = [
  {
    title: "Bridal Elegance",
    category: "Bridal",
    color: "from-[#F5EDE0] to-[#E8DDD0]",
    accent: "#C5A059",
  },
  {
    title: "Modern Colour",
    category: "Hair",
    color: "from-[#EDE5F0] to-[#E0D8E5]",
    accent: "#9B8AA0",
  },
  {
    title: "Luminous Skin",
    category: "Skin Care",
    color: "from-[#E5EDE8] to-[#D8E5DD]",
    accent: "#7A9B85",
  },
  {
    title: "Evening Glamour",
    category: "Makeup",
    color: "from-[#F0EDE5] to-[#E5E0D8]",
    accent: "#B5A070",
  },
  {
    title: "Precision Styling",
    category: "Hair",
    color: "from-[#E8E5F0] to-[#DDD8E5]",
    accent: "#8580A0",
  },
  {
    title: "Natural Radiance",
    category: "Skin Care",
    color: "from-[#F0E8E5] to-[#E5DDD8]",
    accent: "#A08575",
  },
];

function PortfolioItem({
  item,
  index,
}: {
  item: (typeof portfolioItems)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7],
    [
      "inset(100% 0% 0% 0%)",
      "inset(0% 0% 0% 0%)",
      "inset(0% 0% 0% 0%)",
    ]
  );

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-2xl aspect-[4/5] group cursor-pointer"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Background with parallax */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-b ${item.color}`}
        style={{ y: imageY, clipPath, scale: 1.15 }}
      />

      {/* Decorative circles */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-700">
        <svg viewBox="0 0 200 200" className="w-3/4 h-3/4">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={item.accent}
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke={item.accent}
            strokeWidth="0.3"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke={item.accent}
            strokeWidth="0.3"
          />
        </svg>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <p className="text-white/70 text-xs tracking-[0.2em] uppercase mb-1">
          {item.category}
        </p>
        <h3 className="font-[family-name:var(--font-playfair)] text-white text-xl">
          {item.title}
        </h3>
      </div>

      {/* Static label */}
      <div className="absolute bottom-6 left-6 group-hover:opacity-0 transition-opacity duration-300">
        <p
          className="text-xs tracking-[0.15em] uppercase"
          style={{ color: item.accent }}
        >
          {item.category}
        </p>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 md:py-32 px-6 bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          subtitle="Our Work"
          title="Portfolio"
          description="A curated showcase of transformations that speak to our commitment to artistry and excellence."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
            <PortfolioItem key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
