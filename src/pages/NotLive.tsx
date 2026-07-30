import { motion } from 'framer-motion'
import { WifiOff } from 'lucide-react'

export default function NotLive() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center overflow-hidden">
      <div className="text-center px-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-28 h-28 mx-auto rounded-full bg-accent-600/20 flex items-center justify-center border border-accent-500/30">
            <WifiOff size={48} className="text-accent-400" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          <span className="text-gradient">Sorry!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-xl md:text-2xl text-dark-300 mb-8 max-w-md mx-auto"
        >
          Currently we are not live.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex gap-3 justify-center flex-wrap"
        >
          <button
            onClick={() => {
              window.location.href = '/ai_portfolio/#projects'
            }}
            className="px-7 py-3 rounded-full text-sm font-semibold text-white bg-accent-600 hover:bg-accent-700 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Go Back to Home
          </button>
        </motion.div>

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent-500/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}
