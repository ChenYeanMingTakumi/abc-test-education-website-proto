import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-warm)] text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold text-secondary">ABC Test Education</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Malaysia</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground">Home</Link>
          <Link to="/admin" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground">Admin</Link>
          <Button asChild size="sm" className="ml-2">
            <Link to="/book">Book Trial Class</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
