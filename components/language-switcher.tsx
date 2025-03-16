"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const languages = [
  { code: "he", name: "עברית" },
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
]

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("he")

  useEffect(() => {
    // Get language from localStorage or default to Hebrew
    const savedLang = localStorage.getItem("preferredLanguage") || "he"
    setCurrentLang(savedLang)

    // Set the html lang attribute
    document.documentElement.lang = savedLang

    // Add Google Translate script if not Hebrew
    if (savedLang !== "he") {
      addGoogleTranslateScript(savedLang)
    }
  }, [])

  const addGoogleTranslateScript = (lang: string) => {
    // Skip if already Hebrew
    if (lang === "he") return

    // Create Google Translate script
    const googleTranslateScript = document.createElement("script")
    googleTranslateScript.type = "text/javascript"
    googleTranslateScript.async = true
    googleTranslateScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"

    // Add the initialization function
    window.googleTranslateElementInit = () => {
      ;new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "he",
          includedLanguages: lang,
          autoDisplay: false,
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      )
    }

    // Add the script to the document
    document.body.appendChild(googleTranslateScript)
  }

  const changeLanguage = (lang: string) => {
    // Save to localStorage
    localStorage.setItem("preferredLanguage", lang)

    // Update state
    setCurrentLang(lang)

    // Set the html lang attribute
    document.documentElement.lang = lang

    // Reload page to apply translation
    if (lang === "he") {
      // If switching to Hebrew, just reload without translation
      window.location.reload()
    } else {
      // Add Google Translate script
      addGoogleTranslateScript(lang)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center justify-between"
            >
              <span>{lang.name}</span>
              {currentLang === lang.code && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden div for Google Translate */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  )
}

