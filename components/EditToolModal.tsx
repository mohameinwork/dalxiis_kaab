"use client";

import { useGlobalContext } from "@/context/GlobalProvider";
import type { Tool } from "@/context/GlobalProvider";
import { Check, Wrench, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

interface EditToolModalProps {
  onClose: () => void;
  onEdit: (
    toolId: string | number,
    updates: Partial<Omit<Tool, "id">>,
  ) => Promise<{ error?: string }>;
  selectedToolId: number | null;
}

const EditToolModal = ({
  onClose,
  onEdit,
  selectedToolId,
}: EditToolModalProps) => {
  const [toolName, setToolName] = useState("");
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchToolById } = useGlobalContext();

  // Fetch the tool details when the modal is opened
  useEffect(() => {
    if (selectedToolId !== null) {
      const fetchToolDetails = async () => {
        const tool = await fetchToolById(selectedToolId);
        if (tool) {
          setToolName(tool.tool_name || "");
          setPrice(tool.tool_price?.toString() || "");
        }
      };
      fetchToolDetails();
    }
  }, [selectedToolId, fetchToolById]);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (selectedToolId === null) {
      setErrorMessage("No tool selected.");
      return;
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("Enter a valid price.");
      return;
    }

    setIsSubmitting(true);

    const result = await onEdit(selectedToolId, {
      tool_name: toolName.trim(),
      tool_price: parsedPrice,
    });

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
                Update Tool
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

export default EditToolModal;
