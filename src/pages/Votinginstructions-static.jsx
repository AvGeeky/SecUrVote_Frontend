"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, AlertTriangle } from "lucide-react"

export function VotingInstructionsStatic() {
    const navigate = useNavigate()

    const handleProceed = () => {
        navigate("/voting-panel-static")
    }

    React.useEffect(() => {
        // Check if we're in demo mode
        const demoMode = localStorage.getItem("demoMode")
        if (!demoMode) {
            navigate("/login")
        }
    }, [navigate])

    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-purple-800 to-pink-700 overflow-hidden px-4 py-8">
            <motion.div
                className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl text-white text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    DEMO MODE
                </motion.div>

                <motion.h1
                    className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Read Before You Vote
                </motion.h1>
                <p className="mb-6 text-lg">
                    As a voter, ensure you cast your vote without any bias or external influence. Your vote remains anonymous, and
                    results will be sent securely to your personal email.
                </p>
                <div className="text-left space-y-4">
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Check className="w-6 h-6 text-green-400" />
                        <p>Vote freely and without fear.</p>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Check className="w-6 h-6 text-green-400" />
                        <p>Verify your vote using your Magic ID.</p>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        <p>Once submitted, your vote cannot be changed.</p>
                    </motion.div>
                </div>
                <motion.button
                    onClick={handleProceed}
                    className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Proceed to Vote
                </motion.button>

                <motion.p
                    className="mt-4 text-yellow-300/70 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    DEMO MODE - No API calls are being made
                </motion.p>
            </motion.div>
        </main>
    )
}

export default VotingInstructionsStatic

