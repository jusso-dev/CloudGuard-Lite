import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey() {
  const configured = process.env.APP_ENCRYPTION_KEY;
  if (!configured || configured === "replace-with-32-byte-base64-key") {
    return crypto.createHash("sha256").update("cloudguard-lite-local-demo-key").digest();
  }

  const decoded = Buffer.from(configured, "base64");
  if (decoded.length === 32) {
    return decoded;
  }

  return crypto.createHash("sha256").update(configured).digest();
}

export function encryptSecret(plainText: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((part) => part.toString("base64")).join(".");
}

export function decryptSecret(payload: string) {
  const [ivRaw, authTagRaw, encryptedRaw] = payload.split(".");
  if (!ivRaw || !authTagRaw || !encryptedRaw) {
    throw new Error("Invalid encrypted secret payload");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivRaw, "base64")
  );
  decipher.setAuthTag(Buffer.from(authTagRaw, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, "base64")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}

export function secretPreview(secret: string) {
  if (secret.length <= 8) {
    return "********";
  }
  return `${secret.slice(0, 3)}...${secret.slice(-4)}`;
}
