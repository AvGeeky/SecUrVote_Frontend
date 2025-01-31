import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

const stepsData = [
    {
        imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/c552bce18a369b1620211ac2a43be44185172214c398f8ff6322dd85c9f125d2?placeholderIfAbsent=true&apiKey=856530a2bc8b4fad805f6d030062538d",
        imageAlt: "Registration step icon",
        title: "Register",
        description: "Register yourself by filling your university issued secret code and E-Mail. Set your username and password"
    },
    {
        imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/5a525bf2f4d94246249b8bcd8ba73fd4888b480bae394d6b8c451d4fe4cba5c2?placeholderIfAbsent=true&apiKey=856530a2bc8b4fad805f6d030062538d",
        imageAlt: "Sign in step icon",
        title: "Sign In",
        description: "Sign in as user, and verify your personal information. Note down your HASH-ID"
    },
    {
        imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/0481a2e0298cab5b235a94f174484297664f7d872e86e26198d3640c24fd741a?placeholderIfAbsent=true&apiKey=856530a2bc8b4fad805f6d030062538d",
        imageAlt: "Vote option step icon",
        title: "Access Voting",
        description: "Go to vote option on dashboard"
    },
    {
        imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/bc8d18d7914cfb3d0778699d9ac4f86302a2bd34896a59cfed54a459ffa9e41f?placeholderIfAbsent=true&apiKey=856530a2bc8b4fad805f6d030062538d",
        imageAlt: "Cast vote step icon",
        title: "Cast Vote",
        description: "Cast your vote!"
    },
    {
        imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/f89a6a7e345cb0ad3735dcd6f9eecdca5025b607b486aa61864d38f573e80bab?placeholderIfAbsent=true&apiKey=856530a2bc8b4fad805f6d030062538d",
        imageAlt: "Verify vote step icon",
        title: "Verify Vote",
        description: "Verify your vote by checking if the HASH-ID has been marked as voted in the public verification page"
    }
];

function StepItem({ imageUrl, imageAlt, title, description, index, isExpanded, toggleExpand }) {
    return (
        <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <button
                className="w-full text-left p-6 flex items-center focus:outline-none focus:ring-2 focus:ring-pink-500"
                onClick={toggleExpand}
                aria-expanded={isExpanded}
            >
                <div className="flex-shrink-0 mr-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {index + 1}
                    </div>
                </div>
                <img
                    loading="lazy"
                    src={imageUrl}
                    alt={imageAlt}
                    className="object-contain w-16 h-16 mr-6"
                />
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                    <p className="text-lg text-white/80">
                        {isExpanded ? description : `${description.slice(0, 50)}...`}
                    </p>
                </div>
                {isExpanded ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                    >
                        <p className="text-lg text-white/90">{description}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function VotingSteps() {
    const navigate = useNavigate();
    const [expandedStep, setExpandedStep] = useState(null);

    const handleBackToHome = () => {
        navigate("/");
    };

    const toggleExpand = (index) => {
        setExpandedStep(expandedStep === index ? null : index);
    };

    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-purple-800 to-pink-700 overflow-hidden px-4 py-8">
            <motion.div
                className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1
                    className="text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-white to-pink-300 text-transparent bg-clip-text"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Follow these easy steps
                </motion.h1>

                <div className="space-y-6">
                    {stepsData.map((step, index) => (
                        <StepItem
                            key={index}
                            imageUrl={step.imageUrl}
                            imageAlt={step.imageAlt}
                            title={step.title}
                            description={step.description}
                            index={index}
                            isExpanded={expandedStep === index}
                            toggleExpand={() => toggleExpand(index)}
                        />
                    ))}
                </div>

                <nav className="flex justify-center mt-10">
                    <motion.button
                        onClick={handleBackToHome}
                        className="px-6 py-3 text-lg font-semibold text-purple-900 bg-white rounded-full hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-300 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Return to home page"
                    >
                        <ArrowLeft className="mr-2" />
                        BACK TO HOME
                    </motion.button>
                </nav>
            </motion.div>
        </main>
    );
}

export default VotingSteps;