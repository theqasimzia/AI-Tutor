import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://aitutoracademy.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/parent/", "/student/", "/lesson/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
