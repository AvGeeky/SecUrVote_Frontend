import axios from "axios";

const useApiWithAuth = () => {
    const apiCall = async (method, url, data = null, config = {}) => {
        const jwtToken = localStorage.getItem("jwtToken");

        // Check if the JWT token exists
        if (!jwtToken) {
            console.log("JWT Token not present");
        }

        // Ensure `url` is valid
        if (!url || typeof url !== "string") {
            console.error("Invalid API URL:", url);
            throw new Error("Invalid API URL");
        }

        const headers = {
            Authorization: jwtToken ? `Bearer ${jwtToken}` : "", // Prevent "Bearer null"
            ...config.headers, // Keep any custom headers
        };

        try {
            const response = await axios({
                method,
                url,  // Ensure URL is properly assigned
                data,
                headers, // Attach headers separately
                ...config,
            });

            // Handle JWT refresh/update
            if (response.data?.token) {
                localStorage.setItem("jwtToken", response.data.token);
                console.log("JWT token updated.");
            }

            return response;
        } catch (error) {
            console.error("API call error:", error);
            throw error;
        }
    };

    return { apiCall };
};

export default useApiWithAuth;
