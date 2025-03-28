"use client"

import { useState, useCallback } from "react"
import axios from "axios"

const useApiWithAuth = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const apiCall = useCallback(async (method, url, data = null, config = {}) => {
        setLoading(true)
        setError(null)

        // Get JWT token from localStorage
        const jwtToken = localStorage.getItem("jwtToken")
        console.log("JWT Token fetched")

        // Check if the JWT token exists
        if (!jwtToken) {
            console.log("JWT Token not present")
        }

        // Ensure `url` is valid
        if (!url || typeof url !== "string") {
            console.error("Invalid API URL:", url)
            setLoading(false)
            setError(new Error("Invalid API URL"))
            throw new Error("Invalid API URL")
        }

        try {
            // Create headers with authorization if token exists
            const headers = {
                "Content-Type": "application/json",
                ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
                ...config.headers, // Keep any custom headers
            }

            // Create a new config object to avoid modifying the original
            const requestConfig = {
                ...config,
                headers,
            }

            // Make the API call
            const response = await axios({
                method,
                url,
                data,
                ...requestConfig,
            })

            // Handle JWT refresh/update
            if (response.data?.token) {
                localStorage.setItem("jwtToken", response.data.token)
                console.log("JWT token updated.")
            }

            // Check if response indicates admin status
            if (response.data?.isAdmin !== undefined) {
                localStorage.setItem("isAdmin", response.data.isAdmin.toString())
            }

            setLoading(false)
            return response
        } catch (error) {
            setLoading(false)
            setError(error)

            // Handle token expiration
            if (error.response?.status === 401) {
                const message = error.response?.data?.message

                // Check for token expiration or invalid token messages
                if (message === "TO" || message === "JWT Token Empty" || message === "Error_E") {
                    console.log("Token expired or invalid. Clearing authentication.")
                    localStorage.removeItem("jwtToken")
                    localStorage.removeItem("isAdmin")

                    // You could redirect to login here if needed
                    // window.location.href = "/login";
                }
            }

            console.error("API call error:", error)
            throw error
        }
    }, [])

    // Return the apiCall function along with loading and error states
    return {
        apiCall,
        loading,
        error,
        // Helper method to clear errors
        clearError: () => setError(null),
    }
}

export default useApiWithAuth

