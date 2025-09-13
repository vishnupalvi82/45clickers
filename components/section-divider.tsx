"use client"

import { motion } from "framer-motion"

interface SectionDividerProps {
  variant?: "wave" | "diagonal" | "curve"
  color?: "purple" | "blue" | "cyan"
}

export default function SectionDivider({ variant = "wave", color = "purple" }: SectionDividerProps) {
  const colorClasses = {
    purple: "fill-purple-500/20",
    blue: "fill-blue-500/20",
    cyan: "fill-cyan-500/20",
  }

  const waveVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  }

  if (variant === "wave") {
    return (
      <div className="relative h-24 overflow-hidden">
        <motion.svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.path
            variants={waveVariants}
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className={colorClasses[color]}
          />
        </motion.svg>
      </div>
    )
  }

  if (variant === "diagonal") {
    return (
      <div className="relative h-16 overflow-hidden">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r from-${color}-500/20 to-transparent transform -skew-y-1`}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
    )
  }

  return (
    <div className="relative h-20 overflow-hidden">
      <motion.svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.path
          variants={waveVariants}
          d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
          className={colorClasses[color]}
        />
      </motion.svg>
    </div>
  )
}
