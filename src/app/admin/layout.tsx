'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { href: '/admin/site', label: 'Site' },
  { href: '/admin/projects', label: 'Projets' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/testimonials', label: 'Témoignages' },
  { href: '/admin/about', label: 'À propos' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="w-full bg-white/90 border-b border-[#CEA472] py-3">
        <nav className="max-w-6xl mx-auto px-4 flex flex-wrap gap-2">
          {adminLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow ${
                  active ? 'bg-mabelle-gold text-white' : 'bg-white text-mabelle-brown border border-[#CEA472] hover:bg-mabelle-gold hover:text-white'
                } transition-colors`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}