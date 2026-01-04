import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Sun, Moon, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Kegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  jenis: string;
  waktu: string;
}

const ActivitiesSection = () => {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKegiatan = async () => {
      const { data, error } = await supabase
        .from("kegiatan")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setKegiatan(data);
      }
      setLoading(false);
    };

    fetchKegiatan();
  }, []);

  const filterByJenis = (jenis: string) => 
    kegiatan.filter((k) => k.jenis === jenis);

  const getIcon = (jenis: string) => {
    switch (jenis) {
      case "harian":
        return <Sun className="text-accent" size={20} />;
      case "mingguan":
        return <Moon className="text-primary" size={20} />;
      case "tahunan":
        return <Star className="text-gold-primary" size={20} />;
      default:
        return <Calendar size={20} />;
    }
  };

  const ActivityCard = ({ item }: { item: Kegiatan }) => (
    <div className="group bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          {getIcon(item.jenis)}
        </div>
        <div className="flex-1">
          <h4 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {item.judul}
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            {item.deskripsi}
          </p>
          <div className="flex items-center gap-2 text-xs text-primary font-medium">
            <Clock size={14} />
            <span>{item.waktu}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section id="kegiatan" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4 mx-auto" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="kegiatan" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar size={16} />
            <span>Aktivitas Santri</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Kegiatan <span className="text-primary">Pesantren</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Berbagai kegiatan yang kami selenggarakan untuk membentuk karakter santri yang berakhlak mulia
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="harian" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-10 bg-card p-1 rounded-xl shadow-md">
            <TabsTrigger 
              value="harian" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
            >
              <Sun size={16} className="mr-2" />
              Harian
            </TabsTrigger>
            <TabsTrigger 
              value="mingguan"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
            >
              <Moon size={16} className="mr-2" />
              Mingguan
            </TabsTrigger>
            <TabsTrigger 
              value="tahunan"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
            >
              <Star size={16} className="mr-2" />
              Tahunan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="harian" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByJenis("harian").map((item) => (
                <ActivityCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mingguan" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByJenis("mingguan").map((item) => (
                <ActivityCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tahunan" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByJenis("tahunan").map((item) => (
                <ActivityCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ActivitiesSection;
