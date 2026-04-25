'use server'

import { put, del } from '@vercel/blob'
import { createClient } from '@vercel/kv'
import { revalidatePath } from 'next/cache'

// Vercel recently migrated KV to Upstash, so we check for both sets of variables
const db = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '',
});

// We use KV to store lists of objects.
// Keys: 'portfolio_items' and 'contact_messages'

export async function submitContact(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  if (!name || !email || !message) {
    return { error: 'All fields are required' }
  }

  const newMessage = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    name,
    email,
    message
  };

  try {
    let existing: any[] = await db.get('contact_messages') || [];
    existing.unshift(newMessage);
    await db.set('contact_messages', existing);
    return { success: true }
  } catch (err) {
    console.error("KV Error:", err);
    return { error: 'Database connection failed' }
  }
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

  try {
    // 1. Upload to Vercel Blob
    const filename = `${Date.now()}-${file.name}`
    const blob = await put(filename, file, { access: 'public' })

    // 2. Update DB in KV
    const newItem = {
      id: Date.now().toString(),
      title,
      category,
      categoryLabel,
      imageUrl: blob.url,
      linkUrl: linkUrl || "#"
    }

    let existing: any[] = await db.get('portfolio_items') || [];
    existing.unshift(newItem); // put newest first
    await db.set('portfolio_items', existing);
    
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error("Blob/KV Error:", err);
    return { error: 'Failed to upload or save item' }
  }
}

export async function getPortfolioItems() {
  try {
    const data: any[] | null = await db.get('portfolio_items');
    return data || [];
  } catch (e) {
    console.error("KV Fetch Error:", e);
    return [];
  }
}

export async function getMessages() {
  try {
    const data: any[] | null = await db.get('contact_messages');
    return data || [];
  } catch (e) {
    console.error("KV Fetch Error:", e);
    return [];
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    let existing: any[] = await kv.get('portfolio_items') || [];
    const item = existing.find(i => i.id === id);
    
    // Delete file from blob if it exists
    if (item && item.imageUrl && item.imageUrl.includes('public.blob.vercel-storage.com')) {
      await del(item.imageUrl);
    }

    existing = existing.filter(i => i.id !== id);
    await kv.set('portfolio_items', existing);
    
    revalidatePath('/')
    revalidatePath('/admin')
  } catch (e) {
    console.error("Delete Error:", e);
  }
}

export async function deleteMessage(id: string) {
  try {
    let existing: any[] = await kv.get('contact_messages') || [];
    existing = existing.filter(i => i.id !== id);
    await kv.set('contact_messages', existing);
    
    revalidatePath('/admin')
  } catch (e) {
    console.error("Delete Error:", e);
  }
}
