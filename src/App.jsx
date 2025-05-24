"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Tldraw, createShapeId, AssetRecordType } from "tldraw"
import { GarmentSelector } from "./components/GarmentSelector"
import "./App.css"

export default function App() {
  const [selectedGarment, setSelectedGarment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const templateLoadedRef = useRef(false)

  // Debug logging
  useEffect(() => {
    console.log("App: selectedGarment changed to:", selectedGarment?.name || "null")
    // Reset template loaded flag when garment changes
    templateLoadedRef.current = false
  }, [selectedGarment])

  const handleGarmentSelect = useCallback((garment) => {
    console.log("App: Garment selection started:", garment.name)
    setIsLoading(true)
    
    // Small delay to ensure state is properly set before rendering TLDraw
    setTimeout(() => {
      console.log("App: Setting selectedGarment to:", garment.name)
      setSelectedGarment(garment)
      setIsLoading(false)
    }, 100)
  }, [])

  const handleBackToTemplates = useCallback(() => {
    console.log("App: Going back to templates")
    setSelectedGarment(null)
    setIsLoading(false)
  }, [])

  // Add garment template to canvas when TLDraw mounts
  const handleTLDrawMount = useCallback((editor) => {
    if (!selectedGarment || templateLoadedRef.current) return;

    console.log('Attempting to load garment image:', selectedGarment.image)
    templateLoadedRef.current = true

    // Load image asynchronously but don't make the callback async
    const loadGarmentTemplate = async () => {
      try {
        // Load image to get dimensions
        const img = new Image()
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = selectedGarment.image
        })

        console.log('Image loaded, size:', img.width, img.height)

        // Calculate scaled dimensions to fit in view
        const maxSize = 600
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale

        // Create asset first
        const assetId = AssetRecordType.createId()
        
        console.log('Creating asset with ID:', assetId)
        editor.createAssets([{
          id: assetId,
          type: 'image',
          typeName: 'asset',
          props: {
            name: selectedGarment.name + '.png',
            src: selectedGarment.image,
            w: img.width,
            h: img.height,
            mimeType: 'image/png',
            isAnimated: false,
          },
          meta: {},
        }])

        // Create the shape with the asset reference
        const shapeId = createShapeId('garment-template')
        
        console.log('Creating image shape with asset reference...')
        editor.createShape({
          id: shapeId,
          type: 'image',
          x: -scaledWidth / 2, // Center horizontally
          y: -scaledHeight / 2, // Center vertically
          opacity: 0.4,
          isLocked: true,
          props: {
            assetId,
            w: scaledWidth,
            h: scaledHeight
          }
        })

        editor.sendToBack([shapeId])
        editor.zoomToFit()
        console.log('Garment template added as shape with asset reference')
      } catch (error) {
        console.error('Failed to load garment image:', error)
      }
    }

    // Call the async function but don't await it
    loadGarmentTemplate()
  }, [selectedGarment])

  console.log("App: Rendering - selectedGarment:", selectedGarment?.name || "none", "isLoading:", isLoading)

  // Show loading state briefly
  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        }}
      >
        Loading canvas...
      </div>
    )
  }

  // Show TLDraw with template
  if (selectedGarment) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#ffffff" }}>
        {/* TLDraw with garment template added as a shape */}
        <Tldraw
          persistenceKey={`ThreadSketch-${selectedGarment.id}`}
          onMount={handleTLDrawMount}
        />

        {/* Back button */}
        <button
          onClick={handleBackToTemplates}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 1000,
            background: "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "8px",
            padding: "10px 16px",
            cursor: "pointer",
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
            fontSize: "14px",
            fontWeight: "500",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#444"
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#333"
          }}
        >
          ← Back to Templates
        </button>

        {/* Garment info indicator */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
          }}
        >
          {selectedGarment.name}
        </div>
      </div>
    )
  }

  // Show garment selector
  return <GarmentSelector onGarmentSelect={handleGarmentSelect} />
}
