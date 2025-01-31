import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Database, Hash, Zap, Lock, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Shield,
        title: "Secured by RSA/HMAC encryption",
        description: "Military-grade encryption ensuring vote integrity"
    },
    {
        icon: Database,
        title: "Blockchain-based Vote Storage",
        description: "Immutable and transparent vote recording"
    },
    {
        icon: Hash,
        title: "Verifiable votes using Hash-IDs",
        description: "Each vote is uniquely traceable and verifiable"
    },
    {
        icon: Zap,
        title: "Easy to use interface",
        description: "Intuitive design for seamless voting experience"
    },
    {
        icon: Lock,
        title: "Multiple authentication levels",
        description: "Multi-factor authentication for enhanced security"
    },
    {
        icon: Clock,
        title: "Faster voting process",
        description: "Efficient and quick voting system"
    }
];

function FeatureCard({ Icon, title, description, index }) {
    return (
        <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 flex items-start gap-4 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-full">
                <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
                <h3 className="text-xl font-medium text-white mb-2 group-hover:text-pink-300 transition-colors duration-300">{title}</h3>
                <p className="text-blue-200 group-hover:text-white transition-colors duration-300">{description}</p>
            </div>
        </motion.div>
    );
}

export function Features() {
    return (
        <main className="min-h-screen w-full bg-gradient-to-b from-purple-950 via-purple-800 to-pink-700 px-4 py-16 overflow-hidden">
            <motion.div
                className="w-full max-w-[1700px] mx-auto px-4 lg:px-8 py-8 lg:py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <header className="text-center mb-16">
                    <motion.h1
                        className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-pink-300 text-transparent bg-clip-text"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Our Features
                    </motion.h1>
                    <motion.p
                        className="text-xl text-blue-200"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Advanced technology ensuring secure and efficient voting
                    </motion.p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            Icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                        />
                    ))}
                </section>

                <footer className="mt-16 text-center">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            BACK TO HOME
                        </Link>
                    </motion.div>
                </footer>
            </motion.div>
        </main>
    );
}