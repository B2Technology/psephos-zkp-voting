// TODO remover metodo, usar de @psephos/elgamal
export async function sha1(stringToHash: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToHash);

  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
