import React from 'react'

export function LandingPage({ onLogin, onSignUp }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column",
      background: "#000000",
      color: "white",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
    }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
        borderBottom: "1px solid #27272a",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{
          display: "flex",
          height: "80px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            <span style={{ fontWeight: "bold", fontSize: "20px", letterSpacing: "-0.025em" }}>
              ThreadIt
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={onLogin}
              style={{
                background: "white",
                color: "black",
                border: "1px solid white",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#e4e4e7"
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white"
              }}
            >
              Log In
            </button>
            <button
              onClick={onSignUp}
              style={{
                background: "black",
                color: "white",
                border: "1px solid #27272a",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#18181b"
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "black"
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{
          width: "100%",
          padding: "96px 24px",
        }}>
          <div style={{
            maxWidth: "768px",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}>
            <h1 style={{
              fontSize: "48px",
              fontWeight: "bold",
              letterSpacing: "-0.025em",
              lineHeight: "1.1",
              margin: 0,
            }}>
              Transform Your{" "}
              <span style={{
                background: "linear-gradient(to right, white, #a1a1aa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Clothing Designs
              </span>{" "}
              with AI
            </h1>
            <p style={{
              fontSize: "18px",
              color: "#a1a1aa",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}>
              Sketch, enhance, and transform your clothing designs with our powerful AI tools. Create
              professional-quality garment designs in minutes.
            </p>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
            }}>
              <button
                onClick={onSignUp}
                style={{
                  background: "black",
                  color: "white",
                  border: "1px solid #27272a",
                  borderRadius: "6px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  minWidth: "200px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#18181b"
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "black"
                }}
              >
                Get Started
              </button>
              <button
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  background: "white",
                  color: "black",
                  border: "1px solid white",
                  borderRadius: "6px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  minWidth: "200px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e4e4e7"
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white"
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{
          width: "100%",
          padding: "96px 24px",
          borderTop: "1px solid #27272a",
        }}>
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}>
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{
                fontSize: "36px",
                fontWeight: "bold",
                letterSpacing: "-0.025em",
                margin: "0 0 16px 0",
              }}>
                How It Works
              </h2>
              <p style={{
                fontSize: "18px",
                color: "#a1a1aa",
                maxWidth: "700px",
                margin: "0 auto",
              }}>
                Our intuitive workflow makes designing custom clothing simple and efficient
              </p>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "64px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "1px solid #27272a",
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Sketch</h3>
                <p style={{ textAlign: "center", color: "#a1a1aa" }}>
                  Draw your rough designs on front and back garment templates
                </p>
              </div>
              
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "1px solid #27272a",
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 4V2a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v2"/>
                    <path d="M3 7h18l-2 10H5L3 7Z"/>
                    <path d="M18 7H6"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Enhance</h3>
                <p style={{ textAlign: "center", color: "#a1a1aa" }}>
                  Use our AI Magic Wand to refine and perfect your sketches
                </p>
              </div>
              
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "1px solid #27272a",
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17,21 17,13 7,13 7,21"/>
                    <polyline points="7,3 7,8 15,8"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Export</h3>
                <p style={{ textAlign: "center", color: "#a1a1aa" }}>
                  Automatically deploy your designs to your Shopify storefront
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          width: "100%",
          padding: "96px 24px",
          borderTop: "1px solid #27272a",
        }}>
          <div style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}>
            <div>
              <h2 style={{
                fontSize: "36px",
                fontWeight: "bold",
                letterSpacing: "-0.025em",
                margin: "0 0 16px 0",
              }}>
                Ready to Transform Your Designs?
              </h2>
              <p style={{
                fontSize: "18px",
                color: "#a1a1aa",
                maxWidth: "700px",
                margin: "0 auto",
              }}>
                Join today and start creating professional clothing designs in minutes.
              </p>
            </div>
            <button
              onClick={onSignUp}
              style={{
                background: "black",
                color: "white",
                border: "1px solid #27272a",
                borderRadius: "6px",
                padding: "16px 32px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "500",
                maxWidth: "300px",
                margin: "0 auto",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#18181b"
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "black"
              }}
            >
              Get Started Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        width: "100%",
        borderTop: "1px solid #27272a",
        padding: "32px 24px",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}>
          <p style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#71717a",
            margin: 0,
          }}>
            © 2025 ThreadIt. All rights reserved.
          </p>
          <nav style={{ display: "flex", gap: "24px" }}>
            <a href="#" style={{
              fontSize: "14px",
              color: "#71717a",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.color = "white"}
            onMouseLeave={(e) => e.target.style.color = "#71717a"}>
              Terms
            </a>
            <a href="#" style={{
              fontSize: "14px",
              color: "#71717a",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.color = "white"}
            onMouseLeave={(e) => e.target.style.color = "#71717a"}>
              Privacy
            </a>
            <a href="#" style={{
              fontSize: "14px",
              color: "#71717a",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.color = "white"}
            onMouseLeave={(e) => e.target.style.color = "#71717a"}>
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
} 