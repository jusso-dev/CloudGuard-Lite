import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
        {detail ? <div className="mt-1 text-xs text-muted-foreground">{detail}</div> : null}
      </CardContent>
    </Card>
  );
}
