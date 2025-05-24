"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Tldraw, createShapeId, AssetRecordType } from "tldraw"
import { GarmentSelector } from "./components/GarmentSelector"
import { SavedDesigns } from "./components/SavedDesigns"
import "./App.css"

export default function App() {
  const [selectedGarment, setSelectedGarment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState('templates') // 'templates', 'design', 'saved'
  const [savedDesigns, setSavedDesigns] = useState([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [currentEditor, setCurrentEditor] = useState(null)
  const [sessionId, setSessionId] = useState(null) // For unique persistence key
  const templateLoadedRef = useRef(false)
  const initialCanvasStateRef = useRef(null)

  // Debug logging
  useEffect(() => {
    console.log("App: selectedGarment changed to:", selectedGarment?.name || "null")
    // Reset template loaded flag when garment changes
    templateLoadedRef.current = false
    setHasUnsavedChanges(false)
  }, [selectedGarment])

  // Load saved designs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('threadsketch-saved-designs')
    if (saved) {
      try {
        setSavedDesigns(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load saved designs:', error)
      }
    }
  }, [])

  // Save designs to localStorage whenever savedDesigns changes
  useEffect(() => {
    localStorage.setItem('threadsketch-saved-designs', JSON.stringify(savedDesigns))
  }, [savedDesigns])

  const handleGarmentSelect = useCallback((garment) => {
    console.log("App: Garment selection started:", garment.name)
    setIsLoading(true)
    
    // Ensure garment has a consistent id format
    const garmentWithId = {
      ...garment,
      id: garment.id || garment.name.toLowerCase().replace(/\s+/g, '-')
    }
    
    // Generate a unique session ID to ensure fresh start
    const newSessionId = Date.now().toString()
    
    // Always clear persistence for fresh start when selecting a garment
    // Use the exact same key format as the TLDraw persistenceKey
    const persistenceKey = `ThreadSketch-${garmentWithId.id}`
    console.log("Clearing localStorage for key:", persistenceKey)
    localStorage.removeItem(persistenceKey)
    
    // Small delay to ensure state is properly set before rendering TLDraw
    setTimeout(() => {
      console.log("App: Setting selectedGarment to:", garmentWithId.name)
      setSelectedGarment(garmentWithId)
      setSessionId(newSessionId)
      setCurrentView('design')
      setIsLoading(false)
    }, 100)
  }, [])

  const handleBackToTemplates = useCallback(() => {
    console.log("App: Going back to templates")
    // Always show save dialog when going back, regardless of unsaved changes
    setShowSaveDialog(true)
  }, [])

  const handleDiscardChanges = useCallback(() => {
    console.log("App: Discarding changes")
    // Clear the canvas by reloading without persistence
    if (selectedGarment?.id) {
      const persistenceKey = `ThreadSketch-${selectedGarment.id}`
      console.log("Clearing localStorage for key:", persistenceKey)
      localStorage.removeItem(persistenceKey)
    }
    setShowSaveDialog(false)
    setSelectedGarment(null)
    setCurrentView('templates')
    setHasUnsavedChanges(false)
    setIsLoading(false)
  }, [selectedGarment])

  const handleSaveDesign = useCallback((designName) => {
    if (!currentEditor || !selectedGarment) {
      alert("Unable to save: Editor or garment not available")
      return
    }

    try {
      const snapshot = currentEditor.getSnapshot()
      const newDesign = {
        id: Date.now().toString(),
        name: designName || `${selectedGarment.name} Design`,
        garmentType: selectedGarment.name,
        garmentImage: selectedGarment.image,
        snapshot: snapshot,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setSavedDesigns(prev => [...prev, newDesign])
      setHasUnsavedChanges(false)
      console.log("Design saved:", designName)
      
      // Show success feedback
      alert(`✅ Design "${designName}" saved successfully!`)
    } catch (error) {
      console.error("Failed to save design:", error)
      alert("❌ Failed to save design. Please try again.")
    }
  }, [currentEditor, selectedGarment])

  const handleSaveAndReturn = useCallback(() => {
    const designName = prompt("Enter a name for your design:")
    if (designName) {
      handleSaveDesign(designName)
      setShowSaveDialog(false)
      setSelectedGarment(null)
      setCurrentView('templates')
      setIsLoading(false)
    }
  }, [handleSaveDesign])

  const handleViewDesign = useCallback((design) => {
    console.log("Loading saved design:", design.name)
    
    // Find the garment that matches this design
    const garment = {
      id: design.garmentType.toLowerCase().replace(/\s+/g, '-'),
      name: design.garmentType,
      image: design.garmentImage
    }
    
    // Generate a unique session ID for this saved design view
    const newSessionId = `saved-${design.id}-${Date.now()}`
    
    // Always clear persistence for fresh start when going off and back on
    localStorage.removeItem(`ThreadSketch-${garment.id}`)
    
    // Set the garment and switch to design view
    setSelectedGarment(garment)
    setSessionId(newSessionId)
    setCurrentView('design')
    
    // Store the design snapshot to load when editor mounts
    window.threadSketchDesignToLoad = design.snapshot
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
          y: -scaledHeight / 2, // Move down by 100 units
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

        // Store initial state for change detection
        setTimeout(() => {
          initialCanvasStateRef.current = editor.getSnapshot()
        }, 1000)
      } catch (error) {
        console.error('Failed to load garment image:', error)
      }
    }

    // Store editor reference
    setCurrentEditor(editor)

    // Check if we need to load a saved design
    if (window.threadSketchDesignToLoad) {
      console.log("Loading saved design snapshot...")
      try {
        editor.loadSnapshot(window.threadSketchDesignToLoad)
        setHasUnsavedChanges(false)
        window.threadSketchDesignToLoad = null // Clear it
        console.log("Saved design loaded successfully")
        
        // Store initial state for change detection
        setTimeout(() => {
          initialCanvasStateRef.current = editor.getSnapshot()
        }, 1000)
      } catch (error) {
        console.error("Failed to load saved design:", error)
        // Fall back to loading template normally
        loadGarmentTemplate()
      }
    } else {
      // Normal template loading
      loadGarmentTemplate()
    }

    // Set up change detection - simpler approach
    let changeTimeout
    const unsubscribe = editor.store.listen((entry) => {
      // Clear any existing timeout
      if (changeTimeout) clearTimeout(changeTimeout)
      
      // Debounce change detection to avoid too many calls
      changeTimeout = setTimeout(() => {
        if (initialCanvasStateRef.current) {
          const currentShapes = editor.getCurrentPageShapes()
          // Consider it changed if we have more than just the template shape
          // or if any existing shapes have been modified
          const hasUserContent = currentShapes.some(shape => 
            !shape.id.includes('garment-template') && 
            (shape.type === 'draw' || shape.type === 'geo' || shape.type === 'text' || shape.type === 'note')
          )
          
          console.log('Change detected, hasUserContent:', hasUserContent, 'shapes:', currentShapes.length)
          setHasUnsavedChanges(hasUserContent)
        }
      }, 100)
    })

    // Return cleanup function
    return () => {
      if (changeTimeout) clearTimeout(changeTimeout)
      unsubscribe()
    }
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
  if (currentView === 'design' && selectedGarment) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#ffffff" }}>
        {/* TLDraw with garment template added as a shape */}
        <Tldraw
          persistenceKey={sessionId ? `ThreadSketch-${sessionId}` : `ThreadSketch-${selectedGarment.id}`}
          onMount={handleTLDrawMount}
        />

        {/* Navigation and action buttons */}
        <div style={{ position: "absolute", top: "47px", left: "5px", zIndex: 1000, display: "flex", gap: "10px" }}>
          {/* Back button */}
          <button
            onClick={handleBackToTemplates}
            style={{
              background: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
              fontSize: "14px",
              fontWeight: "300",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#444"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#333"
            }}
          >
            ← Back
          </button>

          {/* Save button */}
          <button
            onClick={() => {
              const designName = prompt("Enter a name for your design:")
              if (designName) {
                handleSaveDesign(designName)
              }
            }}
            style={{
              background: "#059669",
              color: "white",
              border: "1px solid #555",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
              fontSize: "14px",
              fontWeight: "300",
              opacity: hasUnsavedChanges ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#047857"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#059669"
            }}
            title={hasUnsavedChanges ? "Save your current design" : "Save current canvas (no changes detected)"}
          >
            💾 Save Design
          </button>
        </div>



        {/* Save Dialog */}
        {showSaveDialog && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}>
            <div style={{
              background: "#1a1a1a",
              color: "white",
              padding: "30px",
              borderRadius: "16px",
              border: "1px solid #333",
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
              textAlign: "center",
              maxWidth: "400px",
            }}>
              <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>Save Before Leaving?</h3>
              <p style={{ marginBottom: "30px", color: "#ccc", lineHeight: "1.5" }}>
                Would you like to save your current design before returning to templates?
              </p>
              <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                <button
                  onClick={handleSaveAndReturn}
                  style={{
                    background: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  💾 Save & Exit
                </button>
                <button
                  onClick={handleDiscardChanges}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  🚪 Exit Without Saving
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show saved designs
  if (currentView === 'saved') {
    return <SavedDesigns 
      savedDesigns={savedDesigns} 
      setSavedDesigns={setSavedDesigns} 
      onBack={() => setCurrentView('templates')}
      onViewDesign={handleViewDesign}
    />
  }

  // Show garment selector with navigation
  return (
    <div style={{ position: "relative" }}>
      {/* Navigation header */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#1a1a1a",
        borderBottom: "1px solid #333",
        padding: "15px 20px",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "white",
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        }}>
          ThreadSketch
        </div>
        
        <button
          onClick={() => setCurrentView('saved')}
          style={{
            background: "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#444"
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#333"
          }}
        >
          📁 Saved Designs ({savedDesigns.length})
        </button>
      </div>
      
      {/* Add top padding to account for fixed header */}
      <div style={{ paddingTop: "80px" }}>
        <GarmentSelector onGarmentSelect={handleGarmentSelect} />
      </div>
    </div>
  )
}
