import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/supabase'

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw error
  return (data ?? []) as Category[]
}

export async function createCategory(name: string, slug: string): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert({ name, slug }).select().single()
  if (error) throw error
  return data as Category
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
