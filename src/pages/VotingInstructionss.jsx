import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check, AlertTriangle } from "lucide-react";

export function VotingInstructions() {
    const navigate = useNavigate();
    const [expandedStep, setExpandedStep] = useState(null);

    const votingSteps = [
        {
            title: "Enter Secret ID",
            content: [
                "Use the secret ID sent to your email to access the registration page."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        },
        {
            title: "Register and Authenticate",
            content: [
                "Enter your email and request an OTP.",
                "Enter the OTP sent to your email to verify your identity.",
                "Complete the registration by creating a username and password."
            ],
            icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />
        },
        {
            title: "Login",
            content: [
                "Once login is enabled by the admin, use your created username and password to log in."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        },
        {
            title: "Receive Your Magic ID",
            content: [
                "Upon successful registration, you will receive a unique 5-word Magic ID.",
                "This Magic ID allows you to verify your vote anonymously after submission."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        },
        {
            title: "Vote",
            content: [
                "Check your details before proceeding.",
                "Enter the candidate's code displayed in the circle at the top left.",
                "Tick the checkbox to confirm your choice.",
                "Submit your vote to finalize the process."
            ],
            icon: <Check className="w-6 h-6 text-green-400" />
        },
        {
            title: "Verify Your Vote",
            content: [
                "Use your Magic ID to confirm that your vote has been securely recorded in the database."
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
                </article>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </main>
    );
}

export default VotingInstructions;