import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts, createProduct, updateProduct, deleteProduct, type ProductInput } from '@/services/products'
import { fetchCategories } from '@/services/categories'
import { uploadProductImage } from '@/services/storage'
import { slugify } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Plus, Upload } from 'lucide-react'
import type { Product } from '@/types/supabase'
import { toast } from 'sonner'

export default function AdminProducts() {
  const qc = useQueryClient()
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => fetchProducts({}) })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState<ProductInput>({
    category_id: null,
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
    is_available: true,
  })

  const resetForm = () => {
    setEditing(null)
    setFiles([])
    setForm({
      category_id: null,
      name: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
      is_available: true,
    })
  }

  const openCreate = () => {
    resetForm()
    setOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setFiles([])
    setForm({
      category_id: p.category_id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? '',
      price: p.price,
      stock: p.stock,
      images: p.images ?? [],
      is_available: p.is_available,
    })
    setOpen(true)
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      let images = form.images ?? []
      if (files.length) {
        const slug = form.slug || slugify(form.name)
        const urls = await Promise.all(files.map((f) => uploadProductImage(f, slug)))
        images = [...images, ...urls]
      }
      const payload: ProductInput = { ...form, slug: form.slug || slugify(form.name), images }
      if (editing) {
        await updateProduct(editing.id, payload)
      } else {
        await createProduct(payload)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      setOpen(false)
      resetForm()
      toast.success('Produk disimpan')
    },
    onError: (e) => toast.error((e as Error).message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produk dihapus')
    },
    onError: (e) => toast.error((e as Error).message),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Manajemen Produk</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-left">Stok</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category?.name ?? '-'}</td>
                <td className="p-3">{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <Badge variant={p.is_available ? 'default' : 'secondary'}>
                    {p.is_available ? 'Tersedia' : 'Habis'}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm('Hapus produk ini?')) deleteMutation.mutate(p.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={form.category_id ?? 'none'}
                onValueChange={(v: string) => setForm({ ...form, category_id: v === 'none' ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa kategori</SelectItem>
                  {(categories ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={form.description ?? ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Stok</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_available}
                onCheckedChange={(v: boolean) => setForm({ ...form, is_available: v })}
              />
              <Label>Tersedia</Label>
            </div>
            <div className="space-y-2">
              <Label>Upload Gambar</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(Array.from(e.target.files ?? []))}
              />
              {files.length > 0 && (
                <p className="text-xs text-muted-foreground">{files.length} file dipilih</p>
              )}
            </div>
            {(form.images ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(form.images ?? []).map((url, i) => (
                  <img key={i} src={url} alt="" className="h-16 w-16 rounded object-cover" />
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              <Upload className="mr-2 h-4 w-4" />
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
