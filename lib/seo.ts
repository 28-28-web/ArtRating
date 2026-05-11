import { Metadata } from "next";

export interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const defaultConfig = {
  title: "ArtRating — বাংলাদেশের শিল্পীদের রেটিং প্ল্যাটফর্ম",
  description: "আপনার শিল্পকর্ম আপলোড করুন, রেটিং পান এবং সেরা শিল্পীদের সাথে প্রতিযোগিতা করুন।",
  image: "/og-image.jpg",
  type: "website" as const,
  keywords: [
    "আর্ট",
    "শিল্প",
    "ছবি",
    "রেটিং",
    "বাংলাদেশ",
    "শিল্পী",
    "প্রতিযোগিতা",
    "পুরস্কার",
    "আর্ট রেটিং",
    "art rating bangladesh",
    "bangladeshi artists"
  ]
};

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const title = config.title ? `${config.title} — ArtRating` : defaultConfig.title;
  const description = config.description || defaultConfig.description;
  const image = config.image || defaultConfig.image;
  const url = config.url || "https://artrating.art";
  const type = config.type || defaultConfig.type;
  const keywords = config.keywords ? [...defaultConfig.keywords, ...config.keywords] : defaultConfig.keywords;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(", "),
    authors: config.author ? [{ name: config.author }] : [{ name: "ArtRating" }],
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: "ArtRating",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "bn_BD",
      alternateLocale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    other: {
      "fb:app_id": "your-facebook-app-id", // Add your Facebook app ID
    },
  };

  // Add article-specific metadata
  if (type === "article") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article" as const,
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      authors: config.author ? [config.author] : ["ArtRating"],
    };
  }

  return metadata;
}

// Structured Data Helpers
export function generateArtworkStructuredData(artwork: {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  artist: string;
  artId: string;
  ratings?: number;
  category?: string;
  createdAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": artwork.title,
    "description": artwork.description,
    "image": artwork.imageUrl,
    "author": {
      "@type": "Person",
      "name": artwork.artist,
    },
    "identifier": artwork.artId,
    "url": `https://artrating.art/art/${artwork.id}`,
    "dateCreated": artwork.createdAt || new Date().toISOString(),
    "artform": artwork.category || "Digital Art",
    "aggregateRating": artwork.ratings ? {
      "@type": "AggregateRating",
      "ratingValue": artwork.ratings,
      "ratingCount": 1,
      "bestRating": 5,
      "worstRating": 1,
    } : undefined,
    "provider": {
      "@type": "Organization",
      "name": "ArtRating",
      "url": "https://artrating.art",
    },
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ArtRating",
    "url": "https://artrating.art",
    "logo": "https://artrating.art/logo.png",
    "description": "বাংলাদেশের শিল্পীদের রেটিং প্ল্যাটফর্ম - আপনার শিল্পকর্ম আপলোড করুন, রেটিং পান এবং সেরা শিল্পীদের সাথে প্রতিযোগিতা করুন।",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BD",
    },
    "sameAs": [
      "https://facebook.com/artrating",
      "https://twitter.com/artrating",
      "https://instagram.com/artrating",
    ],
  };
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url,
    })),
  };
}
