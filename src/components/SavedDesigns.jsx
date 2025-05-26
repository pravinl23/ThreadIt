import { useState } from "react"

export function SavedDesigns({ savedDesigns, setSavedDesigns, onBack, onViewDesign }) {
  const [selectedDesign, setSelectedDesign] = useState(null)

  const handleDeleteDesign = (designId) => {
    if (confirm("Are you sure you want to delete this design?")) {
      setSavedDesigns(prev => prev.filter(design => design.id !== designId))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      color: "white",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
    }}>
      {/* Header */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#000000",
        borderBottom: "1px solid #333",
        padding: "15px 20px",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button
            onClick={onBack}
            style={{
              background: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Back to Templates
          </button>
          <h1 style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: 0,
          }}>
            📁 Saved Designs ({savedDesigns.length})
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px", paddingTop: "90px", maxWidth: "1200px", margin: "0 auto" }}>
        {savedDesigns.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#666",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎨</div>
            <h2 style={{ marginBottom: "10px", color: "#999" }}>No saved designs yet</h2>
            <p>Create your first design by selecting a garment template!</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}>
            {savedDesigns.map((design) => (
              <div
                key={design.id}
                style={{
                  background: "#222",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#2a2a2a"
                  e.currentTarget.style.borderColor = "#444"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#222"
                  e.currentTarget.style.borderColor = "#333"
                }}
              >
                {/* Design Preview */}
                <div style={{
                  height: "200px",
                  background: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}>
                  {design.garmentImage ? (
                    <img
                      src={design.garmentImage}
                      alt={design.garmentType}
                      style={{
                        maxWidth: "80%",
                        maxHeight: "80%",
                        objectFit: "contain",
                        opacity: 0.6,
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize: "48px",
                      color: "#666",
                    }}>
                      🎨
                    </div>
                  )}
                  
                  {/* Preview overlay */}
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}>
                    {design.garmentType}
                  </div>
                </div>

                {/* Design Info */}
                <div style={{ padding: "15px" }}>
                  <h3 style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "white",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {design.name}
                  </h3>
                  
                  <p style={{
                    margin: "0 0 15px 0",
                    fontSize: "12px",
                    color: "#999",
                  }}>
                    Created: {formatDate(design.createdAt)}
                  </p>

                  {/* Actions */}
                  <div style={{
                    display: "flex",
                    gap: "10px",
                  }}>
                    <button
                      onClick={() => onViewDesign(design)}
                      style={{
                        flex: 1,
                        background: "#059669",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      👁️ View
                    </button>
                    
                    <button
                      onClick={() => handleDeleteDesign(design.id)}
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 