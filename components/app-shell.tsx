import Link from "next/link";
import {
  Activity,
  ClipboardCheck,
  Cloud,
  FileText,
  Gauge,
  History,
  Library,
  LockKeyhole,
  ScrollText,
  Settings,
  ShieldCheck,
  TriangleAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/setup", label: "Setup", icon: ClipboardCheck },
  { href: "/assessment", label: "Assessment", icon: ShieldCheck },
  { href: "/connections", label: "Connections", icon: Cloud },
  { href: "/scans", label: "Scan runs", icon: Activity },
  { href: "/findings", label: "Findings", icon: TriangleAlert },
  { href: "/controls", label: "Controls", icon: LockKeyhole },
  { href: "/policies", label: "Policies", icon: Library },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/audit", label: "Audit log", icon: History },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({
  children,
  title,
  description,
  action
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ScrollText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <div className="text-sm font-semibold">CloudGuard Lite</div>
            <div className="text-xs text-muted-foreground">Security posture</div>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              {description ? (
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {action}
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t px-3 py-2 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
