"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    BookOpen,
    LogIn,
    Phone,
    Mail,
    User,
    ArrowRight,
    Shield,
    CheckCircle,
    Vote,
    Lock,
    Menu,
    X,
    Star,
} from "lucide-react"

// Animated background component with multiple layers and effects
function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient orbs */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

            {/* Floating particles */}
            {[...Array(40)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                    style={{
                        width: Math.random() * 50 + 10,
                        height: Math.random() * 50 + 10,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        zIndex: Math.floor(Math.random() * 10),
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50],
                        y: [0, Math.random() * 100 - 50],
                        opacity: [0, Math.random() * 0.5 + 0.1, 0],
                        scale: [0, Math.random() + 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                />
            ))}

            {/* Animated grid */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px] opacity-20"></div>

            {/* Animated stars */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={`star-${i}`}
                    className="absolute"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, Math.random() * 0.5 + 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        delay: Math.random() * 5,
                    }}
                >
                    <Star className="text-white/30" size={Math.random() * 10 + 5} />
                </motion.div>
            ))}

            {/* Animated gradient lines */}
            <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`line-${i}`}
                        className="absolute h-[1px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
                        style={{
                            top: `${20 + i * 15}%`,
                            left: 0,
                            right: 0,
                        }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            scaleY: [0, 1, 0],
                            translateX: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            ease: "easeInOut",
                            delay: i * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

function ActionButton({ icon: Icon, children, to, primary = true }) {
    const navigate = useNavigate()

    return (
        <motion.button
            whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255,105,180,0.6)",
                textShadow: "0 0 10px rgba(255,255,255,0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(to)}
            className={`group relative flex items-center gap-3 overflow-hidden ${
                primary
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    : "bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
            } px-8 py-4 rounded-xl text-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300`}
        >
            {/* Animated background effect for primary buttons */}
            {primary && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600/0 via-white/20 to-pink-600/0"
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                        ease: "linear",
                        repeatDelay: 0.5,
                    }}
                />
            )}

            <Icon className="w-6 h-6 relative z-10" />
            <span className="relative z-10">{children}</span>
            {primary && (
                <motion.div initial={{ x: -5, opacity: 0, width: 0 }} animate={{ opacity: 1 }} className="relative z-10">
                    <ArrowRight className="w-0 h-5 opacity-0 group-hover:opacity-100 group-hover:w-5 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </motion.div>
            )}
        </motion.button>
    )
}

function ContactItem({ icon: Icon, title, details }) {
    return (
        <motion.div
            whileHover={{
                scale: 1.03,
                boxShadow: "0 0 30px rgba(255,105,180,0.4)",
                y: -5,
            }}
            className="flex items-center gap-4 bg-black/30 border border-white/10 p-5 rounded-xl backdrop-blur-sm relative overflow-hidden"
        >
            {/* Animated gradient border */}
            <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                animate={{
                    background: [
                        "linear-gradient(0deg, rgba(255,105,180,0) 0%, rgba(255,105,180,0) 100%)",
                        "linear-gradient(90deg, rgba(255,105,180,0.3) 0%, rgba(147,51,234,0.3) 50%, rgba(255,105,180,0.3) 100%)",
                        "linear-gradient(180deg, rgba(255,105,180,0) 0%, rgba(255,105,180,0) 100%)",
                        "linear-gradient(270deg, rgba(255,105,180,0.3) 0%, rgba(147,51,234,0.3) 50%, rgba(255,105,180,0.3) 100%)",
                        "linear-gradient(0deg, rgba(255,105,180,0) 0%, rgba(255,105,180,0) 100%)",
                    ],
                }}
                transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                }}
            />

            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-full relative z-10">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="relative z-10">
                <h3 className="text-lg font-semibold text-pink-300">{title}</h3>
                {details.map((detail, index) => (
                    <p key={index} className="text-white/90">
                        {detail}
                    </p>
                ))}
            </div>
        </motion.div>
    )
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
    return (
        <motion.div
            className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300 h-full relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(255,105,180,0.4)" }}
        >
            {/* Animated gradient background on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                animate={{
                    background: [
                        "radial-gradient(circle at 0% 0%, rgba(255,105,180,0.2) 0%, rgba(147,51,234,0) 50%)",
                        "radial-gradient(circle at 100% 0%, rgba(255,105,180,0.2) 0%, rgba(147,51,234,0) 50%)",
                        "radial-gradient(circle at 100% 100%, rgba(255,105,180,0.2) 0%, rgba(147,51,234,0) 50%)",
                        "radial-gradient(circle at 0% 100%, rgba(255,105,180,0.2) 0%, rgba(147,51,234,0) 50%)",
                        "radial-gradient(circle at 0% 0%, rgba(255,105,180,0.2) 0%, rgba(147,51,234,0) 50%)",
                    ],
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                }}
            />

            <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 relative z-10 group-hover:text-pink-200 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-white/80 relative z-10 group-hover:text-white/90 transition-colors duration-300">
                {description}
            </p>
        </motion.div>
    )
}

function VotingHeader() {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("hero")
    const sectionsRef = useRef({})

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("jwtToken")
            setIsLoggedIn(!!token)
        }

        checkLoginStatus()

        const handleScroll = () => {
            setScrollY(window.scrollY)

            // Check which section is currently in view
            const sectionIds = Object.keys(sectionsRef.current)
            for (const id of sectionIds) {
                const section = sectionsRef.current[id]
                if (section) {
                    const rect = section.getBoundingClientRect()
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(id)
                        break
                    }
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Register section refs
    const registerSection = (id, ref) => {
        if (ref && !sectionsRef.current[id]) {
            sectionsRef.current[id] = ref
        }
    }

    const navButtonVariants = {
        hover: {
            scale: 1.1,
            textShadow: "0 0 8px rgb(255,105,180)",
            boxShadow: "0 0 15px rgba(255,105,180,0.5)",
            transition: { duration: 0.3 },
        },
        tap: { scale: 0.95 },
    }

    const navItems = [
        { name: "About", path: "/about", id: "about" },
        { name: "Features", path: "/features", id: "features" },
        { name: "Steps", path: "/voting-instructionss", id: "steps" },
        { name: "Verify", path: "/voter-list", id: "verify" },
    ]

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-purple-800 to-pink-700 overflow-hidden">
            {/* Enhanced animated background */}
            <AnimatedBackground />

            <div className="relative z-10 max-w-[2500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
                <motion.nav
                    className={`flex justify-between items-center mb-16 ${
                        scrollY > 50
                            ? "sticky top-0 bg-black/50 backdrop-blur-md p-4 rounded-xl z-50 transition-all duration-300 shadow-lg border border-white/10"
                            : ""
                    }`}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <motion.div
                            className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-lg"
                            whileHover={{
                                rotate: [0, -10, 10, -10, 0],
                                scale: 1.1,
                                boxShadow: "0 0 20px rgba(255,105,180,0.6)",
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <Vote className="w-8 h-8 text-white" />
                        </motion.div>
                        <motion.h1
                            className="text-3xl sm:text-4xl font-bold"
                            animate={{
                                textShadow: [
                                    "0 0 0px rgba(255,255,255,0)",
                                    "0 0 10px rgba(255,255,255,0.5)",
                                    "0 0 0px rgba(255,255,255,0)",
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                            }}
                        >
                            <span className="text-white">SecUr</span>
                            <span className="text-pink-400">Vote</span>
                        </motion.h1>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-wrap gap-3 items-center">
                        {navItems.map((item, index) => (
                            <motion.button
                                key={item.name}
                                variants={navButtonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => navigate(item.path)}
                                className={`text-lg ${
                                    activeSection === item.id
                                        ? "text-white bg-pink-600/50 border-pink-500/50"
                                        : "text-pink-200 hover:text-white bg-black/30 hover:bg-black/50"
                                } transition-colors duration-300 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10`}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                                {item.name}
                            </motion.button>
                        ))}

                        <motion.button
                            variants={navButtonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate("/login")}
                            className="ml-2 text-lg text-white bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        >
                            Login
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden text-white p-2 rounded-lg bg-black/30 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                </motion.nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="flex flex-col items-center justify-center h-full space-y-6 p-4"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 20 }}
                            >
                                <motion.button
                                    className="absolute top-8 right-8 text-white p-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>

                                {navItems.map((item, index) => (
                                    <motion.button
                                        key={item.name}
                                        onClick={() => {
                                            navigate(item.path)
                                            setMobileMenuOpen(false)
                                        }}
                                        className="text-2xl text-white py-3 px-8 rounded-xl bg-black/30 w-full max-w-xs border border-white/10"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.name}
                                    </motion.button>
                                ))}

                                <motion.button
                                    onClick={() => {
                                        navigate("/login")
                                        setMobileMenuOpen(false)
                                    }}
                                    className="text-2xl text-white py-3 px-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 w-full max-w-xs mt-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: navItems.length * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    ref={(ref) => registerSection("hero", ref)}
                    className="flex-1 grid lg:grid-cols-2 gap-12 items-center py-12"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="order-1 lg:order-1 text-center lg:text-left"
                    >
                        <motion.h2
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            Be a part of the {"  "}
                            <motion.span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-200 inline-block"
                                animate={{
                                    backgroundPosition: ["0% center", "100% center", "0% center"],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                            >
                                decision.
                            </motion.span>
                        </motion.h2>

                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-200 to-white"
                        >
                            <motion.span
                                animate={{
                                    textShadow: [
                                        "0 0 0px rgba(255,255,255,0)",
                                        "0 0 20px rgba(255,255,255,0.5)",
                                        "0 0 0px rgba(255,255,255,0)",
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "loop",
                                }}
                            >
                                Vote Today
                            </motion.span>
                        </motion.h3>

                        <motion.div
                            className="flex flex-wrap gap-6 justify-center lg:justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            <ActionButton to="/voting-instructionss" icon={BookOpen}>
                                Instructions
                            </ActionButton>
                            <ActionButton to="/login" icon={LogIn} primary={false}>
                                Login
                            </ActionButton>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="order-2 lg:order-2 flex justify-center items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <motion.div
                            className="relative w-full max-w-md"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 4,
                                ease: "easeInOut",
                            }}
                        >
                            {/* Enhanced glowing effect */}
                            <motion.div
                                className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 opacity-75 blur-xl"
                                animate={{
                                    opacity: [0.5, 0.8, 0.5],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    repeat: Number.POSITIVE_INFINITY,
                                    duration: 3,
                                }}
                            />

                            {/* Animated border */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl opacity-50"
                                style={{
                                    background: "linear-gradient(90deg, #f472b6, #a855f7, #f472b6)",
                                    backgroundSize: "200% 100%",
                                    padding: "2px",
                                }}
                                animate={{
                                    backgroundPosition: ["0% center", "200% center"],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                            />

                            <div className="relative bg-black/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/10">
                                <h3 className="text-2xl font-bold text-white mb-4">Secure. Transparent. Reliable.</h3>
                                <p className="text-white/80 mb-6">
                                    Our cutting-edge voting system ensures your vote is counted securely and accurately.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        { icon: Lock, text: "End-to-end encryption" },
                                        { icon: Shield, text: "Tamper-proof records" },
                                        { icon: CheckCircle, text: "Real-time verification" },
                                        { icon: ArrowRight, text: "Instant results" },
                                    ].map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1 + index * 0.1 }}
                                            whileHover={{ x: 5 }}
                                        >
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center"
                                                whileHover={{ scale: 1.2, rotate: 10 }}
                                            >
                                                <feature.icon className="w-4 h-4 text-white" />
                                            </motion.div>
                                            <span className="text-white">{feature.text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.button
                                    className="mt-8 w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-all duration-300 border border-white/10 relative overflow-hidden group"
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 0 15px rgba(255,105,180,0.3)",
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate("/features")}
                                >
                                    {/* Animated shine effect */}
                                    <motion.div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                                    <span className="relative z-10">Learn more about our features</span>
                                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    className="py-16"
                    ref={(ref) => registerSection("features", ref)}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.3 }}
                    >
                        Why Choose{" "}
                        <motion.span
                            className="text-pink-400"
                            animate={{
                                textShadow: [
                                    "0 0 0px rgba(244,114,182,0)",
                                    "0 0 10px rgba(244,114,182,0.7)",
                                    "0 0 0px rgba(244,114,182,0)",
                                ],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                            }}
                        >
                            SecUrVote
                        </motion.span>
                        ?
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={User}
                            title="User-Friendly"
                            description="Simple and intuitive interface designed for voters of all ages and technical abilities."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Maximum Security"
                            description="Advanced encryption and authentication protocols to protect your vote and personal information."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={CheckCircle}
                            title="Instant Verification"
                            description="Confirm your vote was recorded correctly with our real-time verification system."
                            delay={0.6}
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="mt-auto grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
                    ref={(ref) => registerSection("contact", ref)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <ContactItem icon={Phone} title="Contact Us" details={["+91 8220 289 166", "+91 6383 281 491"]} />
                    <ContactItem
                        icon={Mail}
                        title="Email Us"
                        details={["saipranav2310324@ssn.edu.in", "rahul2310239@ssn.edu.in"]}
                    />
                </motion.div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center py-8 mt-8"
                >
                    <motion.p
                        whileHover={{ scale: 1.1 }}
                        className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-200 mb-2"
                    >
                        Made at SSN COLLEGE OF ENGINEERING, KALAVAKKAM
                    </motion.p>
                    <motion.p whileHover={{scale: 1.1}} className="text-lg text-pink-300">
                        Made with ❣️ by{' '}
                        <a
                            href="https://www.linkedin.com/in/saipranav-m"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Saipranav M
                        </a>
                        {' & '}
                        <a
                            href="https://www.linkedin.com/in/rahul-v-s/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Rahul V S
                        </a>
                    </motion.p>
                </motion.footer>
            </div>
        </div>
    )
}

export default VotingHeader

