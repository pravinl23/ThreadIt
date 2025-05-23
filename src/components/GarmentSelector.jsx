import { useState } from 'react'

const garmentTemplates = [
  { id: 'tee', name: 'T-Shirt', image: '/assets/clothes/Tee.png' },
  { id: 'tee-long', name: 'Long Sleeve Tee', image: '/assets/clothes/Tee Long Sleeve.png' },
  { id: 'tee-2', name: 'T-Shirt 2', image: '/assets/clothes/Tee 2.png' },
  { id: 'hoodie', name: 'Hoodie', image: '/assets/clothes/Hoodie.png' },
  { id: 'tank', name: 'Tank Top', image: '/assets/clothes/Tank Top 1.png' },
  { id: 'sweater', name: 'Sweater', image: '/assets/clothes/Sweater New.png' },
  { id: 'shorts', name: 'Shorts', image: '/assets/clothes/Shorts.png' },
  { id: 'jeans', name: 'Jeans', image: '/assets/clothes/Jeans 2.png' },
  { id: 'sweats', name: 'Sweatpants', image: '/assets/clothes/Sweats 3.png' },
]

export function GarmentSelector({ onGarmentSelect }) {
  const [hoveredId, setHoveredId] = useState(null)

  const handleGarmentClick = (garment) => {
    console.log('Clicking garment:', garment.name) // Debug log
    onGarmentSelect(garment)
  }

  return (
    <div style={{
      minHeight: '100vh',
      height: 'auto',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '60px 40px 120px 40px',
      fontFamily: 'system-ui, sans-serif',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
          color: 'white'
        }}>
          ThreadSketch
        </h1>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'normal',
          textAlign: 'center',
          marginBottom: '60px',
          color: '#888',
          opacity: 0.8
        }}>
          Choose your garment template
        </h2>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingBottom: '40px'
        }}>
          {garmentTemplates.map((garment) => (
            <div
              key={garment.id}
              onClick={() => handleGarmentClick(garment)}
              onMouseEnter={() => setHoveredId(garment.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px 32px',
                backgroundColor: hoveredId === garment.id ? '#3a3a3a' : '#2a2a2a',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid #3a3a3a',
                transform: hoveredId === garment.id ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: hoveredId === garment.id ? '0 6px 20px rgba(0, 0, 0, 0.4)' : 'none'
              }}
            >
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#333',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '24px',
                overflow: 'hidden'
              }}>
                <img
                  src={garment.image}
                  alt={garment.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    filter: 'brightness(0.9)',
                    pointerEvents: 'none' // Prevent image from interfering with click
                  }}
                />
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '500',
                color: 'white',
                pointerEvents: 'none' // Prevent text from interfering with click
              }}>
                {garment.name}
              </div>
              <div style={{
                marginLeft: 'auto',
                color: '#666',
                fontSize: '20px',
                pointerEvents: 'none'
              }}>
                →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 