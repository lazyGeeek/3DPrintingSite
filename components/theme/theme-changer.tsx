"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function ThemeChanger() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null;
  }

  const handleTheme=()=> {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="dark-mode">{theme === "light" ? "☀️" : "🌙"}</Label>
      <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={handleTheme} />
    </div>
  )
}
