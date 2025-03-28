"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Camera, X, User, Mail, Phone, Shield, Check, Award, ChevronRight, Key, Fingerprint } from "lucide-react"
import useApiWithAuth from "../hooks/useApiWithAuth"

const clipartOptions = [
    "https://api.dicebear.com/6.x/identicon/svg?seed=Felix",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Aneka",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=Missy",
    "https://api.dicebear.com/6.x/micah/svg?seed=Tigger",
]

function PersonalInfo() {
    const navigate = useNavigate()
    const [profileImage, setProfileImage] = useState("")
    const [isHovering, setIsHovering] = useState(false)
    const [profileData, setProfileData] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const { apiCall } = useApiWithAuth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setProfileImage(clipartOptions[Math.floor(Math.random() * clipartOptions.length)])
    }, [])

    const fetchUserDetails = async () => {
        setIsLoading(true)
        try {
            const apiUrl = import.meta.env.VITE_API_URL

            const response = await apiCall("GET", apiUrl + "/getUserDetails", null, {})

            if (response.data) {
                const userDetails = response.data

                setProfileData([
                    {
                        label: "Name",
                        value: `${userDetails.first_name} ${userDetails.last_name}`,
                        className: "text-sky-300",
                        icon: <User className="w-5 h-5" />,
                    },
                    {
                        label: "Your Username",
                        value: userDetails.username,
                        className: "text-sky-300",
                        icon: <Fingerprint className="w-5 h-5" />,
                    },
                    {
                        label: "Email",
                        value: userDetails.email,
                        className: "text-sky-300",
                        icon: <Mail className="w-5 h-5" />,
                    },
                    {
                        label: "Phone",
                        value: userDetails.phone,
                        className: "text-sky-300",
                        icon: <Phone className="w-5 h-5" />,
                    },
                    {
                        label: "Public/Private Key Generation Status",
                        value: "Successful",
                        className: "text-emerald-400",
                        icon: <Key className="w-5 h-5" />,
                    },
                    {
                        label: "Unique String",
                        value: userDetails.derived,
                        className: "text-emerald-400",
                        icon: <Check className="w-5 h-5" />,
                    },
                ])
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            if (error.response) {
                const { status, data } = error.response

                if (status === 401 && data.message === "TO") {
                    setErrorMessage("Session expired. Redirecting to login...")
                    alert("Token expired or invalid. Please log in again.")
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else if (status === 401 && data.message === "JWT Token not passed") {
                    setErrorMessage("JWT Token not passed")
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else if (status === 401) {
                    setErrorMessage("Not authorized. Please log in again.")
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else if (status === 404) {
                    setErrorMessage("User details not found. Redirecting...")
                    setTimeout(() => {
                        navigate("/404")
                    }, 2000)
                } else {
                    setErrorMessage("Failed to fetch user details. Please try again later.")
                }
            } else {
                setErrorMessage("Network error. Please check your connection.")
            }
        }
    }

    useEffect(() => {
        fetchUserDetails()
    }, []) // Ensure the effect runs only once when the component mounts.

    const handleVoteClick = () => {
        navigate("/voting-instructions")
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setProfileImage(clipartOptions[Math.floor(Math.random() * clipartOptions.length)])
    }

    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-800 to-pink-800 overflow-hidden p-4 md:p-8">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            </div>

            <motion.div
                className="w-full max-w-5xl bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.header
                    className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-8 mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-center gap-4 mb-6 md:mb-0">
                        <Shield className="w-10 h-10 text-blue-400" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 text-transparent bg-clip-text">
                            Personal Info
                        </h1>
                    </div>
                    <motion.button
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                        onClick={handleVoteClick}
                        aria-label="Vote button"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Vote Now <ChevronRight size={18} />
                    </motion.button>
                </motion.header>

                {errorMessage && (
                    <motion.div
                        className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 mb-8 text-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p>{errorMessage}</p>
                    </motion.div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative w-20 h-20">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full opacity-30"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full opacity-75 animate-spin border-t-transparent"></div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <motion.div
                            className="flex flex-col items-center space-y-6 lg:col-span-1"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <motion.div
                                className="relative w-60 h-60 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 shadow-xl border-4 border-white/10"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(37, 99, 235, 0.3)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={profileImage || "/placeholder.svg"}
                                    alt="Profile avatar"
                                    className="w-full h-full object-cover"
                                />
                                {isHovering && (
                                    <motion.div
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <label htmlFor="profile-upload" className="cursor-pointer">
                                            <Camera className="w-12 h-12 text-white" />
                                            <input
                                                type="file"
                                                id="profile-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </motion.div>
                                )}
                            </motion.div>
                            <div className="flex items-center space-x-4">
                                <span className="text-white/90 text-lg font-medium">Profile Picture</span>
                                <motion.button
                                    onClick={handleRemoveImage}
                                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-300"
                                    aria-label="Remove profile picture"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X className="w-4 h-4 text-white" />
                                </motion.button>
                            </div>

                            <motion.div
                                className="w-full bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-400" />
                                    Voter Status
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70">Registration</span>
                                        <span className="text-emerald-400 flex items-center gap-1">
                      <Check size={16} /> Complete
                    </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70">Verification</span>
                                        <span className="text-emerald-400 flex items-center gap-1">
                      <Check size={16} /> Verified
                    </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70">Voting Status</span>
                                        <span className="text-yellow-400">Not Voted</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="space-y-6 lg:col-span-2"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                                <h2 className="text-2xl font-bold text-white mb-6">Personal Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {profileData.slice(0, 4).map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-white/10 backdrop-blur-md rounded-xl p-5 transition-all duration-300 hover:bg-white/15 border border-white/5"
                                            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -15px rgba(255, 255, 255, 0.1)" }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 rounded-full bg-blue-500/20">{item.icon}</div>
                                                <span className={`text-base ${item.className} font-medium`}>{item.label}</span>
                                            </div>
                                            <span className="text-white text-xl font-semibold block mt-2">{item.value}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                                <h2 className="text-2xl font-bold text-white mb-6">Security Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {profileData.slice(4).map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-white/10 backdrop-blur-md rounded-xl p-5 transition-all duration-300 hover:bg-white/15 border border-white/5"
                                            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -15px rgba(255, 255, 255, 0.1)" }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 rounded-full bg-emerald-500/20">{item.icon}</div>
                                                <span className={`text-base ${item.className} font-medium`}>{item.label}</span>
                                            </div>
                                            <span className="text-white text-xl font-semibold block mt-2">{item.value}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="text-xl font-bold text-white">Ready to cast your vote?</h3>
                                        <p className="text-white/70 mt-1">Your vote is secure and anonymous.</p>
                                    </div>
                                    <motion.button
                                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg flex items-center gap-2"
                                        onClick={handleVoteClick}
                                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Proceed to Vote <ChevronRight size={18} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                )}

                <motion.div
                    className="mt-10 text-center text-white/50 text-sm border-t border-white/10 pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <p>© 2025 SecUrVote - Secure Voting System</p>
                </motion.div>
            </motion.div>
        </main>
    )
}

export default PersonalInfo

