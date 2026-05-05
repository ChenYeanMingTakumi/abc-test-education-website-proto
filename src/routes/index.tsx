import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, BookOpen, Sparkles, Clock, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import heroImage from "@/assets/hero-classroom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aspen Education Malaysia — Book a Trial Class Online" },
      { name: "description", content: "Book trial classes and consultations online with Aspen Education Malaysia. English, Math, Phonics and more for your child." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Trusted by 1,000+ Malaysian families
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-5xl lg:text-6xl">
              Give your child a head start they'll <span className="text-primary">love</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Book a free trial class or consultation in under a minute. No more
              back-and-forth on WhatsApp — pick your program, date, and time slot
              instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-[var(--shadow-elegant)]">
                <Link to="/book"><CalendarCheck className="mr-2 h-5 w-5" /> Book a Trial Class</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/admin">View Admin Panel</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <Stat value="6+" label="Programs" />
              <Stat value="1k+" label="Students" />
              <Stat value="4.9★" label="Parent Rating" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-[image:var(--gradient-warm)] opacity-20 blur-2xl" />
            <img
              src={heroImage}
              alt="Happy children learning at Aspen Education Malaysia"
              width={1536}
              height={1024}
              className="relative rounded-2xl shadow-[var(--shadow-elegant)]"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-secondary">Why parents choose Aspen</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            A simple, modern booking experience — built for busy Malaysian families.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Feature icon={Clock} title="Real-time slots" desc="See only available time slots — no double bookings, ever." />
            <Feature icon={ShieldCheck} title="Instant confirmation" desc="Get booking details on screen and via email immediately." />
            <Feature icon={Users} title="Expert teachers" desc="Programs designed by qualified educators for ages 4–17." />
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-secondary">Our Programs</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "English", d: "Reading, writing, speaking confidence." },
              { t: "Math", d: "From counting to problem-solving mastery." },
              { t: "Phonics", d: "Foundational reading for early learners." },
              { t: "Science", d: "Hands-on experiments and curiosity." },
              { t: "Bahasa Malaysia", d: "Strong national language fluency." },
              { t: "Mandarin", d: "Conversational and written Mandarin." },
            ].map((p) => (
              <div key={p.t} className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[image:var(--gradient-warm)] text-primary-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-secondary">{p.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="container mx-auto rounded-3xl bg-[image:var(--gradient-hero)] p-10 text-center text-primary-foreground shadow-[var(--shadow-elegant)] sm:p-14">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to book your child's trial class?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Takes less than a minute. Free, no commitment.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-7 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/book"><CalendarCheck className="mr-2 h-5 w-5" /> Book a Trial Class</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Aspen Education Malaysia. Prototype.
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-secondary">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: typeof Clock; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-secondary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-secondary">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
