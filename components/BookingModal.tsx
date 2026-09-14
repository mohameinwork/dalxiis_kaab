"use client";

import { AlertCircle, Check, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { useGlobalContext, type Booking } from "@/context/GlobalProvider";

interface BookingModalProps {
  onClose: () => void;
  onSubmit: (booking: Booking) => Promise<{ error?: string }>;
}

interface BookingItem {
  tool_id: string;
  tool_name: string;
  quantity: number;
  unit_price: number;
  available_quantity: number;
  sub_total?: number;
}

interface BookingForm {
  customer_name: string;
  customer_phone: string;
  date: string;
  reference: string;
  reference_phone: string;
  national_id: string;
  national_image: string;
}

const initialBooking: BookingForm = {
  customer_name: "",
  customer_phone: "",
  date: "",
  reference: "",
  reference_phone: "",
  national_id: "",
  national_image: "",
};

const BookingModal = ({ onClose, onSubmit }: BookingModalProps) => {
  const [booking, setBooking] = useState<BookingForm>(initialBooking);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const { tools, bookings, toolsLoading } = useGlobalContext();
  const rentedQuantityByTool = useMemo(() => {
    const quantities = new Map<string, number>();

    for (const booking of bookings) {
      if (booking.status === "returned") continue;

      for (const item of booking.items ?? []) {
        const toolKey = String(item.tool_id);
        quantities.set(
          toolKey,
          (quantities.get(toolKey) ?? 0) + Math.max(Number(item.quantity), 0),
        );
      }
    }

    return quantities;
  }, [bookings]);
  const rentableTools = useMemo(
    () =>
      tools.filter((tool) => {
        const totalQuantity = Math.max(Number(tool.quantity ?? 0), 0);
        const rentedQuantity = rentedQuantityByTool.get(String(tool.id)) ?? 0;
        return totalQuantity - rentedQuantity > 0;
      }),
    [rentedQuantityByTool, tools],
  );
  const totalPrice = bookingItems.reduce(
    (total, item) => total + item.quantity * item.unit_price,
    0,
  );

  const updateField = (field: keyof BookingForm, value: string) => {
    setBooking((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (bookingItems.length === 0) {
      setError("Please select at least one tool.");
      return;
    }

    setIsSubmitting(true);

    const bookingPayload: Booking = {
      ...booking,
      total_amount: totalPrice,
      items: bookingItems.map((item) => ({
        tool_id: item.tool_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        sub_total: item.unit_price * item.quantity,
      })),
    };

    const result = await onSubmit(bookingPayload);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    onClose();
  };

  const addTool = (tool: (typeof tools)[number]) => {
    const toolId = String(tool.id);

    const price = Number(tool.tool_price ?? tool.daily_rate ?? 0);

    const availableQuantity = Math.max(
      Number(tool.quantity ?? 0) - (rentedQuantityByTool.get(toolId) ?? 0),
      0,
    );

    setBookingItems((current) => {
      const existing = current.find((item) => item.tool_id === toolId);

      if (existing) {
        return current.map((item) =>
          item.tool_id === toolId
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.available_quantity),
              }
            : item,
        );
      }

      return [
        ...current,
        {
          tool_id: toolId,
          tool_name: tool.tool_name ?? tool.name ?? "Unnamed tool",
          quantity: 1,
          unit_price: price,
          available_quantity: availableQuantity,
        },
      ];
    });
  };

  const removeTool = (toolId: string) => {
    setBookingItems((current) =>
      current.filter((item) => item.tool_id !== toolId),
    );
  };

  const increaseToolQuantity = (toolId: string) => {
    const tool = tools.find((item) => String(item.id) === toolId);
    if (tool) addTool(tool);
  };

  const decreaseToolQuantity = (toolId: string) => {
    setBookingItems((current) =>
      current
        .map((item) =>
          item.tool_id === toolId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block text-xs font-bold text-secondary">
              Customer Name
              <input
                type="text"
                required
                value={booking.customer_name}
                onChange={(event) =>
                  updateField("customer_name", event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-normal text-stone-900 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </label>

            <label className="block text-xs font-bold text-secondary">
              Customer Phone
              <input
                type="tel"
                required
                value={booking.customer_phone}
                onChange={(event) =>
                  updateField("customer_phone", event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-normal text-stone-900 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </label>

            <label className="block text-xs font-bold text-secondary">
              Booking Date
              <input
                type="date"
                required
                value={booking.date}
                onChange={(event) => updateField("date", event.target.value)}
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-normal text-stone-900 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-secondary">
                Select Tools
              </label>

              <div className="rounded-lg border border-stone-300 bg-white overflow-hidden">
                {toolsLoading ? (
                  <div className="p-4 text-xs text-stone-500">
                    Loading tools...
                  </div>
                ) : rentableTools.length === 0 ? (
                  <div className="p-4 text-xs text-stone-500">
                    No tools available for rent.
                  </div>
                ) : (
                  <div className="max-h-52 overflow-y-auto divide-y divide-stone-100">
                    {rentableTools.map((tool) => {
                      const toolId = String(tool.id);

                      const selectedItem = bookingItems.find(
                        (item) => item.tool_id === toolId,
                      );

                      const price = Number(
                        tool.tool_price ?? tool.daily_rate ?? 0,
                      );

                      const availableQuantity = Math.max(
                        Number(tool.quantity ?? 0) -
                          (rentedQuantityByTool.get(toolId) ?? 0),
                        0,
                      );

                      return (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between gap-3 p-3 hover:bg-stone-50"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-stone-900">
                              {tool.tool_name ?? tool.name ?? "Unnamed tool"}
                            </p>

                            <p className="text-[11px] text-stone-500">
                              ${price.toFixed(2)} / day
                              {" · "}
                              {availableQuantity} available
                            </p>
                          </div>

                          {selectedItem ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => decreaseToolQuantity(toolId)}
                                className="h-7 w-7 rounded-md border border-stone-300 hover:bg-stone-100"
                              >
                                −
                              </button>

                              <span className="w-7 text-center text-sm font-bold">
                                {selectedItem.quantity}
                              </span>

                              <button
                                type="button"
                                disabled={
                                  selectedItem.quantity >= availableQuantity
                                }
                                onClick={() => increaseToolQuantity(toolId)}
                                className="h-7 w-7 rounded-md border border-stone-300 hover:bg-stone-100 disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={availableQuantity <= 0}
                              onClick={() => addTool(tool)}
                              className="rounded-md bg-[#1D4533] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#153526] disabled:opacity-40"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {bookingItems.length > 0 && (
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-800">
                    Selected Tools
                  </p>

                  <span className="text-[10px] text-stone-500">
                    {bookingItems.length} tool
                    {bookingItems.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {bookingItems.map((item) => (
                  <div
                    key={item.tool_id}
                    className="flex items-center justify-between rounded-md bg-white border border-stone-200 p-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        {item.tool_name}
                      </p>

                      <p className="text-[10px] text-stone-500">
                        ${item.unit_price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-stone-900">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeTool(item.tool_id)}
                        className="text-[10px] text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-xs font-bold text-secondary">
                Total Price
                <input
                  type="number"
                  readOnly
                  value={totalPrice}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-stone-100 text-sm font-normal text-stone-900"
                />
              </label>
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
                Reference
                <input
                  type="text"
                  required
                  value={booking.reference}
                  onChange={(event) =>
                    updateField("reference", event.target.value)
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
