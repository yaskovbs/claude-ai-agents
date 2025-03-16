"use client"

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400 mt-auto">
      <p>
        © {new Date().getFullYear()} כל הזכויות שמורות ל-Claude AI 3.7 AI Agents for building web and mobile apps and
        websites
      </p>
    </footer>
  )
}

