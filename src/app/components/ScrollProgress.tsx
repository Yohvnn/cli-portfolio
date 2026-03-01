import { motion, useScroll, useSpring } from "motion/react";

/**
 * A minimal horizontal progress bar fixed at the top of the viewport.
 * Fills from left to right as the user scrolls — replaces the native scrollbar.
 * Uses the accent color and a 1px height for a stark, utilitarian feel.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  /* spring for a smooth, slightly tactile feel */
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-accent origin-left"
    />
  );
}
