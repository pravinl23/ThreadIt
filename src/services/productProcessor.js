import fsPromises from 'fs/promises'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { FormData, File } from 'formdata-node'
import sharp from 'sharp'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const API_URL = "https://api.stability.ai"
const ENGINE_ID = "stable-diffusion-xl-1024-v1-0"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Resizes an image to 1024x1024 for Stability AI
 */
async function resizeToAllowedDimensions(imageBuffer) {
  return sharp(imageBuffer)
    .resize(1024, 1024, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer()
}

/**
 * Generate product image using Stability AI
 */
export async function generateProduct(inputPath, outputPath) {
  try {
    console.log(`🎨 Generating product from: ${inputPath}`)
    
    const formData = new FormData()
    
    // Read and resize the sketch
    const sketchBuffer = await fsPromises.readFile(inputPath)
    const resizedBuffer = await resizeToAllowedDimensions(sketchBuffer)
    
    const imageFile = new File([resizedBuffer], 'sketch.png', { type: 'image/png' })
    formData.append('init_image', imageFile)
    
    // Optimized prompts for ThreadIt designs
    const textPrompts = [
      {
        text: "A creative and artistic product photo of a t-shirt. The t-shirt is displayed on a pure white background. Take the design elements and interpret them artistically - add depth, dimension, and creative flair while keeping the core concept. Premium screen print with artistic interpretation, creative details, and professional finish. Natural cotton fabric texture. Clean product template for e-commerce.",
        weight: 1
      },
      {
        text: "changed design, modified elements, altered colors, distorted text, wrong font, different style, wrong placement, blurry design, flat design, marker drawing, digital art, illustration, cartoon style, unrealistic fabric, drawing style, sketchy look, artificial appearance",
        weight: -1
      }
    ]
    
    textPrompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text)
      formData.append(`text_prompts[${index}][weight]`, prompt.weight.toString())
    })
    
    // Optimized parameters
    formData.append('image_strength', '0.42')
    formData.append('cfg_scale', '6.8')
    formData.append('steps', '50')
    formData.append('samples', '1')
    formData.append('style_preset', 'photographic')
    formData.append('seed', Math.floor(Math.random() * 1000000))
    
    const response = await fetch(
      `${API_URL}/v1/generation/${ENGINE_ID}/image-to-image`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: formData
      }
    )
    
    if (!response.ok) {
      throw new Error(`Stability AI request failed: ${await response.text()}`)
    }
    
    const data = await response.json()
    const imageBuffer = Buffer.from(data.artifacts[0].base64, 'base64')
    await fsPromises.writeFile(outputPath, imageBuffer)
    
    console.log(`✅ Product generated: ${outputPath}`)
    return outputPath
  } catch (error) {
    console.error('❌ Product generation failed:', error)
    throw error
  }
}

/**
 * Enhance product image with AI suggestions
 */
export async function enhanceProduct(inputPath, outputPath) {
  try {
    console.log(`✨ Enhancing product from: ${inputPath}`)
    
    // Use Claude to generate enhancement suggestions
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Analyze this ThreadIt design and suggest creative enhancements that would make it more appealing as a product. Focus on:
        1. Color palette improvements
        2. Visual effects that could be added
        3. Style refinements
        4. Professional finishing touches
        
        Keep suggestions practical for t-shirt design. Return as JSON with specific actionable suggestions.`
      }]
    })
    
    console.log('🤖 Claude enhancement suggestions:', response.content[0].text)
    
    // Apply enhancement using Stability AI with refined prompt
    const formData = new FormData()
    
    const imageBuffer = await fsPromises.readFile(inputPath)
    const resizedBuffer = await resizeToAllowedDimensions(imageBuffer)
    
    const imageFile = new File([resizedBuffer], 'product.png', { type: 'image/png' })
    formData.append('init_image', imageFile)
    
    const enhancementPrompts = [
      {
        text: "Enhanced version of this t-shirt design with premium quality improvements. Add subtle visual effects, refined colors, professional depth and dimension. Maintain the original design concept but elevate it with premium finishing touches, better contrast, and artistic refinement. High-quality product photography with enhanced visual appeal.",
        weight: 1
      },
      {
        text: "completely different design, wrong colors, changed concept, altered graphics, different style, poor quality, blurry, distorted, unprofessional, cheap looking, flat design, amateur finish",
        weight: -1
      }
    ]
    
    enhancementPrompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text)
      formData.append(`text_prompts[${index}][weight]`, prompt.weight.toString())
    })
    
    // Parameters optimized for enhancement
    formData.append('image_strength', '0.3') // Less aggressive for enhancement
    formData.append('cfg_scale', '7.5')
    formData.append('steps', '50')
    formData.append('samples', '1')
    formData.append('style_preset', 'enhance')
    formData.append('seed', Math.floor(Math.random() * 1000000))
    
    const apiResponse = await fetch(
      `${API_URL}/v1/generation/${ENGINE_ID}/image-to-image`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: formData
      }
    )
    
    if (!apiResponse.ok) {
      throw new Error(`Enhancement API request failed: ${await apiResponse.text()}`)
    }
    
    const data = await apiResponse.json()
    const enhancedBuffer = Buffer.from(data.artifacts[0].base64, 'base64')
    await fsPromises.writeFile(outputPath, enhancedBuffer)
    
    console.log(`✅ Product enhanced: ${outputPath}`)
    return outputPath
  } catch (error) {
    console.error('❌ Product enhancement failed:', error)
    throw error
  }
} 