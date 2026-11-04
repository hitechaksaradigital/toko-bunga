import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCartStore } from '@/store/cartStore'
import { signOut } from '@/services/auth'
import { ShoppingCart, User, LogOut, Flower2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CURRENT_YEAR = new Date().getFullYear()

export function Layout() {
  const { user, profile, isAdmin } = useAuth()
  const navigate = useNavigate()
  const totalItems = useCartStore((s) => s.totalItems())

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Flower2 className="h-6 w-6" /> Toko Bunga
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/catalog">
              <Button variant="ghost" size="sm">Katalog</Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm">Admin</Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="mr-1 h-4 w-4" />
                    {profile?.full_name ?? 'Profil'}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">Masuk</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {CURRENT_YEAR} Toko Bunga. Semua hak dilindungi.
      </footer>
    </div>
  )
}
