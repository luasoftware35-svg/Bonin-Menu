export const easeOut = [0.22, 1, 0.36, 1] as const;

export const springSnappy = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
};

export const springSoft = {
  type: "spring" as const,
  stiffness: 320,
  damping: 30,
};

export function fadeUp(reduced: boolean | null, delay = 0) {
  if (reduced) {
    return {
      initial: false as const,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: easeOut },
  };
}
