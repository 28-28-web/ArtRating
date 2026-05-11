import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://artrating.art";
  
  // Get current date for lastmod
  const currentDate = new Date();
  
  // Define all pages with their priorities and update frequencies
  return [
    {
      url: 'https://artrating.art',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://artrating.art/gallery',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://artrating.art/competition',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://artrating.art/campaign',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://artrating.art/leaderboard',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: 'https://artrating.art/upload',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://artrating.art/login',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://artrating.art/register',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://artrating.art/forum',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: 'https://artrating.art/payout',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://artrating.art/privacy',
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://artrating.art/terms',
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://artrating.art/contact',
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://artrating.art/competitions',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: 'https://artrating.art/campaigns',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
