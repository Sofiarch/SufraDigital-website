import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric({
  // Removed badge prop default
  title1 = "Elevate",
  title2 = "Your Brand",
  desc = "Your description goes here.",
  cta = "Get Started",
  onContact,
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden min-h-[80vh]" style={{ backgroundColor: "#ebe3c6" }}>
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ebe3c6] via-[#ebe3c6] to-[#dcd4b8] blur-3xl opacity-80" />

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-[#3c3728]/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-[#3c3728]/[0.10]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-[#3c3728]/[0.10]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-10">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Badge Removed Here */}

          {/* Title */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-5xl md:text-8xl font-bold mb-6 md:mb-8 leading-normal py-4 px-2">
              
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#3c3728] to-[#3c3728]/80 italic inline-block pr-4 pb-4">
                {title1}
              </span>
              <br />
              <span className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-[#3c3728] via-[#5c5643] to-[#3c3728] inline-block py-1 pr-2 pb-4"
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          {/* Description & Button */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-xl md:text-2xl mb-12 opacity-80 max-w-2xl mx-auto font-light leading-relaxed text-[#3c3728]">
              {desc}
            </p>

            <button 
              onClick={onContact} 
              className="px-12 py-4 text-lg border-2 transition-all duration-300 font-bold hover:bg-[#3c3728] hover:text-[#ebe3c6] text-[#3c3728] border-[#3c3728]"
            >
              {cta}
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export { HeroGeometric };