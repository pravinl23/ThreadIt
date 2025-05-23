import { useEffect, useRef } from 'react'
import { Tldraw, createTLStore } from 'tldraw'
import { useStore } from '../store/useStore'

export function DesignCanvas() {
  const {
    selectedGarment,
    activeView,
    frontCanvasStore,
    backCanvasStore,
    setFrontCanvasStore,
    setBackCanvasStore
  } = useStore()

  // Create stores for both canvases if they don't exist
  useEffect(() => {
    if (!frontCanvasStore) {
      const frontStore = createTLStore()
      setFrontCanvasStore(frontStore)
    }
    if (!backCanvasStore) {
      const backStore = createTLStore()
      setBackCanvasStore(backStore)
    }
  }, [frontCanvasStore, backCanvasStore, setFrontCanvasStore, setBackCanvasStore])

  if (!selectedGarment || !frontCanvasStore || !backCanvasStore) {
    return <div className="canvas-loading">Loading canvas...</div>
  }

  const currentStore = activeView === 'front' ? frontCanvasStore : backCanvasStore
  const currentGarmentImage = activeView === 'front' 
    ? selectedGarment.frontImage 
    : selectedGarment.backImage

  return (
    <div className="design-canvas">
      {/* Garment template background */}
      <div className="garment-background">
        <img
          src={currentGarmentImage}
          alt={`${selectedGarment.name} ${activeView} view`}
          className="garment-template"
          draggable={false}
        />
      </div>

      {/* TLDraw canvas overlay */}
      <div className="canvas-overlay">
        <Tldraw
          store={currentStore}
          persistenceKey={`ThreadSketch-${selectedGarment.id}-${activeView}`}
          hideUi={true}
          className="tldraw-canvas"
        />
      </div>

      {/* View indicator */}
      <div className="view-indicator">
        <span className="view-label">{activeView.toUpperCase()} VIEW</span>
      </div>
    </div>
  )
} 