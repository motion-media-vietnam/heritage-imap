/** Hero and header bounds use the same viewport coordinate system. */
export function hasPassedOpeningHero(heroBottom: number | null, headerBottom: number): boolean {
  return heroBottom === null || heroBottom <= Math.max(0, headerBottom);
}
