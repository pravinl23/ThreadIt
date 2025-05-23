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
              onClick={() => onGarmentSelect(garment)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px 32px',
                backgroundColor: '#2a2a2a',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid #3a3a3a'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#3a3a3a'
                e.target.style.transform = 'translateY(-3px)'
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2a2a2a'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
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
                    filter: 'brightness(0.9)'
                  }}
                />
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '500',
                color: 'white'
              }}>
                {garment.name}
              </div>
              <div style={{
                marginLeft: 'auto',
                color: '#666',
                fontSize: '20px'
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