"use client"

import { motion } from "framer-motion"
import { useTheme } from "./theme-provider"

export function LoginToggle({ isEnabled, onToggle }) {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <div className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Login {isEnabled ? "Enabled" : "Disabled"}
        </span>
                <button
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                        isEnabled ? "bg-purple-600" : "bg-gray-400"
                    }`}
                >
          <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? "translate-x-6" : "translate-x-1"
              }`}
          />
                </button>
            </div>
        </motion.div>
    )
}

