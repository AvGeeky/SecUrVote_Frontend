"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    Shield,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Key,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
} from "lucide-react"
import useApiWithAuth from "../hooks/useApiWithAuth"

export default function AdminVerification() {
    // State for different stages of verification
    const [currentStep, setCurrentStep] = useState("email") // email, otp, login
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    })

    // UI states
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { apiCall } = useApiWithAuth()
    const apiUrl = import.meta.env.VITE_API_URL

    // Particle effect
    const [particles] = useState(
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 10 + 5,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5,
        })),
    )

    // Handle email verification and OTP sending
    const handleEmailVerification = async (e) => {
        e.preventDefault()

        if (!email || !email.includes("@")) {
            setErrorMessage("Please enter a valid email address")
            return
        }

        setIsLoading(true)
        setErrorMessage("")

        try {
            // Step 1: Set admin secret
            const secretResponse = await apiCall("GET", `${apiUrl}/setSecret?id=ADMIN`)

            if (!secretResponse || secretResponse.status !== 200) {
                throw new Error("Failed to set admin secret")
            }

            // Step 2: Set admin email
            const emailResponse = await apiCall("GET", `${apiUrl}/setAdminEmail?mail=${encodeURIComponent(email)}`)

            if (!emailResponse || emailResponse.status !== 200) {
                throw new Error("Failed to set admin email")
            }

            // Step 3: Send OTP
            const otpResponse = await apiCall("POST", `${apiUrl}/sendAdminOtp`)

            if (!otpResponse || otpResponse.status !== 200) {
                throw new Error("Failed to send OTP")
            }

            if (otpResponse.data && otpResponse.data.status === "S") {
                setCurrentStep("otp")
                setSuccessMessage("OTP sent successfully to your email")
                setTimeout(() => setSuccessMessage(""), 3000)
            } else {
                setErrorMessage(otpResponse.data?.message || "Failed to send OTP. Please try again.")
            }
        } catch (error) {
            console.error("Error during email verification:", error)
            setErrorMessage(error.message || "An error occurred. Please check your connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle OTP verification
    const handleOtpVerification = async (e) => {
        e.preventDefault()

        if (!otp) {
            setErrorMessage("Please enter the OTP sent to your email")
            return
        }

        setIsLoading(true)
        setErrorMessage("")

        try {
            const response = await apiCall("POST", `${apiUrl}/verifyAdminOtp?otp_param=${encodeURIComponent(otp)}`)

            if (!response || response.status !== 200) {
                throw new Error("Failed to verify OTP")
            }

            if (response.data && response.data.status === "S") {
                setCurrentStep("login")
                setSuccessMessage("OTP verified successfully")
                setTimeout(() => setSuccessMessage(""), 3000)
            } else {
                setErrorMessage(response.data?.message || "Invalid OTP. Please try again.")
            }
        } catch (error) {
            console.error("Error during OTP verification:", error)
            setErrorMessage(error.message || "An error occurred. Please check your connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle admin login
    const handleAdminLogin = async (e) => {
        e.preventDefault()

        if (!credentials.username || !credentials.password) {
            setErrorMessage("Please enter both username and password")
            return
        }

        setIsLoading(true)
        setErrorMessage("")

        try {
            const response = await apiCall(
                "GET",
                `${apiUrl}/adminLogin?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`,
            )

            if (!response || response.status !== 200) {
                throw new Error("Failed to login")
            }

            if (response.data && response.data.status === "S") {
                // Store admin token or session data if provided by the API
                if (response.data.token) {
                    localStorage.setItem("jwtToken", response.data.token)
                    localStorage.setItem("isAdmin", "true")
                }

                setSuccessMessage("Login successful! Redirecting to dashboard...")

                // Redirect to admin dashboard after a short delay
                setTimeout(() => {
                    navigate("/admin-dashboard")
                }, 1500)
            } else {
                setErrorMessage(response.data?.message || "Invalid credentials. Please try again.")
            }
        } catch (error) {
            console.error("Error during admin login:", error)
            setErrorMessage(error.message || "An error occurred. Please check your connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target

        if (name === "email") {
            setEmail(value)
        } else if (name === "otp") {
            setOtp(value)
        } else {
            setCredentials({
                ...credentials,
                [name]: value,
            })
        }
    }

    // Handle resend OTP
    const handleResendOtp = async () => {
        setIsLoading(true)
        setErrorMessage("")

        try {
            const response = await apiCall("POST", `${apiUrl}/sendAdminOtp`)

            if (!response || response.status !== 200) {
                throw new Error("Failed to resend OTP")
            }

            if (response.data && response.data.status === "S") {
                setSuccessMessage("OTP has been resent to your email")
                setTimeout(() => setSuccessMessage(""), 3000)
            } else {
                setErrorMessage(response.data?.message || "Failed to resend OTP. Please try again.")
            }
        } catch (error) {
            console.error("Error during OTP resend:", error)
            setErrorMessage(error.message || "An error occurred. Please check your connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    }

    return (
        <div className="min-h-screen w-screen flex justify-center items-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="relative z-10 w-full max-w-md mx-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Glowing background effect */}
                <motion.div
                    className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 opacity-75 blur-xl"
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                    }}
                />

                <div className="relative bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8">
                    <div className="flex justify-center mb-6">
                        <motion.div
                            className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-full"
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <Shield className="w-10 h-10 text-white" />
                        </motion.div>
                    </div>

                    <motion.div
                        className="text-center mb-8"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">
                            <span className="text-white">SecUr</span>
                            <span className="text-pink-400">Vote</span>
                            <span className="text-purple-300 text-xl ml-1">Admin</span>
                        </h1>
                        <p className="text-white/80">
                            {currentStep === "email" && "Enter your admin email to continue"}
                            {currentStep === "otp" && "Enter the OTP sent to your email"}
                            {currentStep === "login" && "Enter your admin credentials"}
                        </p>
                    </motion.div>

                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 flex items-center"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </motion.div>
                        )}

                        {successMessage && (
                            <motion.div
                                className="bg-green-900/30 border border-green-500/50 text-green-200 p-4 rounded-lg mb-6 flex items-center"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span>{successMessage}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {currentStep === "email" && (
                            <motion.form
                                key="email-form"
                                onSubmit={handleEmailVerification}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                                        Admin Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-pink-300" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your admin email"
                                            disabled={isLoading}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 focus:border-pink-500/50 rounded-lg focus:ring-2 focus:ring-pink-500/50 text-white placeholder-white/50 transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    variants={itemVariants}
                                    className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <div className="flex items-center">
                                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    )}
                                </motion.button>
                            </motion.form>
                        )}

                        {currentStep === "otp" && (
                            <motion.form
                                key="otp-form"
                                onSubmit={handleOtpVerification}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="otp" className="block text-sm font-medium text-white/90 mb-2">
                                        One-Time Password (OTP)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-pink-300" />
                                        </div>
                                        <input
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            value={otp}
                                            onChange={handleInputChange}
                                            placeholder="Enter OTP"
                                            disabled={isLoading}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 focus:border-pink-500/50 rounded-lg focus:ring-2 focus:ring-pink-500/50 text-white placeholder-white/50 transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex justify-center text-sm">
                                    <span className="text-white/70 mr-1">Didn't receive the OTP?</span>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isLoading}
                                        className="text-pink-300 hover:text-pink-200 hover:underline disabled:text-pink-700 disabled:cursor-not-allowed transition-colors duration-300"
                                    >
                                        Resend OTP
                                    </button>
                                </motion.div>

                                <div className="flex space-x-3">
                                    <motion.button
                                        type="button"
                                        variants={itemVariants}
                                        onClick={() => setCurrentStep("email")}
                                        className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Back
                                    </motion.button>

                                    <motion.button
                                        type="submit"
                                        variants={itemVariants}
                                        className="flex-1 flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Verify OTP"}
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}

                        {currentStep === "login" && (
                            <motion.form
                                key="login-form"
                                onSubmit={handleAdminLogin}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="username" className="block text-sm font-medium text-white/90 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-pink-300" />
                                        </div>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={credentials.username}
                                            onChange={handleInputChange}
                                            placeholder="Enter admin username"
                                            disabled={isLoading}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 focus:border-pink-500/50 rounded-lg focus:ring-2 focus:ring-pink-500/50 text-white placeholder-white/50 transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-pink-300" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter admin password"
                                            disabled={isLoading}
                                            required
                                            className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 focus:border-pink-500/50 rounded-lg focus:ring-2 focus:ring-pink-500/50 text-white placeholder-white/50 transition-all duration-300"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-300 hover:text-pink-200"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </motion.div>

                                <div className="flex space-x-3">
                                    <motion.button
                                        type="button"
                                        variants={itemVariants}
                                        onClick={() => setCurrentStep("otp")}
                                        className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Back
                                    </motion.button>

                                    <motion.button
                                        type="submit"
                                        variants={itemVariants}
                                        className="flex-1 flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Login"}
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

