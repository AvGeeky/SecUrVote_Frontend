import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
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
    const navigate = useNavigate()
    const { apiCall } = useApiWithAuth()

    const validateEmail = async () => {
        if (!formData.email.includes("@")) {
            setErrorMessage("Please enter a valid email address.")
            return
        }

        try {
            const response = await apiCall("GET", "https://localhost:8443/api/setEmail", null, {
                params: { mail: formData.email },
            });

            if (response.data.status === "S") {
                setShowOtpField(true);
                setErrorMessage(""); // Clear any previous error messages

                // Send OTP after successful email verification
                await apiCall("POST", "https://localhost:8443/api/sendOtp");
            } else {
                // If the backend sends a failure status, display the error message
                setErrorMessage(response.data.message || "Failed to verify email. Please try again.");
            }
        } catch (error) {
            // Check if the error response contains a message, otherwise display a default message
            const errorMessage = error.response?.data?.message || "Failed to verify email. Please try again.";

            // Handle specific error scenarios
            if (error.response?.data?.message === "TO") {
                setErrorMessage("Session expired. Please log in again.");
                // Redirect to login page after a short delay (if necessary)
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else if (error.response?.data?.message === "JWT Token not passed") {
                setErrorMessage("Authorization token is missing. Please log in.");
            } else if (error.response?.data?.message === "Registration is not the mode selected.") {
                setErrorMessage("Invalid registration mode. Please try again.");
            } else if (error.response?.data?.message === "failed email auth.") {
                setErrorMessage("Email authentication failed. Please check your email and try again.");
            } else if (error.response?.data?.message === "Error_E") {
                setErrorMessage("An unknown error occurred. Please try again.");
            } else {
                // For any other errors that don't match the above cases
                setErrorMessage(errorMessage);
            }
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await apiCall("POST", "https://localhost:8443/api/verifyOtp", null, {
                params: { otp_param: formData.otp },
            });

            if (response.data.status === "S") {
                // OTP verified successfully
                setShowPasswordFields(true);  // Show the password fields for further registration
                setShowOtpField(false);  // Hide the OTP field after successful verification
                setErrorMessage("");  // Clear any previous error messages
            } else {
                // Handle OTP verification failure or other error messages
                setErrorMessage(response.data.message || "Failed to verify OTP. Please try again.");
            }
        } catch (error) {
            // Handle specific errors from the backend
            if (error.response?.data?.message === "TO") {
                setErrorMessage("Session expired. Please log in again.");
                // Redirect to login page after a short delay (if necessary)
                setTimeout(() => {
                    navigate("/login");  // Redirect to the login page
                }, 2000);
            } else if (error.response?.data?.message === "JWT Token not passed") {
                setErrorMessage("Authorization token is missing. Please log in.");
            } else if (error.response?.data?.message === "Error. Mail not verified.") {
                setErrorMessage("Please verify your email before proceeding.");
            } else if (error.response?.data?.message === "Error. OTP Already Verified.") {
                setErrorMessage("This OTP has already been verified. Please request a new OTP.");
            } else if (error.response?.data?.message === "OTP Verification Error") {
                setErrorMessage("The OTP you entered is incorrect. Please try again.");
            } else if (error.response?.data?.message === "Error_E") {
                setErrorMessage("An unknown error occurred. Please try again.");
            } else {
                // For any other errors that don't match the above cases
                setErrorMessage(error.response?.data?.message || "Failed to verify OTP. Please try again.");
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (formData.password !== formData.reEnterPassword) {
            setErrorMessage("Passwords do not match.")
            return
        }

        try {
            // Manually construct the URL with query parameters
            const url = `https://localhost:8443/api/registerUser?username=${encodeURIComponent(formData.username)}&password=${encodeURIComponent(formData.reEnterPassword)}`;

            // Make the API call
            const response = await apiCall("GET", url, {});

            // Handle successful registration
            if (response.data.status === "S") {
                alert(`Registration successful. Your Hash ID is: ${response.data.hashID}. Please store it for future use.`);
                navigate("/login");
            } else {
                // Handle failure: display error message from backend response
                setErrorMessage(response.data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            // Handle specific errors: network issues, server errors, etc.
            if (error.response?.data?.message === "TO") {
                setErrorMessage("Session expired. Please log in again.");
                // Redirect to login page after a short delay (if necessary)
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else if (error.response?.data?.message === "JWT Token not passed") {
                setErrorMessage("Authorization token is missing. Please log in.");
            } else if (error.response?.data?.message === "Registration is not the mode selected.") {
                setErrorMessage("Invalid registration mode. Please try again.");
            } else if (error.response?.data?.message === "failed email auth.") {
                setErrorMessage("Email authentication failed. Please check your email and try again.");
            } else if (error.response?.data?.message === "Error_E") {
                setErrorMessage("An unknown error occurred. Please try again.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }else if (error.request) {
                // The request was made, but no response was received
                setErrorMessage("No response received from the server. Please check your network connection.");
            } else {
                // Some other error occurred while setting up the request
                setErrorMessage(`An unexpected error occurred: ${error.message}`);
            }
        }
    };

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

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.3 } },
    }

    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 overflow-hidden p-4 md:p-8">
            <motion.div
                className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between bg-gray-800/30 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="w-full md:w-1/2 flex justify-center mb-12 md:mb-0"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <motion.img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/67446702eabcd31d9bbf137ef3170bebac9ba0f224c2ee2157d3a073fec81b9f"
                        alt="Student registration illustration"
                        className="max-w-full h-auto object-contain rounded-2xl shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>

                <div className="w-full md:w-1/2 flex justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-8">
                        <motion.h1
                            className="text-4xl font-bold leading-tight mb-10 bg-gradient-to-r from-teal-400 to-gray-300 text-transparent bg-clip-text"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 35, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            User Registration
                        </motion.h1>

                        <motion.p
                            className="text-sm text-gray-400"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 0.9 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            You have been automatically redirected here to complete your registration.
                        </motion.p>

                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <motion.div className="w-full" variants={inputVariants}>
                                <label className="block text-white text-lg font-medium mb-3" htmlFor="email">
                                    Email
                                </label>
                                <motion.input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-xl focus:ring-4 focus:ring-blue-500 focus:outline-none bg-white/20 text-white text-lg placeholder-gray-300"
                                    required
                                    placeholder="your.email@example.com"
                                    whileFocus="focus"
                                />
                            </motion.div>

                            {errorMessage && (
                                <motion.p
                                    className="text-red-300 mt-4 text-lg font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {errorMessage}
                                </motion.p>
                            )}

                            {!showOtpField && !showPasswordFields && (
                                <motion.button
                                    type="button"
                                    onClick={async () => {
                                        await new Promise((resolve) => setTimeout(resolve, 50))
                                        validateEmail()
                                    }}
                                    className="w-full px-6 py-3 mt-6 text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Verify Email
                                </motion.button>
                            )}

                            {showOtpField && (
                                <motion.div
                                    className="space-y-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <motion.div variants={inputVariants}>
                                        <label className="block text-white text-lg font-medium mb-3" htmlFor="otp">
                                            OTP
                                        </label>
                                        <motion.input
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-xl focus:ring-4 focus:ring-blue-500 focus:outline-none bg-white/20 text-white text-lg placeholder-gray-300"
                                            required
                                            placeholder="Enter the OTP sent to your email"
                                            whileFocus="focus"
                                        />
                                    </motion.div>
                                    <motion.button
                                        type="button"
                                        onClick={verifyOtp}
                                        className="w-full px-6 py-3 mt-6 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Verify OTP
                                    </motion.button>
                                </motion.div>
                            )}

                            {showPasswordFields && (
                                <motion.div
                                    className="space-y-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="text-3xl font-bold text-white mt-12 mb-8 text-center">Create Your Password</h2>
                                    <motion.div variants={inputVariants}>
                                        <label className="block text-white text-lg font-medium mb-3" htmlFor="username">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <motion.input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-xl focus:ring-4 focus:ring-blue-500 focus:outline-none bg-white/20 text-white text-lg placeholder-gray-300"
                                                required
                                                placeholder="Enter the username"
                                                whileFocus="focus"
                                            />
                                        </div>
                                    </motion.div>
                                    <motion.div variants={inputVariants}>
                                        <label className="block text-white text-lg font-medium mb-3" htmlFor="password">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <motion.input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-xl focus:ring-4 focus:ring-blue-500 focus:outline-none bg-white/20 text-white text-lg placeholder-gray-300"
                                                required
                                                placeholder="Enter your password"
                                                whileFocus="focus"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility("password")}
                                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-white"
                                            >
                                                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                    <motion.div variants={inputVariants}>
                                        <label className="block text-white text-lg font-medium mb-3" htmlFor="reEnterPassword">
                                            Re-enter Password
                                        </label>
                                        <div className="relative">
                                            <motion.input
                                                type={showReEnterPassword ? "text" : "password"}
                                                id="reEnterPassword"
                                                name="reEnterPassword"
                                                value={formData.reEnterPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-xl focus:ring-4 focus:ring-blue-500 focus:outline-none bg-white/20 text-white text-lg placeholder-gray-300"
                                                required
                                                placeholder="Re-enter your password"
                                                whileFocus="focus"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility("reEnterPassword")}
                                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-white"
                                            >
                                                {showReEnterPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                    <motion.button
                                        type="submit"
                                        className="w-full px-8 py-4 mt-8 text-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl focus:ring-4 focus:ring-teal-300 focus:outline-none transition-all duration-300 transform hover:scale-105"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        SUBMIT
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </main>
    )
}

