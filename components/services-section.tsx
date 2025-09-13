"use client"

import { motion } from "framer-motion"
import { Code, Brush, Rocket } from "lucide-react"

export default function ServicesSection() {
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

  const services = [
    {
      icon: <Code className="h-10 w-10 text-purple-500" />,
      title: "YouTube Video Editing",
      description: "Engaging and dynamic edits for your YouTube content.",
    },
    {
      icon: <Brush className="h-10 w-10 text-blue-500" />,
      title: "Social Media Reels",
      description: "Eye-catching reels to boost your social media presence.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-cyan-500" />,
      title: "Branded Content",
      description: "Professional video editing for your brand's story.",
    },
  ]

  return (
    <motion.section
      id="services"
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
            Our{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We offer a range of video editing services to meet your needs.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:translate-y-[-5px]"
            >
              <div className="mb-4">{service.icon}</div>
              <h4 className="text-xl font-bold mb-2">{service.title}</h4>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
