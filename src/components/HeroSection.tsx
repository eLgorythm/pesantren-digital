import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroPesantren from "@/assets/hero-pesantren.jpg";

const HeroSection = () => {
  const scrollToProfile = () => {
    const element = document.querySelector("#profil");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroPesantren})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Bismillah */}
          <p className="font-heading text-2xl md:text-3xl text-gold-light mb-6 animate-float">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-cream-light font-bold mb-6 leading-tight">
            Pondok Pesantren
            <span className="block text-gradient-gold">Al-Hikmah</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-cream-light/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Membentuk generasi Qurani yang berakhlakul karimah, 
            cerdas, dan siap menjadi pemimpin umat
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="hero"
              size="xl"
              onClick={scrollToProfile}
            >
              Kenali Kami
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              onClick={() => document.querySelector("#kontak")?.scrollIntoView({ behavior: "smooth" })}
            >
              Hubungi Kami
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={scrollToProfile}
            className="text-cream-light/80 hover:text-cream-light transition-colors"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
