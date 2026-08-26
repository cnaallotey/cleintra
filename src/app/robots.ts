import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/contacts",
        "/groups",
        "/settings",
        "/api",
      ],
    },
    sitemap: "https://simplecrm.app/sitemap.xml",
  };
}
