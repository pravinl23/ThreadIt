import dotenv from 'dotenv'
import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const FormData = require('form-data')
import formidable from 'formidable'
import { nanoid } from 'nanoid'
import { generateProduct, enhanceProduct } from './src/services/productProcessor.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const SHOP = process.env.SHOPIFY_STORE_URL
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// Clean the SHOP URL to remove any existing protocol
const cleanShop = SHOP ? SHOP.replace(/^https?:\/\//, '') : ''

// Initialize Anthropic client with the best model
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
})

// Check for required environment variables
if (!cleanShop || !ADMIN_API_TOKEN || !ANTHROPIC_API_KEY) {
  console.error('❌ Missing required environment variables:')
  if (!cleanShop) console.error('  - SHOPIFY_STORE_URL')
  if (!ADMIN_API_TOKEN) console.error('  - SHOPIFY_ADMIN_API_KEY')
  if (!ANTHROPIC_API_KEY) console.error('  - ANTHROPIC_API_KEY')
  console.error('Please create a .env file with your credentials')
}

// Serve static files (for output.png and uploads)
app.use('/static', express.static('public'))
app.use('/uploads', express.static(path.join('public','uploads')))

// Serve theme file for Shopify installation
app.get('/theme.zip', (req, res) => {
  const themeZipPath = path.join(process.cwd(), 'themes', 'theme.zip')
  
  if (!fs.existsSync(themeZipPath)) {
    return res.status(404).json({ error: 'Theme file not found' })
  }
  
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', 'attachment; filename="theme.zip"')
  res.sendFile(themeZipPath)
})

// Function to take screenshot and save as output.png
async function takeScreenshot() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://localhost:5175') // Updated to match current Vite port
    
    // Use proper delay method for newer Puppeteer versions
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for page to load
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public/output.jpg',
      fullPage: true,
      type: 'jpeg',
      quality: 90
    })
    
    await browser.close()
    console.log('✅ Screenshot saved as output.jpg')
    return true
  } catch (error) {
    console.error('❌ Screenshot failed:', error)
    return false
  }
}

// Function to generate product details using Claude
async function generateProductDetails(garmentType = 'T-Shirt') {
  try {
    console.log('🤖 Generating product details with Claude 3.5 Sonnet...')
    console.log('🎽 Creating product name for:', garmentType)
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Best model available
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Generate a creative product name and description for a custom ${garmentType} design created with ThreadIt.

The garment type is: ${garmentType}

Create a catchy, creative product name that fits this specific garment type and suggests uniqueness and style. Use words that suggest creativity, art, or fashion.

Examples for different types:
- T-Shirt: "Neon Dreams Tee", "Cosmic Canvas Shirt", "Urban Art Tee"  
- Hoodie: "Midnight Vibes Hoodie", "Street Art Pullover", "Creative Flow Hoodie"
- Tank Top: "Summer Pulse Tank", "Minimalist Art Tank", "Urban Edge Tank"
- Sweater: "Cozy Canvas Sweater", "Artistic Comfort Pullover"

Return ONLY a valid JSON object with title, description, and tags. No extra text.

Format:
{
  "title": "[Creative Name] ${garmentType}",
  "description": "A one-of-a-kind ${garmentType.toLowerCase()} design created with ThreadIt's creative tools. This unique piece showcases artistic expression and personal style.",
  "tags": ["ThreadIt", "custom-design", "unique", "artistic", "${garmentType.toLowerCase()}"]
}`
      }]
    })

    const content = response.content[0].text
    console.log('🤖 Claude response:', content)
    
    // Try to parse JSON from Claude's response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const productDetails = JSON.parse(jsonMatch[0])
      
      // Ensure we have required fields
      if (productDetails.title && productDetails.description) {
        // Add waitlist HTML to description
        productDetails.description = `
          <p>${productDetails.description}</p>
          <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
            <h4 style="margin-top: 0; color: #28a745;">🎯 Join the Waitlist</h4>
            <p style="margin-bottom: 15px;">This item is currently out of stock. Enter your email below to be notified when it becomes available:</p>
            <form action="/contact" method="post" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <input type="hidden" name="form_type" value="customer">
              <input type="hidden" name="tags" value="waitlist,threadit">
              <input type="email" name="contact[email]" placeholder="your@email.com" required style="flex: 1; min-width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <button type="submit" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Notify Me</button>
            </form>
          </div>
        `
        
        // Ensure tags exist and include ThreadIt tags
        if (!productDetails.tags || !Array.isArray(productDetails.tags)) {
          productDetails.tags = ["ThreadIt", "custom", "coming-soon"]
        } else {
          // Add ThreadIt tags if not present
          if (!productDetails.tags.includes("ThreadIt")) {
            productDetails.tags.push("ThreadIt")
          }
          if (!productDetails.tags.includes("custom")) {
            productDetails.tags.push("custom")
          }
        }
        
        console.log('✅ Successfully parsed Claude response:', productDetails.title)
        return productDetails
      }
    }
    
    // If we get here, JSON parsing failed or missing required fields
    console.warn('⚠️ Claude JSON parsing failed, using fallback')
    throw new Error('Invalid JSON response from Claude')
    
  } catch (error) {
    console.error('❌ Claude API error:', error)
    // Fallback product details
    return {
      title: "Custom ThreadIt Design",
      description: `
        <p>Unique design created in ThreadIt. Coming soon - join the waitlist to be notified when this drops!</p>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
          <h4 style="margin-top: 0; color: #28a745;">🎯 Join the Waitlist</h4>
          <p style="margin-bottom: 15px;">This item is currently out of stock. Enter your email below to be notified when it becomes available:</p>
          <form action="/contact" method="post" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input type="hidden" name="form_type" value="customer">
            <input type="hidden" name="tags" value="waitlist,threadit">
            <input type="email" name="contact[email]" placeholder="your@email.com" required style="flex: 1; min-width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <button type="submit" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Notify Me</button>
          </form>
        </div>
      `,
      tags: ["ThreadIt", "custom", "coming-soon"]
    }
  }
}

// Function to upload image to Shopify
async function uploadImageToShopify(productId) {
  try {
    // Read the Thread It enhanced image file
    const imagePath = 'public/uploads/thread-it-enhanced.png'
    
    // Check if Thread It enhanced image exists, fallback to output.png if not
    let imageBuffer
    if (fs.existsSync(imagePath)) {
      imageBuffer = fs.readFileSync(imagePath)
      console.log('📷 Using Thread It enhanced image for Shopify upload')
    } else if (fs.existsSync('public/output.png')) {
      imageBuffer = fs.readFileSync('public/output.png')
      console.log('📷 Using fallback image for Shopify upload')
    } else {
      throw new Error('No image file found to upload')
    }
    
    const base64Image = imageBuffer.toString('base64')
    
    console.log('📷 Uploading design image to Shopify...')
    
    const result = await fetch(`https://${cleanShop}/admin/api/2023-10/products/${productId}/images.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: {
          attachment: base64Image,
          filename: 'thread-it-design.png',
          alt: 'Custom ThreadIt Design'
        }
      })
    })

    const json = await result.json()
    
    if (result.ok) {
      console.log('✅ Image uploaded successfully')
      return json.image
    } else {
      console.error('❌ Image upload failed:', json)
      return null
    }
  } catch (error) {
    console.error('❌ Image upload error:', error)
    return null
  }
}

// Thread It API route
app.post('/api/thread-it', async (req, res) => {
  try {
    console.log('🚀 Thread It request received')
    
    // Parse multipart form data
    const form = formidable({
      uploadDir: './public/uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    })
    
    const [fields, files] = await form.parse(req)
    const uploadedFile = files.image?.[0]
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No image file provided' })
    }
    
    console.log('📸 Processing Thread It request...')
    
    // Use fixed filenames instead of random session IDs
    const rawPath = uploadedFile.filepath
    const midPath = path.join('./public/uploads', 'thread-it-generated.png')
    const finalPath = path.join('./public/uploads', 'thread-it-enhanced.png')
    
    // Delete existing files if they exist
    try {
      if (fs.existsSync(midPath)) fs.unlinkSync(midPath)
      if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath)
      console.log('🗑️ Cleaned up existing Thread It files')
    } catch (cleanupError) {
      console.warn('⚠️ Cleanup warning:', cleanupError.message)
    }
    
    console.log('🎨 Starting AI processing pipeline...')
    
    // Step 1: Generate product image
    await generateProduct(rawPath, midPath)
    
    // Step 2: Enhance the product image
    await enhanceProduct(midPath, finalPath)
    
    // Clean up intermediate files
    try {
      fs.unlinkSync(rawPath)
      fs.unlinkSync(midPath)
    } catch (cleanupError) {
      console.warn('⚠️ Cleanup warning:', cleanupError.message)
    }
    
    // Return the enhanced image URL with consistent filename
    const resultUrl = '/uploads/thread-it-enhanced.png'
    console.log(`✅ Thread It completed: ${resultUrl}`)
    
    res.json({ 
      success: true,
      url: resultUrl,
      filename: 'thread-it-enhanced.png'
    })
    
  } catch (error) {
    console.error('❌ Thread It error:', error)
    res.status(500).json({ 
      error: 'Thread It processing failed', 
      details: error.message 
    })
  }
})

// Function to install Shopify theme
// Function to install Shopify theme from a public ZIP URL
async function installShopifyTheme() {
  try {
    const PUBLIC_THEME_URL = 'https://fc931dfc-913f-4742-8668-3e1b778553d1-00-29zxc3l7r8rth.picard.replit.dev/theme.zip'

    console.log('🎨 Installing ThreadIt theme via public URL...')

    // 1. Create the theme using the public ZIP URL
    const themeResp = await fetch(`https://${cleanShop}/admin/api/2023-10/themes.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        theme: {
          name: `ThreadIt Theme ${Date.now()}`,
          src : PUBLIC_THEME_URL,
          role: 'unpublished' // Use 'main' if you want to publish immediately
        }
      })
    });

    const themeJson = await themeResp.json();
    if (!themeResp.ok) throw new Error(JSON.stringify(themeJson));

    console.log('✅ Theme created in Shopify. ID:', themeJson.theme.id);

    return {
      success  : true,
      installed: true,
      theme    : themeJson.theme
    };

  } catch (err) {
    console.error('❌ Theme install failed:', err.message);
    return { success: false, error: err.message };
  }
}


// Function to publish a theme (optional)
async function publishTheme(themeId) {
  try {
    console.log('🚀 Publishing theme...')
    
    const result = await fetch(`https://${cleanShop}/admin/api/2023-10/themes/${themeId}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        theme: {
          id: themeId,
          role: 'main'
        }
      })
    })

    const json = await result.json()
    
    if (result.ok) {
      console.log('✅ Theme published successfully')
      return json.theme
    } else {
      console.error('❌ Theme publish failed:', json)
      return null
    }
  } catch (error) {
    console.error('❌ Theme publish error:', error)
    return null
  }
}

// Route for theme installation
app.post('/install-theme', async (req, res) => {
  try {
    // Check if environment variables are set
    if (!cleanShop || !ADMIN_API_TOKEN) {
      return res.status(500).json({ 
        error: 'Server configuration error', 
        details: 'Missing Shopify credentials in environment variables' 
      })
    }

    console.log('🎨 Installing custom ThreadIt theme...')
    const themeResult = await installShopifyTheme()
    
    if (themeResult.success) {
      res.json({
        message: 'Theme installed successfully!',
        theme: themeResult.theme,
        details: themeResult.message
      })
    } else {
      res.status(400).json({
        error: themeResult.error,
        details: themeResult.details
      })
    }
  } catch (err) {
    console.error('❌ Server error:', err)
    res.status(500).json({ error: 'Server error', details: err.message })
  }
})

app.post('/add-product', async (req, res) => {
  try {
    // Check if environment variables are set
    if (!cleanShop || !ADMIN_API_TOKEN) {
      return res.status(500).json({ 
        error: 'Server configuration error', 
        details: 'Missing Shopify credentials in environment variables' 
      })
    }

    // Get garment type from request body
    const { garmentType } = req.body
    console.log('🎽 Garment type received:', garmentType)

    console.log('📸 Taking screenshot...')
    await takeScreenshot()

    console.log('🤖 Generating product details with AI...')
    const productDetails = await generateProductDetails(garmentType)

    console.log('🎨 Installing ThreadIt theme...')
    const themeResult = await installShopifyTheme()
    
    let publishedTheme = null;
    if (themeResult.success && themeResult.theme && themeResult.theme.id) {
      // Auto-publish the theme after installing
      publishedTheme = await publishTheme(themeResult.theme.id);
      if (publishedTheme) {
        console.log('✅ Theme published successfully');
      } else {
        console.warn('⚠️ Theme installed but failed to publish automatically');
      }
    } else {
      console.warn('⚠️ Theme installation failed, continuing with product creation:', themeResult.error)
    }

    console.log('🚀 Making request to Shopify...')
    console.log('Store URL:', cleanShop)
    console.log('Generated product:', productDetails)

    const result = await fetch(`https://${cleanShop}/admin/api/2023-10/products.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product: {
          title: productDetails.title,
          body_html: productDetails.description,
          vendor: 'ThreadIt',
          product_type: 'Custom Apparel',
          tags: productDetails.tags,
          status: 'active',
          variants: [
            {
              price: '0.00',
              sku: `TI-${Date.now()}`,
              inventory_management: 'shopify',
              inventory_quantity: 0,
              inventory_policy: 'deny'
            }
          ]
        }
      })
    })

    const json = await result.json()
    console.log('📊 Shopify response status:', result.status)
    console.log('📊 Shopify response:', json)

    if (!result.ok) {
      return res.status(result.status).json({ error: json.errors || 'Something went wrong' })
    }

    // Upload the design image to the product
    const uploadedImage = await uploadImageToShopify(json.product.id)

    res.json({ 
      message: 'Product added to Shopify successfully!', 
      product: json.product,
      aiDetails: productDetails,
      uploadedImage: uploadedImage,
      theme: themeResult.success ? {
        installed: true,
        success: true,
        theme: themeResult.theme,
        themeId: themeResult.theme.id,
        published: publishedTheme ? true : false,
        publishedTheme: publishedTheme,
        message: publishedTheme 
          ? `✅ Theme installed and published successfully! Theme: ${themeResult.theme.name}`
          : `✅ Theme installed successfully! Theme: ${themeResult.theme.name} (Published: No)`
      } : {
        installed: false,
        success: false,
        error: themeResult.error,
        message: 'Theme installation failed, but product was created successfully',
        published: false,
        details: themeResult.details || 'Theme installation encountered an error'
      },
      waitlistEnabled: true
    })
  } catch (err) {
    console.error('❌ Server error:', err)
    res.status(500).json({ error: 'Server error', details: err.message })
  }
})

app.listen(3001, () => console.log('🚀 Server running on port 3001')) 