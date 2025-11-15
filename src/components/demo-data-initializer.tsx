"use client"

import { useEffect } from "react"
import { initializeDemoData } from "@/lib/demo-data"

export function DemoDataInitializer() {
  useEffect(() => {
    localStorage.removeItem('autocare_demo_initialized')
    initializeDemoData()
    
    // Force re-render of components by dispatching a storage event
    window.dispatchEvent(new Event('storage'))
  }, [])

  return null
}
