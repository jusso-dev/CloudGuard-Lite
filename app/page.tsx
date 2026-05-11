import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-between px-6 py-6 sm:px-10 lg:px-14">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </div>
            <span className="font-semibold">CloudGuard Lite</span>
          </div>
          <div className="max-w-xl py-16">
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
              Lightweight cloud posture and policy workspace
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Build an organisation profile, complete a security assessment, run a demo Azure scan,
              review control gaps, generate internal policies, and export a practical report.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard">
                  Open demo workspace
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/login">Demo login</Link>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Internal security posture tracking only. No certification or legal compliance claims.
          </p>
        </div>
        <div className="border-t bg-muted/40 p-4 lg:border-l lg:border-t-0 lg:p-8">
          <div className="grid h-full content-center gap-4">
            <Card className="mx-auto w-full max-w-3xl">
              <CardContent className="p-0">
                <div className="border-b p-5">
                  <div className="text-sm font-semibold">Demo posture summary</div>
                  <div className="mt-1 text-sm text-muted-foreground">Northstar Medical Group</div>
                </div>
                <div className="grid gap-0 sm:grid-cols-3">
                  {[
                    ["Maturity", "61/100"],
                    ["Failed findings", "4"],
                    ["Policies", "9"]
                  ].map(([label, value]) => (
                    <div key={label} className="border-b p-5 sm:border-r sm:last:border-r-0">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="mt-2 text-2xl font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 p-5">
                  {[
                    "Restrict broad inbound administration rule",
                    "Enable diagnostic logging for production app",
                    "Complete backup restore test"
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-md border p-3">
                      <span className="text-sm">{item}</span>
                      <span className="text-xs font-medium text-primary">30 days</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
