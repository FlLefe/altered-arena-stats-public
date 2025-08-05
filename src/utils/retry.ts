export async function retryUntilTruthy<T>(
  fn: () => Promise<T | null | undefined>,
  options?: {
    attempts?: number;
    delayMs?: number;
  },
): Promise<T | null> {
  const { attempts = 3, delayMs = 500 } = options ?? {};

  for (let i = 0; i < attempts; i++) {
    const result = await fn();
    if (result !== null && result !== undefined) return result;
    if (i < attempts - 1) {
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  return null;
}
