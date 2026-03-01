import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className = "" }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [60, 0, 0, -60]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className={`min-h-screen flex items-center justify-center px-6 py-24 md:py-32 relative ${className}`}
    >
      {children}
    </motion.section>
  );
}