import { useState, useEffect, useCallback, useRef } from 'react'
import { Tldraw } from 'tldraw'
import { GarmentSelector } from './components/GarmentSelector'
import './App.css'

export default function App() {
  const [selectedGarment, setSelectedGarment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const tldrawRef = useRef(null)

  // Debug logging
  useEffect(() => {
    console.log('App: selectedGarment changed to:', selectedGarment?.name || 'null')
  }, [selectedGarment])

  const handleGarmentSelect = useCallback((garment) => {
    console.log('App: Garment selection started:', garment.name)
    setIsLoading(true)
    
    // Small delay to ensure state is properly set before rendering TLDraw
    setTimeout(() => {
      console.log('App: Setting selectedGarment to:', garment.name)
      setSelectedGarment(garment)
      setIsLoading(false)
    }, 100)
  }, [])

  const handleBackToTemplates = useCallback(() => {
    console.log('App: Going back to templates')
    setSelectedGarment(null)
    setIsLoading(false)
  }, [])

  // Continuously enforce transparency
  useEffect(() => {
    if (!selectedGarment) return

    const enforceTransparency = () => {
      // Target multiple possible TLDraw background elements
      const selectors = [
        '[data-testid="canvas"]',
        '.tl-svg-container', 
        '.tldraw canvas',
        '.tldraw > div',
        '.tldraw',
        '[class*="tl-background"]'
      ]
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          if (el) {
            el.style.backgroundColor = 'transparent'
            el.style.background = 'transparent'
          }
        })
      })
    }

    // Run immediately and then on an interval
    const interval = setInterval(enforceTransparency, 100)
    enforceTransparency()

    return () => clearInterval(interval)
  }, [selectedGarment])

  console.log('App: Rendering - selectedGarment:', selectedGarment?.name || 'none', 'isLoading:', isLoading)

  // Show loading state briefly
  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Loading canvas...
      </div>
    )
  }

  // Show TLDraw with template
  if (selectedGarment) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#ffffff' }}>
        {/* TLDraw - base layer */}
        <div ref={tldrawRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <Tldraw 
            persistenceKey={`ThreadSketch-${selectedGarment.id}`}
            onMount={() => {
              console.log('TLDraw mounted for:', selectedGarment.name)
            }}
          />
        </div>

        {/* Garment template overlay - on top but non-interactive */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          <img
            src={selectedGarment.image}
            alt={selectedGarment.name}
            style={{
              maxWidth: '70%',
              maxHeight: '70%',
              objectFit: 'contain',
              opacity: 0.15,
              filter: 'contrast(0.8) brightness(0.8)',
              pointerEvents: 'none'
            }}
            onLoad={() => console.log('Template overlay loaded:', selectedGarment.name)}
            onError={() => console.log('Template overlay failed to load:', selectedGarment.name)}
          />
        </div>

        {/* Back button */}
        <button
          onClick={handleBackToTemplates}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            background: '#333',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '8px',
            padding: '10px 16px',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#444'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#333'
          }}
        >
          ← Back to Templates
        </button>

        {/* Garment info indicator */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {selectedGarment.name}
        </div>
      </div>
    )
  }

  // Show garment selector
  return <GarmentSelector onGarmentSelect={handleGarmentSelect} />
}
