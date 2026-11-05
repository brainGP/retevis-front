import type { Metadata } from "next";
import CustomCarousel from "@/components/Carousel";
import LogoSlider from "@/components/LogoSlider";
import NewProducts from "@/components/NewProducts";
import HomeHero from "@/components/HomeHero";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Аялал, ажилд зориулсан холбооны станц",
  description: "Аялал, хөдөө ажил, харуул хамгаалалт болон байгууллагын хэрэглээнд тохирох гар станц, суурин станц, дагалдах хэрэгслийг хэрэглээгээрээ сонгоорой.",
  alternates: { canonical: "/" },
};

const Home = () => {
  return (
    <div>
      <Header />
      <HomeHero />
      <NewProducts />
      <CustomCarousel />
      <LogoSlider />
      <Footer />
    </div>
  );
};

export default Home;
