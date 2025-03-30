// "use client"
//
// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import useApiWithAuth from "../hooks/useApiWithAuth"
//
// export default function RegistrationPage() {
//     const [formData, setFormData] = useState({
//         email: "",
//         username: "",
//         password: "",
//         reEnterPassword: "",
//         otp: "",
//     })
//
//     const [showPasswordFields, setShowPasswordFields] = useState(false)
//     const [showOtpField, setShowOtpField] = useState(false)
//     const [errorMessage, setErrorMessage] = useState("")
//     const [showPassword, setShowPassword] = useState(false)
//     const [showReEnterPassword, setShowReEnterPassword] = useState(false)
//     const navigate = useNavigate()
//     const { apiCall } = useApiWithAuth()
//
//     const validateEmail = async () => {
//         if (!formData.email.includes("@")) {
//             setErrorMessage("Please enter a valid email address.")
//             return
//         }
//
//         try {
//             const apiUrl = import.meta.env.VITE_API_URL
//
//             const response = await apiCall("GET", apiUrl + "/setEmail", null, {
//                 params: { mail: formData.email },
//             })
//
//             if (response.data.status === "S") {
//                 setShowOtpField(true)
//                 setErrorMessage("") // Clear any previous error messages
//
//                 // Send OTP after successful email verification
//                 const apiUrl = import.meta.env.VITE_API_URL
//
//                 await apiCall("POST", apiUrl + "/sendOtp")
//             } else {
//                 // If the backend sends a failure status, display the error message
//                 setErrorMessage(response.data.message || "Failed to verify email. Please try again.")
//             }
//         } catch (error) {
//             // Check if the error response contains a message, otherwise display a default message
//             const errorMessage = error.response?.data?.message || "Failed to verify email. Please try again."
//
//             // Handle specific error scenarios
//             if (error.response?.data?.message === "TO") {
//                 setErrorMessage("Session expired. Please log in again.")
//                 alert("Token expired or invalid. Please log in again.")
//                 // Redirect to login page after a short delay (if necessary)
//                 setTimeout(() => {
//                     navigate("/login")
//                 }, 2000)
//             } else if (error.response?.data?.message === "JWT Token not passed") {
//                 setErrorMessage("Authorization token is missing. Please log in.")
//             } else if (error.response?.data?.message === "Registration is not the mode selected.") {
//                 setErrorMessage("Invalid registration mode. Please try again.")
//             } else if (error.response?.data?.message === "failed email auth.") {
//                 setErrorMessage("Email authentication failed. Please check your email and try again.")
//             } else if (error.response?.data?.message === "Error_E") {
//                 setErrorMessage("An unknown error occurred. Please try again.")
//             } else {
//                 // For any other errors that don't match the above cases
//                 setErrorMessage(errorMessage)
//             }
//         }
//     }
//
//     const verifyOtp = async () => {
//         try {
//             const apiUrl = import.meta.env.VITE_API_URL
//
//             const response = await apiCall("POST", apiUrl + "/verifyOtp", null, {
//                 params: { otp_param: formData.otp },
//             })
//
//             if (response.data.status === "S") {
//                 // OTP verified successfully
//                 setShowPasswordFields(true) // Show the password fields for further registration
//                 setShowOtpField(false) // Hide the OTP field after successful verification
//                 setErrorMessage("") // Clear any previous error messages
//             } else {
//                 // Handle OTP verification failure or other error messages
//                 setErrorMessage(response.data.message || "Failed to verify OTP. Please try again.")
//             }
//         } catch (error) {
//             // Handle specific errors from the backend
//             if (error.response?.data?.message === "TO") {
//                 setErrorMessage("Session expired. Please log in again.")
//                 alert("Token expired or invalid. Please log in again.")
//                 // Redirect to login page after a short delay (if necessary)
//                 setTimeout(() => {
//                     navigate("/login") // Redirect to the login page
//                 }, 2000)
//             } else if (error.response?.data?.message === "JWT Token not passed") {
//                 setErrorMessage("Authorization token is missing. Please log in.")
//             } else if (error.response?.data?.message === "Error. Mail not verified.") {
//                 setErrorMessage("Please verify your email before proceeding.")
//             } else if (error.response?.data?.message === "Error. OTP Already Verified.") {
//                 setErrorMessage("This OTP has already been verified. Please request a new OTP.")
//             } else if (error.response?.data?.message === "OTP Verification Error") {
//                 setErrorMessage("The OTP you entered is incorrect. Please try again.")
//             } else if (error.response?.data?.message === "Error_E") {
//                 setErrorMessage("An unknown error occurred. Please try again.")
//             } else {
//                 // For any other errors that don't match the above cases
//                 setErrorMessage(error.response?.data?.message || "Failed to verify OTP. Please try again.")
//             }
//         }
//     }
//
//     const handleSubmit = async (event) => {
//         event.preventDefault()
//         if (formData.password !== formData.reEnterPassword) {
//             setErrorMessage("Passwords do not match.")
//             return
//         }
//
//         try {
//             // Manually construct the URL with query parameters
//             const apiUrl = import.meta.env.VITE_API_URL
//
//             const url = `${apiUrl}/registerUser?username=${encodeURIComponent(formData.username)}&password=${encodeURIComponent(formData.reEnterPassword)}`
//
//             // Make the API call
//             const response = await apiCall("GET", url, {})
//
//             // Handle successful registration
//             if (response.data.status === "S") {
//                 alert(`Registration successful. Your Hash ID is: ${response.data.hashID}. Please store it for future use.`)
//                 navigate("/login")
//             } else {
//                 // Handle failure: display error message from backend response
//                 setErrorMessage(response.data.message || "Registration failed. Please try again.")
//             }
//         } catch (error) {
//             // Handle specific errors: network issues, server errors, etc.
//             if (error.response?.data?.message === "TO") {
//                 setErrorMessage("Session expired. Please log in again.")
//                 alert("Token expired or invalid. Please log in again.")
//                 // Redirect to login page after a short delay (if necessary)
//                 setTimeout(() => {
//                     navigate("/login")
//                 }, 2000)
//             } else if (error.response?.data?.message === "JWT Token not passed") {
//                 setErrorMessage("Authorization token is missing. Please log in.")
//             } else if (error.response?.data?.message === "Registration is not the mode selected.") {
//                 setErrorMessage("Invalid registration mode. Please try again.")
//             } else if (error.response?.data?.message === "failed email auth.") {
//                 setErrorMessage("Email authentication failed. Please check your email and try again.")
//             } else if (error.response?.data?.message === "Error_E") {
//                 setErrorMessage("An unknown error occurred. Please try again.")
//                 setTimeout(() => {
//                     navigate("/login")
//                 }, 2000)
//             } else if (error.request) {
//                 // The request was made, but no response was received
//                 setErrorMessage("No response received from the server. Please check your network connection.")
//             } else {
//                 // Some other error occurred while setting up the request
//                 setErrorMessage(`An unexpected error occurred: ${error.message}`)
//             }
//         }
//     }
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prevState) => ({
//             ...prevState,
//             [name]: value,
//         }))
//     }
//
//     const togglePasswordVisibility = (field) => {
//         if (field === "password") {
//             setShowPassword(!showPassword)
//         } else {
//             setShowReEnterPassword(!showReEnterPassword)
//         }
//     }
//
//     return (
//         <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-800 to-pink-800 overflow-hidden p-4 md:p-8">
//             {/* Background elements */}
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute top-0 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
//                 <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
//                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
//             </div>
//
//             <motion.div
//                 className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between backdrop-blur-sm bg-white/5 rounded-3xl p-6 md:p-10 shadow-2xl border border-white/10 relative z-10"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 {/* Left side - Illustration */}
//                 <motion.div
//                     className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0 p-4"
//                     initial={{ x: -50, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ duration: 0.8, type: "spring" }}
//                 >
//                     <div className="relative">
//                         <motion.div
//                             className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-indigo-600/20 blur-xl"
//                             animate={{
//                                 opacity: [0.5, 0.8, 0.5],
//                                 scale: [1, 1.05, 1],
//                             }}
//                             transition={{
//                                 duration: 5,
//                                 repeat: Number.POSITIVE_INFINITY,
//                                 repeatType: "reverse"
//                             }}
//                         />
//
//                         <motion.div
//                             className="relative z-10 w-full max-w-md"
//                             whileHover={{ scale: 1.02 }}
//                             transition={{ type: "spring", stiffness: 100 }}
//                         >
//                             <motion.div
//                                 className="w-full h-full"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ delay: 0.5, duration: 1 }}
//                             >
//                                 <svg
//                                     viewBox="0 0 500 500"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="w-full h-auto"
//                                 >
//                                     <motion.rect
//                                         x="150"
//                                         y="100"
//                                         width="200"
//                                         height="300"
//                                         rx="20"
//                                         fill="#0EA5"
//                                         fillOpacity="0.3"
//                                     initial={{ y: 20, opacity: 0 }}
//                                     animate={{ y: 0, opacity: 1 }}
//                                     transition={{ duration: 0.8 }}
//                                     />
//
//                                     <motion.rect
//                                         x="175"
//                                         y="150"
//                                         width="150"
//                                         height="30"
//                                         rx="5"
//                                         fill="white"
//                                         fillOpacity="0.3"
//                                         initial={{ width: 0 }}
//                                         animate={{ width: 150 }}
//                                         transition={{ duration: 0.8, delay: 0.5 }}
//                                     />
//
//                                     <motion.rect
//                                         x="175"
//                                         y="200"
//                                         width="150"
//                                         height="30"
//                                         rx="5"
//                                         fill="white"
//                                         fillOpacity="0.3"
//                                         initial={{ width: 0 }}
//                                         animate={{ width: 150 }}
//                                         transition={{ duration: 0.8, delay: 0.7 }}
//                                     />
//
//                                     <motion.rect
//                                         x="175"
//                                         y="250"
//                                         width="150"
//                                         height="30"
//                                         rx="5"
//                                         fill="white"
//                                         fillOpacity="0.3"
//                                         initial={{ width: 0 }}
//                                         animate={{ width: 150 }}
//                                         transition={{ duration: 0.8, delay: 0.9 }}
//                                     />
//
//                                     <motion.rect
//                                         x="175"
//                                         y="300"
//                                         width="150"
//                                         height="40"
//                                         rx="10"
//                                         fill="#0EA5E9"
//                                         initial={{ width: 0 }}
//                                         animate={{ width: 150 }}
//                                         transition={{ duration: 0.8, delay: 1.1 }}
//                                     />
//
//                                     <motion.circle
//                                         cx="250"
//                                         cy="80"
//                                         r="30"
//                                         fill="#818CF8"
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         transition={{ duration: 0.5, delay: 1.3, type: "spring" }}
//                                     />
//
//                                     <motion.path
//                                         d="M235 80L245 90L265 70"
//                                         stroke="white"
//                                         strokeWidth="4"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         initial={{ pathLength: 0 }}
//                                         animate={{ pathLength: 1 }}
//                                         transition={{ duration: 0.5, delay: 1.5 }}
//                                     />
//
//                                     <motion.circle
//                                         cx="250"
//                                         cy="320"
//                                         r="10"
//                                         fill="white"
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         transition={{ duration: 0.5, delay: 1.7, type: "spring" }}
//                                     />
//
//                                     <motion.circle
//                                         cx="250"
//                                         cy="250"
//                                         r="100"
//                                         stroke="#38BDF8"
//                                         strokeWidth="2"
//                                         strokeDasharray="10 5"
//                                         fill="none"
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         transition={{ duration: 1, delay: 0.3 }}
//                                     />
//
//                                     <motion.circle
//                                         cx="250"
//                                         cy="250"
//                                         r="150"
//                                         stroke="#818CF8"
//                                         strokeWidth="2"
//                                         strokeDasharray="15 10"
//                                         fill="none"
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         transition={{ duration: 1, delay: 0.1 }}
//                                     />
//                                 </svg>
//                             </motion.div>
//                         </motion.div>
//                     </div>
//                 </motion.div>
//
//                 {/* Right side - Form */}
//                 <div className="w-full lg:w-1/2 flex justify-center">
//                     <motion.div
//                         className="w-full max-w-md"
//                         initial={{ opacity: 0, x: 50 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.8, delay: 0.3 }}
//                     >
//                         <motion.h1
//                             className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text"
//                             initial={{ y: -20, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             Create Your Account
//                         </motion.h1>
//
//                         <motion.p
//                             className="text-white/70 mb-8"
//                             initial={{ y: -20, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ duration: 0.5, delay: 0.1 }}
//                         >
//                             Complete the registration process to access the secure voting system.
//                         </motion.p>
//
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             <AnimatePresence mode="wait">
//                                 {!showOtpField && !showPasswordFields && (
//                                     <motion.div
//                                         key="email-step"
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, y: -20 }}
//                                         transition={{ duration: 0.3 }}
//                                         className="space-y-6"
//                                     >
//                                         <div className="space-y-2">
//                                             <label className="block text-white/90 font-medium text-sm">Email Address</label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
//                                                     <Mail size={18} />
//                                                 </div>
//                                                 <input
//                                                     type="email"
//                                                     name="email"
//                                                     value={formData.email}
//                                                     onChange={handleInputChange}
//                                                     className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
//                                                     placeholder="your.email@example.com"
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>
//
//                                         <motion.button
//                                             type="button"
//                                             onClick={validateEmail}
//                                             className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-blue-900/40 transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
//                                             whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)" }}
//                                             whileTap={{ scale: 0.98 }}
//                                         >
//                                             Verify Email <ArrowRight size={18} />
//                                         </motion.button>
//                                     </motion.div>
//                                 )}
//
//                                 {showOtpField && (
//                                     <motion.div
//                                         key="otp-step"
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, y: -20 }}
//                                         transition={{ duration: 0.3 }}
//                                         className="space-y-6"
//                                     >
//                                         <motion.div
//                                             className="flex items-center gap-2 text-green-400 mb-4"
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             transition={{ delay: 0.2 }}
//                                         >
//                                             <CheckCircle size={20} />
//                                             <span>Email verified successfully</span>
//                                         </motion.div>
//
//                                         <div className="space-y-2">
//                                             <label className="block text-white/90 font-medium text-sm">One-Time Password (OTP)</label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
//                                                     <Lock size={18} />
//                                                 </div>
//                                                 <input
//                                                     type="text"
//                                                     name="otp"
//                                                     value={formData.otp}
//                                                     onChange={handleInputChange}
//                                                     className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
//                                                     placeholder="Enter the OTP sent to your email"
//                                                     required
//                                                 />
//                                             </div>
//                                             <p className="text-white/60 text-sm mt-2">
//                                                 Please check your email for the OTP code we just sent you.
//                                             </p>
//                                         </div>
//
//                                         <motion.button
//                                             type="button"
//                                             onClick={verifyOtp}
//                                             className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-blue-900/40 transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
//                                             whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)" }}
//                                             whileTap={{ scale: 0.98 }}
//                                         >
//                                             Verify OTP <ArrowRight size={18} />
//                                         </motion.button>
//                                     </motion.div>
//                                 )}
//
//                                 {showPasswordFields && (
//                                     <motion.div
//                                         key="password-step"
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, y: -20 }}
//                                         transition={{ duration: 0.3 }}
//                                         className="space-y-6"
//                                     >
//                                         <motion.div
//                                             className="flex items-center gap-2 text-green-400 mb-4"
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             transition={{ delay: 0.2 }}
//                                         >
//                                             <CheckCircle size={20} />
//                                             <span>OTP verified successfully</span>
//                                         </motion.div>
//
//                                         <div className="space-y-2">
//                                             <label className="block text-white/90 font-medium text-sm">Username</label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
//                                                     <User size={18} />
//                                                 </div>
//                                                 <input
//                                                     type="text"
//                                                     name="username"
//                                                     value={formData.username}
//                                                     onChange={handleInputChange}
//                                                     className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
//                                                     placeholder="Choose a username"
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>
//
//                                         <div className="space-y-2">
//                                             <label className="block text-white/90 font-medium text-sm">Password</label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
//                                                     <Lock size={18} />
//                                                 </div>
//                                                 <input
//                                                     type={showPassword ? "text" : "password"}
//                                                     name="password"
//                                                     value={formData.password}
//                                                     onChange={handleInputChange}
//                                                     className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
//                                                     placeholder="Create a strong password"
//                                                     required
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => togglePasswordVisibility("password")}
//                                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
//                                                 >
//                                                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                                 </button>
//                                             </div>
//                                         </div>
//
//                                         <div className="space-y-2">
//                                             <label className="block text-white/90 font-medium text-sm">Confirm Password</label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
//                                                     <Lock size={18} />
//                                                 </div>
//                                                 <input
//                                                     type={showReEnterPassword ? "text" : "password"}
//                                                     name="reEnterPassword"
//                                                     value={formData.reEnterPassword}
//                                                     onChange={handleInputChange}
//                                                     className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
//                                                     placeholder="Confirm your password"
//                                                     required
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => togglePasswordVisibility("reEnterPassword")}
//                                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
//                                                 >
//                                                     {showReEnterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                                 </button>
//                                             </div>
//                                         </div>
//
//                                         <motion.button
//                                             type="submit"
//                                             className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-blue-900/40 transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
//                                             whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)" }}
//                                             whileTap={{ scale: 0.98 }}
//                                         >
//                                             Complete Registration <CheckCircle size={18} />
//                                         </motion.button>
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>
//
//                             {errorMessage && (
//                                 <motion.div
//                                     className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 flex items-start gap-3"
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.3 }}
//                                 >
//                                     <AlertCircle size={20} className="shrink-0 mt-0.5" />
//                                     <p>{errorMessage}</p>
//                                 </motion.div>
//                             )}
//                         </form>
//
//                         <motion.div
//                             className="mt-8 text-center text-white/50 text-sm"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.8 }}
//                         >
//                             <p>© 2025 SecUrVote - Secure Voting System</p>
//                         </motion.div>
//                     </motion.div>
//                 </div>
//             </motion.div>
//         </main>
//     )
// }
//
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import useApiWithAuth from "../hooks/useApiWithAuth"

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        reEnterPassword: "",
        otp: "",
    })

    const [showPasswordFields, setShowPasswordFields] = useState(false)
    const [showOtpField, setShowOtpField] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showReEnterPassword, setShowReEnterPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isOtpLoading, setIsOtpLoading] = useState(false)
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)
    const navigate = useNavigate()
    const { apiCall } = useApiWithAuth()

    const validateEmail = async (e) => {
        // Prevent default form submission if called from a form
        if (e) e.preventDefault()

        if (!formData.email.includes("@")) {
            setErrorMessage("Please enter a valid email address.")
            return
        }

        try {
            setIsLoading(true)
            const apiUrl = import.meta.env.VITE_API_URL

            const response = await apiCall("GET", apiUrl + "/setEmail", null, {
                params: { mail: formData.email },
            })

            if (response.data.status === "S") {
                setShowOtpField(true)
                setErrorMessage("") // Clear any previous error messages

                // Send OTP after successful email verification
                const apiUrl = import.meta.env.VITE_API_URL

                await apiCall("POST", apiUrl + "/sendOtp")
            } else {
                // If the backend sends a failure status, display the error message
                setErrorMessage(response.data.message || "Failed to verify email. Please try again.")
            }
        } catch (error) {
            // Check if the error response contains a message, otherwise display a default message
            const errorMessage = error.response?.data?.message || "Failed to verify email. Please try again."

            // Handle specific error scenarios
            if (error.response?.data?.message === "TO") {
                setErrorMessage("Session expired. Please log in again.")
                alert("Token expired or invalid. Please log in again.")
                // Redirect to login page after a short delay (if necessary)
                setTimeout(() => {
                    navigate("/login")
                }, 2000)
            } else if (error.response?.data?.message === "JWT Token not passed") {
                setErrorMessage("Authorization token is missing. Please log in.")
            } else if (error.response?.data?.message === "Registration is not the mode selected.") {
                setErrorMessage("Invalid registration mode. Please try again.")
            } else if (error.response?.data?.message === "failed email auth.") {
                setErrorMessage("Email authentication failed. Please check your email and try again.")
            } else if (error.response?.data?.message === "Error_E") {
                setErrorMessage("An unknown error occurred. Please try again.")
            } else {
                // For any other errors that don't match the above cases
                setErrorMessage(errorMessage)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const verifyOtp = async (e) => {
        // Prevent default form submission if called from a form
        if (e) e.preventDefault()

        try {
            setIsOtpLoading(true)
            const apiUrl = import.meta.env.VITE_API_URL

            const response = await apiCall("POST", apiUrl + "/verifyOtp", null, {
                params: { otp_param: formData.otp },
            })

            if (response.data.status === "S") {
                // OTP verified successfully
                setShowPasswordFields(true) // Show the password fields for further registration
                setShowOtpField(false) // Hide the OTP field after successful verification
                setErrorMessage("") // Clear any previous error messages
            } else {
                // Handle OTP verification failure or other error messages
                setErrorMessage(response.data.message || "Failed to verify OTP. Please try again.")
            }
        } catch (error) {
            // Handle specific errors from the backend
            if (error.response?.data?.message === "TO") {
                setErrorMessage("Session expired. Please log in again.")
                alert("Token expired or invalid. Please log in again.")
                // Redirect to login page after a short delay (if necessary)
                setTimeout(() => {
                    navigate("/login") // Redirect to the login page
                }, 2000)
            } else if (error.response?.data?.message === "JWT Token not passed") {
                setErrorMessage("Authorization token is missing. Please log in.")
            } else if (error.response?.data?.message === "Error. Mail not verified.") {
                setErrorMessage("Please verify your email before proceeding.")
            } else if (error.response?.data?.message === "Error. OTP Already Verified.") {
                setErrorMessage("This OTP has already been verified. Please request a new OTP.")
            } else if (error.response?.data?.message === "OTP Verification Error") {
                setErrorMessage("The OTP you entered is incorrect. Please try again.")
            } else if (error.response?.data?.message === "Error_E") {
                setErrorMessage("An unknown error occurred. Please try again.")
            } else {
                // For any other errors that don't match the above cases
                setErrorMessage(error.response?.data?.message || "Failed to verify OTP. Please try again.")
            }
        } finally {
            setIsOtpLoading(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        // Determine which step we're on and call the appropriate function
        if (!showOtpField && !showPasswordFields) {
            await validateEmail(event)
            return
        }

        if (showOtpField && !showPasswordFields) {
            await verifyOtp(event)
            return
        }

        // Only proceed with registration if we're on the password step
        if (showPasswordFields) {
            if (formData.password !== formData.reEnterPassword) {
                setErrorMessage("Passwords do not match.")
                return
            }

            try {
                setIsRegisterLoading(true)
                // Manually construct the URL with query parameters
                const apiUrl = import.meta.env.VITE_API_URL

                const url = `${apiUrl}/registerUser?username=${encodeURIComponent(formData.username)}&password=${encodeURIComponent(formData.reEnterPassword)}`

                // Make the API call
                const response = await apiCall("GET", url, {})

                // Handle successful registration
                if (response.data.status === "S") {
                    alert(`Registration successful. Your Magic ID is: ${response.data.hashID}. Please store it for future use.`)
                    navigate("/login")
                } else {
                    // Handle failure: display error message from backend response
                    setErrorMessage(response.data.message || "Registration failed. Please try again.")
                }
            } catch (error) {
                // Handle specific errors: network issues, server errors, etc.
                if (error.response?.data?.message === "TO") {
                    setErrorMessage("Session expired. Please log in again.")
                    alert("Token expired or invalid. Please log in again.")
                    // Redirect to login page after a short delay (if necessary)
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else if (error.response?.data?.message === "JWT Token not passed") {
                    setErrorMessage("Authorization token is missing. Please log in.")
                } else if (error.response?.data?.message === "Registration is not the mode selected.") {
                    setErrorMessage("Invalid registration mode. Please try again.")
                } else if (error.response?.data?.message === "failed email auth.") {
                    setErrorMessage("Email authentication failed. Please check your email and try again.")
                } else if (error.response?.data?.message === "Error_E") {
                    setErrorMessage("An unknown error occurred. Please try again.")
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else if (error.request) {
                    // The request was made, but no response was received
                    setErrorMessage("No response received from the server. Please check your network connection.")
                } else {
                    // Some other error occurred while setting up the request
                    setErrorMessage(`An unexpected error occurred: ${error.message}`)
                }
            } finally {
                setIsRegisterLoading(false)
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const togglePasswordVisibility = (field) => {
        if (field === "password") {
            setShowPassword(!showPassword)
        } else {
            setShowReEnterPassword(!showReEnterPassword)
        }
    }

    // Handle key press to prevent form submission on Enter in email and OTP fields
    const handleKeyPress = (e, currentStep) => {
        if (e.key === "Enter") {
            e.preventDefault()

            if (currentStep === "email") {
                validateEmail()
            } else if (currentStep === "otp") {
                verifyOtp()
            }
            // For password step, let the form handle it normally
        }
    }

    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-800 to-pink-800 overflow-hidden p-4 md:p-8">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-0 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
                    className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                ></motion.div>
            </div>

            <motion.div
                className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between backdrop-blur-sm bg-white/5 rounded-3xl p-6 md:p-10 shadow-2xl border border-white/10 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Left side - Illustration */}
                <motion.div
                    className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0 p-4"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <div className="relative">
                        <motion.div
                            className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-indigo-600/20 blur-xl"
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

                        <motion.div
                            className="relative z-10 w-full max-w-md"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <motion.div
                                className="w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 1 }}
                            >
                                <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                                    <motion.rect
                                        x="150"
                                        y="100"
                                        width="200"
                                        height="300"
                                        rx="20"
                                        fill="#0EA5E9"
                                        fillOpacity="0.3"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8 }}
                                    />

                                    <motion.rect
                                        x="175"
                                        y="150"
                                        width="150"
                                        height="30"
                                        rx="5"
                                        fill="white"
                                        fillOpacity="0.3"
                                        initial={{ width: 0 }}
                                        animate={{ width: 150 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    />

                                    <motion.rect
                                        x="175"
                                        y="200"
                                        width="150"
                                        height="30"
                                        rx="5"
                                        fill="white"
                                        fillOpacity="0.3"
                                        initial={{ width: 0 }}
                                        animate={{ width: 150 }}
                                        transition={{ duration: 0.8, delay: 0.7 }}
                                    />

                                    <motion.rect
                                        x="175"
                                        y="250"
                                        width="150"
                                        height="30"
                                        rx="5"
                                        fill="white"
                                        fillOpacity="0.3"
                                        initial={{ width: 0 }}
                                        animate={{ width: 150 }}
                                        transition={{ duration: 0.8, delay: 0.9 }}
                                    />

                                    <motion.rect
                                        x="175"
                                        y="300"
                                        width="150"
                                        height="40"
                                        rx="10"
                                        fill="#0EA5E9"
                                        initial={{ width: 0 }}
                                        animate={{ width: 150 }}
                                        transition={{ duration: 0.8, delay: 1.1 }}
                                    />

                                    <motion.circle
                                        cx="250"
                                        cy="80"
                                        r="30"
                                        fill="#818CF8"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5, delay: 1.3, type: "spring" }}
                                    />

                                    <motion.path
                                        d="M235 80L245 90L265 70"
                                        stroke="white"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 1.5 }}
                                    />

                                    <motion.circle
                                        cx="250"
                                        cy="320"
                                        r="10"
                                        fill="white"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5, delay: 1.7, type: "spring" }}
                                    />

                                    <motion.circle
                                        cx="250"
                                        cy="250"
                                        r="100"
                                        stroke="#38BDF8"
                                        strokeWidth="2"
                                        strokeDasharray="10 5"
                                        fill="none"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                    />

                                    <motion.circle
                                        cx="250"
                                        cy="250"
                                        r="150"
                                        stroke="#818CF8"
                                        strokeWidth="2"
                                        strokeDasharray="15 10"
                                        fill="none"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 1, delay: 0.1 }}
                                    />
                                </svg>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right side - Form */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <motion.h1
                            className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Create Your Account
                        </motion.h1>

                        <motion.p
                            className="text-white/70 mb-8"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Complete the registration process to access the secure voting system.
                        </motion.p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {!showOtpField && !showPasswordFields && (
                                    <motion.div
                                        key="email-step"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="block text-white/90 font-medium text-sm">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    onKeyPress={(e) => handleKeyPress(e, "email")}
                                                    className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                                    placeholder="your.email@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <motion.button
                                            type="button"
                                            onClick={validateEmail}
                                            className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-blue-900/40 transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-70"
                                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)" }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <motion.div
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    />
                                                    <span>Verifying...</span>
                                                </>
                                            ) : (
                                                <>
                                                    Verify Email <ArrowRight size={18} />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}

                                {showOtpField && (
                                    <motion.div
                                        key="otp-step"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <motion.div
                                            className="flex items-center gap-2 text-green-400 mb-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <CheckCircle size={20} />
                                            <span>Email verified successfully</span>
                                        </motion.div>

                                        <div className="space-y-2">
                                            <label className="block text-white/90 font-medium text-sm">One-Time Password (OTP)</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="otp"
                                                    value={formData.otp}
                                                    onChange={handleInputChange}
                                                    onKeyPress={(e) => handleKeyPress(e, "otp")}
                                                    className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                                    placeholder="Enter the OTP sent to your email"
                                                    required
                                                />
                                            </div>
                                            <p className="text-white/60 text-sm mt-2">
                                                Please check your email for the OTP code we just sent you.
                                            </p>
                                        </div>

                                        <motion.button
                                            type="button"
                                            onClick={verifyOtp}
                                            className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-blue-900/40 transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-70"
                                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)" }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isOtpLoading}
                                        >
                                            {isOtpLoading ? (
                                                <>
                                                    <motion.div
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    />
                                                    <span>Verifying OTP...</span>
                                                </>
                                            ) : (
                                                <>
                                                    Verify OTP <ArrowRight size={18} />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}

                                {showPasswordFields && (
                                    <motion.div
                                        key="password-step"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <motion.div
                                            className="flex items-center gap-2 text-green-400 mb-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <CheckCircle size={20} />
                                            <span>OTP verified successfully</span>
                                        </motion.div>

                                        <div className="space-y-2">
                                            <label className="block text-white/90 font-medium text-sm">Username</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                                    placeholder="Choose a username"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-white/90 font-medium text-sm">Password</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                                    placeholder="Create a strong password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility("password")}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-white/90 font-medium text-sm">Confirm Password</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type={showReEnterPassword ? "text" : "password"}
                                                    name="reEnterPassword"
                                                    value={formData.reEnterPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/10 text-white border border-cyan-500/30 h-[50px] pl-12 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                                    placeholder="Confirm your password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility("reEnterPassword")}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                                                >
                                                    {showReEnterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <motion.button
                                            type="submit"
                                            className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-blue-900/40 transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-70"
                                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)" }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isRegisterLoading}
                                        >
                                            {isRegisterLoading ? (
                                                <>
                                                    <motion.div
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    />
                                                    <span>Registering...</span>
                                                </>
                                            ) : (
                                                <>
                                                    Complete Registration <CheckCircle size={18} />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {errorMessage && (
                                <motion.div
                                    className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 flex items-start gap-3"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                    <p>{errorMessage}</p>
                                </motion.div>
                            )}
                        </form>

                        <motion.div
                            className="mt-8 text-center text-white/50 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <p>© 2025 SecUrVote - The Secure Voting System</p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </main>
    )
}

