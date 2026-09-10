"use client";
import { useAuth } from "@/context/AuthProvider";
import { LogIn, LogOut, Menu, Plus } from "lucide-react";
import React, { useState } from "react";

const Navbar: React.FC<{ onOpenMobileMenu?: () => void }> = ({
  onOpenMobileMenu,
}) => {
  const [showNewRentalModal, setShowNewRentalModal] = useState(false);
  const initials = "DK"; // Placeholder for user initials, replace with actual logic to get user initials

  const { currentUser, logout } = useAuth(); // Assuming you have a useAuth hook to get the current user and logout function
  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-[#F7EAE0] border-b border-[#1D4533]/15 sticky top-0 z-20 transition-colors">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#1D4533] hover:bg-[#1D4533]/10 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1D4533]">
            Welcome back to DalxiisKaab, {initials}!
          </h2>
          <span className="hidden sm:inline-block  text-xs font-semibold text-[#1D4533]/70">
            start with your first booking or check your rentals, {initials}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 sm:space-x-4">
        {/* User Profile in Header showing User Name & Title */}
        {currentUser ? (
          <div
            id="header-user-profile"
            className="flex items-center gap-2.5 sm:gap-3 px-3 py-1.5 rounded-xl bg-white border border-[#1D4533]/15 shadow-xs"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5E3122] text-[#F7EAE0] flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {initials}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-xs font-bold text-[#1D4533] leading-none">
                {initials}
              </div>
              <div className="text-[10px] font-semibold text-[#1D4533]/70 uppercase tracking-wider mt-1">
                Administrator
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#1D4533]/60 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors ml-0.5 cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            // onClick={() => setActiveView('auth')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1D4533] text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
