import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Target, Eye, Star } from "lucide-react";

interface Profile {
  nama: string;
  sejarah: string;
  visi: string;
  misi: string[];
}

const ProfileSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("pesantren_profile")
        .select("*")
        .maybeSingle();

      if (!error && data) {
        setProfile({
          nama: data.nama,
          sejarah: data.sejarah,
          visi: data.visi,
          misi: data.misi || [],
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section id="profil" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="profil" className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-soft text-green-deep px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen size={16} />
            <span>Tentang Kami</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Profil <span className="text-primary">Pesantren</span>
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Sejarah */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border/50">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="text-primary" size={24} />
              </div>
              Sejarah Singkat
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {profile?.sejarah}
            </p>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Visi */}
          <div className="bg-primary rounded-2xl p-8 md:p-10 shadow-card text-primary-foreground">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-cream-light/20 flex items-center justify-center">
                <Eye className="text-cream-light" size={28} />
              </div>
              <h3 className="font-heading text-2xl font-bold">Visi</h3>
            </div>
            <p className="text-cream-light/90 leading-relaxed text-lg">
              {profile?.visi}
            </p>
          </div>

          {/* Misi */}
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                <Target className="text-accent" size={28} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Misi</h3>
            </div>
            <ul className="space-y-4">
              {profile?.misi.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent text-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
