import { create } from "zustand"

export const useStore = create((set, get) => ({
  // Garment and template state
  selectedGarment: null,
  garmentTemplates: [
    {
      id: "tee",
      name: "T-Shirt",
      image: "/assets/clothes/Tee.png",
      frontImage: "/assets/clothes/Tee.png",
      backImage: "/assets/clothes/Tee 2.png",
    },
    {
      id: "hoodie",
      name: "Hoodie",
      image: "/assets/clothes/Hoodie.png",
      frontImage: "/assets/clothes/Hoodie.png",
      backImage: "/assets/clothes/Hoodie.png",
    },
    {
      id: "tank",
      name: "Tank Top",
      image: "/assets/clothes/Tank Top 1.png",
      frontImage: "/assets/clothes/Tank Top 1.png",
      backImage: "/assets/clothes/Tank Top 1.png",
    },
    {
      id: "sweater",
      name: "Sweater",
      image: "/assets/clothes/Sweater New.png",
      frontImage: "/assets/clothes/Sweater New.png",
      backImage: "/assets/clothes/Sweater New.png",
    },
    {
      id: "zip-hoodie",
      name: "Zip Hoodie",
      image: "/assets/clothes/Zip Hoodie 4.png",
      frontImage: "/assets/clothes/Zip Hoodie 4.png",
      backImage: "/assets/clothes/Zip Hoodie 4.png",
    },
    {
      id: "jacket",
      name: "Work Jacket",
      image: "/assets/clothes/Work Jacket.png",
      frontImage: "/assets/clothes/Work Jacket.png",
      backImage: "/assets/clothes/Work Jacket.png",
    },
    {
      id: "shorts",
      name: "Shorts",
      image: "/assets/clothes/Shorts.png",
      frontImage: "/assets/clothes/Shorts.png",
      backImage: "/assets/clothes/Shorts.png",
    },
    {
      id: "jeans",
      name: "Jeans",
      image: "/assets/clothes/Jeans 2.png",
      frontImage: "/assets/clothes/Jeans 2.png",
      backImage: "/assets/clothes/Jeans 2.png",
    },
    {
      id: "sweats",
      name: "Sweatpants",
      image: "/assets/clothes/Sweats 3.png",
      frontImage: "/assets/clothes/Sweats 3.png",
      backImage: "/assets/clothes/Sweats 3.png",
    },
  ],

  // Canvas state
  activeView: "front", // 'front' or 'back'
  frontCanvasRef: null,
  backCanvasRef: null,

  // Tool state
  selectedTool: "brush",
  selectedColor: "#000000",
  brushSize: 4,

  // AI and processing state
  isProcessingAI: false,
  aiProgress: null,

  // UI state
  showTemplateSelector: true,
  showToolbar: true,

  // Actions
  setSelectedGarment: (garment) => set({ selectedGarment: garment, showTemplateSelector: false }),
  setActiveView: (view) => set({ activeView: view }),
  setFrontCanvasRef: (ref) => set({ frontCanvasRef: ref }),
  setBackCanvasRef: (ref) => set({ backCanvasRef: ref }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setIsProcessingAI: (processing) => set({ isProcessingAI: processing }),
  setAiProgress: (progress) => set({ aiProgress: progress }),
  setShowTemplateSelector: (show) => set({ showTemplateSelector: show }),
  setShowToolbar: (show) => set({ showToolbar: show }),

  // Get current active canvas ref
  getActiveCanvasRef: () => {
    const state = get()
    return state.activeView === "front" ? state.frontCanvasRef : state.backCanvasRef
  },

  // Reset to template selection
  resetToTemplateSelection: () =>
    set({
      selectedGarment: null,
      showTemplateSelector: true,
      activeView: "front",
    }),

  // Magic Wand - AI Enhancement
  enhanceDrawing: async () => {
    const state = get()

    set({ isProcessingAI: true, aiProgress: "Preparing your sketch..." })

    try {
      // Simulate AI processing for now
      set({ aiProgress: "AI is analyzing your design..." })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      set({ aiProgress: "Enhancing artwork..." })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      set({ aiProgress: "Finalizing details..." })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For now, just show completion message
      set({ aiProgress: "Enhancement complete!" })
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("AI enhancement failed:", error)
      set({ aiProgress: "Enhancement failed. Please try again." })
    } finally {
      set({ isProcessingAI: false, aiProgress: null })
    }
  },

  // Save current design
  saveDesign: () => {
    const state = get()
    // Implementation for saving design
    console.log("Saving design for garment:", state.selectedGarment?.name)
  },

  // Export design
  exportDesign: () => {
    const state = get()
    // Implementation for exporting design
    console.log("Exporting design for garment:", state.selectedGarment?.name)
  },
}))
