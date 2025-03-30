
"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Lock, User, Key, ArrowRight, Camera, CheckCircle, AlertCircle, RefreshCw, X } from "lucide-react"
import useApiWithAuth from "../hooks/useApiWithAuth"

// Face detection component
function FaceVerification({ onSuccess, onCancel }) {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [isCapturing, setIsCapturing] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [verificationStatus, setVerificationStatus] = useState("idle") // idle, verifying, success, failed
    const [errorMessage, setErrorMessage] = useState("")
    const { apiCall } = useApiWithAuth()

    // Start the webcam
    useEffect(() => {
        let stream = null

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: "user",
                    },
                })

                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            } catch (err) {
                setErrorMessage("Unable to access camera. Please ensure you've granted camera permissions.")
                console.error("Error accessing camera:", err)
            }
        }

        startCamera()

        // Cleanup function to stop the camera when component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [])

    const captureImage = () => {
        if (!videoRef.current) return

        setIsCapturing(true)

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame on the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL (base64 image)
        const imageData = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        setIsCapturing(false)
    }

    const retakeImage = () => {
        setCapturedImage(null)
        setVerificationStatus("idle")
        setErrorMessage("")
    }

    const verifyFace = async () => {
        if (!capturedImage) return

        setVerificationStatus("verifying")
        setErrorMessage("")

        try {
            // Remove the data URL prefix to get just the base64 data
            const base64Image = capturedImage.split(",")[1]

            // Call your API to verify the face
            const apiUrl = import.meta.env.VITE_API_URL
            const response = await apiCall("POST", `${apiUrl}/verifyFace`, {
                faceImage: base64Image,
            })

            if (response.data.status === "S") {
                setVerificationStatus("success")
                // Wait a moment to show success message before proceeding
                setTimeout(() => {
                    onSuccess()
                }, 1500)
            } else {
                setVerificationStatus("failed")
                setErrorMessage(response.data.message || "Face verification failed. Please try again.")
            }
        } catch (error) {
            setVerificationStatus("failed")
            setErrorMessage(error.message || "An error occurred during face verification.")
            console.error("Face verification error:", error)
        }
    }

    return (
        <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Face Verification</h2>
                    <motion.button
                        onClick={onCancel}
                        className="text-white/70 hover:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X size={24} />
                    </motion.button>
                </div>

                <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden mb-4">
                    {!capturedImage ? (
                        <>
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                            {/* Face outline guide */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    className="w-48 h-48 rounded-full border-2 border-dashed border-pink-400/70"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        borderColor: ["rgba(244,114,182,0.7)", "rgba(168,85,247,0.7)", "rgba(244,114,182,0.7)"],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <img src={capturedImage || "/placeholder.svg"} alt="Captured face" className="w-full h-full object-cover" />
                    )}

                    {/* Hidden canvas for capturing */}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {errorMessage && (
                    <motion.div
                        className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <p>{errorMessage}</p>
                    </motion.div>
                )}

                {verificationStatus === "success" && (
                    <motion.div
                        className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <p>Face verification successful!</p>
                    </motion.div>
                )}

                <div className="flex gap-3">
                    {!capturedImage ? (
                        <>
                            <motion.button
                                onClick={captureImage}
                                disabled={isCapturing}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isCapturing ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Camera className="w-5 h-5" />
                                        Capture Image
                                    </>
                                )}
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <motion.button
                                onClick={retakeImage}
                                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={verificationStatus === "verifying" || verificationStatus === "success"}
                            >
                                Retake
                            </motion.button>

                            <motion.button
                                onClick={verifyFace}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={verificationStatus === "verifying" || verificationStatus === "success"}
                            >
                                {verificationStatus === "verifying" ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Verify Face
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </>
                    )}
                </div>

                <p className="text-white/60 text-xs mt-4 text-center">
                    Please position your face within the circle and ensure good lighting for accurate verification.
                </p>
            </motion.div>
        </motion.div>
    )
}

function InputField({ label, type = "text", value, onChange, disabled = false, icon }) {
    return (
        <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <label className="text-white/90 font-medium text-sm mb-2 block">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300">{icon}</div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full bg-white/10 text-white border border-purple-500/30 h-[50px] pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                        disabled ? "opacity-70 cursor-not-allowed" : "hover:bg-white/15"
                    }`}
                    aria-label={label}
                    required
                />
            </div>
        </motion.div>
    )
}

function LoginForm() {
    const [formData, setFormData] = useState({
        secretId: "",
        username: "",
        password: "",
    })
    const [error, setError] = useState("")
    const [secretIdStatus, setSecretIdStatus] = useState("unverified")
    const [isAdmin, setIsAdmin] = useState(false)
    const [showCredentials, setShowCredentials] = useState(false)
    const [showFaceVerification, setShowFaceVerification] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { apiCall } = useApiWithAuth()

    useEffect(() => {
        const jwtToken = localStorage.getItem("jwtToken")
        if (!jwtToken) {
            console.log("JWT Token not present")
        }
    }, [])

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }))
    }

    const verifySecretId = async () => {
        if (formData.secretId === "TEST") {
            // Activate demo mode
            localStorage.setItem("demoMode", "true")
            navigate("/personal-info-static")
            return
        }
        // Check for ADMIN-TEST mode
        if (formData.secretId === "ADMIN-TEST") {
            // Activate admin demo mode
            localStorage.setItem("demoMode", "true")
            navigate("/admin-dashboard-static")
            return
        }
        try {

            setIsLoading(true)
            const apiUrl = import.meta.env.VITE_API_URL

            const response = await apiCall("GET", apiUrl + "/setSecret", null, {
                params: { id: formData.secretId },
            })

            if (response.data.status === "N") {
                setSecretIdStatus("not_found")
                setError("Secret ID not found.")
                setShowCredentials(false)
            } else if (response.data.status === "R") {
                setSecretIdStatus("register")
                setTimeout(() => navigate("/registration"), 0)
            } else if (response.data.status === "L") {
                setSecretIdStatus("verified")
                setShowCredentials(true)
                setIsAdmin(false)
                setError("")
            } else if (response.data.status === "A") {
                setSecretIdStatus("verified")
                setShowCredentials(true)
                setIsAdmin(true)
                setError("")
            } else if (response.data.status === "L_ADMIN") {
                setSecretIdStatus("verified")
                setShowCredentials(true)
                setIsAdmin(true)
                setError("")
                navigate("/admin-verification")
            }
        } catch (error) {
            setError(error.message || "Error verifying Secret ID")
            setShowCredentials(false)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (credentials) => {
        try {
            setIsLoading(true)
            const apiUrl = import.meta.env.VITE_API_URL

            // Use adminLogin_5 endpoint for admin login
            const endpoint = isAdmin ? "/admin-dashboard" : "/login"

            const response = await apiCall("GET", apiUrl + endpoint, null, {
                params: { username: credentials.username, password: credentials.password },
            })

            if (response.status === 200) {
                return response.data // Successful login
            } else {
                throw response.data // Handle error returned by API
            }
        } catch (error) {
            const message = error.response?.data?.message || "Login failed."
            if (error.response?.status === 401) {
                if (message === "TO") {
                    setError("Session expired. Redirecting to login...")
                    alert("Token expired or invalid. Please log in again.")
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else if (message === "JWT Token Empty" || message === "Error_E") {
                    setError("Not authorized. Please log in again.")
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else {
                    setError(message)
                }
            } else {
                setError(message)
            }

            throw new Error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")

        if (secretIdStatus === "unverified" || secretIdStatus === "not_found") {
            await verifySecretId()
            return
        }

        if (secretIdStatus === "register") {
            navigate("/registration")
            return
        }

        try {
            const response = await login(formData)
            if (response.status === "S") {
                // If login is successful, show face verification
                navigate("/personal-info")
            } else {
                setError(response.message || "An error occurred during login")
            }
        } catch (err) {
            setError(err.message || "An error occurred during login")
        }
    }

    const handleFaceVerificationSuccess = () => {
        // Face verification was successful, proceed to redirect
        if (isAdmin) {
            navigate("/admin-dashboard")
        } else {
            navigate("/personal-info")
        }
    }

    const handleFaceVerificationCancel = () => {
        setShowFaceVerification(false)
    }

    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="mb-8 text-center">
                <motion.div
                    className="inline-block p-4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-md mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                >
                    <Shield className="w-12 h-12 text-pink-400" />
                </motion.div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
                    SecUrVote
                </h1>
                <p className="text-white/70">Secure Authentication System</p>
            </div>

            <motion.form
                onSubmit={handleSubmit}
                className="backdrop-blur-lg bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <InputField
                    label="Secret ID"
                    type="text"
                    value={formData.secretId}
                    onChange={handleChange("secretId")}
                    disabled={secretIdStatus === "verified"}
                    icon={<Lock size={18} />}
                />

                <AnimatePresence>
                    {showCredentials && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <InputField
                                label="Username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange("username")}
                                icon={<User size={18} />}
                            />

                            <InputField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange("password")}
                                icon={<Key size={18} />}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <p>{error}</p>
                    </motion.div>
                )}

                <motion.button
                    type="submit"
                    className="w-full px-6 py-4 mt-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500/70 focus:ring-offset-2 focus:ring-offset-purple-900/40 transition-all duration-300 shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-70"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : secretIdStatus === "verified" ? (
                        <>
                            {isAdmin ? "ADMIN LOGIN" : "LOGIN"} <ArrowRight size={18} />
                        </>
                    ) : (
                        "VERIFY SECRET ID"
                    )}
                </motion.button>
            </motion.form>

            <motion.div
                className="mt-6 text-center text-white/50 text-sm"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.8}}
            >
                <p>© 2025 SecUrVote - Secure Voting System </p>
                <p> </p>
                <p>Enter “TEST” As Your Secretid To View Demonstration Pages Of The Voting Process!</p>
                <p>Enter "ADMIN-TEST" As Your Secretid To View Demonstration Pages Of The Administrative Process!</p>
            </motion.div>

            {/* Face verification modal */}
            <AnimatePresence>
            {showFaceVerification && (
                    <FaceVerification onSuccess={handleFaceVerificationSuccess} onCancel={handleFaceVerificationCancel} />
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Enhance the SecurityIllustration component with more dynamic animations
function SecurityIllustration() {
    return (
        <motion.div
            className="relative w-full max-w-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
        >
            <motion.div
                className="absolute -inset-10 rounded-3xl bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-xl"
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                }}
            />

            <div className="relative z-10">
                <motion.div
                    className="absolute -top-20 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                />

                <motion.div
                    className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/20 rounded-full blur-xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                />

                <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <motion.circle
                        cx="300"
                        cy="300"
                        r="250"
                        stroke="url(#purpleGradient)"
                        strokeWidth="3"
                        strokeDasharray="20 10"
                        fill="none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />

                    <motion.circle
                        cx="300"
                        cy="300"
                        r="200"
                        stroke="url(#pinkGradient)"
                        strokeWidth="3"
                        strokeDasharray="15 15"
                        fill="none"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />

                    <motion.circle
                        cx="300"
                        cy="300"
                        r="150"
                        fill="url(#gradient1)"
                        fillOpacity="0.2"
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.5,
                            filter: {
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                            },
                        }}
                    />

                    <motion.path
                        d="M300 200L300 400"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                    />

                    <motion.path
                        d="M200 300L400 300"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                    />

                    <motion.circle
                        cx="300"
                        cy="300"
                        r="80"
                        fill="url(#gradient2)"
                        fillOpacity="0.6"
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            boxShadow: [
                                "0 0 0px rgba(217, 70, 239, 0)",
                                "0 0 20px rgba(217, 70, 239, 0.5)",
                                "0 0 0px rgba(217, 70, 239, 0)",
                            ],
                        }}
                        transition={{
                            duration: 1,
                            delay: 1.4,
                            type: "spring",
                            boxShadow: {
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                            },
                        }}
                    />

                    {/* Face outline with pulsing effect */}
                    <motion.circle
                        cx="300"
                        cy="300"
                        r="60"
                        stroke="url(#glowGradient)"
                        strokeWidth="3"
                        strokeDasharray="10 5"
                        fill="none"
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            strokeWidth: [3, 5, 3],
                        }}
                        transition={{
                            duration: 1,
                            delay: 1.6,
                            strokeWidth: {
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                            },
                        }}
                    />

                    {/* Eyes with blinking effect */}
                    <motion.circle
                        cx="280"
                        cy="280"
                        r="8"
                        fill="white"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1, 0.1, 1] }}
                        transition={{
                            duration: 0.5,
                            delay: 1.8,
                            scale: {
                                duration: 3,
                                times: [0, 0.9, 0.95, 1],
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 5,
                            },
                        }}
                    />

                    <motion.circle
                        cx="320"
                        cy="280"
                        r="8"
                        fill="white"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1, 0.1, 1] }}
                        transition={{
                            duration: 0.5,
                            delay: 1.9,
                            scale: {
                                duration: 3,
                                times: [0, 0.9, 0.95, 1],
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 5,
                            },
                        }}
                    />

                    {/* Smile with drawing effect */}
                    <motion.path
                        d="M280 320C280 320 290 335 300 335C310 335 320 320 320 320"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 2.0 }}
                    />

                    {/* Camera icon with pulse effect */}
                    <motion.rect
                        x="380"
                        y="380"
                        width="40"
                        height="30"
                        rx="5"
                        fill="url(#cameraGradient)"
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            opacity: [1, 0.8, 1],
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 2.2,
                            type: "spring",
                            opacity: {
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                            },
                        }}
                    />

                    <motion.circle
                        cx="400"
                        cy="395"
                        r="10"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 2.3, type: "spring" }}
                    />

                    {/* Enhanced scanning effect */}
                    <motion.line
                        x1="200"
                        y1="300"
                        x2="400"
                        y2="300"
                        stroke="url(#scanGradient)"
                        strokeWidth="3"
                        strokeDasharray="5 5"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            y: [270, 330, 270],
                            strokeWidth: [2, 4, 2],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                        }}
                    />

                    {/* Particle effects */}
                    {[...Array(8)].map((_, i) => (
                        <motion.circle
                            key={i}
                            cx={300 + Math.cos((i * Math.PI) / 4) * 100}
                            cy={300 + Math.sin((i * Math.PI) / 4) * 100}
                            r={3 + Math.random() * 3}
                            fill="white"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 0.8, 0],
                                scale: [0, 1.5, 0],
                                x: [0, Math.random() * 30 - 15],
                                y: [0, Math.random() * 30 - 15],
                            }}
                            transition={{
                                duration: 2 + Math.random() * 3,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.3,
                            }}
                        />
                    ))}

                    <defs>
                        <radialGradient
                            id="gradient1"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(300 300) rotate(90) scale(150)"
                        >
                            <stop stopColor="#D946EF" />
                            <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
                        </radialGradient>

                        <radialGradient
                            id="gradient2"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(300 300) rotate(90) scale(80)"
                        >
                            <stop stopColor="#A855F7" />
                            <stop offset="1" stopColor="#D946EF" stopOpacity="0" />
                        </radialGradient>

                        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#C026D3" />
                            <stop offset="100%" stopColor="#7E22CE" />
                        </linearGradient>

                        <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#EC4899" />
                            <stop offset="100%" stopColor="#D946EF" />
                        </linearGradient>

                        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#EC4899" />
                            <stop offset="50%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>

                        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
                            <stop offset="50%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                        </linearGradient>

                        <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D946EF" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                    </defs>
                </svg>

                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.4, duration: 0.5 }}
                ></motion.div>
            </div>
        </motion.div>
    )
}

// Enhance the background animation in the main component
export function LoginPage() {
    return (
        <main className="min-h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-purple-950 via-purple-800 to-pink-800 overflow-hidden p-8">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, 15, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                ></motion.div>
                <motion.div
                    className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                        x: [0, -20, 0],
                        y: [0, -15, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                ></motion.div>

                {/* Animated grid background with subtle pulse */}
                <motion.div
                    className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px] opacity-20"
                    animate={{
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                ></motion.div>

                {/* Enhanced animated particles with more variety */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/20 backdrop-blur-sm"
                        style={{
                            width: Math.random() * 30 + 5,
                            height: Math.random() * 30 + 5,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            opacity: [0, Math.random() * 0.5 + 0.1, 0],
                            scale: [0, Math.random() + 0.5, 0],
                            rotate: [0, Math.random() * 360],
                            boxShadow: [
                                "0 0 0px rgba(236, 72, 153, 0)",
                                "0 0 10px rgba(236, 72, 153, 0.3)",
                                "0 0 0px rgba(236, 72, 153, 0)",
                            ],
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
            </div>

            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
                <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-8">
                    <SecurityIllustration />
                </div>
                <div className="w-full md:w-1/2 flex justify-center md:justify-start pl-0 md:pl-8">
                    <LoginForm />
                </div>
            </div>
        </main>
    )
}

export default LoginPage

