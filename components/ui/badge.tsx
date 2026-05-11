import { cn } from "@/lib/utils";

const styles = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  high: "border-orange-200 bg-orange-50 text-orange-900",
  critical: "border-red-200 bg-red-50 text-red-900",
  pass: "border-emerald-200 bg-emerald-50 text-emerald-800",
  fail: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-red-200 bg-red-50 text-red-900",
  not_applicable: "border-slate-200 bg-slate-50 text-slate-700",
  neutral: "border-border bg-muted text-muted-foreground"
};

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: keyof typeof styles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium",
        styles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
