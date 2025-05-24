# ThreadIt 🧵✨

A powerful AI-enhanced clothing design application that lets you sketch, enhance, and transform garment designs using cutting-edge AI tools, then launch them directly to Shopify as waitlist products.

## 🚀 Features Overview

### 🎯 Complete Design-to-Store Workflow
1. **Select Garment Template** - Choose from T-shirts, hoodies, sweaters, tanks, and more
2. **Sketch & Design** - Draw your designs with professional TLDraw canvas integration
3. **🧵 Thread It** - AI-powered design enhancement using Stability AI
4. **Preview Enhanced Design** - See your AI-transformed creation
5. **Launch to Shopify** - Deploy as waitlist product with custom themes

### 🤖 AI-Powered Enhancement Pipeline
- **Stability AI Integration** - Professional image-to-image transformation
- **Claude AI Product Generation** - Smart product names and descriptions
- **Dual-Stage Processing** - Generate → Enhance workflow
- **Garment-Specific Prompts** - Tailored AI processing per clothing type

### 🏪 Shopify Integration
- **Automated Product Creation** - Zero-inventory waitlist products
- **Custom Theme Installation** - Branded ThreadIt store themes
- **Image Upload System** - Enhanced designs as product images
- **Waitlist Functionality** - Customer email capture for notifications

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** - Modern UI framework with hooks
- **TLDraw v3** - Professional drawing canvas
- **Zustand** - Lightweight state management
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Smooth animations

### Backend Stack
- **Node.js + Express** - REST API server
- **Formidable** - Multipart file upload handling
- **Sharp** - Image processing and optimization
- **Anthropic Claude** - AI product description generation
- **Stability AI** - Image enhancement and generation

### AI Processing Pipeline

```
User Canvas → Thread It → AI Enhancement → Shopify Product
     ↓              ↓            ↓             ↓
  PNG Capture → Generate() → Enhance() → Upload + Launch
```

#### 1. **Canvas Capture**
```javascript
// TLDraw v3 API integration
const { blob } = await editor.toImage([...shapeIds], {
  format: 'png',
  background: true,
  scale: 2
})
```

#### 2. **AI Processing** (`/api/thread-it`)
```javascript
// Step 1: Generate product image
await generateProduct(rawPath, midPath)  // Stability AI

// Step 2: Enhance the product image  
await enhanceProduct(midPath, finalPath) // Stability AI + Claude suggestions
```

#### 3. **Shopify Launch** (`/add-product`)
```javascript
// Create product with Claude-generated details
const productDetails = await generateProductDetails(garmentType)

// Upload enhanced image
await uploadImageToShopify(productId, enhancedImagePath)

// Install custom ThreadIt theme
await installShopifyTheme()
```

### File Management System
```
public/uploads/
├── thread-it-generated.png    # Stability AI generated
├── thread-it-enhanced.png     # Final enhanced version
└── [temp-uploads]            # Cleaned automatically
```

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js 16+** 
- **Shopify Store** with Admin API access
- **Stability AI API Key** - [Get here](https://platform.stability.ai/)
- **Anthropic API Key** - [Get here](https://console.anthropic.com/)

### 1. Installation

```bash
git clone <your-repo-url>
cd ThreadIt
npm install
```

### 2. Environment Configuration

Create `.env` file:
```bash
# Shopify Configuration
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ADMIN_API_KEY=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# AI API Keys  
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STABILITY_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Shopify Admin API Setup

Create a **Private App** in your Shopify admin:

1. **Settings** → **Apps and sales channels** → **Develop apps**
2. **Create an app** → **Configure Admin API scopes**
3. **Required scopes:**
   - ✅ `write_products` - Create waitlist products
   - ✅ `write_themes` - Install ThreadIt themes  
   - ✅ `write_files` - Upload enhanced design images
4. **Install app** and copy the **Admin API access token**

### 4. Start Development

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend API server
npm run server
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🎨 Usage Guide

### Basic Workflow

1. **Select Garment**
   - Choose from 9+ garment templates (T-shirt, Hoodie, Tank, etc.)
   - Each garment loads as a background template

2. **Design Creation**
   - Use TLDraw tools to sketch your design
   - Work on transparent canvas over garment template
   - Auto-save functionality per garment type

3. **AI Enhancement**
   - Click **🧵 Thread It** to start AI processing
   - Captures canvas at 2x scale with white background
   - Processes through dual AI pipeline:
     - **Generate**: Transforms sketch into product photo
     - **Enhance**: Adds artistic improvements and effects

4. **Preview & Launch**
   - Review enhanced design in preview page
   - Click **🚀 Launch to Shopify** 
   - Creates $0.00 waitlist product with email capture
   - Installs custom ThreadIt theme (optional)

### Advanced Features

#### Custom Product Names
Claude AI generates garment-specific product names:
- **T-Shirt**: "Cosmic Dreams Tee", "Urban Art Shirt"
- **Hoodie**: "Midnight Vibes Hoodie", "Street Flow Pullover"  
- **Tank Top**: "Summer Pulse Tank", "Minimalist Edge Tank"

#### AI Enhancement Prompts
Optimized Stability AI prompts for clothing:
```javascript
// Generation prompt focuses on product photography
"A creative and artistic product photo of a t-shirt displayed on pure white background. Interpret design elements artistically with depth and dimension..."

// Enhancement prompt adds premium touches
"Enhanced version with premium quality improvements, refined colors, professional depth and artistic refinement..."
```

#### File Cleanup System
- **Consistent naming**: `thread-it-enhanced.png` (overwrites previous)
- **Automatic cleanup**: Removes temp files after processing
- **Organized storage**: Dedicated `/uploads` directory

## 🗂️ Project Structure

```
ThreadIt/
├── public/
│   ├── assets/clothes/          # Garment templates (PNG)
│   └── uploads/                 # AI-generated images
├── src/
│   ├── components/
│   │   ├── GarmentSelector.jsx  # Template selection UI
│   │   ├── FinalDesign.jsx     # Preview & Shopify launch
│   │   ├── SavedDesigns.jsx    # Design management
│   │   └── DesignCanvas.jsx    # TLDraw integration
│   ├── services/
│   │   ├── productProcessor.js  # Stability AI integration
│   │   └── productGenerator.js  # Enhancement pipeline
│   ├── store/
│   │   └── useStore.js         # Zustand state management
│   ├── App.jsx                 # Main application
│   └── App.css                 # Styling
├── server.js                   # Express API server
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Frontend APIs

#### `POST /api/thread-it`
AI enhancement pipeline endpoint
```javascript
// Request: multipart/form-data
FormData {
  image: Blob // Canvas PNG capture
}

// Response
{
  success: true,
  url: "/uploads/thread-it-enhanced.png",
  filename: "thread-it-enhanced.png"
}
```

#### `POST /add-product`  
Shopify product creation endpoint
```javascript
// Request
{
  garmentType: "T-Shirt" // From selected garment
}

// Response
{
  message: "Product added to Shopify successfully!",
  product: { /* Shopify product object */ },
  aiDetails: { 
    title: "Cosmic Dreams Tee",
    description: "...",
    tags: ["ThreadIt", "custom-design", "t-shirt"]
  },
  uploadedImage: { /* Shopify image object */ },
  theme: { /* Theme installation result */ }
}
```

### AI Processing Functions

#### `generateProduct(inputPath, outputPath)`
Transforms sketch into product photo using Stability AI
- **Input**: Raw canvas capture
- **Output**: Product-style image with creative interpretation
- **Settings**: `image_strength: 0.42`, `cfg_scale: 6.8`

#### `enhanceProduct(inputPath, outputPath)`  
Adds premium finishing touches
- **Input**: Generated product image
- **Output**: Enhanced version with artistic improvements
- **Settings**: `image_strength: 0.3`, `style_preset: 'enhance'`

#### `generateProductDetails(garmentType)`
Creates product metadata using Claude AI
- **Input**: Garment type (T-Shirt, Hoodie, etc.)
- **Output**: Creative name, description, tags
- **Features**: Garment-specific examples, waitlist integration

## 🎯 State Management

### Zustand Store (`useStore.js`)
```javascript
{
  // Preview system
  previewUrl: string,
  setPreviewUrl: (url) => void,
  
  // Threading state  
  isThreading: boolean,
  setIsThreading: (state) => void,
  
  // Persistence
  selectedGarment: object,
  savedDesigns: array,
  hasUnsavedChanges: boolean
}
```

### TLDraw Persistence
```javascript
// Unique keys per garment and session
persistenceKey: `ThreadIt-${garment.id}-${sessionId}`

// Design loading system
window.threadItDesignToLoad = snapshot
editor.loadSnapshot(window.threadItDesignToLoad)
```

## 🔧 Configuration

### Stability AI Settings
```javascript
// Optimized for clothing design
const API_URL = "https://api.stability.ai"
const ENGINE_ID = "stable-diffusion-xl-1024-v1-0"

// Generation parameters
image_strength: 0.42,  // Preserve design while enhancing
cfg_scale: 6.8,       // Creative interpretation
steps: 50,            // Quality vs speed balance
style_preset: 'photographic'
```

### Claude AI Settings
```javascript
// Product name generation
model: "claude-3-5-sonnet-20241022",
max_tokens: 500,
// Garment-specific prompts with examples
```

### Shopify Configuration
```javascript
// Waitlist product settings
price: '0.00',
inventory_quantity: 0,
inventory_policy: 'deny',
status: 'active'
```

## 🚀 Deployment

### Development
```bash
npm run dev     # Frontend (Vite)
npm run server  # Backend (Express)
```

### Production
```bash
npm run build   # Build frontend
node server.js  # Production server
```

### Environment Variables
Ensure all API keys are configured:
- ✅ Shopify Admin API access token
- ✅ Stability AI API key  
- ✅ Anthropic API key
- ✅ Correct store URL format

## 🔍 Troubleshooting

### Common Issues

#### Thread It Button Not Working
- Check Stability AI API key and credits
- Verify canvas has drawable content
- Check browser console for TLDraw errors

#### Shopify Launch Failing
- Verify Admin API scopes: `write_products`, `write_themes`, `write_files`
- Check store URL format: `store.myshopify.com`
- Ensure API token starts with `shpat_`

#### AI Generated Names Generic
- Confirm garment type is being passed correctly
- Check Claude API key and quota
- Review server logs for prompt/response details

#### Image Upload Issues
- Verify enhanced image exists: `/uploads/thread-it-enhanced.png`
- Check file permissions on uploads directory
- Ensure image file size under Shopify limits

### Debug Mode
```bash
# Enable detailed logging
NODE_ENV=development npm run server
```

## 🎨 Customization

### Adding New Garments
1. Add images to `public/assets/clothes/`
2. Update `garmentTemplates` array in `GarmentSelector.jsx`
3. Add to Claude prompt examples in `generateProductDetails()`

### Custom AI Prompts
Modify prompts in `src/services/productProcessor.js`:
- **Generation prompts**: Control product photo style
- **Enhancement prompts**: Adjust artistic effects
- **Negative prompts**: Exclude unwanted elements

### Shopify Theme Customization
Update theme URL in `server.js`:
```javascript
const PUBLIC_THEME_URL = 'your-custom-theme.zip'
```

## 📊 Performance

- **Canvas Capture**: ~100-500ms (depends on complexity)
- **AI Processing**: ~10-30s total (Generation + Enhancement)
- **Shopify Upload**: ~2-5s (product + image + theme)
- **File Cleanup**: Automatic, immediate

## 🔒 Security

- **API Keys**: Environment variables only
- **File Upload**: 10MB limit, extension validation
- **CORS**: Configured for localhost development
- **Input Validation**: Garment type validation, image format checks

---

**Built with ❤️ using cutting-edge AI technology for the modern fashion creator**

*Transform your sketches into professional products with the power of AI*
