"use client";

import { AlertCircle, Check, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useGlobalContext, type Booking } from "@/context/GlobalProvider";

interface BookingModalProps {
  onClose: () => void;
  onSubmit: (booking: Booking) => Promise<{ error?: string }>;
}

const initialBooking: Booking = {
  customer_name: "",
  customer_phone: "",
  tool: "",
  price: 0,
  date: "",
  reference: "",
  reference_phone: "",
  national_id: "",
  national_image: "",
  tool_id: "",
};

const BookingModal = ({ onClose, onSubmit }: BookingModalProps) => {
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const { tools, toolsLoading } = useGlobalContext();
  const selectedTool = tools.find(
    (tool) => String(tool.id) === String(booking.tool_id),
  );
  const rentableTools = tools.filter(
    (tool) => !tool.status || tool.status === "available",
  );

  const updateField = (field: keyof Booking, value: string | number) => {
    setBooking((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await onSubmit(booking);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    onClose();
  };

  const fields = [
    ["customer_name", "Customer Name", "text"],
    ["customer_phone", "Customer Phone", "tel"],
    ["date", "Date", "date"],
    ["reference", "Reference", "text"],
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-5 flex items-center justify-between bg-[#1D4533] text-[#F7EAE0] rounded-t-2xl">
          <h3 className="text-lg font-bold">Create Booking</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            className="p-1.5 text-[#F7EAE0]/70 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-secondary">
                Select Tool
                <select
                  required
                  value={String(booking.tool_id)}
                  onChange={(event) => {
                    const tool = tools.find(
                      (item) => String(item.id) === event.target.value,
                    );
                    updateField("tool_id", event.target.value);
                    updateField("tool", tool?.tool_name ?? tool?.name ?? "");
                    updateField(
                      "price",
                      Number(tool?.tool_price ?? tool?.daily_rate ?? 0),
                    );
                  }}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm font-normal text-stone-900 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                >
                  <option value="" disabled>
                    {toolsLoading ? "Loading tools..." : "Select a tool"}
                  </option>
                  {rentableTools.map((tool) => (
                    <option key={tool.id} value={String(tool.id)}>
                      {tool.tool_name ?? tool.name ?? "Unnamed tool"}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-bold text-secondary">
                Price
                <input
                  type="number"
                  readOnly
                  value={
                    selectedTool?.tool_price ??
                    selectedTool?.daily_rate ??
                    booking.price
                  }
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-stone-100 text-sm font-normal text-stone-900"
                />
              </label>

              {fields.map(([field, label, type]) => (
                <label
                  key={field}
                  className="block text-xs font-bold text-secondary"
                >
                  {label}
                  <input
                    type={type}
                    required
                    value={String(booking[field])}
                    onChange={(event) => updateField(field, event.target.value)}
                    className="mt-1 w-full px-3 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-normal text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                  />
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-secondary">
                National ID
                <input
                  type="text"
                  required
                  value={booking.national_id}
                  onChange={(event) =>
                    updateField("national_id", event.target.value)
                  }
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-normal text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </label>

              <label className="block text-xs font-bold text-secondary">
                Reference Phone
                <input
                  type="tel"
                  required
                  value={booking.reference_phone}
                  onChange={(event) =>
                    updateField("reference_phone", event.target.value)
                  }
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-normal text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </label>

              <label className="block text-xs font-bold text-secondary">
                National ID Image
                <span className="mt-1 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 p-4 text-center hover:border-[#1D4533]">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="National ID preview"
                      width={500}
                      height={160}
                      unoptimized
                      className="max-h-40 w-full rounded-md object-contain"
                    />
                  ) : (
                    <>
                      <ImagePlus className="mb-2 h-8 w-8 text-stone-400" />
                      <span className="text-xs font-semibold text-stone-600">
                        Upload national ID image
                      </span>
                      <span className="mt-1 text-[10px] text-stone-400">
                        JPG, PNG, or WEBP
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    required
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        setError(
                          "The national ID image must be smaller than 5 MB.",
                        );
                        event.target.value = "";
                        return;
                      }

                      const reader = new FileReader();
                      reader.onload = () => {
                        const image = String(reader.result ?? "");
                        setImagePreview(image);
                        updateField("national_image", image);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#5E3122] hover:bg-[#482418] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? "Saving..." : "Save Booking"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
