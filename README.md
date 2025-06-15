# ThreadSketch 🎨

[![Demo](./public/videos/thumbnail.png)](./public/videos/threadit.mov)

> A powerful web application that transforms your sketches into custom garment designs, powered by AI and integrated with Shopify.

## 🎯 Overview

ThreadSketch is an innovative platform that bridges the gap between artistic expression and fashion design. It allows users to create custom garment designs through an intuitive drawing interface, which are then processed using AI to generate professional-quality product listings on Shopify.

## ✨ Features

- **Interactive Drawing Interface**: Create designs using a powerful canvas-based drawing tool
- **AI-Powered Design Enhancement**: Automatically enhance and optimize your sketches
- **Shopify Integration**: Seamlessly publish designs to your Shopify store
- **Real-time Preview**: See how your design looks on different garment types
- **Custom Product Generation**: AI-generated product names, descriptions, and tags
- **Waitlist System**: Built-in waitlist functionality for pre-launch products

## 🛠 Technical Architecture

### Frontend
- **Framework**: React with Vite
- **State Management**: Zustand
- **Drawing Interface**: tldraw
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **AI Integration**: Anthropic Claude 3.5 Sonnet
- **Image Processing**: Sharp, Canvas
- **Shopify Integration**: REST Admin API
- **File Handling**: Formidable, Multer

### Key Components

#### Drawing Interface
```javascript
// Example of drawing interface integration
import { Tldraw } from 'tldraw'

function DrawingCanvas() {
  return (
    <Tldraw
      onSave={(data) => {
        // Handle drawing data
      }}
      tools={['draw', 'erase', 'select']}
    />
  )
}
```

#### AI Product Generation
```javascript
// Example of AI product generation
async function generateProductDetails(garmentType) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    messages: [{
      role: "user",
      content: `Generate product details for ${garmentType}...`
    }]
  })
  return response.content
}
```

#### Shopify Integration
```javascript
// Example of Shopify product creation
async function createShopifyProduct(design, productDetails) {
  const response = await fetch(
    `https://${shopUrl}/admin/api/2024-01/products.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product: {
          title: productDetails.title,
          body_html: productDetails.description,
          tags: productDetails.tags,
          images: [{
            attachment: designImage
          }]
        }
      })
    }
  )
  return response.json()
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Shopify Partner account
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/threadsketch.git
cd threadsketch
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
SHOPIFY_STORE_URL=your_store_url
SHOPIFY_ADMIN_API_KEY=your_admin_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. In a separate terminal, start the backend server:
```bash
npm run server
```

## 🔧 Configuration

### Environment Variables
- `ANTHROPIC_API_KEY`: Your Anthropic API key for AI features
- `SHOPIFY_STORE_URL`: Your Shopify store URL
- `SHOPIFY_ADMIN_API_KEY`: Your Shopify Admin API key

### Customization
- Modify `tailwind.config.ts` for styling customization
- Update `server.js` for backend configuration
- Customize product templates in `src/services/productGenerator.js`

## 📦 Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the backend:
```bash
npm run server
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Anthropic for providing the Claude AI API
- Shopify for their robust e-commerce platform
- The open-source community for the amazing tools and libraries


