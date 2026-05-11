import Link from "next/link";
import { FilePenLine } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { policyCatalog } from "@/lib/policies/templates";

const generated = new Set(["access-control", "backup-recovery", "cloud-security"]);

export default function PoliciesPage() {
  return (
    <AppShell
      title="Policy library"
      description="Generate deterministic internal policies from organisation profile, assessment answers, and findings."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {policyCatalog.map((policy) => (
          <Card key={policy.type}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{policy.title}</CardTitle>
                <Badge tone={generated.has(policy.type) ? "pass" : "neutral"}>
                  {generated.has(policy.type) ? "Generated" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {policy.controls.map((control) => (
                  <Badge key={control}>{control}</Badge>
                ))}
              </div>
              <Button asChild variant={generated.has(policy.type) ? "secondary" : "default"}>
                <Link href={`/policies/${policy.type}`}>
                  <FilePenLine className="h-4 w-4" aria-hidden />
                  {generated.has(policy.type) ? "Open editor" : "Generate"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
