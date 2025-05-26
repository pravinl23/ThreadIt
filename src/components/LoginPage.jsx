import React, { useState } from 'react'

export function LoginPage({ onSuccess, onBack, onSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Hardcoded credentials check
    if (email === 'krishgarg19@gmail.com' && password === 'password19') {
      // Simulate a brief loading state
      setTimeout(() => {
        onSuccess()
      }, 1000)
    } else {
      setError('Invalid email or password. Please try again.')
      setIsLoading(false)
    }
  }

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
        width: "100%",
        borderBottom: "1px solid #27272a",
        background: "#000000",
      }}>
        <div style={{
          display: "flex",
          height: "80px",
          alignItems: "center",
          padding: "0 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              letterSpacing: "-0.025em",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            ThreadIt
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: "0 0 8px 0",
              }}>
                Welcome back
              </h1>
              <p style={{
                color: "#a1a1aa",
                margin: 0,
              }}>
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <div style={{
                background: "rgba(185, 28, 28, 0.2)",
                color: "#fca5a5",
                border: "1px solid #7f1d1d",
                borderRadius: "6px",
                padding: "12px",
                fontSize: "14px",
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label htmlFor="email" style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "6px",
                    color: "white",
                    padding: "12px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <label htmlFor="password" style={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}>
                    Password
                  </label>
                  <a href="#" style={{
                    fontSize: "12px",
                    color: "#a1a1aa",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => e.target.style.color = "white"}
                  onMouseLeave={(e) => e.target.style.color = "#a1a1aa"}>
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "6px",
                    color: "white",
                    padding: "12px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  background: "white",
                  color: "black",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.background = "#e4e4e7"
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.background = "white"
                }}
              >
                {isLoading && (
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid black",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }} />
                )}
                Sign In
              </button>
            </form>

            <div style={{
              textAlign: "center",
              fontSize: "14px",
            }}>
              <p style={{
                color: "#a1a1aa",
                margin: 0,
              }}>
                Don't have an account?{" "}
                <button
                  onClick={onSignUp}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        width: "100%",
        borderTop: "1px solid #27272a",
        padding: "24px",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}>
          <p style={{
            fontSize: "14px",
            color: "#71717a",
            margin: 0,
          }}>
            © 2025 ThreadIt. All rights reserved.
          </p>
        </div>
      </footer>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 