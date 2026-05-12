import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/hotels" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Hotels</Link></li>
              <li><Link href="/restaurants" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Restaurants</Link></li>
              <li><Link href="/tours" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Tours</Link></li>
              <li><Link href="/muse" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Muse</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Tourist dashboard</Link></li>
              <li><Link href="/business/dashboard" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Business dashboard</Link></li>
              <li><Link href="/admin" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Admin panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">kaya.ge</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Discover Georgia through curated stays, services, structured platform flows and thoughtful local context.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; 2026 Kaya.ge &mdash; Discover Georgia
          </p>
          <p className="text-gray-400 text-sm">
            Built around the Phase 1 brief
          </p>
        </div>
      </div>
    </footer>
  );
}
