"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StaggeredText from "./StaggeredText";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Back layer - marble/silk texture */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <div
          className="w-full h-[120%] bg-gradient-to-br from-[#F5F0EB] via-[#FAF7F4] to-[#EDE7E0]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 30% 20%, rgba(197, 160, 89, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(197, 160, 89, 0.05) 0%, transparent 50%),
              linear-gradient(135deg, #F5F0EB 0%, #FAF7F4 50%, #EDE7E0 100%)
            `,
          }}
        />
        {/* Marble veining effect */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0,400 Q300,350 600,420 T1200,380"
            fill="none"
            stroke="#C5A059"
            strokeWidth="1.5"
          />
          <path
            d="M0,200 Q400,180 800,220 T1200,200"
            fill="none"
            stroke="#8B7355"
            strokeWidth="1"
          />
          <path
            d="M0,600 Q350,580 700,610 T1200,590"
            fill="none"
            stroke="#C5A059"
            strokeWidth="0.8"
          />
        </svg>
      </motion.div>

      {/* Middle layer - decorative element */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center"
        style={{ y: midY }}
      >
        <div className="absolute right-[-5%] top-[10%] w-[50vw] h-[80vh] opacity-[0.08]">
          <svg viewBox="0 0 500 600" className="w-full h-full">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="#8B6914" />
              </linearGradient>
            </defs>
            <circle cx="250" cy="250" r="200" fill="none" stroke="url(#goldGrad)" strokeWidth="0.5" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="url(#goldGrad)" strokeWidth="0.3" />
            <circle cx="250" cy="250" r="120" fill="none" stroke="url(#goldGrad)" strokeWidth="0.3" />
            <path d="M250,50 L250,450" stroke="url(#goldGrad)" strokeWidth="0.3" />
            <path d="M50,250 L450,250" stroke="url(#goldGrad)" strokeWidth="0.3" />
          </svg>
        </div>
      </motion.div>

      {/* Front layer - Glass card with CTA */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center px-6"
        style={{ y: fgY }}
      >
        <motion.div
          className="glass rounded-3xl p-10 md:p-16 max-w-2xl text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.p
            className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-6 font-[family-name:var(--font-inter)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Annapurna Beauty Parlour
          </motion.p>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl text-[#3A3A3A] leading-tight mb-6">
            <StaggeredText text="Enhance Your" delay={0.8} />
            <br />
            <StaggeredText text="Natural Beauty" delay={1.2} />
          </h1>

          <motion.p
            className="text-[#6B6B6B] text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto font-[family-name:var(--font-inter)]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            Where sophistication meets self-care. Premium beauty services
            crafted for the discerning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            <button
              onClick={() =>
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-ghost"
            >
              Book Appointment
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#9B9B9B] font-[family-name:var(--font-inter)]">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-8 bg-[#C5A059]/40"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
