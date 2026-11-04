import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { updateProfile } from '@/services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth()
  const form = useForm({
    defaultValues: {
      full_name: profile?.full_name ?? '',
      phone_number: profile?.phone_number ?? '',
      address: profile?.address ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      full_name: profile?.full_name ?? '',
      phone_number: profile?.phone_number ?? '',
      address: profile?.address ?? '',
    })
  }, [profile, form])

  const onSubmit = async (values: any) => {
    if (!profile) return
    try {
      await updateProfile(profile.id, values)
      await refreshProfile()
      toast.success('Profil diperbarui')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profil Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input {...form.register('full_name')} />
            </div>
            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input {...form.register('phone_number')} />
            </div>
            <div className="space-y-2">
              <Label>Alamat</Label>
              <Textarea {...form.register('address')} />
            </div>
            <Button type="submit">Simpan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
