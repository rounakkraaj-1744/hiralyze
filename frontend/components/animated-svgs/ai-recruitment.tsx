"use client"

import { motion } from "framer-motion"

export function AIRecruitmentAnimation() {
  return (
    <div className="relative w-full h-80">
      <svg viewBox="0 0 600 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* AI Brain Center */}
        <motion.g transform="translate(300, 200)">
          {/* Main Brain Circle */}
          <motion.circle
            cx="0"
            cy="0"
            r="40"
            fill="url(#aiGradient)"
            filter="url(#glow)"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Brain Pattern */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <path d="M-20,-10 Q0,-20 20,-10 Q0,0 -20,-10" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
            <path d="M-15,10 Q0,0 15,10 Q0,20 -15,10" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
          </motion.g>

          {/* Pulsing Core */}
          <motion.circle
            cx="0"
            cy="0"
            r="8"
            fill="white"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.g>

        {/* Candidate Profiles Around Brain */}
        {[
          { angle: 0, delay: 0, name: "John", score: "95%" },
          { angle: 72, delay: 0.2, name: "Sarah", score: "88%" },
          { angle: 144, delay: 0.4, name: "Mike", score: "92%" },
          { angle: 216, delay: 0.6, name: "Lisa", score: "85%" },
          { angle: 288, delay: 0.8, name: "Alex", score: "90%" },
        ].map((candidate, index) => {
          const x = 300 + Math.cos((candidate.angle * Math.PI) / 180) * 120
          const y = 200 + Math.sin((candidate.angle * Math.PI) / 180) * 120

          return (
            <motion.g
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: candidate.delay + 1, duration: 0.5 }}
            >
              {/* Connection Line */}
              <motion.line
                x1="300"
                y1="200"
                x2={x}
                y2={y}
                stroke="#10B981"
                strokeWidth="2"
                opacity="0.3"
                strokeDasharray="4,4"
                animate={{ strokeDashoffset: [0, -8] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Candidate Card */}
              <motion.g
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: candidate.delay,
                  ease: "easeInOut",
                }}
              >
                <rect
                  x={x - 25}
                  y={y - 20}
                  width="50"
                  height="40"
                  rx="8"
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />

                {/* Avatar */}
                <circle cx={x} cy={y - 8} r="8" fill="#10B981" />

                {/* Name */}
                <text x={x} y={y + 8} textAnchor="middle" fontSize="8" fill="#374151" fontWeight="600">
                  {candidate.name}
                </text>

                {/* Score */}
                <text x={x} y={y + 16} textAnchor="middle" fontSize="6" fill="#10B981" fontWeight="700">
                  {candidate.score}
                </text>
              </motion.g>
            </motion.g>
          )
        })}

        {/* Floating Data Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={100 + i * 60}
            cy={50 + Math.sin(i) * 30}
            r="2"
            fill="#10B981"
            opacity="0.6"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Resume Icons */}
        <motion.g
          animate={{
            x: [0, 10, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <rect x="50" y="300" width="25" height="35" rx="3" fill="#15803D" opacity="0.8" />
          <rect x="55" y="310" width="15" height="2" rx="1" fill="white" />
          <rect x="55" y="315" width="12" height="1" rx="0.5" fill="white" />
          <rect x="55" y="320" width="10" height="1" rx="0.5" fill="white" />
        </motion.g>

        <motion.g
          animate={{
            x: [0, -8, 0],
            rotate: [0, -2, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <rect x="520" y="320" width="25" height="35" rx="3" fill="#059669" opacity="0.8" />
          <rect x="525" y="330" width="15" height="2" rx="1" fill="white" />
          <rect x="525" y="335" width="12" height="1" rx="0.5" fill="white" />
          <rect x="525" y="340" width="10" height="1" rx="0.5" fill="white" />
        </motion.g>

        {/* Success Indicators */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, duration: 0.5 }}>
          <circle cx="150" cy="100" r="12" fill="#10B981" />
          <motion.path
            d="M145 100 L149 104 L155 96"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 2.5 }}
          />
        </motion.g>

        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, duration: 0.5 }}>
          <circle cx="450" cy="120" r="12" fill="#15803D" />
          <motion.path
            d="M445 120 L449 124 L455 116"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 3 }}
          />
        </motion.g>
      </svg>
    </div>
  )
}
