"use client"

import { motion } from "framer-motion"
import { Film, Sparkles, Clock } from "lucide-react"

export default function AboutSection() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const slideInLeft = {
    hidden: { opacity: 0, x: -100, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 100, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-purple-500" />,
      title: "Creative Storytelling",
      description: "We craft compelling narratives that engage and captivate your audience.",
    },
    {
      icon: <Film className="h-10 w-10 text-blue-500" />,
      title: "Precision Editing",
      description: "Meticulous attention to detail ensures every frame is perfectly crafted.",
    },
    {
      icon: <Clock className="h-10 w-10 text-cyan-500" />,
      title: "Fast Delivery",
      description: "Quick turnaround times without compromising on quality.",
    },
  ]

  const stats = [
    { value: "4+", label: "Years Experience" },
    { value: "100+", label: "Projects Completed" },
    { value: "50+", label: "Happy Clients" },
    { value: "24/7", label: "Support" },
  ]

  return (
    <motion.section
      id="about"
      className="py-20 relative"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-200px" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              45Clickers
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={slideInLeft} className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 z-10"></div>
              <img src="/images/team-45clickers.jpg" alt="45Clickers Team" className="w-full h-full object-cover" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          </motion.div>

          <motion.div variants={slideInRight} className="space-y-6">
            <motion.h3 variants={fadeInUp} className="text-2xl md:text-3xl font-bold">
              A passionate group of editors delivering{" "}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                cinematic visuals
              </span>
            </motion.h3>

            <motion.p variants={fadeInUp} className="text-gray-300">
              45Clickers is a dedicated team of video editors, motion designers, and storytellers specializing in
              YouTube content, reels, and branded stories. With 4+ years of experience and 100+ successful projects, we
              turn vision into reality.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:translate-y-[-5px]"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-gray-900/30 border border-gray-800">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
