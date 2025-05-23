const garmentTemplates = [
  { id: 'tee', name: 'T-Shirt', image: '/assets/clothes/Tee.png' },
  { id: 'tee-long', name: 'Long Sleeve Tee', image: '/assets/clothes/Tee Long Sleeve.png' },
  { id: 'tee-2', name: 'T-Shirt 2', image: '/assets/clothes/Tee 2.png' },
  { id: 'hoodie', name: 'Hoodie', image: '/assets/clothes/Hoodie.png' },
  { id: 'tank', name: 'Tank Top', image: '/assets/clothes/Tank Top 1.png' },
  { id: 'sweater', name: 'Sweater', image: '/assets/clothes/Sweater New.png' },
  { id: 'zip-hoodie', name: 'Zip Hoodie', image: '/assets/clothes/Zip Hoodie 4.png' },
  { id: 'shorts', name: 'Shorts', image: '/assets/clothes/Shorts.png' },
  { id: 'jeans', name: 'Jeans', image: '/assets/clothes/Jeans 2.png' },
  { id: 'sweats', name: 'Sweatpants', image: '/assets/clothes/Sweats 3.png' },
]

export function GarmentSelector({ onGarmentSelect }) {
  return (
    <div className="garment-selector">
      <div className="garment-selector-content">
        <h1 className="title">ThreadSketch</h1>
        <h2 className="subtitle">Choose your garment template</h2>
        
        <div className="garment-grid">
          {garmentTemplates.map((garment) => (
            <div
              key={garment.id}
              className="garment-card"
              onClick={() => onGarmentSelect(garment)}
            >
              <div className="garment-image-container">
                <img
                  src={garment.image}
                  alt={garment.name}
                  className="garment-image"
                />
              </div>
              <div className="garment-name">{garment.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 