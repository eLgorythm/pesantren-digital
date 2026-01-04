import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContactInfo {
  alamat: string;
  whatsapp: string;
  email: string;
  maps_embed: string;
}

const ContactSection = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    pesan: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchContact = async () => {
      const { data, error } = await supabase
        .from("pesantren_profile")
        .select("alamat, whatsapp, email, maps_embed")
        .maybeSingle();

      if (!error && data) {
        setContact(data);
      }
      setLoading(false);
    };

    fetchContact();
  }, []);

  const handleWhatsApp = () => {
    if (contact?.whatsapp) {
      const phone = contact.whatsapp.replace(/[^0-9]/g, "");
      const message = encodeURIComponent("Assalamu'alaikum, saya ingin bertanya tentang pesantren.");
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nama.trim() || !formData.email.trim() || !formData.pesan.trim()) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email tidak valid",
        description: "Mohon masukkan alamat email yang valid.",
        variant: "destructive",
      });
      return;
    }

    // Send via WhatsApp
    if (contact?.whatsapp) {
      const phone = contact.whatsapp.replace(/[^0-9]/g, "");
      const message = encodeURIComponent(
        `Assalamu'alaikum,\n\nNama: ${formData.nama}\nEmail: ${formData.email}\n\nPesan:\n${formData.pesan}`
      );
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      
      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih telah menghubungi kami. Kami akan segera merespons.",
      });

      setFormData({ nama: "", email: "", pesan: "" });
    }
  };

  if (loading) {
    return (
      <section id="kontak" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4 mx-auto" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-xl" />
              <div className="h-96 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="kontak" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageCircle size={16} />
            <span>Hubungi Kami</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Kontak <span className="text-primary">Pesantren</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Silakan hubungi kami untuk informasi lebih lanjut tentang pendaftaran santri
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid gap-4">
              {/* Address */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground mb-1">Alamat</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {contact?.alamat}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="bg-card rounded-xl p-6 shadow-card border border-border/50 flex items-start gap-4 text-left hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-green-600" size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    WhatsApp
                  </h4>
                  <p className="text-muted-foreground text-sm">{contact?.whatsapp}</p>
                </div>
              </button>

              {/* Email */}
              <a
                href={`mailto:${contact?.email}`}
                className="bg-card rounded-xl p-6 shadow-card border border-border/50 flex items-start gap-4 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    Email
                  </h4>
                  <p className="text-muted-foreground text-sm">{contact?.email}</p>
                </div>
              </a>
            </div>

            {/* Google Maps */}
            <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border/50">
              <iframe
                src={contact?.maps_embed}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Pesantren"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
              Kirim Pesan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="bg-background border-border focus:border-primary"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Masukkan alamat email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background border-border focus:border-primary"
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pesan
                </label>
                <Textarea
                  placeholder="Tulis pesan Anda di sini..."
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  className="bg-background border-border focus:border-primary min-h-[150px]"
                  maxLength={1000}
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                <Send size={18} />
                Kirim via WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
