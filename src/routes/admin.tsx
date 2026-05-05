import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — ABC Test Education Bookings" },
      { name: "description", content: "Manage trial class bookings." },
    ],
  }),
  component: Admin,
});

type Booking = {
  id: string; parent_name: string; phone: string; email: string;
  child_name: string; child_age: number; program: string;
  booking_date: string; time_slot: string; status: string; created_at: string;
};

function Admin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("bookings").select("*")
      .order("booking_date", { ascending: true }).order("time_slot");
    if (error) toast.error(error.message);
    setBookings((data ?? []) as Booking[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Booking deleted");
    load();
  }

  async function complete(id: string) {
    const { error } = await supabase.from("bookings").update({ status: "completed" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Marked complete");
    load();
  }

  function exportCsv() {
    if (bookings.length === 0) return toast.error("No bookings to export");
    const headers = ["Reference","Parent","Phone","Email","Child","Age","Program","Date","Time","Status"];
    const rows = bookings.map((b) => [
      b.id.slice(0, 8), b.parent_name, b.phone, b.email, b.child_name, b.child_age,
      b.program, b.booking_date, b.time_slot, b.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Admin — Bookings</h1>
            <p className="mt-1 text-muted-foreground">{bookings.length} total booking{bookings.length === 1 ? "" : "s"}</p>
          </div>
          <Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…</div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">No bookings yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <Th>Parent</Th><Th>Child</Th><Th>Program</Th>
                    <Th>Date</Th><Th>Time</Th><Th>Contact</Th>
                    <Th>Status</Th><Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <Td><div className="font-medium text-foreground">{b.parent_name}</div></Td>
                      <Td>{b.child_name} <span className="text-muted-foreground">({b.child_age})</span></Td>
                      <Td>{b.program}</Td>
                      <Td>{b.booking_date}</Td>
                      <Td>{b.time_slot}</Td>
                      <Td>
                        <div>{b.phone}</div>
                        <div className="text-xs text-muted-foreground">{b.email}</div>
                      </Td>
                      <Td>
                        <Badge variant={b.status === "completed" ? "default" : "secondary"}>
                          {b.status}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        <div className="flex justify-end gap-1">
                          {b.status !== "completed" && (
                            <Button size="sm" variant="ghost" onClick={() => complete(b.id)} title="Mark completed">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => remove(b.id)} title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
