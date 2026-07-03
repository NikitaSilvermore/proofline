import { randomBytes } from "crypto";

// Unguessable student link tokens (BUILD_SPEC.md §7: "nanoid(24)+, never
// enumerate"). URL-safe base62, 24 chars ≈ 143 bits of entropy.
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function newToken(length = 24): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}
