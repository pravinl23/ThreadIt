import React, { useState } from 'react'

export function FinalDesign({ designData, onBack }) {
  const [isLaunching, setIsLaunching] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [progress, setProgress] = useState('')

  const handleLaunchIt = async () => {
    setIsLaunching(true)
    setProgress('Launching product to Shopify...')

    try {
      console.log("Launching product to Shopify...")
      const response = await fetch('http://localhost:3001/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setProgress('✅ Product added successfully!')
        setLaunched(true)
        console.log("Product created:", data.product)
        console.log("AI-generated details:", data.aiDetails)
        
        // Show success message
        setTimeout(() => {
          alert(`✅ Product added to waitlist successfully!\nTitle: ${data.aiDetails?.title || 'ThreadSketch Design'}\nCustomers can now sign up for updates!`)
        }, 500)
      } else {
        setProgress(`❌ Failed: ${data.error}`)
        alert(`❌ Failed to add product: ${data.error}`)
        console.error("Error:", data.error)
      }
    } catch (error) {
      setProgress(`❌ Connection error: ${error.message}`)
      alert(`❌ Error connecting to server: ${error.message}`)
      console.error("Network error:", error)
    } finally {
      setIsLaunching(false)
    }
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#1a1a1a",
      color: "white",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        position: "relative",
        zIndex: 10,
        borderBottom: "1px solid #333",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#1a1a1a",
      }}>
        <div>
          <h1 style={{ 
            fontSize: "20px", 
            fontWeight: "600", 
            margin: 0,
            color: "white",
          }}>
            🧵 Thread It - AI Design Preview
          </h1>
          <p style={{ 
            fontSize: "14px", 
            color: "#ccc", 
            margin: "5px 0 0 0",
            fontWeight: "300",
          }}>
            Your design enhanced with AI magic
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "8px",
            padding: "10px 16px",
            cursor: "pointer",
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
          ← Back to Design
        </button>
      </div>

      {/* Main content */}
      <div style={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        height: "calc(100vh - 60px)",
        gap: "20px",
        padding: "20px",
      }}>
        {/* Design Preview Panel */}
        <div style={{
          flex: "1",
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          borderRadius: "12px",
          padding: "25px",
          border: "1px solid #333",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}>
          {/* Panel header */}
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ 
              fontSize: "18px", 
              marginBottom: "8px", 
              color: "#fff",
              fontWeight: "500",
            }}>
              🎨 AI Enhanced Design
            </h2>
            <p style={{ 
              fontSize: "14px", 
              color: "#ccc", 
              margin: 0,
              lineHeight: "1.5",
            }}>
              Your creative vision enhanced with AI
            </p>
          </div>
          
          {/* Design preview container */}
          <div style={{
            background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
            borderRadius: "12px",
            padding: "25px",
            textAlign: "center",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #333",
            position: "relative",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}>

            <img
              src="/output.png"
              alt="AI Generated Design"
              style={{
                maxWidth: "100%",
                maxHeight: "350px",
                objectFit: "contain",
                borderRadius: "12px",
                border: "2px solid #444",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                background: "#000",
              }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div style={{
              display: "none",
              flexDirection: "column",
              alignItems: "center",
              color: "#ccc",
              textAlign: "center",
              fontSize: "16px",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📸</div>
              <div style={{ fontSize: "16px", marginBottom: "8px", color: "#ccc" }}>
                No design image found
              </div>
              <div style={{ fontSize: "14px", color: "#999" }}>
                output.png will appear here when generated
              </div>
            </div>

            <div style={{ 
              marginTop: "15px", 
              color: "#ccc",
              textAlign: "center",
            }}>
              <div style={{ 
                fontSize: "14px", 
                fontWeight: "500", 
                marginBottom: "5px",
                color: "#059669",
              }}>
                ✨ AI Enhanced Design
              </div>
              <p style={{ 
                fontSize: "12px", 
                margin: "0",
                color: "#999",
                lineHeight: "1.4",
              }}>
                Enhanced with AI to optimize colors and prepare for production
              </p>
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div style={{
          width: "400px",
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          borderRadius: "12px",
          padding: "25px",
          border: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #059669, #047857)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
            }}>
              🚀
            </div>
            <h2 style={{ 
              fontSize: "20px", 
              margin: 0,
              color: "#fff",
              fontWeight: "600",
            }}>
              Launch to Shopify
            </h2>
          </div>
          
          {!launched ? (
            <>
              <div style={{
                background: "linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(5, 150, 105, 0.05))",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "25px",
                border: "1px solid rgba(5, 150, 105, 0.2)",
                boxShadow: "0 4px 16px rgba(5, 150, 105, 0.1)",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    background: "linear-gradient(135deg, #059669, #047857)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}>
                    🛒
                  </div>
                  <h3 style={{ 
                    fontSize: "16px", 
                    margin: 0,
                    color: "#10b981",
                    fontWeight: "600",
                  }}>
                    What happens next?
                  </h3>
                </div>
                <ul style={{ 
                  fontSize: "13px", 
                  color: "#e5e7eb", 
                  lineHeight: "1.6", 
                  margin: 0, 
                  paddingLeft: "0",
                  listStyle: "none",
                }}>
                  <li style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#10b981", 
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}></div>
                    Add your design to Shopify store
                  </li>
                  <li style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#10b981", 
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}></div>
                    Generate AI-powered product descriptions
                  </li>
                  <li style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#10b981", 
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}></div>
                    Create multiple size variants (S, M, L, XL)
                  </li>
                  <li style={{ marginBottom: "0", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#10b981", 
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}></div>
                    Set up product collections and pricing
                  </li>
                </ul>
              </div>

              {progress && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05))",
                  color: "#60a5fa",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  marginBottom: "20px",
                  textAlign: "center",
                  border: "1px solid rgba(14, 165, 233, 0.2)",
                  fontWeight: "500",
                  boxShadow: "0 4px 16px rgba(14, 165, 233, 0.1)",
                }}>
                  {progress}
                </div>
              )}

              <button
                onClick={handleLaunchIt}
                disabled={isLaunching}
                style={{
                  width: "100%",
                  background: isLaunching 
                    ? "linear-gradient(135deg, #6b7280, #4b5563)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "16px 24px",
                  cursor: isLaunching ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "20px",
                  boxShadow: isLaunching 
                    ? "0 4px 12px rgba(107, 114, 128, 0.3)"
                    : "0 8px 20px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isLaunching) {
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 12px 28px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.2)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLaunching) {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1)"
                  }
                }}
              >
                {isLaunching ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}></div>
                    Launching to Shopify...
                  </span>
                ) : (
                  "🚀 Launch to Shopify"
                )}
              </button>

              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "8px",
                padding: "12px 16px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                textAlign: "center",
              }}>
                <p style={{ 
                  fontSize: "12px", 
                  color: "#a1a1aa", 
                  lineHeight: "1.5",
                  margin: 0,
                }}>
                  🎨 Launch your AI-enhanced design to your Shopify store
                  <br />
                  <span style={{ color: "#10b981", fontWeight: "500" }}>Create products, collections, and start selling instantly</span>
                </p>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
                color: "#10b981",
                padding: "25px",
                borderRadius: "16px",
                marginBottom: "25px",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.15)",
              }}>
                <div style={{ 
                  fontSize: "48px", 
                  marginBottom: "15px",
                  filter: "drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))",
                }}>✅</div>
                <h3 style={{ fontSize: "20px", margin: "0 0 10px 0", fontWeight: "600" }}>
                  Successfully Launched!
                </h3>
                <p style={{ fontSize: "14px", margin: 0, color: "#6ee7b7" }}>
                  Your design is now live on Shopify
                </p>
              </div>

              <div style={{
                background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #333",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    background: "linear-gradient(135deg, #059669, #047857)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}>
                    🛒
                  </div>
                  <h4 style={{ fontSize: "16px", color: "#10b981", margin: 0, fontWeight: "600" }}>
                    What's Next:
                  </h4>
                </div>
                <ul style={{ 
                  fontSize: "13px", 
                  color: "#e5e7eb", 
                  lineHeight: "1.6", 
                  margin: 0, 
                  paddingLeft: "0",
                  listStyle: "none",
                }}>
                  <li style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#10b981", 
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}></div>
                    View your product in Shopify admin
                  </li>
                  <li style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#10b981", 
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}></div>
                    Customize product details and pricing
                  </li>
                  <li style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#10b981", 
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}></div>
                    Set up inventory and shipping options
                  </li>
                  <li style={{ marginBottom: "0", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#10b981", 
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}></div>
                    Start promoting and selling your design
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 