import { CheckCircle2, CircleAlert } from "lucide-react";

export function ActionList({
  items
}: {
  items: Array<{ title: string; detail: string; complete?: boolean }>;
}) {
  return (
    <div className="divide-y rounded-lg border bg-card">
      {items.map((item) => (
        <div key={item.title} className="flex gap-3 p-4">
          {item.complete ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700" aria-hidden />
          ) : (
            <CircleAlert className="mt-0.5 h-4 w-4 text-amber-700" aria-hidden />
          )}
          <div>
            <div className="text-sm font-medium">{item.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{item.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
