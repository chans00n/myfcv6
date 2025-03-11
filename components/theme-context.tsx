"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    // Check if there's a theme in localStorage
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  // Update the theme context to use the lime palette
  useEffect(() => {
    // Update the class on the html element
    const root = window.document.documentElement
    const isDark = theme === "dark"

    // First remove both classes
    root.classList.remove("light", "dark")

    // Then add the current theme class
    root.classList.add(theme)

    // Also set a data attribute for additional CSS targeting
    root.setAttribute("data-theme", theme)

    // Apply theme-specific styles directly to ensure they take effect
    if (isDark) {
      // Primary and accent colors
      document.documentElement.style.setProperty("--primary", "65 70% 45%")
      document.documentElement.style.setProperty("--primary-foreground", "0 0% 100%")
      document.documentElement.style.setProperty("--accent", "65 50% 25%")
      document.documentElement.style.setProperty("--accent-foreground", "65 70% 90%")
      document.documentElement.style.setProperty("--secondary", "65 10% 15%")
      document.documentElement.style.setProperty("--secondary-foreground", "65 10% 98%")
      document.documentElement.style.setProperty("--muted", "65 10% 15%")
      document.documentElement.style.setProperty("--muted-foreground", "65 10% 65%")
      document.documentElement.style.setProperty("--border", "65 10% 20%")
      document.documentElement.style.setProperty("--input", "65 10% 20%")
      document.documentElement.style.setProperty("--ring", "65 70% 40%")

      // Sidebar colors
      document.documentElement.style.setProperty("--sidebar-primary", "65 70% 45%")
      document.documentElement.style.setProperty("--sidebar-primary-foreground", "0 0% 100%")
      document.documentElement.style.setProperty("--sidebar-accent", "65 50% 25%")
      document.documentElement.style.setProperty("--sidebar-accent-foreground", "65 70% 90%")
      document.documentElement.style.setProperty("--sidebar-border", "65 10% 20%")
    } else {
      // Primary and accent colors
      document.documentElement.style.setProperty("--primary", "65 70% 62%")
      document.documentElement.style.setProperty("--primary-foreground", "65 10% 10%")
      document.documentElement.style.setProperty("--accent", "65 70% 92%")
      document.documentElement.style.setProperty("--accent-foreground", "65 10% 15%")
      document.documentElement.style.setProperty("--secondary", "65 10% 96%")
      document.documentElement.style.setProperty("--secondary-foreground", "65 10% 15%")
      document.documentElement.style.setProperty("--muted", "65 10% 96%")
      document.documentElement.style.setProperty("--muted-foreground", "65 10% 45%")
      document.documentElement.style.setProperty("--border", "65 10% 90%")
      document.documentElement.style.setProperty("--input", "65 10% 90%")
      document.documentElement.style.setProperty("--ring", "65 70% 50%")

      // Sidebar colors
      document.documentElement.style.setProperty("--sidebar-primary", "65 70% 62%")
      document.documentElement.style.setProperty("--sidebar-primary-foreground", "65 10% 10%")
      document.documentElement.style.setProperty("--sidebar-accent", "65 70% 92%")
      document.documentElement.style.setProperty("--sidebar-accent-foreground", "65 10% 15%")
      document.documentElement.style.setProperty("--sidebar-border", "65 10% 90%")
    }

    // Save the theme to localStorage
    localStorage.setItem("theme", theme)

    // Log for debugging
    console.log("Theme changed to:", theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => setTheme(newTheme),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

