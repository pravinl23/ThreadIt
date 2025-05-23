"use client"

import { useState } from "react"

// Add this to ensure we have enough content to scroll
// Add more garment templates to ensure we have enough content to force scrolling
const garmentTemplates = [
  { id: "tee", name: "T-Shirt", image: "/assets/clothes/Tee.png" },
  { id: "tee-long", name: "Long Sleeve Tee", image: "/assets/clothes/Tee Long Sleeve.png" },
  { id: "tee-2", name: "T-Shirt 2", image: "/assets/clothes/Tee 2.png" },
  { id: "hoodie", name: "Hoodie", image: "/assets/clothes/Hoodie.png" },
  { id: "tank", name: "Tank Top", image: "/assets/clothes/Tank Top 1.png" },
  { id: "sweater", name: "Sweater", image: "/assets/clothes/Sweater New.png" },
  { id: "shorts", name: "Shorts", image: "/assets/clothes/Shorts.png" },
  { id: "jeans", name: "Jeans", image: "/assets/clothes/Jeans 2.png" },
  { id: "sweats", name: "Sweatpants", image: "/assets/clothes/Sweats 3.png" },
  // Duplicate some items to ensure we have enough content to force scrolling
  { id: "tee-extra", name: "Basic Tee", image: "/assets/clothes/Tee.png" },
  { id: "hoodie-extra", name: "Classic Hoodie", image: "/assets/clothes/Hoodie.png" },
  { id: "jeans-extra", name: "Slim Jeans", image: "/assets/clothes/Jeans 2.png" },
]

export function GarmentSelector({ onGarmentSelect }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Items" },
    { id: "tops", name: "Tops" },
    { id: "bottoms", name: "Bottoms" },
    { id: "outerwear", name: "Outerwear" },
  ]

  // Map garments to categories
  const categoryMap = {
    tops: ["tee", "tee-long", "tee-2", "tank"],
    bottoms: ["shorts", "jeans", "sweats"],
    outerwear: ["hoodie", "sweater"],
  }

  // Filter garments based on selected category
  const filteredGarments =
    selectedCategory === "all"
      ? garmentTemplates
      : garmentTemplates.filter((garment) => categoryMap[selectedCategory]?.includes(garment.id))

  const handleGarmentClick = (garment) => {
    console.log("Clicking garment:", garment.name) // Debug log
    onGarmentSelect(garment)
  }

  return (
    <div className="selector-page">
      <div className="selector-content">
        <header className="selector-header">
          <h1 className="selector-title">ThreadSketch</h1>
          <div className="title-underline"></div>
          <p className="selector-subtitle">Choose a garment to start designing</p>
        </header>

        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
              {selectedCategory === category.id && <span className="active-indicator"></span>}
            </button>
          ))}
        </div>

        <div className="garments-grid">
          {filteredGarments.map((garment) => (
            <div
              key={garment.id}
              className={`garment-item ${hoveredId === garment.id ? "hovered" : ""}`}
              onClick={() => handleGarmentClick(garment)}
              onMouseEnter={() => setHoveredId(garment.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="garment-image-container">
                <img src={garment.image || "/placeholder.svg"} alt={garment.name} className="garment-image" />
                <div className="garment-overlay">
                  <span className="select-label">Select</span>
                </div>
              </div>
              <div className="garment-details">
                <h3 className="garment-name">{garment.name}</h3>
                <span className="select-arrow">→</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="selector-footer">
          <div className="feature-list">
            <div className="feature">
              <div className="feature-icon">✏️</div>
              <span>Draw</span>
            </div>
            <div className="feature">
              <div className="feature-icon">✨</div>
              <span>Enhance</span>
            </div>
            <div className="feature">
              <div className="feature-icon">🎨</div>
              <span>Create</span>
            </div>
          </div>
          <p className="footer-text">Select a garment template to begin your design journey</p>
        </footer>
      </div>
    </div>
  )
}
