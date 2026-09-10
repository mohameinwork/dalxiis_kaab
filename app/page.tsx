"use client";
import DashboardView from "@/components/DashboardView";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { redirect } from "next/navigation";
import ToolsView from "@/components/ToolsView";
import { useGlobalContext } from "@/context/GlobalProvider";
import BookingView from "@/components/BookingView";

export default function Home() {
  // check if user is authenticated, if not redirect to login page
  const { currentUser, loading } = useAuth();
  const { activeView } = useGlobalContext();

  if (loading) {
    return null;
  }

  if (!currentUser) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-[#F7EAE0] text-[#1D4533] font-lato antialiased overflow-x-hidden selection:bg-[#1D4533] selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F7EAE0]">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "tools" && <ToolsView />}
          {activeView === "booking" && <BookingView />}
        </main>
      </div>
    </div>
  );
}
