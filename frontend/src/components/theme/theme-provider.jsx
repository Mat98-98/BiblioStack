import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext(undefined)

export function ThemeProvider({
                                  children,
                                  defaultTheme = "system",
                                  storageKey = "vite-ui-theme",
                              }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        const applyTheme = (t) => {
            root.classList.remove("light", "dark")

            if (t === "system") {
                const systemDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches

                root.classList.add(systemDark ? "dark" : "light")
            } else {
                root.classList.add(t)
            }
        }

        applyTheme(theme)

        if (theme !== "system") return

        const media = window.matchMedia("(prefers-color-scheme: dark)")
        const handler = () => applyTheme("system")

        media.addEventListener("change", handler)

        return () => media.removeEventListener("change", handler)
    }, [theme])

    const value = {
        theme,
        setTheme: (t) => {
            localStorage.setItem(storageKey, t)
            setTheme(t)
        },
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeProviderContext)

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider")
    }

    return context
}