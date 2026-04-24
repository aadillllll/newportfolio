'use client'

import React, { useState, useRef } from 'react'
import { uploadPortfolio } from '../actions'

export default function AdminClient() {
  const [status, setStatus] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('Uploading...')

    const formData = new FormData(formRef.current)
    const category = formData.get('category') as string
    
    // Automatically set human readable label
    const labelMap: Record<string, string> = {
      'youtube': 'YouTube Videos',
      'thumbnails': 'Thumbnail Design',
      'posters': 'Poster Design',
      'reels': 'Reels / Shorts'
    }
    formData.append('categoryLabel', labelMap[category] || 'Portfolio Item')

    const res = await uploadPortfolio(formData)
    if (res.success) {
      setStatus('Success! Item added to portfolio.')
      formRef.current.reset()
      // Reload to show new items (simple approach)
      setTimeout(() => window.location.reload(), 1500)
    } else {
      setStatus(`Error: ${res.error}`)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Project Title</label>
        <input 
          type="text" 
          name="title" 
          required 
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
          placeholder="e.g. Cinematic Documentary Edit"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Category</label>
        <select 
          name="category" 
          required
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
        >
          <option value="youtube">YouTube Video</option>
          <option value="reels">Vertical Reel / Short</option>
          <option value="thumbnails">Thumbnail</option>
          <option value="posters">Poster Design</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Upload Image/Thumbnail</label>
        <input 
          type="file" 
          name="media" 
          accept="image/*" 
          required
          style={{ color: '#ccc' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Project Link (Optional)</label>
        <input 
          type="url" 
          name="linkUrl" 
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
          placeholder="e.g. https://youtube.com/..."
        />
      </div>

      {status && <p style={{ color: status.includes('Success') ? '#00e5ff' : '#ff3b30', fontSize: '0.9rem', marginTop: '0.5rem' }}>{status}</p>}

      <button 
        type="submit" 
        style={{ 
          marginTop: '1rem', 
          backgroundColor: '#00e5ff', 
          color: '#000', 
          border: 'none', 
          padding: '1rem', 
          borderRadius: '8px', 
          fontWeight: 600, 
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
        onMouseOut={e => e.currentTarget.style.opacity = '1'}
      >
        Upload to Portfolio
      </button>
    </form>
  )
}
