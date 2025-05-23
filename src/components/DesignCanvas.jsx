"use client"

import { useEffect, useRef, useState } from "react"
import { Tldraw } from "tldraw"
import { motion, AnimatePresence } from "framer-motion"

export function DesignCanvas({ selectedGarment, activeView, onCanvasReady }) {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (canvasRef.current) {
      setIsLoading(false)
      if (onCanvasReady) {
        onCanvasReady(canvasRef.current)
      }
    }
  }, [canvasRef, onCanvasReady])

  if (!selectedGarment) {
    return <div className="canvas-loading">No garment selected</div>
  }

  const templateImage = selectedGarment.image
  const persistenceKey = `ThreadSketch-${selectedGarment.id}-${activeView}`

  return (
    <div className="design-canvas">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          className="canvas-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Garment template background */}
          <div className="garment-background">
            <img
              src={templateImage || "/placeholder.svg"}
              alt={`${selectedGarment.name} template`}
              className="garment-template"
              draggable={false}
            />
          </div>

          {/* TLDraw canvas overlay */}
          <div className="canvas-overlay" ref={canvasRef}>
            <Tldraw persistenceKey={persistenceKey} hideUi={true} className="tldraw-canvas" />
          </div>

          {/* View indicator */}
          <div className="view-indicator">
            <span className="view-label">{activeView.toUpperCase()} VIEW</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {isLoading && (
        <div className="canvas-loading">
          <div className="loading-spinner"></div>
          <p>Loading canvas...</p>
        </div>
      )}
    </div>
  )
}
