import type { MetadataRoute } from "next";

const iconSizes = [
  48,
  72,
  96,
  128,
  144,
  152,
  192,
  256,
  384,
  512,
] as const;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MemeShelf",
    short_name: "MemeShelf",
    description: "Your meme library, organized for you.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: iconSizes.map((size) => ({
      src: `/icons/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
  };
}
