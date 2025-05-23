import { 
  Wand2, 
  RotateCcw, 
  Save, 
  Download, 
  Palette,
  Brush,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { useStore } from '../store/useStore'

export function Toolbar() {
  const {
    selectedGarment,
    activeView,
    isProcessingAI,
    aiProgress,
    selectedColor,
    brushSize,
    setActiveView,
    enhanceDrawing,
    saveDesign,
    exportDesign,
    setSelectedColor,
    setBrushSize,
    resetToTemplateSelection
  } = useStore()

  if (!selectedGarment) return null

  return (
    <div className="toolbar">
      {/* Header with garment info and back button */}
      <div className="toolbar-header">
        <button 
          className="back-button"
          onClick={resetToTemplateSelection}
          title="Back to template selection"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="garment-info">
          <span className="garment-name">{selectedGarment.name}</span>
        </div>
      </div>

      {/* View Switcher */}
      <div className="view-switcher">
        <button
          className={`view-button ${activeView === 'front' ? 'active' : ''}`}
          onClick={() => setActiveView('front')}
        >
          Front
        </button>
        <button
          className={`view-button ${activeView === 'back' ? 'active' : ''}`}
          onClick={() => setActiveView('back')}
        >
          Back
        </button>
      </div>

      {/* Drawing Tools */}
      <div className="tool-section">
        <div className="tool-group">
          <label className="tool-label">Color</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="color-picker"
          />
        </div>

        <div className="tool-group">
          <label className="tool-label">Brush Size</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="brush-slider"
          />
          <span className="brush-size-display">{brushSize}px</span>
        </div>
      </div>

      {/* Magic Wand Section */}
      <div className="magic-section">
        <button
          className={`magic-button ${isProcessingAI ? 'processing' : ''}`}
          onClick={enhanceDrawing}
          disabled={isProcessingAI}
        >
          <Wand2 size={20} />
          <span>{isProcessingAI ? 'Enhancing...' : 'Magic Wand'}</span>
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
        <button className="action-button save" onClick={saveDesign}>
          <Save size={18} />
          <span>Save</span>
        </button>
        
        <button className="action-button export" onClick={exportDesign}>
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>
    </div>
  )
} 