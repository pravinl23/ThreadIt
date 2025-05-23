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
            top: '85px',
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
            backdropFilter: 'blur(4px)'
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

        {/* Tldraw with background template */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${selectedGarment.image})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.8, // Make template slightly transparent
        }}>
          <Tldraw 
            persistenceKey={`ThreadSketch-${selectedGarment.id}`}
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
      </div>
    )
  }

  return <GarmentSelector onGarmentSelect={setSelectedGarment} />
}
