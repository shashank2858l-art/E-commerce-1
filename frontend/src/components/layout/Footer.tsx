import Link from 'next/link';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-low">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand — matching Navbar/Preloader */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Building a circular economy through community-powered reuse, rescue, and upcycling.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-heading text-xs font-semibold tracking-widest uppercase text-neon-green mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/marketplace" className="text-sm text-muted hover:text-neon-green transition-colors">Marketplace</Link></li>
              <li><Link href="/marketplace?tab=swap" className="text-sm text-muted hover:text-neon-green transition-colors">Swap & Rent</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted hover:text-neon-green transition-colors">Dashboard</Link></li>
              <li><Link href="/wishlist" className="text-sm text-muted hover:text-neon-green transition-colors">Wishlist</Link></li>
              <li><Link href="/tracking" className="text-sm text-muted hover:text-neon-green transition-colors">Order Tracking</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-semibold tracking-widest uppercase text-neon-green mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted hover:text-neon-green transition-colors">About Us</Link></li>
              <li><Link href="/cart" className="text-sm text-muted hover:text-neon-green transition-colors">Cart</Link></li>
              <li><Link href="/marketplace" className="text-sm text-muted hover:text-neon-green transition-colors">Browse Items</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted hover:text-neon-green transition-colors">List an Item</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-dim">© {new Date().getFullYear()} Reuse_Mart. Built for a sustainable future.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-muted-dim hover:text-muted transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-muted-dim hover:text-muted transition-colors">Terms</Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-dim">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
