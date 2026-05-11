import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { JsonLd } from "@/components/JsonLd";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { generateOrganizationStructuredData } from "@/lib/seo";
import "../globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://artrating.art'),
  title: "ArtRating.art",
  description: "বাংলাদেশের শিল্পীদের জন্য একটি আর্ট রেটিং প্ল্যাটফর্ম। আপনার আঁকা ছবি আপলোড করুন, কমিউনিটি রেটিং পান এবং প্রতি সপ্তাহে পুরস্কার জিতুন।",
  openGraph: {
    images: ['/og-image.png'],
    locale: 'bn_BD',
    alternateLocale: 'en_US',
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${hindSiliguri.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={generateOrganizationStructuredData()} />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
