"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()
import PropTypes from "prop-types";

const Button = ({ label, theme }) => {
    return <button className={`btn ${theme}`}>{label}</button>;
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    theme: PropTypes.string,  // Optional prop
};

export default Button;

export const ThemeProvider = ({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) => {
    const [theme, setTheme] = useState(defaultTheme)

    useEffect(() => {
        const storedTheme = localStorage.getItem(storageKey)
        if (storedTheme) {
            setTheme(storedTheme)
        } else if (defaultTheme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            setTheme(systemTheme)
        }
    }, [defaultTheme, storageKey])

    useEffect(() => {
        localStorage.setItem(storageKey, theme)
    }, [theme, storageKey])

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    return useContext(ThemeContext)
}

