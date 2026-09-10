import { useAuth } from "@/context/AuthProvider";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  LayoutDashboard,
  CalendarCheck2,
  LogOut,
  Wrench,
  X,
} from "lucide-react";
import React from "react";
interface NavItem {
  id: "dashboard" | "tools" | "booking";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}
const Sidebar: React.FC<{
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}> = ({ setMobileOpen }) => {
  const { setActiveView, activeView } = useGlobalContext();
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "tools",
      label: "Qalabka",
      icon: Wrench,
    },
    { id: "booking", label: "Diwaanka", icon: CalendarCheck2 },
  ];

  const { currentUser, logout } = useAuth();
  const handleNavClick = (id: "dashboard" | "tools" | "booking") => {
    setActiveView(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  const initials = "DK";
  return (
    <aside className="hidden md:flex w-64 bg-[#1D4533] text-[#F7EAE0] flex-col shrink-0 min-h-screen sticky top-0 h-screen z-30 shadow-md">
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-7 sm:p-8 flex items-center justify-between border-b border-[#F7EAE0]/10 mb-4">
            <button
              onClick={() => handleNavClick("dashboard")}
              className="text-left group focus:outline-none"
            >
              <h1 className="text-2xl font-black tracking-tight text-[#F7EAE0] flex items-center gap-2">
                <span>DalxiisKaab</span>
              </h1>
              <p className="text-[10px] sm:text-xs opacity-70 mt-1 uppercase tracking-widest font-semibold text-[#F7EAE0]">
                Tool Management
              </p>
            </button>

            {/* Close button inside mobile drawer */}
            {setMobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-[#F7EAE0]/70 hover:text-white hover:bg-[#F7EAE0]/10"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="px-4 space-y-1.5 sm:space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
                    isActive
                      ? "bg-[#F7EAE0]/10 text-white shadow-xs font-semibold"
                      : "opacity-75 hover:opacity-100 hover:bg-[#F7EAE0]/5 text-[#F7EAE0]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 opacity-90 shrink-0" />
                    <span className="uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account / Profile Section */}
        <div className="p-6 border-t border-[#F7EAE0]/10">
          {currentUser && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#5E3122] text-[#F7EAE0] flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#F7EAE0] truncate">
                    {initials}
                  </p>
                  <p className="text-[10px] opacity-60 text-[#F7EAE0] truncate uppercase tracking-wider">
                    {currentUser.role}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-[#F7EAE0]/60 hover:text-red-300 rounded-lg hover:bg-[#F7EAE0]/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
