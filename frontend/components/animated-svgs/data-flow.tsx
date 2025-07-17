"use client"

import { motion } from "framer-motion"

export function DataFlowAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg viewBox="0 0 1200 800" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Flowing Data Streams */}
        {[...Array(6)].map((_, i) => (
          <motion.g key={i}>
            <motion.path
              d={`M${-100 + i * 200} ${100 + i * 80} Q${400 + i * 100} ${200 + i * 60} ${800 + i * 150} ${150 + i * 90}`}
              stroke="url(#flowGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="20,10"
              animate={{
                strokeDashoffset: [0, -60],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 0.3,
              }}
            />

            {/* Data Points */}
            <motion.circle
              cx={200 + i * 150}
              cy={150 + i * 70}
              r="4"
              fill="#10B981"
              opacity="0.7"
              animate={{
                scale: [0.5, 1.2, 0.5],
                opacity: [0.3, 0.9, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
              }}
            />
          </motion.g>
        ))}

        {/* Floating Binary Code */}
        {[...Array(12)].map((_, i) => (
          <motion.text
            key={i}
            x={100 + (i % 4) * 300}
            y={200 + Math.floor(i / 4) * 200}
            fontSize="12"
            fill="#10B981"
            opacity="0.4"
            fontFamily="monospace"
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            {Math.random() > 0.5 ? "1010" : "0101"}
          </motion.text>
        ))}

        {/* Network Nodes */}
        {[
          { x: 200, y: 300 },
          { x: 600, y: 200 },
          { x: 1000, y: 400 },
          { x: 400, y: 500 },
          { x: 800, y: 600 },
        ].map((node, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill="#15803D"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.6,
              }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill="none"
              stroke="#10B981"
              strokeWidth="1"
              opacity="0.3"
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
              }}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  )
}
