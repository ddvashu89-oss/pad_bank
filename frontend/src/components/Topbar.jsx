import { useState } from 'react';
import { ChevronDown, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="md:hidden text-neutral-600 hover:text-neutral-900"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="relative ml-auto">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
        >
          <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold shrink-0">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </span>
          <span className="hidden sm:inline">{user?.name || 'Account'}</span>
          <ChevronDown size={16} />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-10">
            <div className="px-3 py-2 text-xs text-neutral-500 border-b border-neutral-100 truncate">
              {user?.email}
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
