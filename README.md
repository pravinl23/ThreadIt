# ThreadSketch 🎨👕

A powerful clothing design application that lets you sketch, enhance, and transform garment designs using AI-powered tools.

## ✨ Features

### 🎯 Core Workflow
1. **Select Garment Template** - Choose from T-shirts, hoodies, sweaters, jackets, and more
2. **Sketch** - Draw your designs on front and back views with intuitive drawing tools
3. **Enhance with Magic Wand** - AI-powered design enhancement (coming soon)
4. **Review & Iterate** - Switch between views, refine your designs
5. **Save & Export** - Save your work and export final designs

### 🛠️ Current Features
- **Dual Canvas System** - Independent front and back view design canvases
- **Garment Templates** - 9 different clothing items with proper front/back views
- **Full-Screen Drawing** - Immersive design experience with TLDraw integration
- **Persistent Saves** - Your work is automatically saved per garment and view
- **Modern UI** - Clean, professional interface with smooth animations
- **Responsive Design** - Works on desktop and mobile devices

### 🎨 Available Garments
- T-Shirt
- Hoodie  
- Tank Top
- Sweater
- Zip Hoodie
- Work Jacket
- Shorts
- Jeans
- Sweatpants

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ThreadSketch
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Use

### Starting a Design
1. Launch the app and you'll see the garment selection screen
2. Click on any garment template to start designing
3. You'll be taken to the design workspace

### Design Workspace
- **Toolbar (Left)**: Contains all your tools and controls
- **Canvas (Right)**: Your drawing area with the garment template as a background
- **View Switcher**: Toggle between Front and Back views
- **Drawing Tools**: Color picker and brush size controls
- **Magic Wand**: AI enhancement button (simulated for now)
- **Save/Export**: Save your work or export designs

### Navigation
- **Back Button**: Return to garment selection
- **Front/Back Tabs**: Switch between garment views
- **Auto-Save**: Your work is automatically saved as you draw

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** - Modern UI framework
- **TLDraw** - Powerful 2D drawing canvas
- **Zustand** - Lightweight state management
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons

### Key Components
- `GarmentSelector` - Template selection interface
- `DesignCanvas` - Dual canvas with background templates
- `Toolbar` - All controls and tools
- `useStore` - Centralized state management

### State Management
The app uses Zustand for clean, performant state management:
- Garment selection and templates
- Active view (front/back) tracking
- Canvas stores for each view
- Tool states (color, brush size)
- AI processing states
- UI visibility controls

## 🔮 Future Enhancements

### AI Integration (Next Steps)
- **Backend API** - FastAPI server for AI processing
- **Real AI Enhancement** - Integration with image generation models
- **Celery Workers** - Async AI processing
- **Redis** - Message queuing and real-time updates
- **Server-Sent Events** - Live progress updates

### Additional Features
- **3D Visualization** - View designs on 3D garment models
- **Collaboration** - Real-time collaborative design
- **Design Library** - Save and share design templates
- **Export Formats** - Multiple export options (PNG, SVG, PDF)
- **Print Integration** - Direct printing capabilities

## 📁 Project Structure

```
ThreadSketch/
├── public/
│   └── assets/
│       └── clothes/           # Garment template images
├── src/
│   ├── components/
│   │   ├── GarmentSelector.jsx
│   │   ├── DesignCanvas.jsx
│   │   └── Toolbar.jsx
│   ├── store/
│   │   └── useStore.js        # Zustand store
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
└── README.md
```

## 🎨 Design Philosophy

ThreadSketch is built with a focus on:
- **Intuitive Workflow** - Natural progression from template to finished design
- **Professional Tools** - Industry-grade drawing capabilities
- **Modern UX** - Smooth animations and responsive design  
- **Scalable Architecture** - Ready for advanced AI features
- **Cross-Platform** - Works on all devices

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Garments
1. Add garment images to `public/assets/clothes/`
2. Update the `garmentTemplates` array in `src/store/useStore.js`
3. Include both front and back view images

---

**Built for the hackathon with ❤️ by the ThreadSketch team**
