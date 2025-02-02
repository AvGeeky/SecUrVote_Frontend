import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X } from "lucide-react";
import useApiWithAuth from "../hooks/useApiWithAuth";

const clipartOptions = [
    "https://api.dicebear.com/6.x/identicon/svg?seed=Felix",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Aneka",
    "https://api.dicebear.com/6.x/avataaars/svg?seed=Missy",
    "https://api.dicebear.com/6.x/micah/svg?seed=Tigger",
];

function PersonalInfo() {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState("");
    const [isHovering, setIsHovering] = useState(false);
    const [profileData, setProfileData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const { apiCall } = useApiWithAuth();

    useEffect(() => {
        setProfileImage(clipartOptions[Math.floor(Math.random() * clipartOptions.length)]);
    }, []);

    const fetchUserDetails = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;

            const response = await apiCall("GET", apiUrl+'/getUserDetails', null, {

            });

            if (response.data) {
                const userDetails = response.data;

                setProfileData([
                    { label: "Name", value: `${userDetails.first_name} ${userDetails.last_name}`, className: "text-sky-300" },
                    { label: "Your Username", value: userDetails.username, className: "text-sky-300" },
                    { label: "Email", value: userDetails.email, className: "text-sky-300" },
                    { label: "Phone", value: userDetails.phone, className: "text-sky-300" },
                    { label: "Public/Private Key Generation Status", value: "Successful", className: "text-emerald-400" },
                    { label: "Eligible", value: "True", className: "text-emerald-400" },
                ]);
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 401 && data.message === "TO") {
                    setErrorMessage("Session expired. Redirecting to login...");
                    alert("Token expired or invalid. Please log in again.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else if (status === 401 && data.message === "JWT Token not passed") {
                    setErrorMessage("JWT Token not passed");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                }else if (status === 401) {
                    setErrorMessage("Not authorized. Please log in again.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                }
                else if (status === 404) {
                    setErrorMessage("User details not found. Redirecting...");
                    setTimeout(() => {
                        navigate("/404");
                    }, 2000);
                } else {
                    setErrorMessage("Failed to fetch user details. Please try again later.");
                }
            } else {
                setErrorMessage("Network error. Please check your connection.");
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []); // Ensure the effect runs only once when the component mounts.


    const handleVoteClick = () => {
        navigate("/voting-instructions");
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(clipartOptions[Math.floor(Math.random() * clipartOptions.length)]);
    };

    return (
        <main className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 overflow-hidden p-4 md:p-8">
            <div className="w-full max-w-5xl bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl">
                <header className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-8 mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 md:mb-0">Personal Info</h1>
                    <button
                        className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        onClick={handleVoteClick}
                        aria-label="Vote button"
                    >
                        Vote Now
                    </button>
                </header>

                {errorMessage && <p className="text-red-500 text-center mb-6">{errorMessage}</p>}

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="flex flex-col items-center space-y-6 lg:col-span-1">
                        <div
                            className="relative w-60 h-60 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <img
                                src={profileImage || "/placeholder.svg"}
                                alt="Profile avatar"
                                className="w-full h-full object-cover"
                            />
                            {isHovering && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-white/90 text-lg font-medium">Profile Picture</span>
                            <button
                                onClick={handleRemoveImage}
                                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-300"
                                aria-label="Remove profile picture"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8 lg:col-span-2">
                        {profileData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-6 transition-all duration-300 hover:bg-white/20"
                            >
                                <span className={`text-base ${item.className} block mb-2 font-medium`}>{item.label}</span>
                                <span className="text-white text-xl font-semibold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default PersonalInfo;
