"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase/client";

export interface Tool {
  id: string | number;
  name?: string | null;
  tool_name?: string | null;
  tool_price?: number | null;
  quantity?: number | null;
  category?: string | null;
  status?: string | null;
  condition?: string | null;
  daily_rate?: number | null;
  [key: string]: unknown;
}

export type ToolStatus =
  | "waa la heli karaa"
  | "waa lasoo celiyey"
  | "waa la kireystay";

const normalizeToolStatus = (status: unknown): ToolStatus | null => {
  switch (status) {
    case "waa la heli karaa":
    case "available":
      return "waa la heli karaa";
    case "waa lasoo celiyey":
    case "returned":
      return "waa lasoo celiyey";
    case "waa la kireystay":
    case "rented":
      return "waa la kireystay";
    default:
      return null;
  }
};

export interface Booking {
  id?: string | number;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  date: string;
  reference: string;
  reference_phone: string;
  national_id: string;
  national_id_image?: string;
  national_image: string; // Base64 encoded image data
  status?: string | null;
  items?: BookingItem[];
}

export interface BookingItem {
  tool_id: string | number;
  tool_name?: string | null;
  quantity: number;
  unit_price?: number;
  sub_total?: number;
}

interface GlobalProviderContext {
  activeView: "dashboard" | "tools" | "booking";
  showNewRentalModal: boolean;
  setShowNewRentalModal: (open: boolean) => void;
  // Navigation & View Actions
  setActiveView: (view: "dashboard" | "tools" | "booking") => void;
  tools: Tool[];
  toolsLoading: boolean;
  toolsError: string | null;
  refreshTools: () => Promise<void>;
  addTool: (
    toolName: string,
    price: number,
    quantity: number,
    status: ToolStatus,
  ) => Promise<{ error?: string }>;
  updateTool: (
    toolId: string | number,
    updates: Partial<Omit<Tool, "id">>,
  ) => Promise<{ error?: string }>;
  deleteTool: (toolId: string | number) => Promise<{ error?: string }>;
  fetchToolById: (toolId: string | number) => Promise<Tool | null>;
  bookings: Booking[];
  bookingsLoading: boolean;
  bookingsError: string | null;
  refreshBookings: () => Promise<void>;
  addBooking: (booking: Booking) => Promise<{ error?: string }>;
  deleteBooking: (bookingId: string | number) => Promise<{ error?: string }>;
  returnBooking: (bookingId: string | number) => Promise<{ error?: string }>;
}
export const GlobalContext = createContext<GlobalProviderContext | undefined>(
  undefined,
);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeView, setActiveView] = useState<
    "dashboard" | "tools" | "booking"
  >("dashboard");
  const [showNewRentalModal, setShowNewRentalModal] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [toolsError, setToolsError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const { currentUser, loading: authLoading } = useAuth();

  const refreshTools = useCallback(async () => {
    if (!currentUser) {
      setTools([]);
      setToolsLoading(false);
      return;
    }

    setToolsLoading(true);
    setToolsError(null);

    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("id");

    if (error) {
      setToolsError(error.message);
      setTools([]);
    } else {
      setTools(
        (data ?? []).map((tool) => ({
          ...(tool as Tool),
          status: normalizeToolStatus(tool.status) ?? tool.status,
        })),
      );
    }

    setToolsLoading(false);
  }, [currentUser]);

  const fetchToolById = useCallback(
    async (toolId: string | number) => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("id", toolId)
        .single();

      if (error) {
        setToolsError(error.message);
        return null;
      }

      await refreshTools(); // Refresh tools after fetching a specific tool

      return data as Tool | null;
    },
    [refreshTools],
  );

  const addTool = useCallback(
    async (
      toolName: string,
      price: number,
      quantity: number,
      status: ToolStatus,
    ) => {
      const { error } = await supabase.from("tools").insert({
        tool_name: toolName,
        tool_price: price,
        quantity,
        status,
      });

      if (error) {
        return { error: error.message };
      }

      await refreshTools();
      return {};
    },
    [refreshTools],
  );

  const updateTool = useCallback(
    async (toolId: string | number, updates: Partial<Omit<Tool, "id">>) => {
      const { error } = await supabase
        .from("tools")
        .update(updates)
        .eq("id", toolId);

      if (error) {
        return { error: error.message };
      }

      await refreshTools();
      return {};
    },
    [refreshTools],
  );

  const deleteTool = useCallback(
    async (toolId: string | number) => {
      const { error } = await supabase.from("tools").delete().eq("id", toolId);

      if (error) {
        return { error: error.message };
      }

      await refreshTools();
      return {};
    },
    [refreshTools],
  );

  const refreshBookings = useCallback(async () => {
    if (!currentUser) {
      setBookings([]);
      setBookingsLoading(false);
      return;
    }

    setBookingsLoading(true);
    setBookingsError(null);

    const { data, error } = await supabase
      .from("booking")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      setBookingsError(error.message);
      setBookings([]);
    } else {
      const bookingRows = data ?? [];
      const bookingIds = bookingRows
        .map((booking) => booking.id)
        .filter((id): id is string | number => id !== undefined);
      const { data: itemRows, error: itemsError } = bookingIds.length
        ? await supabase
            .from("booking_items")
            .select("tool_id, booking_id, quantity, unit_price, sub_total")
            .in("booking_id", bookingIds)
        : { data: [], error: null };

      if (itemsError) {
        setBookingsError(itemsError.message);
        setBookings([]);
      } else {
        const toolIds = [
          ...new Set((itemRows ?? []).map((item) => item.tool_id)),
        ];
        const { data: toolRows, error: toolsError } = toolIds.length
          ? await supabase
              .from("tools")
              .select("id, tool_name")
              .in("id", toolIds)
          : { data: [], error: null };

        if (toolsError) {
          setBookingsError(toolsError.message);
          setBookings([]);
        } else {
          const toolNames = new Map(
            (toolRows ?? []).map((tool) => [
              String(tool.id),
              tool.tool_name ?? "Unnamed tool",
            ]),
          );
          const itemsByBooking = new Map<string, BookingItem[]>();

          for (const item of itemRows ?? []) {
            const bookingKey = String(item.booking_id);
            const bookingItems = itemsByBooking.get(bookingKey) ?? [];
            bookingItems.push({
              ...item,
              tool_name: toolNames.get(String(item.tool_id)) ?? "Unnamed tool",
            } as BookingItem);
            itemsByBooking.set(bookingKey, bookingItems);
          }

          setBookings(
            bookingRows.map((booking) => ({
              ...booking,
              items: itemsByBooking.get(String(booking.id)) ?? [],
            })) as Booking[],
          );
        }
      }
    }

    setBookingsLoading(false);
  }, [currentUser]);

  const addBooking = useCallback(
    async (booking: Booking) => {
      const { items, ...bookingFields } = booking;

      const bookingRecord = {
        ...bookingFields,
        status: "Confirmed",
      };

      const bookingItems = items ?? [];

      if (bookingItems.length === 0) {
        return { error: "A booking must include at least one tool." };
      }

      const { data: insertedBooking, error } = await supabase
        .from("booking")
        .insert(bookingRecord)
        .select("id")
        .single();

      if (error) {
        return { error: error.message };
      }

      const { error: itemsError } = await supabase.from("booking_items").insert(
        bookingItems.map((item) => ({
          booking_id: insertedBooking.id,
          tool_id: item.tool_id,
          quantity: item.quantity,
          unit_price: item.unit_price ?? 0,
          sub_total: item.sub_total ?? (item.unit_price ?? 0) * item.quantity,
        })),
      );

      if (itemsError) {
        await supabase.from("booking").delete().eq("id", insertedBooking.id);

        return { error: itemsError.message };
      }

      const { error: statusError } = await supabase
        .from("tools")
        .update({ status: "waa la kireystay" })
        .in(
          "id",
          bookingItems.map((item) => item.tool_id),
        );

      if (statusError) {
        await supabase
          .from("booking_items")
          .delete()
          .eq("booking_id", insertedBooking.id);

        await supabase.from("booking").delete().eq("id", insertedBooking.id);

        return { error: statusError.message };
      }

      await refreshBookings();
      await refreshTools();

      return {};
    },
    [refreshBookings, refreshTools],
  );

  const returnBooking = useCallback(
    async (bookingId: string | number) => {
      const booking = bookings.find(
        (item) => String(item.id) === String(bookingId),
      );

      if (!booking) {
        return { error: "Booking not found." };
      }

      const { data: bookingItems, error: itemsError } = await supabase
        .from("booking_items")
        .select("tool_id")
        .eq("booking_id", bookingId);

      if (itemsError) {
        return { error: itemsError.message };
      }

      const toolIds = (bookingItems ?? []).map((item) => item.tool_id);

      const { error } = await supabase
        .from("tools")
        .update({ status: "waa lasoo celiyey" })
        .in("id", toolIds);

      if (error) {
        return { error: error.message };
      }

      const { error: bookingStatusError } = await supabase
        .from("booking")
        .update({ status: "returned" })
        .eq("id", bookingId);

      if (bookingStatusError) {
        return { error: bookingStatusError.message };
      }

      await refreshTools();
      await refreshBookings();
      return {};
    },
    [bookings, refreshBookings, refreshTools],
  );

  const deleteBooking = useCallback(
    async (bookingId: string | number) => {
      const booking = bookings.find(
        (item) => String(item.id) === String(bookingId),
      );
      const { error } = await supabase
        .from("booking")
        .delete()
        .eq("id", bookingId);

      if (error) {
        return { error: error.message };
      }

      const imagePrefix = "/storage/v1/object/public/reference_image/";
      const imageUrl = booking?.national_image ?? booking?.national_id_image;
      const imagePath = imageUrl?.includes(imagePrefix)
        ? imageUrl.split(imagePrefix)[1]
        : null;

      if (imagePath) {
        await supabase.storage.from("reference_image").remove([imagePath]);
      }

      await refreshBookings();
      return {};
    },
    [bookings, refreshBookings],
  );

  useEffect(() => {
    if (!authLoading) {
      queueMicrotask(() => {
        void refreshTools();
        void refreshBookings();
      });
    }
  }, [authLoading, refreshBookings, refreshTools]);

  return (
    <GlobalContext.Provider
      value={{
        activeView,
        setActiveView,
        showNewRentalModal,
        setShowNewRentalModal,
        tools,
        toolsLoading,
        toolsError,
        refreshTools,
        addTool,
        updateTool,
        deleteTool,
        bookings,
        bookingsLoading,
        bookingsError,
        refreshBookings,
        addBooking,
        deleteBooking,
        returnBooking,
        fetchToolById,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
