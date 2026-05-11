import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </div>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use the demo account to review the full workflow.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/auth/login" method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue="demo@cloudguard.local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" defaultValue="demo-password" />
            </div>
            <Button className="w-full">Continue</Button>
          </form>
          <Button asChild variant="ghost" className="mt-3 w-full">
            <Link href="/dashboard">Skip to demo workspace</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
