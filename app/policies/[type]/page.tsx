import Link from "next/link";
import { Download, Save } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { demoAnswers, demoFindings, demoOrganisation } from "@/lib/fixtures/demo-data";
import { generatePolicyTemplate, policyCatalog, type PolicyType } from "@/lib/policies/templates";

export default async function PolicyEditorPage({
  params
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const policy = policyCatalog.find((item) => item.type === type);
  if (!policy) {
    notFound();
  }

  const content = generatePolicyTemplate({
    type: type as PolicyType,
    organisation: demoOrganisation,
    answers: demoAnswers,
    findings: demoFindings
  });

  return (
    <AppShell
      title={policy.title}
      description="Edit generated policy wording, keep version history, and export Markdown."
      action={
        <Button asChild variant="secondary">
          <Link
            href={`/api/policies?type=${policy.type}&format=markdown`}
            target="_blank"
            rel="noreferrer"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export Markdown
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Policy editor</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/policies" method="post" className="space-y-4">
              <input type="hidden" name="type" value={policy.type} />
              <Textarea name="content" defaultValue={content} className="min-h-[680px] font-mono text-xs leading-5" />
              <Button>
                <Save className="h-4 w-4" aria-hidden />
                Save version
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Version history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[3, 2, 1].map((version) => (
              <div key={version} className="rounded-md border p-3">
                <div className="text-sm font-medium">Version {version}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Saved from deterministic template mode
                </div>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              LLM enhancement is available when an OpenAI-compatible API key is configured.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
