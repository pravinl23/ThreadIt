import React, { useState } from 'react'

export function FinalDesign({ designData, selectedGarment, onBack }) {
  const [isLaunching, setIsLaunching] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [progress, setProgress] = useState('')
  const [statusUpdates, setStatusUpdates] = useState([])
  const [productData, setProductData] = useState(null) // Store product data for redirect

  // Get the Thread It enhanced image URL from designData
  const enhancedImageUrl = designData?.previewUrl || '/uploads/thread-it-enhanced.png'

  const addStatusUpdate = (message) => {
    setStatusUpdates(prev => [...prev, { message, timestamp: Date.now() }])
  }

  const handleLaunchIt = async () => {
    setIsLaunching(true)
    setStatusUpdates([])
    setProgress('🚀 Launching to Shopify...')
    addStatusUpdate('🚀 Starting Shopify integration...')

    try {
      console.log("Launching product to Shopify...")
      
      // Check if we're in demo mode or have stored credentials
      const isDemoMode = sessionStorage.getItem('demo_mode') === 'true'
      const storeUrl = sessionStorage.getItem('shopify_store_url')
      const apiKey = sessionStorage.getItem('shopify_api_key')
      
      if (!isDemoMode && (!storeUrl || !apiKey)) {
        throw new Error('Shopify credentials not found. Please try the Thread It process again.')
      }
      
      // Update progress to show theme installation
      setTimeout(() => {
        setProgress('🎨 Installing ThreadIt theme...')
        addStatusUpdate('🎨 Installing custom ThreadIt theme...')
      }, 1000)
      
      setTimeout(() => {
        setProgress('📦 Creating product...')
        addStatusUpdate('📦 Creating product with AI descriptions...')
      }, 3000)
      
      setTimeout(() => {
        setProgress('📷 Uploading design image...')
        addStatusUpdate('📷 Uploading your enhanced design...')
      }, 5000)
      
      // Prepare request body
      const requestBody = isDemoMode 
        ? { demo: true } // Server will use .env credentials
        : { storeUrl: storeUrl, apiKey: apiKey } // Use provided credentials
      
      const response = await fetch('http://localhost:3001/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (response.ok) {
        setProgress('✅ Successfully launched to Shopify!')
        addStatusUpdate('✅ Product created successfully!')
        
        if (isDemoMode) {
          addStatusUpdate('🎪 Launched using demo store credentials')
        }
        
        if (data.theme?.installed || data.theme?.success) {
          addStatusUpdate(`🎨 Theme installation: SUCCESS!`)
          if (data.theme?.theme?.name) {
            addStatusUpdate(`📋 Theme: ${data.theme.theme.name}`)
          }
          if (data.theme?.published) {
            addStatusUpdate(`🚀 Theme published: YES - Now live!`)
          } else {
            addStatusUpdate(`⏳ Theme installed but not published yet`)
          }
          addStatusUpdate('🛒 Your store is ready with custom branding!')
        } else if (data.theme?.error) {
          addStatusUpdate(`⚠️ Theme installation had issues: ${data.theme.error}`)
        }
        
        addStatusUpdate(`🎯 Product: ${data.aiDetails?.title || 'ThreadIt Design'}`)
        addStatusUpdate('🎉 Launch completed successfully!')
        
        setLaunched(true)
        setProductData(data)
        console.log("Product created:", data.product)
        console.log("AI-generated details:", data.aiDetails)
        console.log("Theme installation:", data.theme)
      } else {
        setProgress(`❌ Failed: ${data.error}`)
        addStatusUpdate(`❌ Failed: ${data.error}`)
        console.error("Error:", data.error)
      }
    } catch (error) {
      setProgress(`❌ Connection error: ${error.message}`)
      addStatusUpdate(`❌ Connection error: ${error.message}`)
      console.error("Network error:", error)
    } finally {
      setIsLaunching(false)
    }
  }

  // Function to redirect to Shopify store
  const redirectToStore = () => {
    if (productData) {
      // Check if we're in demo mode or have stored credentials
      const isDemoMode = sessionStorage.getItem('demo_mode') === 'true'
      let storeUrl
      
      if (isDemoMode) {
        // Use demo store URL (hardcoded)
        storeUrl = '32sxs7-yt.myshopify.com'
      } else {
        // Use stored credentials
        storeUrl = sessionStorage.getItem('shopify_store_url')
        if (storeUrl) {
          // Clean the URL to remove protocol if present
          storeUrl = storeUrl.replace(/^https?:\/\//, '')
        }
      }
      
      if (storeUrl && productData.product?.handle) {
        const productUrl = `https://${storeUrl}/products/${productData.product.handle}`
        console.log('Redirecting to:', productUrl)
        window.open(productUrl, '_blank')
      } else {
        // Fallback to store homepage
        const storeHomeUrl = storeUrl ? `https://${storeUrl}` : '#'
        console.log('Redirecting to store home:', storeHomeUrl)
        window.open(storeHomeUrl, '_blank')
      }
    }
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#000000",
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
        background: "#000000",
      }}>
        <div>
          <h1 style={{ 
            fontSize: "20px", 
            fontWeight: "600", 
            margin: 0,
            color: "white",
          }}>
            🧵 Thread It - Final Design
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
        height: "calc(100vh - 80px)",
        gap: "0",
      }}>
        {/* Design Preview Panel */}
        <div style={{
          flex: "1",
          background: "#000000",
          padding: "30px",
          borderRight: "1px solid #333",
        }}>
          <h2 style={{ 
            fontSize: "18px", 
            marginBottom: "20px", 
            color: "#fff",
            fontWeight: "500",
            margin: "0 0 20px 0",
          }}>
            Design Preview
          </h2>
          
          {/* T-shirt mockup container */}
          <div style={{
            background: "#2a2a2a",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #333",
            position: "relative",
          }}>
            {/* Enhanced design display */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* Single enhanced image */}
              <div style={{ textAlign: "center" }}>
                <img
                  src={enhancedImageUrl}
                  alt="AI Enhanced Design"
                  style={{
                    maxWidth: "400px",
                    maxHeight: "400px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    background: "#333",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                  onError={(e) => {
                    console.error('Failed to load enhanced image:', enhancedImageUrl)
                  }}
                />
              </div>
            </div>
            
            {/* Design info */}
            <div style={{ 
              marginTop: "30px", 
              textAlign: "center",
            }}>
              <h3 style={{ 
                fontSize: "18px", 
                fontWeight: "500", 
                marginBottom: "8px",
                color: "#fff",
              }}>
                AI Enhanced Design
              </h3>
              <p style={{ 
                fontSize: "14px", 
                margin: "0 0 5px 0",
                color: "#ccc",
              }}>
                Created with ThreadIt
              </p>
              <p style={{ 
                fontSize: "12px", 
                margin: "0",
                color: "#999",
              }}>
                Enhanced: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Create Your Store Panel */}
        <div style={{
          width: "400px",
          background: "#000000",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
        }}>
          <h2 style={{ 
            fontSize: "18px", 
            margin: "0 0 30px 0",
            color: "#fff",
            fontWeight: "500",
          }}>
            Launch to Shopify
          </h2>
          
          {!launched ? (
            <>
              {/* Features Section */}
              <div style={{
                marginBottom: "30px",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}>
                  <span style={{ fontSize: "16px" }}>💎</span>
                  <h3 style={{ 
                    fontSize: "14px", 
                    margin: 0,
                    color: "#10b981",
                    fontWeight: "600",
                  }}>
                    Professional Shopify Store Features
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
                  <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ color: "#10b981", fontSize: "10px", marginTop: "6px" }}>●</span>
                    <span>Custom ThreadIt product with premium variants</span>
                  </li>
                  <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ color: "#3b82f6", fontSize: "10px", marginTop: "6px" }}>●</span>
                    <span>Professional design system & typography</span>
                  </li>
                  <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ color: "#8b5cf6", fontSize: "10px", marginTop: "6px" }}>●</span>
                    <span>Beautiful organized product collections</span>
                  </li>
                  <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ color: "#f59e0b", fontSize: "10px", marginTop: "6px" }}>●</span>
                    <span>Responsive design for all devices</span>
                  </li>
                  <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ color: "#ec4899", fontSize: "10px", marginTop: "6px" }}>●</span>
                    <span>Modern animations & interactions</span>
                  </li>
                  <li style={{ marginBottom: "0", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ color: "#06b6d4", fontSize: "10px", marginTop: "6px" }}>●</span>
                    <span>ThreadIt branding throughout</span>
                  </li>
                </ul>
              </div>

              {/* Progress Updates */}
              {statusUpdates.length > 0 && (
                <div style={{
                  background: "#2a2a2a",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "25px",
                  border: "1px solid #333",
                  maxHeight: "120px",
                  overflowY: "auto",
                }}>
                  {statusUpdates.map((update, index) => (
                    <div key={index} style={{
                      fontSize: "12px",
                      color: "#10b981",
                      marginBottom: "8px",
                      paddingLeft: "10px",
                      borderLeft: "2px solid #10b981",
                    }}>
                      {update.message}
                    </div>
                  ))}
                </div>
              )}

              {/* Launch Button */}
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
                  borderRadius: "8px",
                  padding: "16px 24px",
                  cursor: isLaunching ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "20px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isLaunching) {
                    e.target.style.background = "linear-gradient(135deg, #059669, #047857)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLaunching) {
                    e.target.style.background = "linear-gradient(135deg, #10b981, #059669)"
                  }
                }}
              >
                {isLaunching ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <div style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}></div>
                    Creating Shopify Store...
                  </span>
                ) : (
                  "🚀 Launch to Shopify Store"
                )}
              </button>

              {/* Description */}
              <p style={{
                fontSize: "11px",
                color: "#999",
                lineHeight: "1.6",
                textAlign: "center",
                margin: 0,
              }}>
                This will create a stunning, professional Shopify store with elegant design system, refined typography, smooth animations, and beautiful modern layouts optimized for conversions.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
                color: "#10b981",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>✅</div>
                <h3 style={{ fontSize: "18px", margin: "0 0 10px 0", fontWeight: "600" }}>
                  Store Created Successfully!
                </h3>
                <p style={{ fontSize: "12px", margin: 0, color: "#6ee7b7" }}>
                  Your professional store is now live on Shopify
                </p>
              </div>

              {/* Status Updates */}
              <div style={{
                background: "#2a2a2a",
                borderRadius: "8px",
                padding: "15px",
                border: "1px solid #333",
                maxHeight: "200px",
                overflowY: "auto",
                textAlign: "left",
                marginBottom: "20px",
              }}>
                {statusUpdates.map((update, index) => (
                  <div key={index} style={{
                    fontSize: "11px",
                    color: "#10b981",
                    marginBottom: "8px",
                    paddingLeft: "10px",
                    borderLeft: "2px solid #10b981",
                  }}>
                    {update.message}
                  </div>
                ))}
              </div>

              {/* View in Shopify Store Button */}
              <button
                onClick={redirectToStore}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "16px 24px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)"
                }}
              >
                🛒 View in Shopify Store
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 