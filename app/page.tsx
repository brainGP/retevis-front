import type { Metadata } from "next";
import CustomCarousel from "@/components/Carousel";
import LogoSlider from "@/components/LogoSlider";
import NewProducts from "@/components/NewProducts";
import HomeHero from "@/components/HomeHero";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { absoluteSiteUrl, siteOrigin } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Гар станц, радио холбооны хэрэгсэл",
  description: "Монгол дахь Retevis Mongolia каталогоос гар болон суурин радио станц, холбооны хэрэгслээ загвар, үзүүлэлт, үнээр нь харьцуулан сонгоорой.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "Retevis Mongolia",
    title: "Гар станц, радио холбооны хэрэгсэл | Retevis Mongolia",
    description: "Гар болон суурин станц, дагалдах хэрэгслийг загвар, үзүүлэлт, үнээр нь харьцуулан сонгоорой.",
    url: siteOrigin,
    images: [{ url: absoluteSiteUrl("/opengraph-image"), width: 1200, height: 630, alt: "Retevis Mongolia-ийн бүтээгдэхүүний каталог" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Гар станц, радио холбооны хэрэгсэл | Retevis Mongolia",
    description: "Гар болон суурин станц, дагалдах хэрэгслийг загвар, үзүүлэлт, үнээр нь харьцуулан сонгоорой.",
    images: [absoluteSiteUrl("/opengraph-image")],
  },
};

const Home = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteOrigin}/#organization`,
    name: "Retevis Mongolia",
    alternateName: ["Ретевис Монгол", "RETEVIS Mongolia"],
    url: siteOrigin,
    logo: `${siteOrigin}/Retevis/RMlogo.png`,
    areaServed: { "@type": "Country", name: "Mongolia" },
    sameAs: ["https://www.facebook.com/RetevisMongolia", "https://www.instagram.com/retevis_mongolia/"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData).replace(/</g, "\\u003c") }} />
      <div>
        <Header />
        <HomeHero />
        <NewProducts />
        <CustomCarousel />
        <LogoSlider />
        <Footer />
      </div>
    </>
  );
};

export default Home;
