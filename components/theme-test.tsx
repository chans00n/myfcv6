"use client"

import { useTheme } from "@/components/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function ThemeTest() {
  const { theme, setTheme } = useTheme()
  const [key, setKey] = useState(0) // Add this state for forcing re-render

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    // Force a re-render after theme change
    setTimeout(() => setKey((prev) => prev + 1), 50)
  }

  return (
    <div className="p-4 space-y-4" key={key}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Current Theme: {theme}</h2>
        <Button onClick={toggleTheme} variant="outline">
          Toggle Theme
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Primary Color Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-20 bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              Primary Background
            </div>
            <div className="h-20 bg-accent text-accent-foreground flex items-center justify-center font-semibold">
              Accent Background
            </div>
            <Button className="w-full">Primary Button</Button>
            <Button variant="secondary" className="w-full">
              Secondary Button
            </Button>
            <Button variant="outline" className="w-full">
              Outline Button
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text Colors Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-primary">This is primary text</p>
            <p className="text-secondary">This is secondary text</p>
            <p className="text-muted-foreground">This is muted text</p>
            <p className="text-accent-foreground">This is accent text</p>
            <div className="p-4 border rounded-md">
              <p>Border and input colors</p>
              <input type="text" className="mt-2 w-full p-2 border rounded-md" placeholder="Input with border" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

