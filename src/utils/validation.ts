export function validateAndConvertToBigInt(
  id: string | number | bigint | null | undefined,
  fieldName: string,
): { success: true; data: bigint | null } | { success: false; error: string } {
  if (id === null || id === undefined || id === '') {
    return { success: true, data: null };
  }
  const strId = String(id).trim();
  if (strId === '') {
    return { success: true, data: null };
  }
  const numId = Number(strId);
  if (isNaN(numId) || numId <= 0) {
    return { success: false, error: `${fieldName} doit être un nombre valide` };
  }
  return { success: true, data: BigInt(numId) };
}
