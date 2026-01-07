import { LayoutDashboard, FileText, Image, Settings, LogOut, Calendar } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'content', label: 'Content Manager', icon: FileText },
    { id: 'images', label: 'Gallery Manager', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black text-[#FFFFFF] flex flex-col shadow-xl z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shadow-md border border-white">
            <span className="text-[#FFFFFF] font-bold text-xl">SM</span>
          </div>
          <div>
            <h2 className="text-[#FFFFFF] font-display">Susan Makeup</h2>
            <p className="text-xs text-[#999999]">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] transform scale-[1.02] font-medium'
                  : 'text-[#E5E5E5] hover:bg-[#111111] hover:transform hover:scale-[1.02]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#2A2A2A]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#E5E5E5] hover:bg-[#111111] hover:text-[#FFFFFF] transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
