import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check, AlertTriangle, Home } from "lucide-react";

export function VotingInstructionss() {
    const navigate = useNavigate();
    const [expandedStep, setExpandedStep] = useState(null);

    const votingSteps = [
        {
            title: "Vote Freely",
            content: [
                "Make your voting decision independently.",
                "Do not let anyone pressure or intimidate you.",
                "If you feel threatened, please contact the provided helpline numbers."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        },
        {
            title: "Prepare for Voting",
            content: [
                "Register and Login successfully.",
                "Have your Unique HASH-ID ready.",
                "Read through manifestos thoroughly and select your candidate carefully."
            ],
            icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />
        },
        {
            title: "Voting Guidelines",
            content: [
                "You are allowed only one vote per election.",
                "You may choose only one candidate per vote.",
                "Candidate information is available on the voting page for your reference."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        },
        {
            title: "Selecting Your Candidate",
            content: [
                "Carefully select your desired candidate by confirming their name and symbol displayed on the screen."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        },
        {
            title: "Submitting Your Vote",
            content: [
                "After selecting your candidate, ensure you submit your vote to finalize the process."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        },
        {
            title: "Results Announcement",
            content: [
                "Election results will be announced automatically after the election concludes."
            ],
            icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />
        },
        {
            title: "Vote Verification",
            content: [
                "You will have the opportunity to verify your vote status after you finish voting."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        }
    ];

    const handleCancel = () => {
        navigate("/");
    };

    const toggleStep = (index) => {
        setExpandedStep(expandedStep === index ? null : index);
    };

    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-purple-800 to-pink-700 overflow-hidden px-4 py-8">
            <motion.div
                className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <header className="text-xl font-normal mb-6 text-center">
                    <motion.h2
                        className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        SSN Election Commission
                    </motion.h2>
                    This election is being conducted by the election commission of SSN.
                </header>

                <article className="border-2 border-pink-400 rounded-lg p-8 bg-purple-900/40 mb-8">
                    <motion.h1
                        className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Voting Instructions for College Election
                    </motion.h1>
                    <p className="mb-8 text-center">
                        As a member of the college community, you are eligible to vote. Please follow these steps to cast your vote:
                    </p>

                    <div className="space-y-4">
                        {votingSteps.map((step, index) => (
                            <motion.section
                                key={index}
                                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <button
                                    className="w-full text-left p-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    onClick={() => toggleStep(index)}
                                    aria-expanded={expandedStep === index}
                                    aria-controls={`content-${index}`}
                                >
                                    <div className="flex items-center">
                                        {step.icon}
                                        <h2 className="text-xl font-semibold ml-3">
                                            {index + 1}. {step.title}
                                        </h2>
                                    </div>
                                    {expandedStep === index ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                                </button>
                                <AnimatePresence>
                                    {expandedStep === index && (
                                        <motion.div
                                            id={`content-${index}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ul className="list-disc pl-12 pr-6 pb-4 space-y-2">
                                                {step.content.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="text-white/90">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.section>
                        ))}
                    </div>

                    <motion.p
                        className="mt-8 text-center font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        Thank you for participating in your college's democratic process!
                    </motion.p>
                </article>

                <nav className="flex justify-end gap-4">
                    <motion.button
                        onClick={handleCancel}
                        className="px-6 py-3 text-lg font-semibold text-purple-900 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Return to home page"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        BACK TO HOME
                    </motion.button>
                </nav>
            </motion.div>
        </main>
    );
}

export default VotingInstructionss;