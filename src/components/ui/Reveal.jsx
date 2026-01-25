import React from 'react';
import { motion } from 'framer-motion';

export const Reveal = ({ children, width = "100%", delay = 0 }) => {
  return (
    <motion.div
      style={{ width, position: 'relative' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }} // Triggers when 10% of element is visible
      transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }} // "Elegance" bezier curve
    >
      {children}
    </motion.div>
  );
};