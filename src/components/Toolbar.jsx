"use client"

import {
  Wand2,
  Download,
  Brush,
  ArrowLeft,
  Eye,
  Undo,
  Redo,
  Eraser,
  Square,
  Circle,
  Type,
  ImageIcon,
  Layers,
} from "lucide-react"
import { useState } from "react"

export function Toolbar({
  selectedGarment,
  activeView,
  selectedColor,
  brushSize,
  isProcessingAI,
  aiProgress,
  onViewChange,
  onColorChange,
  onBrushSizeChange,
  onEnhanceDrawing,
  onExportDesign,
  onBackToTemplates,
}) {
  const [activeTool, setActiveTool] = useState("brush")

  const tools = [
    { id: "brush", name: "Brush", icon: <Brush size={20} /> },
    { id: "eraser", name: "Eraser", icon: <Eraser size={20} /> },
    { id: "square", name: "Square", icon: <Square size={20} /> },
    { id: "circle", name: "Circle", icon: <Circle size={20} /> },
    { id: "text", name: "Text", icon: <Type size={20} /> },
    { id: "image", name: "Image", icon: <ImageIcon size={20} /> },
  ]

  if (!selectedGarment) return null

  return (
    <div className="toolbar">
      {/* Header with garment info and back button */}
      <div className="toolbar-header">
        <button className="back-button" onClick={onBackToTemplates} title="Back to template selection">
          <ArrowLeft size={20} />
        </button>
        <div className="garment-info">
          <span className="garment-name">{selectedGarment.name}</span>
        </div>
      </div>

      {/* View Switcher */}
      <div className="view-switcher">
        <button
          className={`view-button ${activeView === "front" ? "active" : ""}`}
          onClick={() => onViewChange("front")}
        >
          <Eye size={16} />
          <span>Front</span>
        </button>
        <button className={`view-button ${activeView === "back" ? "active" : ""}`} onClick={() => onViewChange("back")}>
          <Eye size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Drawing Tools */}
      <div className="tool-section">
        <h3 className="section-title">Tools</h3>

        <div className="tools-grid">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-button ${activeTool === tool.id ? "active" : ""}`}
              onClick={() => setActiveTool(tool.id)}
              title={tool.name}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        <div className="tool-group">
          <label className="tool-label">Color</label>
          <div className="color-picker-container">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="color-picker"
            />
            <span className="color-value">{selectedColor}</span>
          </div>
        </div>

        <div className="tool-group">
          <label className="tool-label">Brush Size</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number.parseInt(e.target.value))}
            className="brush-slider"
          />
          <div className="brush-size-preview">
            <div
              className="brush-preview-dot"
              style={{
                width: `${brushSize * 2}px`,
                height: `${brushSize * 2}px`,
                background: selectedColor,
              }}
            ></div>
            <span className="brush-size-value">{brushSize}px</span>
          </div>
        </div>

        <div className="history-controls">
          <button className="history-button" title="Undo">
            <Undo size={18} />
          </button>
          <button className="history-button" title="Redo">
            <Redo size={18} />
          </button>
        </div>
      </div>

      {/* Magic Wand Section */}
      <div className="magic-section">
        <button
          className={`magic-button ${isProcessingAI ? "processing" : ""}`}
          onClick={onEnhanceDrawing}
          disabled={isProcessingAI}
        >
          <Wand2 size={20} />
          <span>{isProcessingAI ? "Enhancing..." : "Enhance with AI"}</span>
        </button>

        {aiProgress && (
          <div className="ai-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">{aiProgress}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="action-buttons">
        <button className="action-button export" onClick={onExportDesign}>
          <Download size={18} />
          <span>Export Design</span>
        </button>

        <button className="action-button layers">
          <Layers size={18} />
          <span>Manage Layers</span>
        </button>
      </div>
    </div>
  )
}
