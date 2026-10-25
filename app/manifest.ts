import type { MetadataRoute } from "next";
import { SHARE_TARGET_ACTION_PATH, SHARE_TARGET_FORM_FIELD } from "@/lib/pwa/shareTarget";

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
    categories: ["photo", "utilities"],
    launch_handler: {
      client_mode: "focus-existing",
    },
    share_target: {
      action: SHARE_TARGET_ACTION_PATH,
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        files: [
          {
            name: SHARE_TARGET_FORM_FIELD,
            accept: [
              "image/*",
              ".gif",
              ".heic",
              ".heif",
              ".jpg",
              ".jpeg",
              ".png",
              ".webp",
            ],
          },
        ],
      },
    },
  } as MetadataRoute.Manifest;
}
