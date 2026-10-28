/** Exact catalog identity only. Unknown/repeated parameters leave normal iMap state alone. */
export function linkedDestination(search: string, available: readonly string[]): string | undefined {
  const parameters = new URLSearchParams(search).getAll('place');
  return parameters.length === 1 && available.includes(parameters[0]!) ? parameters[0] : undefined;
}
