import React from "react";
import Image from "next/image";
import type { Booking } from "@/context/GlobalProvider";
import { X, Printer } from "lucide-react";

interface InvoicePreviewModalProps {
  booking: Booking;
  onClose: () => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  booking,
  onClose,
}) => {
  const handlePrint = () => window.print();

  return (
    <div className="invoice-print-root fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-stone-200  rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="invoice-print-controls p-4 border-b border-stone-200  bg-secondary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-[#1D4533] text-white px-2 py-0.5 rounded">
              {booking?.reference || `BOOKING-${booking?.id ?? "NEW"}`}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Automated PDF Invoice Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="btn-modal-print"
              className="bg-[#5E3122] hover:bg-[#482418] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable / Preview Document Container */}
        <div className="invoice-print-content p-6 sm:p-8 overflow-y-auto flex-1 bg-white font-sans text-primary ">
          <div className="invoice-print-document max-w-xl mx-auto bg-bg-sand border border-primary-light rounded-xl p-6 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="border-b-2 border-primary-light pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-primary-dark">
                  DalxiisKaab
                </h1>
                <p className="text-xs text-primary mt-0.5">
                  Tool Booking Invoice
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-1 bg-[#F7EAE0] text-[#1D4533] dark:bg-stone-800 dark:text-emerald-300">
                  Official Invoice
                </span>
                <div className="text-xs text-primary">Date: {booking.date}</div>
              </div>
            </div>

            {/* Billed To & Status */}
            <div className="py-5 border-b border-primary-light">
              {booking.national_image && (
                <div className="mb-4 flex items-center gap-3">
                  <Image
                    src={booking.national_image}
                    alt="Customer national ID"
                    width={64}
                    height={64}
                    unoptimized
                    className="h-16 w-16 rounded-full border-2 border-primary-light object-cover"
                  />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary-light">
                      Customer ID Image
                    </div>
                    <div className="text-xs text-primary">
                      Verified booking document
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                    Billed To
                  </span>
                  <div className="text-sm font-extrabold text-primary uppercase">
                    {booking.customer_name}
                  </div>
                  <div className="text-xs text-primary-light">
                    {booking.customer_phone}
                  </div>
                  <div className="text-xs text-primary">
                    National ID: {booking.national_id}
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold text-primary-light uppercase tracking-wider block mb-1">
                    Booking Reference
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-secondary bg-primary px-2 py-0.5 rounded">
                    {booking?.reference || "Not provided"}
                  </span>
                  <div className="text-xs text-primary-secondary mt-1.5">
                    Reference phone: {booking?.reference_phone}
                  </div>
                  <span className="mt-2 inline-flex rounded-full bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary">
                    {booking.status ?? "Confirmed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-5">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-primary-light  text-primary uppercase text-[10px]">
                    <th className="pb-2">Tool Item</th>
                    <th className="pb-2 text-center">Quantity</th>
                    <th className="pb-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-light ">
                  {(booking.items ?? []).map((item) => (
                    <tr key={String(item.tool_id)}>
                      <td className="py-3">
                        <div className="font-bold text-primary uppercase tracking-wide text-sm">
                          {item.tool_name ?? "Unnamed tool"}
                        </div>
                        <div className="text-[10px] text-primary-light">
                          ${Number(item.unit_price ?? 0).toFixed(2)} per day
                        </div>
                      </td>
                      <td className="py-3 text-center font-semibold text-primary">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right font-bold text-primary">
                        ${Number(item.sub_total ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Box */}
            <div className="border-t border-primary-light  pt-4 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-primary">
                  <span>Booking Price:</span>
                  <span>${Number(booking.total_amount ?? 0).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-primary-light  flex justify-between font-black text-base text-[#1D4533]">
                  <span>Total Due:</span>
                  <span>${Number(booking.total_amount ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms and Notes */}
            <div className="mt-8 pt-4 border-t border-primary-light text-[11px] text-primary-light leading-relaxed">
              <span className="font-bold text-primary">Contract Notes: </span>
              Booking details are based on the information saved in the
              database.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
