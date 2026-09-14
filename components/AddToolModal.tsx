"use client";

import { Check, Wrench, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { ToolStatus } from "@/context/GlobalProvider";

interface AddToolModalProps {
  onClose: () => void;
  onSubmit: (
    toolName: string,
    price: number,
    quantity: number,
    status: ToolStatus,
  ) => Promise<{ error?: string }>;
}

const AddToolModal = ({ onClose, onSubmit }: AddToolModalProps) => {
  const [toolName, setToolName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [status, setStatus] = useState<ToolStatus>("waa la heli karaa");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await onSubmit(
      toolName.trim(),
      Number(price),
      Number(quantity),
      status,
    );

    if (result.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1D4533] text-white flex items-center justify-center">
              <Wrench className="w-4 h-4 text-[#F7EAE0]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Add New Tool
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add tool modal"
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Tool Name
            </label>
            <input
              type="text"
              required
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. Rotary Hammer Drill"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Tool Status
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as ToolStatus)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
            >
              <option value="waa la heli karaa">Waa La Heli Karaa</option>
              <option value="waa lasoo celiyey">Waa Lasoo Celiyey</option>
              <option value="waa la kireystay">Waa la Kireystay</option>
            </select>
          </div>

          <div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Tool Price
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Tool Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="1"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
            />
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5E3122] hover:bg-[#482418] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? "Submitting..." : "Submit Tool"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToolModal;
