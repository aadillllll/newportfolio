'use server'

import fs from 'fs'
import path from 'path'

const portfolioFile = path.join(process.cwd(), 'data', 'portfolio.json')
const messagesFile = path.join(process.cwd(), 'data', 'messages.json')

export async function submitContact(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  if (!name || !email || !message) {
    return { error: 'All fields are required' }
  }

  const existing = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'))
  existing.push({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    name,
    email,
    message
  })
  
  fs.writeFileSync(messagesFile, JSON.stringify(existing, null, 2))
  return { success: true }
}

export async function uploadPortfolio(formData: FormData) {
  const file = formData.get('media') as File
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const categoryLabel = formData.get('categoryLabel') as string
  const linkUrl = formData.get('linkUrl') as string

  if (!file || !title || !category || !categoryLabel) {
    return { error: 'All fields are required' }
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  // Save file to public/uploads directory
  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
  fs.writeFileSync(filepath, buffer)

  // Update DB
  const existing = JSON.parse(fs.readFileSync(portfolioFile, 'utf-8'))
  const newItem = {
    id: Date.now().toString(),
    title,
    category,
    categoryLabel,
    imageUrl: `/uploads/${filename}`,
    linkUrl: linkUrl || "#"
  }
  existing.push(newItem)
  
  fs.writeFileSync(portfolioFile, JSON.stringify(existing, null, 2))
  return { success: true }
}

export async function getPortfolioItems() {
  const data = JSON.parse(fs.readFileSync(portfolioFile, 'utf-8'))
  return data
}

export async function getMessages() {
  const data = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'))
  return data
}

import { revalidatePath } from 'next/cache'

export async function deletePortfolioItem(id: string) {
  if (!fs.existsSync(portfolioFile)) return;
  let existing = JSON.parse(fs.readFileSync(portfolioFile, 'utf-8'))
  
  const item = existing.find((i: any) => i.id === id)
  if (item && item.imageUrl && item.imageUrl !== '#') {
    const photoPath = path.join(process.cwd(), 'public', item.imageUrl)
    if (fs.existsSync(photoPath)) {
      try { fs.unlinkSync(photoPath) } catch (e) {}
    }
  }

  existing = existing.filter((item: any) => item.id !== id)
  fs.writeFileSync(portfolioFile, JSON.stringify(existing, null, 2))
  
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteMessage(id: string) {
  if (!fs.existsSync(messagesFile)) return;
  let existing = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'))
  
  existing = existing.filter((item: any) => item.id !== id)
  fs.writeFileSync(messagesFile, JSON.stringify(existing, null, 2))
  
  revalidatePath('/admin')
}
