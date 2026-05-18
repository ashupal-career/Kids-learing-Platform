import { motion } from 'framer-motion';

// Simple fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

// Fade in from bottom
export const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Scale effect on hover
export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

// Stagger children (cards appear one by one)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Bounce animation (for stars)
export const bounce = {
  animate: { 
    y: [0, -10, 0],
    transition: { 
      repeat: Infinity, 
      duration: 1,
      ease: "easeInOut"
    }
  }
};

// Rotate animation (for loading)
export const rotate = {
  animate: { 
    rotate: 360,
    transition: { 
      repeat: Infinity, 
      duration: 2,
      ease: "linear"
    }
  }
};

export { motion };