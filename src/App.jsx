import { useState } from 'react'
import { Tldraw } from 'tldraw'
import { GarmentSelector } from './components/GarmentSelector'
import './App.css'

export default function App() {
  const [selectedGarment, setSelectedGarment] = useState(null)

  const goBack = () => {
    setSelectedGarment(null)
  }

  if (selectedGarment) {
    return (
      <div style={{ position: 'fixed', inset: 0 }}>
        {/* Back button - moved down to avoid TLDraw toolbar */}
        <button
          onClick={goBack}
          style={{
            position: 'absolute',
            top: '85px', // Moved down from 20px to avoid toolba
            left: '20px',
            zIndex: 1000,
            padding: '10px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'system-ui, sans-serif',
            backdropFilter: 'blur(4px)' // Added backdrop blur for better visibility
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
          }}
        >
          ← Back to Templates
        </button>

        {/* Garment info indicator - moved to bottom right to avoid right panel */}
        <div style={{
          position: 'absolute',
          bottom: '100px', // Positioned above bottom toolbar
          right: '20px',
          zIndex: 1000,
          padding: '10px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'system-ui, sans-serif',
          backdropFilter: 'blur(4px)' // Added backdrop blur for consistency
        }}>
          {selectedGarment.name}
        </div>

        <Tldraw persistenceKey={`ThreadSketch-${selectedGarment.id}`} />
      </div>
    )
  }

  return <GarmentSelector onGarmentSelect={setSelectedGarment} />
}
