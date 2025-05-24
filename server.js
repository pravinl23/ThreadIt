import dotenv from 'dotenv'
import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
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
app.use('/uploads', express.static('public/uploads'))

// Function to take screenshot and save as output.png
async function takeScreenshot() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://localhost:5173') // Vite dev server default port
    await page.waitForTimeout(2000) // Wait for page to load
    
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
async function generateProductDetails() {
  try {
    console.log('🤖 Generating product details with Claude 3.5 Sonnet...')
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Best model available
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Generate a simple product name and short description for a custom designed garment created with ThreadSketch.

Keep it simple and include:
- A catchy product name
- Short description (2-3 sentences max)
- Mention it was "Created in ThreadSketch"
- Add "Coming Soon" messaging

Return a JSON object with: title, description (plain text, not HTML), tags (array).

Example:
{
  "title": "Urban Sketch Tee",
  "description": "Custom designed t-shirt created in ThreadSketch. This unique piece features your personal design. Coming soon - join the waitlist!",
  "tags": ["ThreadSketch", "custom", "coming-soon"]
}`
      }]
    })

    const content = response.content[0].text
    console.log('🤖 Claude response:', content)
    
    // Try to parse JSON from Claude's response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const productDetails = JSON.parse(jsonMatch[0])
      // Add waitlist HTML to description
      productDetails.description = `
        <p>${productDetails.description}</p>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
          <h4 style="margin-top: 0; color: #28a745;">🎯 Join the Waitlist</h4>
          <p style="margin-bottom: 15px;">This item is currently out of stock. Enter your email below to be notified when it becomes available:</p>
          <form action="/contact" method="post" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input type="hidden" name="form_type" value="customer">
            <input type="hidden" name="tags" value="waitlist,threadsketch">
            <input type="email" name="contact[email]" placeholder="your@email.com" required style="flex: 1; min-width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <button type="submit" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Notify Me</button>
          </form>
        </div>
      `
      return productDetails
    } else {
      // Fallback if JSON parsing fails
      return {
        title: "Custom ThreadSketch Design",
        description: `
          <p>Unique design created in ThreadSketch. Coming soon - join the waitlist to be notified when this drops!</p>
          <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
            <h4 style="margin-top: 0; color: #28a745;">🎯 Join the Waitlist</h4>
            <p style="margin-bottom: 15px;">This item is currently out of stock. Enter your email below to be notified when it becomes available:</p>
            <form action="/contact" method="post" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <input type="hidden" name="form_type" value="customer">
              <input type="hidden" name="tags" value="waitlist,threadsketch">
              <input type="email" name="contact[email]" placeholder="your@email.com" required style="flex: 1; min-width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <button type="submit" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Notify Me</button>
            </form>
          </div>
        `,
        tags: ["ThreadSketch", "custom", "coming-soon"]
      }
    }
  } catch (error) {
    console.error('❌ Claude API error:', error)
    // Fallback product details
    return {
      title: "Custom ThreadSketch Design",
      description: `
        <p>Unique design created in ThreadSketch. Coming soon - join the waitlist to be notified when this drops!</p>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
          <h4 style="margin-top: 0; color: #28a745;">🎯 Join the Waitlist</h4>
          <p style="margin-bottom: 15px;">This item is currently out of stock. Enter your email below to be notified when it becomes available:</p>
          <form action="/contact" method="post" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input type="hidden" name="form_type" value="customer">
            <input type="hidden" name="tags" value="waitlist,threadsketch">
            <input type="email" name="contact[email]" placeholder="your@email.com" required style="flex: 1; min-width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <button type="submit" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Notify Me</button>
          </form>
        </div>
      `,
      tags: ["ThreadSketch", "custom", "coming-soon"]
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
          alt: 'Custom ThreadSketch Design'
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

app.post('/add-product', async (req, res) => {
  try {
    // Check if environment variables are set
    if (!cleanShop || !ADMIN_API_TOKEN) {
      return res.status(500).json({ 
        error: 'Server configuration error', 
        details: 'Missing Shopify credentials in environment variables' 
      })
    }

    console.log('📸 Taking screenshot...')
    await takeScreenshot()

    console.log('🤖 Generating product details with AI...')
    const productDetails = await generateProductDetails()

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
          vendor: 'ThreadSketch',
          product_type: 'Custom Apparel',
          tags: productDetails.tags,
          status: 'active',
          variants: [
            {
              price: '29.99',
              sku: `TS-${Date.now()}`,
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
      message: 'Product added to waitlist! Customers can now sign up for updates.', 
      product: json.product,
      aiDetails: productDetails,
      uploadedImage: uploadedImage,
      waitlistEnabled: true
    })
  } catch (err) {
    console.error('❌ Server error:', err)
    res.status(500).json({ error: 'Server error', details: err.message })
  }
})

app.listen(3001, () => console.log('🚀 Server running on port 3001')) 