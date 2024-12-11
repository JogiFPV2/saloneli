import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Scissors, Clock, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const links = [
    { icon: Calendar, label: 'Terminarz', path: '/' },
    { icon: Users, label: 'Klienci', path: '/clients' },
    { icon: Scissors, label: 'Usługi', path: '/services' },
    { icon: Clock, label: 'Historia', path: '/history' },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 h-screen transition-all duration-300`}>
      <div className="p-4 flex justify-between items-center">
        <h1 className={`font-bold text-xl ${!isOpen && 'hidden'}`}>Salon Manager</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>
      </div>
      <nav className="mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center p-4 ${
                location.pathname === link.path ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <Icon size={20} className="text-gray-600" />
              {isOpen && <span className="ml-4">{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
