import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Gift, History, Droplet } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/ladies', label: 'Ladies', icon: Users },
  { to: '/stock', label: 'Stock', icon: Package },
  { to: '/distributions/give', label: 'Give Pads', icon: Gift },
  { to: '/distributions', label: 'History', icon: History },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-neutral-200 flex flex-col">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-neutral-200">
        <Droplet className="text-brand-600" size={22} fill="currentColor" />
        <span className="font-bold text-lg tracking-tight text-neutral-900">PadBank</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
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
