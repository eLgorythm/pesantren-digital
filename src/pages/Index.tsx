import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProfileSection from "@/components/ProfileSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProfileSection />
        <ActivitiesSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
