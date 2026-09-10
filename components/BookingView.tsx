"use client";

import { FileText, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import BookingModal from "@/components/BookingModal";
import { useGlobalContext, type Booking } from "@/context/GlobalProvider";
import { InvoicePreviewModal } from "./BookingInvoiceModal";

const BookingView = () => {
  const {
    bookings,
    bookingsLoading,
    bookingsError,
    addBooking,
    deleteBooking,
    returnBooking,
  } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<
    string | number | null
  >(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [returningBookingId, setReturningBookingId] = useState<
    string | number | null
  >(null);
  const [returnError, setReturnError] = useState<string | null>(null);
  const filteredBookings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return bookings;
    }

    return bookings.filter((item) =>
      [
        item.customer_name,
        item.customer_phone,
        item.tool,
        item.reference,
        item.reference_phone,
        item.national_id,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [bookings, searchQuery]);

  const tableHeaders = [
    ["Magaca Macmiilka", "customer_name"],
    ["Numberka Macmiilka", "customer_phone"],
    ["Magaca Qalabka", "tool"],
    ["Qiimaha", "price"],
    ["Taariikhda", "date"],
    ["Damiinka", "reference"],
    ["Numberka Damiinka", "reference_phone"],
    ["National ID", "national_id"],
    ["Actions", "actions"],
  ] as const;

  return (
    <div className="space-y-6 text-[#1D4533]">
      <div className="bg-white rounded-2xl border border-[#1D4533]/15 shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 sm:p-6 border-b border-[#1D4533]/10">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight">Bookings</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1D4533]/10">
                {bookingsLoading ? "Loading..." : `${bookings.length} Bookings`}
              </span>
            </div>
            <p className="text-xs text-[#1D4533]/70 mt-1">
              Customer and equipment booking records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative min-w-55">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowBookingForm(true)}
              className="bg-[#5E3122] hover:bg-[#482418] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Book Tool</span>
            </button>
          </div>
        </div>

        {bookingsError && (
          <p role="alert" className="p-5 text-sm text-red-700">
            Unable to load bookings: {bookingsError}
          </p>
        )}

        {deleteError && (
          <p role="alert" className="px-5 pb-3 text-sm text-red-700">
            Unable to delete booking: {deleteError}
          </p>
        )}

        {returnError && (
          <p role="alert" className="px-5 pb-3 text-sm text-red-700">
            Unable to return tool: {returnError}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-[#1D4533]/70 border-b border-[#1D4533]/10 bg-[#F7EAE0]/50">
                {tableHeaders.map(([label, key]) => (
                  <th
                    key={key}
                    className="py-3 px-5 font-bold whitespace-nowrap"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {!bookingsLoading &&
                filteredBookings.map((item, index) => (
                  <tr
                    key={item.id ?? `${item.reference}-${index}`}
                    className="hover:bg-secondary/15 transition-colors"
                  >
                    <td className="py-3 px-5">{item.customer_name}</td>
                    <td className="py-3 px-5">{item.customer_phone}</td>
                    <td className="py-3 px-5">{item.tool}</td>
                    <td className="py-3 px-5">${item.price}</td>
                    <td className="py-3 px-5">{item.date}</td>
                    <td className="py-3 px-5">{item.reference}</td>
                    <td className="py-3 px-5">{item.reference_phone}</td>
                    <td className="py-3 px-5">{item.national_id}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Mark tool as returned"
                          title="Mark tool as returned"
                          disabled={returningBookingId === item.id}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 disabled:opacity-50 rounded"
                          onClick={async () => {
                            if (item.id === undefined) return;
                            if (
                              !window.confirm("Mark this tool as returned?")
                            ) {
                              return;
                            }

                            setReturnError(null);
                            setReturningBookingId(item.id);
                            const result = await returnBooking(item.id);
                            if (result.error) setReturnError(result.error);
                            setReturningBookingId(null);
                          }}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="View booking invoice"
                          title="View invoice"
                          className="p-1.5 text-accent hover:text-secondary-dark rounded hover:btn-hover"
                          onClick={() => {
                            setSelectedBooking(item);
                            setShowInvoiceModal(true);
                          }}
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete booking"
                          title="Delete booking"
                          disabled={deletingBookingId === item.id}
                          className="p-1.5 text-red-600 hover:text-red-800 disabled:opacity-50 rounded"
                          onClick={async () => {
                            if (item.id === undefined) return;
                            if (!window.confirm("Delete this booking?")) return;

                            setDeleteError(null);
                            setDeletingBookingId(item.id);
                            const result = await deleteBooking(item.id);
                            if (result.error) setDeleteError(result.error);
                            setDeletingBookingId(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!bookingsLoading &&
          !bookingsError &&
          filteredBookings.length === 0 && (
            <p className="p-10 text-center text-sm text-[#1D4533]/70">
              {searchQuery
                ? "No matching bookings found."
                : "No bookings found."}
            </p>
          )}
      </div>

      {showBookingForm && (
        <BookingModal
          onClose={() => setShowBookingForm(false)}
          onSubmit={addBooking}
        />
      )}

      {showInvoiceModal && selectedBooking && (
        <InvoicePreviewModal
          booking={selectedBooking}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingView;
