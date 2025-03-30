"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check, AlertCircle, Lock } from "lucide-react"

// Static demo data
const DEMO_CANDIDATES = [
    { name: "Jane Smith", party: "Progressive Party", details: "A" },
    { name: "Robert Johnson", party: "Conservative Union", details: "B" },
    { name: "Maria Rodriguez", party: "Liberty Alliance", details: "C" },
    { name: "David Chen", party: "Reform Coalition", details: "D" },
]

function CandidateCard({ candidate, isSelected, onSelect }) {
    return (
        <motion.article
            className={`flex justify-between items-center p-4 w-full bg-white/10 backdrop-blur-md rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                isSelected ? "border-pink-500 bg-white/20" : "border-transparent hover:bg-white/15"
            }`}
            onClick={onSelect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-center gap-4">
                <motion.div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "bg-pink-500 border-pink-500" : "border-gray-300"
                    }`}
                    animate={{ scale: isSelected ? 1.1 : 1 }}
                >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                </motion.div>
                <span className="text-xl text-white">{candidate.name}</span>
            </div>
            <div className="flex items-center gap-8">
                <span className="text-xl text-white">{candidate.party}</span>
                <span className="text-gray-300 font-semibold">Code: {candidate.details}</span>
                <ChevronDown className="w-6 h-6 text-gray-300" />
            </div>
        </motion.article>
    )
}

export default function VotingPanelStatic() {
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [enteredCode, setEnteredCode] = useState("")
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
    const [candidates, setCandidates] = useState(DEMO_CANDIDATES)
    const [showSuccess, setShowSuccess] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Check if we're in demo mode
        const demoMode = localStorage.getItem("demoMode")
        if (!demoMode) {
            navigate("/login")
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    alert("Time is up")
                    navigate("/login")
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [navigate])

    const handleCodeChange = (e) => {
        setEnteredCode(e.target.value.toUpperCase())
    }

    const handleSubmit = async () => {
        if (!selectedCandidate) {
            alert("Please select a candidate before submitting your vote.")
            return
        }

        if (enteredCode !== selectedCandidate.details) {
            alert("The entered code does not match the selected candidate. Please check and try again.")
            return
        }

        if (!agreeTerms) {
            alert("Please agree to the terms before submitting your vote.")
            return
        }

        // Show success message in demo mode
        setShowSuccess(true)

        // Redirect after 2 seconds
        setTimeout(() => {
            navigate("/login")
        }, 2000)
    }

    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-purple-800 to-pink-700 overflow-hidden px-4 py-8">
            <motion.div
                className="w-full max-w-4xl bg-black/40 backdrop-blur-md rounded-xl p-8 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Official Voting Panel</h1>
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm font-medium"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            DEMO MODE
                        </motion.div>
                        <div className="text-white text-xl">
                            Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                        </div>
                    </div>
                </header>

                <div className="space-y-6">
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                className="bg-green-500/20 border border-green-500/30 p-6 rounded-lg mb-6 text-green-200"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-3">
                                    <Check className="w-6 h-6" />
                                    <h3 className="text-xl font-semibold">Vote Submitted Successfully!</h3>
                                </div>
                                <p className="mt-2">Thank you for participating in the demo. Redirecting...</p>
                            </motion.div>
                        )}

                        {selectedCandidate && !showSuccess && (
                            <motion.div
                                className="bg-white/20 backdrop-blur-md p-6 rounded-lg mb-6"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-between items-center text-white mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">{selectedCandidate.details}</span>
                                        </div>
                                        <span className="text-2xl font-semibold">{selectedCandidate.name}</span>
                                    </div>
                                    <span className="text-xl">{selectedCandidate.party}</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-white">
                                    <p className="mb-4">
                                        <strong>Unique Code:</strong> {selectedCandidate.details}
                                    </p>
                                    <div>
                                        <label htmlFor="codeInput" className="block text-white mb-2">
                                            Enter the unique code for this candidate:
                                        </label>
                                        <input
                                            id="codeInput"
                                            type="text"
                                            value={enteredCode}
                                            onChange={handleCodeChange}
                                            className="w-full p-2 border rounded text-black"
                                            maxLength={1}
                                            placeholder="Enter code"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        {candidates.map((candidate, index) => (
                            <CandidateCard
                                key={index}
                                candidate={candidate}
                                isSelected={selectedCandidate?.name === candidate.name}
                                onSelect={() => setSelectedCandidate(candidate)}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="flex items-center gap-4 text-white mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            className="w-5 h-5"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <label htmlFor="agreeTerms" className="flex items-center">
                            <Lock className="w-5 h-5 mr-2" />I confirm that I have selected my candidate and the information provided
                            is correct. I understand that the submit button is enabled only after I enter the right code for the
                            candidate.
                        </label>
                    </motion.div>
                    <div className="flex justify-center mt-8">
                        <motion.button
                            onClick={handleSubmit}
                            className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedCandidate || !agreeTerms || enteredCode !== selectedCandidate?.details || showSuccess}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AlertCircle className="w-5 h-5 mr-2" />
                            SUBMIT VOTE
                        </motion.button>
                    </div>

                    <motion.p
                        className="text-center text-yellow-300/70 text-sm mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        DEMO MODE - No API calls are being made
                    </motion.p>
                </div>
            </motion.div>
        </main>
    )
}

