import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Gift, History, Droplet, BarChart3, UserSearch, Info, X } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/ladies', label: 'Ladies', icon: Users },
  { to: '/check-aadhaar', label: 'Check Aadhaar', icon: UserSearch },
  { to: '/stock', label: 'Stock', icon: Package },
  { to: '/distributions/give', label: 'Give Pads', icon: Gift },
  { to: '/distributions', label: 'History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/info', label: 'Info', icon: Info },
];

export default function Sidebar({ open = false, onClose }) {
  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 w-64 md:w-56 shrink-0 bg-white border-r border-neutral-200 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      <div className="h-16 flex items-center justify-between gap-2 px-5 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Droplet className="text-brand-600" size={22} fill="currentColor" />
          <span className="font-bold text-lg tracking-tight text-neutral-900">PadBank</span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-neutral-500 hover:text-neutral-900"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
