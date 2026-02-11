import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.tradepigloball.co/",
      lastModified: new Date(),
    },
  ];
}
