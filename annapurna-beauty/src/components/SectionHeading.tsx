"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const words = title.split(" ");

  return (
    <div ref={ref} className="text-center mb-16 md:mb-20">
      <motion.p
        className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-4 font-[family-name:var(--font-inter)]"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {subtitle}
      </motion.p>
      <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl text-[#3A3A3A] mb-6">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block mr-[0.3em]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.2 + i * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        ))}
      </h2>
      {description && (
        <motion.p
          className="text-[#6B6B6B] text-base md:text-lg max-w-xl mx-auto leading-relaxed font-[family-name:var(--font-inter)]"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
