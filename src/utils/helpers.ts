export async function sha256(stringToHash: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToHash);

  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function objectToSha256(data: unknown): Promise<string> {
  return sha256(JSON.stringify(data));
}
