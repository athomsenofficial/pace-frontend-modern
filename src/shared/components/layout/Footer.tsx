import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">PACE</h3>
            <p className="text-sm text-slate-600">
              Personnel & Administrative Collaboration Engine for Air Force MEL processing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/initial-mel" className="text-sm text-slate-600 hover:text-primary">
                  Initial MEL
                </Link>
              </li>
              <li>
                <Link to="/final-mel" className="text-sm text-slate-600 hover:text-primary">
                  Final MEL
                </Link>
              </li>
              <li>
                <Link to="/how-to" className="text-sm text-slate-600 hover:text-primary">
                  How To Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 text-center">
            © {currentYear} PACE System. All rights reserved. | For official use only.
          </p>
        </div>
      </div>
    </footer>
  )
}
