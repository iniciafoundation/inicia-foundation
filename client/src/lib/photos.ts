/** Brand photography (WebP, 960w and 1920w) stored in client/public/assets/photos. */
export type PhotoName = "earth" | "community" | "planting" | "team" | "seedling" | "horizon" | "learning" | "energy" | "vision" | "river" | "coast" | "whale" | "river-logo" | "sea-logo" | "spiral-logo";

export function photo(name: PhotoName) {
  const base = `/assets/photos/${name}`;
  return { src: `${base}-1920.webp`, srcSet: `${base}-960.webp 960w, ${base}-1920.webp 1920w` };
}
