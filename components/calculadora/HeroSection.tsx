// components/mortgage/HeroSection.tsx

"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  const scrollToForm = () => {
    const form = document.getElementById("mortgage-form");
    if (form) form.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="text-center py-20 md:py-32">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Calcula tu hipoteca en <span className="text-primary">España</span> <br />
        con claridad y visualización total
      </motion.h1>

      <motion.p
        className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Simula tu cuota mensual, esfuerzo financiero y evolución de la deuda con una experiencia visual única.
      </motion.p>

      <motion.button
        onClick={scrollToForm}
        className="cursor-pointer mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white bg-primary hover:bg-primary/90 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Empezar simulación <ArrowDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
}
