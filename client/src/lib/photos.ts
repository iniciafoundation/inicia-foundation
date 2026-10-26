/** Brand photography (WebP, 480/720/960/1920 px wide) stored in client/public/assets/photos. Phones pick the small ones. */
export type PhotoName = "earth" | "community" | "planting" | "team" | "seedling" | "horizon" | "learning" | "energy" | "vision" | "river" | "coast" | "whale" | "river-logo" | "sea-logo" | "spiral-logo";

export function photo(name: PhotoName) {
  const base = `/assets/photos/${name}`;
  return { src: `${base}-1920.webp`, srcSet: `${base}-480.webp 480w, ${base}-720.webp 720w, ${base}-960.webp 960w, ${base}-1920.webp 1920w` };
}
