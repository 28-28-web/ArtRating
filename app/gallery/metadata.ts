import { generateMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "গ্যালারি",
  description: "বাংলাদেশের শিল্পীদের অনুমোদিত আর্টওয়ার্ক গ্যালারি। শুধুমাত্র অ্যাডমিন অনুমোদিত ছবিগুলো এখানে দেখা যাবে। সেরা শিল্পকর্মগুলো দেখুন এবং রেটিং দিন।",
  keywords: ["গ্যালারি", "আর্টওয়ার্ক", "ছবি", "শিল্পী", "বাংলাদেশ", "শিল্প"],
  url: "https://artrating.art/gallery"
});
