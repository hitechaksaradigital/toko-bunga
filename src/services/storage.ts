import { supabase } from '@/lib/supabase'
import imageCompression from 'browser-image-compression'

export async function uploadProductImage(file: File, slug: string): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  })
  const ext = compressed.name.split('.').pop() ?? 'jpg'
  const path = `products/${slug}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(path, compressed, {
    cacheControl: '3600',
    upsert: false,
    contentType: compressed.type,
  })
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}
