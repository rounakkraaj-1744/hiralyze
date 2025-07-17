"use client"

import { motion } from "framer-motion"

export function HiringAnimation() {
  return (
    <div className="relative w-full h-96">
      <svg viewBox="0 0 800 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Background Elements */}
        <defs>
          <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#15803D" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="personGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>
        </defs>

        {/* Floating Data Points */}
        <motion.g
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <circle cx="150" cy="100" r="4" fill="#10B981" opacity="0.7" />
          <circle cx="680" cy="150" r="3" fill="#15803D" opacity="0.8" />
          <circle cx="120" cy="200" r="2" fill="#059669" opacity="0.6" />
        </motion.g>

        {/* Person with Laptop */}
        <g transform="translate(300, 200)">
          {/* Desk */}
          <motion.rect
            x="0"
            y="150"
            width="200"
            height="8"
            rx="4"
            fill="#D1D5DB"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          {/* Person Body */}
          <motion.g
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Head */}
            <circle cx="100" cy="50" r="25" fill="url(#personGradient)" />

            {/* Body */}
            <rect x="80" y="75" width="40" height="60" rx="20" fill="url(#personGradient)" />

            {/* Arms */}
            <motion.rect
              x="60"
              y="85"
              width="15"
              height="40"
              rx="7"
              fill="url(#personGradient)"
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              style={{ transformOrigin: "67px 85px" }}
            />
            <motion.rect
              x="125"
              y="85"
              width="15"
              height="40"
              rx="7"
              fill="url(#personGradient)"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              style={{ transformOrigin: "132px 85px" }}
            />
          </motion.g>

          {/* Laptop */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {/* Laptop Base */}
            <rect x="50" y="140" width="100" height="15" rx="5" fill="#374151" />

            {/* Laptop Screen */}
            <rect x="55" y="80" width="90" height="65" rx="5" fill="#1F2937" />
            <rect x="60" y="85" width="80" height="50" rx="3" fill="url(#screenGlow)" />

            {/* Screen Content - Animated */}
            <motion.g
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {/* Fake UI Elements */}
              <rect x="65" y="90" width="70" height="3" rx="1" fill="white" opacity="0.8" />
              <rect x="65" y="98" width="50" height="2" rx="1" fill="white" opacity="0.6" />
              <rect x="65" y="105" width="60" height="2" rx="1" fill="white" opacity="0.6" />

              {/* Candidate Cards */}
              <rect x="65" y="115" width="25" height="15" rx="2" fill="white" opacity="0.3" />
              <rect x="95" y="115" width="25" height="15" rx="2" fill="white" opacity="0.3" />
              <rect x="125" y="115" width="25" height="15" rx="2" fill="white" opacity="0.3" />
            </motion.g>
          </motion.g>
        </g>

        {/* Floating Resume Icons */}
        <motion.g
          animate={{
            x: [0, 15, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <rect x="100" y="300" width="30" height="40" rx="3" fill="#10B981" opacity="0.7" />
          <rect x="105" y="310" width="20" height="2" rx="1" fill="white" />
          <rect x="105" y="315" width="15" height="1" rx="0.5" fill="white" />
          <rect x="105" y="320" width="18" height="1" rx="0.5" fill="white" />
        </motion.g>

        <motion.g
          animate={{
            x: [0, -12, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <rect x="650" y="350" width="30" height="40" rx="3" fill="#15803D" opacity="0.7" />
          <rect x="655" y="360" width="20" height="2" rx="1" fill="white" />
          <rect x="655" y="365" width="15" height="1" rx="0.5" fill="white" />
          <rect x="655" y="370" width="18" height="1" rx="0.5" fill="white" />
        </motion.g>

        {/* AI Brain Network */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
          {/* Network Nodes */}
          <motion.circle
            cx="200"
            cy="450"
            r="6"
            fill="#10B981"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.circle
            cx="280"
            cy="480"
            r="4"
            fill="#15803D"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          />
          <motion.circle
            cx="350"
            cy="460"
            r="5"
            fill="#059669"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />

          {/* Connecting Lines */}
          <motion.line
            x1="200"
            y1="450"
            x2="280"
            y2="480"
            stroke="#10B981"
            strokeWidth="2"
            opacity="0.6"
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.line
            x1="280"
            y1="480"
            x2="350"
            y2="460"
            stroke="#15803D"
            strokeWidth="2"
            opacity="0.6"
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />
        </motion.g>

        {/* Floating Checkmarks */}
        <motion.g
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <circle cx="600" cy="250" r="15" fill="#10B981" opacity="0.8" />
          <motion.path
            d="M595 250 L600 255 L605 245"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          />
        </motion.g>

        {/* Data Flow Lines */}
        <motion.g opacity="0.4">
          <motion.path
            d="M150 350 Q400 300 650 380"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.path
            d="M100 400 Q400 450 700 420"
            stroke="#15803D"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3,3"
            animate={{ strokeDashoffset: [0, -15] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </motion.g>
      </svg>
    </div>
  )
}
