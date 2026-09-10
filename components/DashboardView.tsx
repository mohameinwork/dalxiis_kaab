"use client";
import { AlertTriangle, Plus, Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import BookingModal from "@/components/BookingModal";
import { useGlobalContext } from "@/context/GlobalProvider";

const DashboardView = () => {
  const { tools, bookings, bookingsLoading, bookingsError, addBooking } =
    useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRentModal, setShowRentModal] = useState(false);

  const totalTools = tools.length;
  const rentedTools = bookings.length;
  const availableTools = Math.max(totalTools - rentedTools, 0);
  const overdueTools = 0;
  const totalLateFeesAccrued = 0;
  const totalRentalRevenue = bookings.reduce(
    (total, booking) => total + Number(booking.price || 0),
    0,
  );
  const availabilityRate = totalTools
    ? Math.round((availableTools / totalTools) * 100)
    : 0;

  const tableHeader = [
    {
      label: "Magaca Qalabka",
      key: "toolName",
    },
    {
      label: "Macmiilka",
      key: "customer",
    },
    {
      label: "Numberka Macmiilka",
      key: "phone",
    },
    {
      label: "Qiimaha",
      key: "price",
    },
    {
      label: "National ID",
      key: "nationalId",
    },
    {
      label: "Taariikhda",
      key: "date",
    },
    {
      label: "Xaalada",
      key: "status",
    },
  ];

  const bookedRentalsData = useMemo<
    {
      toolName: string;
      customer: string;
      phone: string;
      price: string;
      nationalId: string;
      date: string;
      status: string;
    }[]
  >(
    () =>
      bookings.map((booking) => ({
        toolName: booking.tool,
        customer: booking.customer_name,
        phone: booking.customer_phone,
        price: `$${Number(booking.price || 0).toFixed(2)}`,
        nationalId: booking.national_id,
        date: booking.date,
        status: "Active",
      })),
    [bookings],
  );

  // Filtered booked tools based on search and status filter
  const filteredBookedTools = useMemo(() => {
    return bookedRentalsData.filter((rental) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        rental.toolName.toLowerCase().includes(q) ||
        rental.customer.toLowerCase().includes(q) ||
        rental.phone.toLowerCase().includes(q) ||
        rental.nationalId.toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [bookedRentalsData, searchQuery]);
  return (
    <div className="space-y-6">
      {/* The 4 Dashboard Metric Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Box 1: Active Rentals */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#1D4533]/15 shadow-sm text-[#1D4533] flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
              Active Rentals
            </p>
            <h3 className="text-3xl font-black mt-1 tracking-tight text-[#1D4533]">
              {rentedTools < 10 ? `0${rentedTools}` : rentedTools}
            </h3>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{bookings.length} tools booked</span>
            </span>
            <span className="text-[10px] opacity-70 font-semibold">
              {bookings.length - overdueTools} on-time
            </span>
          </div>
        </div>

        {/* Box 2: Availability */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#1D4533]/15 shadow-sm text-[#1D4533] flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
              Fleet Availability
            </p>
            <h3 className="text-3xl font-black mt-1 tracking-tight text-[#1D4533]">
              {availabilityRate}%
            </h3>
          </div>
          <div className="mt-3">
            <span className="text-[11px] opacity-80 font-medium">
              <strong>{availableTools}</strong> of {totalTools} tools in
              warehouse
            </span>
            <div className="w-full bg-[#1D4533]/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#1D4533] h-full rounded-full transition-all duration-500"
                style={{ width: `${availabilityRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Box 3: Overdue Items */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#1D4533]/15 shadow-sm text-[#1D4533] flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
              Overdue Items
            </p>
            <h3 className="text-3xl font-black mt-1 tracking-tight text-red-700">
              {String(overdueTools).padStart(2, "0")}
            </h3>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>
                {overdueTools > 0 ? "Requires Return" : "All On Schedule"}
              </span>
            </span>
            <span className="text-[10px] font-bold text-red-800">
              ${totalLateFeesAccrued.toFixed(0)} Late Fees
            </span>
          </div>
        </div>

        {/* Box 4: Est. Revenue */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#1D4533]/15 shadow-sm text-[#1D4533] flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
              Est. Fleet Revenue
            </p>
            <h3 className="text-3xl font-black mt-1 tracking-tight text-[#1D4533]">
              ${totalRentalRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
              <span>+${totalLateFeesAccrued.toFixed(0)} Late Fees</span>
            </span>
            <span className="text-[10px] opacity-70 font-semibold">
              Total Contracts
            </span>
          </div>
        </div>
      </div>

      {/* Table of Booked Tools (Replaces Overdue attention and all lower sections) */}
      <div className="bg-white rounded-2xl border border-[#1D4533]/15 shadow-md overflow-hidden text-[#1D4533]">
        <div className="flex justify-between w-full p-5 sm:p-6 border-b border-[#1D4533]/10 bg-white">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-[#1D4533] tracking-tight">
                Table of Booked Tools
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1D4533]/10 text-[#1D4533]">
                {bookings.length} Currently Booked
              </span>
            </div>
            <p className="text-xs text-[#1D4533]/70 mt-1">
              Real-time registry of all active and overdue equipment checked out
              to customers.
            </p>
          </div>

          {/* Actions & Filters */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Search Bar */}
            <div className="relative min-w-55">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tool, SKU, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
              />
            </div>

            {/* Book Tool Button */}
            <button
              onClick={() => setShowRentModal(true)}
              className="bg-[#5E3122] hover:bg-[#482418] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Tool</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-[#1D4533]/70 border-b border-[#1D4533]/10 bg-[#F7EAE0]/50">
                {tableHeader.map((header) => (
                  <th key={header.key} className="py-3 px-5 font-bold">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1D4533]/10">
              {bookingsLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 px-5 text-center">
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookedTools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-5 text-center">
                    {searchQuery
                      ? "No matching bookings found."
                      : "No bookings found."}
                  </td>
                </tr>
              ) : (
                filteredBookedTools.map((rental, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#1D4533]/5 transition-colors"
                  >
                    <td className="py-3 px-5">{rental.toolName}</td>
                    <td className="py-3 px-5">{rental.customer}</td>
                    <td className="py-3 px-5">{rental.phone}</td>
                    <td className="py-3 px-5">{rental.price}</td>
                    <td className="py-3 px-5">{rental.nationalId}</td>
                    <td className="py-3 px-5">{rental.date}</td>
                    <td className="py-3 px-5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rental.status === "Active"
                            ? "bg-emerald-800/10 text-emerald-800"
                            : "bg-red-700/10 text-red-700"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {bookingsError && (
        <p role="alert" className="text-sm text-red-700">
          Unable to load bookings: {bookingsError}
        </p>
      )}

      {showRentModal && (
        <BookingModal
          onClose={() => setShowRentModal(false)}
          onSubmit={addBooking}
        />
      )}
    </div>
  );
};

export default DashboardView;
