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

export const overlayFade = {
  duration: 0.15,
  ease: easeOut,
};

export const sheetSlide = {
  duration: 0.22,
  ease: easeOut,
};

export const categorySlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 28 : -28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.24, ease: easeOut },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -28 : 28,
    opacity: 0,
    transition: { duration: 0.18, ease: easeOut },
  }),
};

export const priceStamp = {
  hidden: { scale: 1.16, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 520,
      damping: 20,
      delay: 0.1,
    },
  },
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
