"use client";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit,
  PackageCheck,
  Package,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useGlobalContext, type ToolStatus } from "@/context/GlobalProvider";
import { useMemo, useState } from "react";
import AddToolModal from "@/components/AddToolModal";
import EditToolModal from "./EditToolModal";

const ToolsView = () => {
  const { tools, addTool, updateTool, deleteTool } = useGlobalContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null);

  // Filter tools based on search query matching tool name
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return tools;
    return tools.filter((tool) => tool.tool_name?.toLowerCase().includes(q));
  }, [tools, searchQuery]);

  // Status badge display
  const getStatusBadge = (status: ToolStatus) => {
    switch (status) {
      case "waa la heli karaa":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Waa la heli karaa</span>
          </span>
        );
      case "waa la kireystay":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Wa la kireystay</span>
          </span>
        );
      case "waa lasoo celiyey":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Waa lasoo celiyey</span>
          </span>
        );
    }
  };
  return (
    <div className="space-y-6 text-[#1D4533]">
      {/* Inventory Container */}
      <div className="bg-white rounded-2xl border border-[#1D4533]/15 shadow-md overflow-hidden">
        {/* Header with Search and Add Action */}
        <div className="p-5 sm:p-6 border-b border-[#1D4533]/10 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-[#1D4533] tracking-tight">
                  Tool Inventory
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1D4533]/10 text-[#1D4533]">
                  {tools.length} Tools
                </span>
              </div>
              <p className="text-xs text-[#1D4533]/70 mt-1">
                Equipment inventory list displaying tool name, rental price, and
                real-time status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative min-w-60 sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a tool..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                />
              </div>

              {/* Add Tool Button */}
              <button
                onClick={() => setShowAddModal(true)}
                id="btn-add-tool"
                className="bg-[#5E3122] hover:bg-[#482418] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tool</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tools Table: Only Tool Name, Tool Price, Tool Status */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#1D4533]/70 border-b border-[#1D4533]/10 bg-[#F7EAE0]/50">
                <th className="py-3.5 px-6 font-bold">Tool Name</th>
                <th className="py-3.5 px-6 font-bold">Tool Price</th>
                <th className="py-3.5 px-6 font-bold">Tool Status</th>
                <th className="py-3.5 px-6 font-bold">Inventory</th>
                <th className="py-3.5 px-6 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D4533]/10">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <tr
                    key={tool.id}
                    className="hover:bg-[#F7EAE0]/30 transition-colors"
                  >
                    {/* Tool Name */}
                    <td className="py-4 px-6 font-bold text-stone-900 text-sm">
                      {tool.tool_name}
                    </td>

                    {/* Tool Price */}
                    <td className="py-4 px-6 font-semibold text-stone-800 text-sm whitespace-nowrap">
                      ${tool.tool_price} / day
                    </td>

                    {/* Tool Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(
                        tool.status === "waa la kireystay" ||
                          tool.status === "waa lasoo celiyey" ||
                          tool.status === "waa la heli karaa"
                          ? tool.status
                          : "waa la heli karaa",
                      )}
                    </td>

                    {/* Quantity by status */}
                    <td className="py-4 px-6">
                      {(() => {
                        const quantity = Math.max(
                          Number(tool.quantity ?? 1),
                          0,
                        );
                        const status = tool.status ?? "waa la heli karaa";
                        const counts = {
                          available:
                            status === "waa la heli karaa" ? quantity : 0,
                          rented: status === "waa la kireystay" ? quantity : 0,
                          returned:
                            status === "waa lasoo celiyey" ? quantity : 0,
                        };

                        return (
                          <div className="flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Available: {counts.available}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
                              <Clock className="h-3.5 w-3.5" />
                              Rented: {counts.rented}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">
                              <PackageCheck className="h-3.5 w-3.5" />
                              Returned: {counts.returned}
                            </span>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Actions */}
                    <td className="flex gap-2 py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedToolId(Number(tool.id));
                          setShowEditModal(true);
                        }}
                        className="p-2 rounded-xl border border-[#1D4533]/20 dark:border-white/15 text-[#1D4533] dark:text-[#F7EAE0] hover:bg-[#F7EAE0]/50 dark:hover:bg-stone-800 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteTool(tool.id)}
                        className="p-2 rounded-xl border border-[#1D4533]/20 dark:border-white/15 text-[#1D4533] dark:text-[#F7EAE0] hover:bg-[#F7EAE0]/50 dark:hover:bg-stone-800 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#1D4533]/10 text-[#1D4533] flex items-center justify-center mx-auto">
                        <Package className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-800">
                        {searchQuery
                          ? "No matching tools found"
                          : "No Tools in Inventory"}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {searchQuery
                          ? `No tools match "${searchQuery}". Try a different search.`
                          : "No equipment has been registered in the system yet."}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-xs font-semibold text-stone-800 cursor-pointer"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-[#1D4533]/10 bg-[#F7EAE0]/30 flex items-center justify-between text-xs text-[#1D4533]/80">
          <span className="font-medium">
            Showing <strong>{filteredTools.length}</strong> of{" "}
            <strong>{tools.length}</strong> tools
          </span>
        </div>
      </div>

      {/* Add Tool Modal */}
      {showAddModal && (
        <AddToolModal
          onSubmit={addTool}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Tool Modal */}
      {showEditModal && selectedToolId !== null && (
        <EditToolModal
          selectedToolId={selectedToolId}
          onEdit={updateTool}
          onClose={() => {
            setShowEditModal(false);
            setSelectedToolId(null);
          }}
        />
      )}
    </div>
  );
};

export default ToolsView;
