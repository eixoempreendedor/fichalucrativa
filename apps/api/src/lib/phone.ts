// Normalização de telefone brasileiro → E.164.
// Z-API devolve em vários formatos; padronizamos para "+55DDNNNNNNNNN".

export function toE164Br(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return `+${digits}`;
  }
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }
  throw new Error(`Telefone inválido: ${raw}`);
}

export function isValidE164Br(e164: string): boolean {
  return /^\+55\d{10,11}$/.test(e164);
}
