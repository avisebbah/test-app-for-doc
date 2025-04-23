"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function TopProgressBar() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => {
      setTimeout(() => setLoading(false), 500)
    }

    // Listen for route changes
    handleComplete()

    return () => {
      // Clean up listeners
    }
  }, [pathname, searchParams])

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
          <div className="h-full bg-secondary animate-[progress_2s_ease-in-out_infinite]" style={{ width: "100%" }} />
        </div>
      )}
    </>
  )
}
