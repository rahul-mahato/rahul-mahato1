"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const quickLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Testimonials", href: "#testimonials" },
];

const serviceLinks = [
  "Hair Styling",
  "Skin Care",
  "Bridal Packages",
  "Makeup Artistry",
  "Nail Art",
  "Spa & Wellness",
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="contact" ref={ref} className="bg-[#F0EDE8] pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#3A3A3A] mb-4">
              Annapurna
            </h3>
            <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6">
              Where sophistication meets self-care. Premium beauty services
              crafted with love and precision.
            </p>
            <div className="flex gap-4">
              {/* Social icons */}
              {["Instagram", "Facebook", "WhatsApp"].map((social) => (
                <div
                  key={social}
                  className="w-9 h-9 rounded-full border border-[#C5A059]/30 flex items-center justify-center cursor-pointer hover:bg-[#C5A059]/10 transition-colors duration-300"
                >
                  <span className="text-[#C5A059] text-[10px]">
                    {social[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#3A3A3A] text-xs tracking-[0.2em] uppercase mb-6 font-medium">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-[#6B6B6B] text-sm hover:text-[#C5A059] transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#3A3A3A] text-xs tracking-[0.2em] uppercase mb-6 font-medium">
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <span className="text-[#6B6B6B] text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Map */}
          <div>
            <h4 className="text-[#3A3A3A] text-xs tracking-[0.2em] uppercase mb-6 font-medium">
              Visit Us
            </h4>
            <div className="space-y-4 text-sm text-[#6B6B6B]">
              <p>
                Shakti Nagar Colony
                <br />
                Annapurna Beauty Parlour
              </p>
              <p>
                Mon – Sat: 10:00 AM – 8:00 PM
                <br />
                Sunday: By Appointment
              </p>
            </div>

            {/* Google Map embed */}
            <div className="mt-6 rounded-xl overflow-hidden border border-white/50">
              <iframe
                title="Annapurna Beauty Parlour Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.0!2d0.0!3d0.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sShakti+Nagar+Colony!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-[1px] bg-[#C5A059]/10 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#9B9B9B] text-xs">
            &copy; {new Date().getFullYear()} Annapurna Beauty Parlour. All
            rights reserved.
          </p>
          <p className="text-[#9B9B9B] text-xs">
            Crafted with care in Shakti Nagar Colony
          </p>
        </div>
      </div>
    </footer>
  );
}
