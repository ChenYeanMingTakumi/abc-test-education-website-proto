import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteHeader } from "@/components/SiteHeader";
import { PROGRAMS, TIME_SLOTS } from "@/lib/booking";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Trial Class — Aspen Education Malaysia" },
      { name: "description", content: "Reserve your child's free trial class online. Choose program, date and time slot." },
    ],
  }),
  component: BookPage,
});

const schema = z.object({
  parent_name: z.string().trim().min(2, "Enter parent name").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  email: z.string().trim().email("Enter a valid email").max(255),
  child_name: z.string().trim().min(1, "Enter child name").max(100),
  child_age: z.coerce.number().int().min(3, "Min age 3").max(18, "Max age 18"),
  program: z.string().min(1, "Choose a program"),
});

type FormState = {
  parent_name: string;
  phone: string;
  email: string;
  child_name: string;
  child_age: string;
  program: string;
};

function BookPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [program, setProgram] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | {
    id: string; parent_name: string; child_name: string; program: string; booking_date: string; time_slot: string; email: string;
  }>(null);

  const [form, setForm] = useState<FormState>({
    parent_name: "", phone: "", email: "", child_name: "", child_age: "", program: "",
  });

  // Load taken slots when date changes
  useEffect(() => {
    if (!date) { setTakenSlots([]); return; }
    setLoadingSlots(true);
    const dateStr = format(date, "yyyy-MM-dd");
    supabase.from("bookings").select("time_slot").eq("booking_date", dateStr)
      .then(({ data, error }) => {
        if (error) toast.error("Couldn't load slots");
        setTakenSlots((data ?? []).map((r) => r.time_slot));
        setLoadingSlots(false);
      });
  }, [date]);

  const availableSlots = useMemo(
    () => TIME_SLOTS.filter((s) => !takenSlots.includes(s)),
    [takenSlots],
  );

  const canNextFromStep1 = !!program;
  const canNextFromStep2 = !!date && !!timeSlot;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, program });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    if (!date || !timeSlot) { toast.error("Pick a date and time"); return; }
    setSubmitting(true);
    const { data, error } = await supabase.from("bookings").insert({
      ...parsed.data,
      booking_date: format(date, "yyyy-MM-dd"),
      time_slot: timeSlot,
    }).select().single();
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") toast.error("That slot was just taken — please pick another.");
      else toast.error(error.message);
      return;
    }
    // Mock email confirmation
    console.log("[Mock email] Confirmation sent to", data.email, data);
    setSuccess(data);
  }

  if (success) {
    const waMsg = encodeURIComponent(
      `Hi Aspen Education! I just booked a trial class:\n` +
      `Child: ${success.child_name}\nProgram: ${success.program}\n` +
      `Date: ${success.booking_date} at ${success.time_slot}\nRef: ${success.id.slice(0, 8)}`,
    );
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto max-w-xl px-4 py-16">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-elegant)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="text-2xl font-bold text-secondary">Booking Confirmed!</h1>
            <p className="mt-2 text-muted-foreground">
              A confirmation email has been sent to <span className="font-medium text-foreground">{success.email}</span>.
            </p>
            <div className="mt-6 rounded-xl bg-muted p-5 text-left text-sm">
              <Row k="Reference" v={success.id.slice(0, 8).toUpperCase()} />
              <Row k="Parent" v={success.parent_name} />
              <Row k="Child" v={success.child_name} />
              <Row k="Program" v={success.program} />
              <Row k="Date" v={success.booking_date} />
              <Row k="Time" v={success.time_slot} />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <a href={`https://wa.me/60123456789?text=${waMsg}`} target="_blank" rel="noreferrer">Continue on WhatsApp</a>
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/" })}>Back to Home</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <Link to="/" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold text-secondary">Book a Trial Class</h1>
        <p className="mt-1 text-muted-foreground">Step {step} of 3</p>

        {/* Progress */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className={cn("h-1.5 flex-1 rounded-full", n <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-secondary">Choose a program</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PROGRAMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProgram(p)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left text-sm font-medium transition",
                      program === p
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button disabled={!canNextFromStep1} onClick={() => setStep(2)}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-secondary">Pick date & time</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block">Preferred date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => { setDate(d); setTimeSlot(""); }}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="mb-2 block">Time slot</Label>
                  {!date ? (
                    <p className="text-sm text-muted-foreground">Select a date first.</p>
                  ) : loadingSlots ? (
                    <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-destructive">All slots booked. Try another date.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map((s) => {
                        const taken = takenSlots.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={taken}
                            onClick={() => setTimeSlot(s)}
                            className={cn(
                              "rounded-lg border-2 px-3 py-2 text-sm transition",
                              taken && "cursor-not-allowed border-border bg-muted text-muted-foreground line-through",
                              !taken && timeSlot === s && "border-primary bg-primary/5 text-primary",
                              !taken && timeSlot !== s && "border-border hover:border-primary/40",
                            )}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                <Button disabled={!canNextFromStep2} onClick={() => setStep(3)}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-semibold text-secondary">Your details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Parent name" v={form.parent_name} onChange={(v) => setForm({ ...form, parent_name: v })} />
                <Field label="Phone" v={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
                <Field label="Email" v={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" className="sm:col-span-2" />
                <Field label="Child name" v={form.child_name} onChange={(v) => setForm({ ...form, child_name: v })} />
                <div>
                  <Label className="mb-2 block">Child age</Label>
                  <Input type="number" min={3} max={18} value={form.child_age} onChange={(e) => setForm({ ...form, child_age: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label className="mb-2 block">Program</Label>
                  <Select value={program} onValueChange={setProgram}>
                    <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                    <SelectContent>
                      {PROGRAMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 text-sm">
                <div className="font-medium text-secondary">Booking summary</div>
                <div className="mt-1 text-muted-foreground">
                  {program || "—"} • {date ? format(date, "PPP") : "—"} • {timeSlot || "—"}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Booking
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, v, onChange, type = "text", className }: { label: string; v: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      <Input type={type} value={v} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}
