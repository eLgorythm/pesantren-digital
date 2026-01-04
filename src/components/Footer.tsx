import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-cream-light/20 flex items-center justify-center">
              <span className="font-heading text-2xl">ا</span>
            </div>
            <span className="font-heading text-2xl font-bold">
              Pondok Pesantren Al-Hikmah
            </span>
          </div>

          {/* Tagline */}
          <p className="text-cream-light/80 max-w-lg mx-auto mb-8">
            Membentuk generasi Qurani yang berakhlakul karimah, cerdas, dan siap menjadi pemimpin umat
          </p>

          {/* Divider */}
          <div className="w-24 h-px bg-cream-light/30 mx-auto mb-6" />

          {/* Copyright */}
          <p className="text-cream-light/60 text-sm flex items-center justify-center gap-2">
            © {currentYear} Pondok Pesantren Al-Hikmah. Dibuat dengan
            <Heart size={14} className="text-accent" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
