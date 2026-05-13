import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Logo } from "@/components/cyber/Logo";
import { Github, Twitter, Linkedin } from "lucide-react";

export const Route = createFileRoute("/_marketing")({
  component: MarketingLayout,
});

const NAV = [
  { label: "Home", to: "/" as const },
  { label: "Features", to: "/#features" as const },
  { label: "Solutions", to: "/#solutions" as const },
  { label: "Pricing", to: "/#pricing" as const },
  { label: "Contact", to: "/#contact" as const },
];

function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <a key={n.label} href={n.to} className="hover:text-foreground transition">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-1.5 text-sm rounded-md border border-border/60 hover:bg-accent transition">Login</Link>
            <Link to="/register" className="px-3 py-1.5 text-sm rounded-md bg-cyber text-primary-foreground font-medium hover:opacity-90 glow-cyan transition">Get Started</Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/60 bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Enterprise threat monitoring & incident response built for modern Security Operations Centers.
            </p>
          </div>
          <FooterCol title="Product" links={["Threat Detection", "Incident Response", "Analytics", "API"]} />
          <FooterCol title="Company" links={["About", "Customers", "Careers", "Press"]} />
          <FooterCol title="Legal" links={["Privacy Policy", "Terms of Service", "Security", "DPA"]} />
        </div>
        <div className="border-t border-border/60">
          <div className="mx-auto max-w-7xl px-4 py-5 flex items-center justify-between text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} CyberShield, Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-foreground"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-foreground"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-foreground transition">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
