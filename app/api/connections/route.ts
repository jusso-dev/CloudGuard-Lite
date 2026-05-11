import { NextResponse } from "next/server";
import { encryptSecret, secretPreview } from "@/lib/crypto/encryption";
import { azureConnectionSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = azureConnectionSchema.safeParse({
    name: form.get("name"),
    tenantId: form.get("tenantId"),
    clientId: form.get("clientId"),
    clientSecret: form.get("clientSecret"),
    subscriptionId: form.get("subscriptionId")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const encryptedSecret = encryptSecret(parsed.data.clientSecret);
  return NextResponse.json({
    provider: "azure",
    name: parsed.data.name,
    tenantId: parsed.data.tenantId,
    clientId: parsed.data.clientId,
    subscriptionId: parsed.data.subscriptionId,
    secretPreview: secretPreview(parsed.data.clientSecret),
    encryptedSecretLength: encryptedSecret.length
  });
}
