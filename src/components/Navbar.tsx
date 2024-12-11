import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Scissors, Clock } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { icon: Calendar, label: 'Terminarz', path: '/' },
    { icon: Users, label: 'Klienci', path: '/clients' },
    { icon: Scissors, label: 'Usługi', path: '/services' },
    { icon: Clock, label: 'Historia', path: '/history' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
            <h1 className="font-bold text-base text-gray-900 mr-6">HairFlow</h1>
            {/* Desktop menu */}
            <div className="hidden md:flex space-x-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                      location.pathname === link.path
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={14} className="mr-1.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden">
            <div className="flex space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`p-1.5 rounded ${
                      location.pathname === link.path
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
