import { Badge } from "@/components/ui/badge";
import type { Finding } from "@/lib/types";
import { titleCase } from "@/lib/utils";

export function FindingTable({ findings }: { findings: Finding[] }) {
  return (
    <div className="table-scroll overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Finding</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Engine</th>
            <th className="px-4 py-3 font-medium">Resource</th>
            <th className="px-4 py-3 font-medium">Controls</th>
            <th className="px-4 py-3 font-medium">Remediation</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((finding) => (
            <tr key={finding.id} className="border-b last:border-b-0">
              <td className="max-w-72 px-4 py-3 align-top">
                <div className="font-medium">{finding.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{finding.category}</div>
              </td>
              <td className="px-4 py-3 align-top">
                <Badge tone={finding.severity}>{titleCase(finding.severity)}</Badge>
              </td>
              <td className="px-4 py-3 align-top">
                <Badge tone={finding.status}>{titleCase(finding.status)}</Badge>
              </td>
              <td className="px-4 py-3 align-top">
                <Badge>{titleCase(finding.engine ?? "native")}</Badge>
              </td>
              <td className="px-4 py-3 align-top text-muted-foreground">
                {finding.affectedResource ?? "None"}
              </td>
              <td className="px-4 py-3 align-top">
                <div className="flex flex-wrap gap-1">
                  {finding.complianceTags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </td>
              <td className="max-w-96 px-4 py-3 align-top text-muted-foreground">
                {finding.remediation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
