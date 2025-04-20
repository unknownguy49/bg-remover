"use client"

import { useState, useRef, useEffect } from "react"

export function ImageCompare({ beforeImage, afterImage }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const containerWidth = rect.width

    // Calculate position as percentage
    let newPosition = (x / containerWidth) * 100

    // Clamp position between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition))

    setPosition(newPosition)
  }

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isDragging.current = false
    }

    window.addEventListener("mouseup", handleMouseUpGlobal)
    window.addEventListener("mouseleave", handleMouseUpGlobal)

    return () => {
      window.removeEventListener("mouseup", handleMouseUpGlobal)
      window.removeEventListener("mouseleave", handleMouseUpGlobal)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] overflow-hidden rounded-md cursor-col-resize"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={(e) => {
        if (!isDragging.current || !containerRef.current) return
        const touch = e.touches[0]
        const container = containerRef.current
        const rect = container.getBoundingClientRect()
        const x = touch.clientX - rect.left
        const containerWidth = rect.width

        let newPosition = (x / containerWidth) * 100
        newPosition = Math.max(0, Math.min(100, newPosition))

        setPosition(newPosition)
      }}
    >
      {/* Before image (original) */}
      <div className="absolute inset-0 w-full h-full">
        <img src={beforeImage || "/placeholder.svg"} alt="Original" className="w-full h-full object-contain" />
      </div>

      {/* After image (result) */}
      <div className="absolute inset-0 overflow-hidden h-full bg-grid" style={{ width: `${position}%` }}>
        <img
          src={afterImage || "/placeholder.svg"}
          alt="Result"
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-md cursor-col-resize z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
          <div className="w-0.5 h-3 bg-gray-400 mx-0.5"></div>
          <div className="w-0.5 h-3 bg-gray-400 mx-0.5"></div>
        </div>
      </div>
    </div>
  )
}
