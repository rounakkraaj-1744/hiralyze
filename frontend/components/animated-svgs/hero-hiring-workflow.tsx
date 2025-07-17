"use client"

import { motion } from "framer-motion"

export function HeroHiringWorkflow() {
  return (
    <div className="relative w-full h-[500px]">
      <svg viewBox="0 0 1000 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aiGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#15803D" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F9FAFB" />
          </linearGradient>
          <filter id="dropShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.1"/>
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Elements */}
        <motion.g opacity="0.1">
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={i}
              cx={50 + (i % 5) * 200}
              cy={50 + Math.floor(i / 5) * 120}
              r="2"
              fill="#10B981"
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.g>

        {/* Main Workflow Container */}
        <g transform="translate(50, 50)">
          
          {/* Step 1: Resume Upload */}
          <motion.g
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Upload Area */}
            <rect
              x="0"
              y="100"
              width="180"
              height="120"
              rx="12"
              fill="url(#cardGradient)"
              stroke="#E5E7EB"
              strokeWidth="2"
              strokeDasharray="8,4"
              filter="url(#dropShadow)"
            />
            
            {/* Upload Icon */}
            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <rect x="70" y="130" width="40" height="50" rx="4" fill="#10B981" opacity="0.8"/>
              <path d="M85 140 L90 135 L95 140" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <line x1="90" y1="135" x2="90" y2="165" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </motion.g>

            {/* Floating Resumes */}
            {[...Array(3)].map((_, i) => (
              <motion.g
                key={i}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                }}
              >
                <rect
                  x={20 + i * 50}
                  y={60 - i * 10}
                  width="25"
                  height="35"
                  rx="3"
                  fill="#15803D"
                  opacity="0.7"
                />
                <rect x={25 + i * 50} y={70 - i * 10} width="15" height="2" rx="1" fill="white"/>
                <rect x={25 + i * 50} y={75 - i * 10} width="12" height="1" rx="0.5" fill="white"/>
                <rect x={25 + i * 50} y={80 - i * 10} width="10" height="1" rx="0.5" fill="white"/>
              </motion.g>
            ))}

            <text x="90" y="250" textAnchor="middle" fontSize="16" fontWeight="600" fill="#374151">
              Upload Resumes
            </text>
            <text x="90" y="270" textAnchor="middle" fontSize="12" fill="#6B7280">
              Bulk upload or drag & drop
            </text>
          </motion.g>

          {/* Arrow 1 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.path
              d="M200 160 L280 160"
              stroke="#10B981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="6,3"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <polygon points="275,155 285,160 275,165" fill="#10B981"/>
          </motion.g>

          {/* Step 2: AI Processing */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* AI Brain Container */}
            <rect
              x="300"
              y="80"
              width="200"
              height="160"
              rx="16"
              fill="url(#cardGradient)"
              stroke="#10B981"
              strokeWidth="2"
              filter="url(#dropShadow)"
            />

            {/* AI Brain */}
            <motion.circle
              cx="400"
              cy="160"
              r="35"
              fill="url(#aiGlow)"
              filter="url(#glow)"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />

            {/* Brain Neural Network */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ transformOrigin: "400px 160px" }}
            >
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const x1 = 400 + Math.cos(angle) * 20;
                const y1 = 160 + Math.sin(angle) * 20;
                const x2 = 400 + Math.cos(angle) * 30;
                const y2 = 160 + Math.sin(angle) * 30;
                
                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.8"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
                  />
                );
              })}
            </motion.g>

            {/* Processing Indicators */}
            <motion.g>
              {["Parsing", "Analyzing", "Scoring"].map((text, i) => (
                <motion.text
                  key={text}
                  x="400"
                  y={110 + i * 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#059669"
                  fontWeight="500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.3 }}
                >
                  {text}...
                </motion.text>
              ))}
            </motion.g>

            {/* Data Streams */}
            {[...Array(6)].map((_, i) => (
              <motion.circle
                key={i}
                cx={320 + i * 20}
                cy={200 + Math.sin(i) * 10}
                r="2"
                fill="#10B981"
                animate={{
                  x: [0, 160, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}

            <text x="400" y="260" textAnchor="middle" fontSize="16" fontWeight="600" fill="#374151">
              AI Processing
            </text>
            <text x="400" y="280" textAnchor="middle" fontSize="12" fill="#6B7280">
              Parse, analyze & score candidates
            </text>
          </motion.g>

          {/* Arrow 2 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <motion.path
              d="M520 160 L600 160"
              stroke="#10B981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="6,3"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <polygon points="595,155 605,160 595,165" fill="#10B981"/>
          </motion.g>

          {/* Step 3: Ranked Results */}
          <motion.g
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {/* Results Container */}
            <rect
              x="620"
              y="60"
              width="220"
              height="200"
              rx="12"
              fill="url(#cardGradient)"
              stroke="#E5E7EB"
              strokeWidth="2"
              filter="url(#dropShadow)"
            />

            {/* Candidate Cards */}
            {[
              { name: "Sarah J.", score: 95, skills: "React, AI/ML", rank: 1 },
              { name: "Mike C.", score: 88, skills: "Python, AWS", rank: 2 },
              { name: "Lisa K.", score: 82, skills: "Vue, Docker", rank: 3 },
            ].map((candidate, i) => (
              <motion.g
                key={candidate.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.3 }}
              >
                {/* Candidate Card */}
                <rect
                  x="635"
                  y={80 + i * 50}
                  width="190"
                  height="40"
                  rx="8"
                  fill="white"
                  stroke={i === 0 ? "#10B981" : "#E5E7EB"}
                  strokeWidth={i === 0 ? "2" : "1"}
                />

                {/* Rank Badge */}
                <circle
                  cx="650"
                  cy={100 + i * 50}
                  r="12"
                  fill={i === 0 ? "#10B981" : i === 1 ? "#F59E0B" : "#6B7280"}
                />
                <text
                  x="650"
                  y={105 + i * 50}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="white"
                >
                  {candidate.rank}
                </text>

                {/* Candidate Info */}
                <text x="670" y={95 + i * 50} fontSize="12" fontWeight="600" fill="#374151">
                  {candidate.name}
                </text>
                <text x="670" y={108 + i * 50} fontSize="10" fill="#6B7280">
                  {candidate.skills}
                </text>

                {/* Score */}
                <text x="810" y={100 + i * 50} textAnchor="end" fontSize="14" fontWeight="700" fill="#10B981">
                  {candidate.score}%
                </text>

                {/* Animated Score Bar */}
                <rect x="670" y={110 + i * 50} width="120" height="4" rx="2" fill="#E5E7EB"/>
                <motion.rect
                  x="670"
                  y={110 + i * 50}
                  width="0"
                  height="4"
                  rx="2"
                  fill="#10B981"
                  animate={{ width: (candidate.score / 100) * 120 }}
                  transition={{ duration: 1, delay: 2.5 + i * 0.3 }}
                />
              </motion.g>
            ))}

            {/* Success Indicators */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 3.5, type: "spring", stiffness: 200 }}
            >
              <circle cx="800" cy="85" r="8" fill="#10B981"/>
              <path d="M796 85 L799 88 L804 81" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </motion.g>

            <text x="730" y="280" textAnchor="middle" fontSize="16" fontWeight="600" fill="#374151">
              Ranked Candidates
            </text>
            <text x="730" y="300" textAnchor="middle" fontSize="12" fill="#6B7280">
              Best matches first
            </text>
          </motion.g>

          {/* Final Arrow to Action */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <motion.path
              d="M730 320 L730 380"
              stroke="#10B981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="6,3"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <polygon points="725,375 730,385 735,375" fill="#10B981"/>
          </motion.g>

          {/* Call to Action */}
          <motion.g
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5 }}
          >
            <rect
              x="630"
              y="400"
              width="200"
              height="60"
              rx="30"
              fill="url(#aiGlow)"
              filter="url(#dropShadow)"
            />
            <text x="730" y="425" textAnchor="middle" fontSize="14" fontWeight="600" fill="white">
              Start Hiring Smarter
            </text>
            <text x="730" y="445" textAnchor="middle" fontSize="12" fill="white" opacity="0.9">
              Try Hiralyze Today
            </text>
          </motion.g>

        </g>

        {/* Floating Success Metrics */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          {[
            { x: 100, y: 400, metric: "60%", label: "Faster Hiring" },
            { x: 300, y: 450, metric: "95%", label: "Accuracy" },
            { x: 500, y: 420, metric: "10x", label: "Efficiency" },
          ].map((item, i) => (
            <motion.g
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            >
              <rect
                x={item.x - 30}
                y={item.y - 20}
                width="60"
                height="40"
                rx="8"
                fill="white"
                stroke="#10B981"
                strokeWidth="1"
                filter="url(#dropShadow)"
              />
              <text x={item.x} y={item.y - 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#10B981">
                {item.metric}
              </text>
              <text x={item.x} y={item.y + 8} textAnchor="middle" fontSize="10" fill="#6B7280">
                {item.label}
              </text>
            </motion.g>
          ))}
        </motion.g>

        {/* Background Data Flow */}
        <motion.g opacity="0.3">
          {[...Array(5)].map((_, i) => (
            <motion.path
              key={i}
              d={`M${i * 200} 500 Q${400 + i * 100} 400 ${800 + i * 50} 550`}
              stroke="#10B981"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4,4"
              animate={{ strokeDashoffset: [0, -16] }}
              transition={{
                duration: 4 + i,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </motion.g>

      </svg>
    </div>
  )
}
