import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ChevronDown, LogOut, Settings, HelpCircle } from "lucide-react";
import useApiWithAuth from "../hooks/useApiWithAuth";

// eslint-disable-next-line react/prop-types
function InputField({ label, type = "text", value, onChange, disabled = false }) {
    return (
        <motion.label
            className="flex flex-col text-lg text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <span className="mb-2 font-medium">{label}</span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`flex shrink-0 self-stretch w-full bg-white/20 text-white h-[43px] px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 hover:bg-white/30 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-label={label}
                required
            />
        </motion.label>
    );
}

function LoginForm() {
    const [formData, setFormData] = useState({
        secretId: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [secretIdStatus, setSecretIdStatus] = useState("unverified");
    const navigate = useNavigate();
    const { apiCall } = useApiWithAuth();

    useEffect(() => {
        let jwtToken = localStorage.getItem("jwtToken");
        if(!jwtToken) {
            console.log("JWT Token not present");
        }
    },[]);

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const verifySecretId = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;

            const response = await apiCall("GET", apiUrl+'/setSecret', null, {
                params: { id: formData.secretId },
            });

            if (response.data.status === "N") {
                setSecretIdStatus("not_found");
                setError("Secret ID not found.");
            } else if (response.data.status === "R") {
                setSecretIdStatus("register");
                setTimeout(() => navigate("/registration"), 0);
            } else if (response.data.status === "L") {
                setSecretIdStatus("verified");
                setError("");
            } else if (response.data.status === "A") {
                // Handle admin login
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError(data.message);
        }
    };


    const login = async (credentials) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;

            const response = await apiCall("GET", apiUrl+'/login', null, {
                params: { username: credentials.username, password: credentials.password },

            });

            if (response.status === 200) {
                return response.data; // Successful login
            } else {
                throw response.data; // Handle error returned by API
            }
        } catch (error) {
            const message = error.response?.data?.message || "Login failed.";
            if (error.response?.status === 401) {
                if (message === "TO") {
                    setError("Session expired. Redirecting to login...");
                    alert("Token expired or invalid. Please log in again.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else if (message === "JWT Token Empty" || message === "Error_E") {
                    setError("Not authorized. Please log in again.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    setError(message);
                }
            } else {
                setError(message);
            }

            throw new Error(message);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (secretIdStatus === "unverified" || secretIdStatus === "not_found") {
            await verifySecretId();
            return;
        }

        if (secretIdStatus === "register") {
            navigate("/registration");
            return;
        }

        try {
            const response = await login(formData);
            if (response.status === "S") {
                navigate("/personal-info");
            } else {
                setError(response.message || "An error occurred during login");
            }
        } catch (err) {
            setError(err.message || "An error occurred during login");
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text text-center">
                User Authorization
            </h1>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 space-y-4 shadow-lg">
                <InputField
                    label="Secret ID"
                    type="text"
                    value={formData.secretId}
                    onChange={handleChange("secretId")}
                    disabled={secretIdStatus === "verified"}
                />

                <InputField
                    label="Username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange("username")}
                    disabled={secretIdStatus !== "verified"}
                />

                <InputField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    disabled={secretIdStatus !== "verified"}
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <motion.button
                    type="submit"
                    className="w-full px-6 py-3 mt-6 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {secretIdStatus === "verified" ? "LOGIN" : "VERIFY SECRET ID"}
                </motion.button>
            </div>
        </motion.form>
    );
}

function LoginIllustration() {
    return (
        <motion.div
            className="w-full md:w-1/2 flex items-center justify-center p-8 mb-8 md:mb-0"
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
            <motion.img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6221094fe2c7c8ad2a39e4d14fce6f10acddd7c0a340bec06c10c8831a8c6af3"
                alt="Login page illustration"
                className="max-w-full h-auto object-contain"
                whileHover={{ filter: "hue-rotate(90deg)", transition: { duration: 0.5 } }}
            />
        </motion.div>
    );
}

function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    // return (
    //     <div className="relative">
    //         <motion.button
    //             className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300"
    //             onClick={() => setIsOpen(!isOpen)}
    //             whileHover={{ scale: 1.05 }}
    //             whileTap={{ scale: 0.95 }}
    //         >
    //             <User size={20} />
    //             <ChevronDown size={20} />
    //         </motion.button>
    //
    //         {isOpen && (
    //             <motion.div
    //                 className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl overflow-hidden"
    //                 initial={{ opacity: 0, y: -20 }}
    //                 animate={{ opacity: 1, y: -10 }}
    //                 exit={{ opacity: 0, y: -20 }}
    //                 transition={{ duration: 0.2 }}
    //             >
    //                 {isLoggedIn ? (
    //                     <>
    //                         <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
    //                             <Settings size={18} className="inline mr-2" /> Profile
    //                         </a>
    //                         <a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
    //                             <LogOut size={18} className="inline mr-2" /> Logout
    //                         </a>
    //                     </>
    //                 ) : (
    //                     <a href="/voting-instructions" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
    //                         <HelpCircle size={18} className="inline mr-2" /> Instructions
    //                     </a>
    //                 )}
    //                 <a href="/about" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
    //                     <HelpCircle size={18} className="inline mr-2" /> About
    //                 </a>
    //             </motion.div>
    //         )}
    //     </div>
    // );
}

export function LoginPage() {
    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-purple-700 to-pink-700 overflow-hidden">
            <div className="absolute top-4 right-4">
                <UserMenu />
            </div>
            <div className="w-full px-4 py-8 flex flex-col md:flex-row items-center justify-between">
                <LoginIllustration />
                <div className="w-full md:w-1/2 flex justify-center">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}