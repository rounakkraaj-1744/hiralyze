"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, FileText, Target, MessageSquare, BarChart3, ArrowRight, CheckCircle, Zap, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import { HeroHiringWorkflow } from "@/components/animated-svgs/hero-hiring-workflow"
import { HiringAnimation } from "@/components/animated-svgs/hiring-animation"
import { useRouter } from "next/navigation"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const features = [
  {
    icon: FileText,
    title: "AI Resume Parsing",
    description: "Extract and analyze candidate data from resumes with 99% accuracy using advanced NLP.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Target,
    title: "Skill-Based Matching",
    description: "Match candidates to roles based on skills, experience, and cultural fit using ML algorithms.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot Interviews",
    description: "Conduct preliminary interviews with intelligent chatbots that understand context.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Get deep insights into your hiring pipeline with real-time analytics and predictions.",
    color: "from-emerald-600 to-green-600",
  },
]

const steps = [
  {
    number: "01",
    title: "Upload Resumes",
    description: "Bulk upload resumes or integrate with job boards for automatic collection.",
    icon: FileText,
  },
  {
    number: "02",
    title: "AI Scores & Ranks",
    description: "Our AI analyzes and scores candidates based on job requirements and company culture.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Hire the Best",
    description: "Review top candidates with detailed insights and make data-driven hiring decisions.",
    icon: Users,
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Talent",
    company: "TechFlow Inc.",
    content: "Hiralyze reduced our time-to-hire by 60% while improving candidate quality significantly.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Marcus Rodriguez",
    role: "HR Director",
    company: "InnovateCorp",
    content: "The AI-powered matching is incredibly accurate. We've never had better hiring outcomes.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Emily Watson",
    role: "Recruitment Lead",
    company: "StartupXYZ",
    content: "Game-changer for our startup. We can now compete with big companies for top talent.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const companies = ["TechFlow", "InnovateCorp", "StartupXYZ", "DataDriven", "CloudFirst", "AIVentures"]

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const router = useRouter ()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Hiralyze
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">
              How it Works
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Testimonials
            </Link>
            <Button onClick={()=>{router.push("/")}} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center" style={{ y, opacity }}>
          <motion.div className="space-y-8" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={fadeInUp}>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Recruitment
              </Badge>
            </motion.div>

            <motion.h1 className="text-5xl lg:text-7xl font-bold leading-tight" variants={fadeInUp}>
              <span className="bg-gradient-to-r from-gray-900 via-emerald-800 to-green-800 bg-clip-text text-transparent">
                Smarter Hiring
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Starts with AI
              </span>
            </motion.h1>

            <motion.p className="text-xl text-gray-600 leading-relaxed max-w-2xl" variants={fadeInUp}>
              Automate recruitment with AI-powered resume parsing, intelligent candidate scoring, and streamlined
              shortlisting. Transform your hiring process in minutes, not months.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
              <Button onClick={()=>{router.push("/main")}} size="lg"
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg px-8 py-6 group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div className="flex items-center space-x-6 pt-8" variants={fadeInUp}>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-600">Free forever plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-600">No credit card required</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Hero SVG Animation */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-3xl p-8 backdrop-blur-sm border border-emerald-100/50">
              <HiringAnimation/>
              {/* Floating Action Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-6 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                animate={{
                  x: [0, 10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Users className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Revolutionize Your
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {" "}
                Hiring Process
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leverage cutting-edge AI technology to streamline recruitment, improve candidate quality, and make
              data-driven hiring decisions.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <motion.div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How Hiralyze
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {" "}
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our intuitive three-step process that transforms your hiring workflow.
            </p>
          </motion.div>

          <HeroHiringWorkflow />

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-green-300 to-emerald-200 transform -translate-y-1/2"></div>

            <motion.div
              className="grid lg:grid-cols-3 gap-12 relative z-10"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {steps.map((step, index) => (
                <motion.div key={step.number} className="text-center" variants={fadeInUp}>
                  <motion.div
                    className="relative mb-6 mx-auto w-20 h-20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center text-sm font-bold text-emerald-600">
                      {step.number}
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Hiralyze</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered recruitment platform that transforms how companies hire top talent.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 Hiralyze. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
