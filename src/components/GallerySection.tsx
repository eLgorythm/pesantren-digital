import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Camera, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GaleriItem {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  kategori: string;
}

const GallerySection = () => {
  const [galeri, setGaleri] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaleri = async () => {
      const { data, error } = await supabase
        .from("galeri")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGaleri(data);
      }
      setLoading(false);
    };

    fetchGaleri();
  }, []);

  if (loading) {
    return (
      <section id="galeri" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="galeri" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Camera size={16} />
            <span>Dokumentasi</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Galeri <span className="text-primary">Pesantren</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Momen-momen berharga dari berbagai kegiatan di pesantren kami
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {galeri.map((item, index) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <div
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                    index === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <div className="aspect-square w-full h-full">
                    <img
                      src={item.gambar_url || "/placeholder.svg"}
                      alt={item.judul}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block bg-accent text-foreground text-xs px-2 py-1 rounded-full mb-2">
                        {item.kategori}
                      </span>
                      <h4 className="text-cream-light font-heading font-bold text-lg">
                        {item.judul}
                      </h4>
                    </div>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-cream-light/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <ZoomIn className="text-primary" size={20} />
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card">
                <img
                  src={item.gambar_url || "/placeholder.svg"}
                  alt={item.judul}
                  className="w-full h-auto"
                />
                <div className="p-6">
                  <span className="inline-block bg-accent text-foreground text-xs px-3 py-1 rounded-full mb-3">
                    {item.kategori}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    {item.judul}
                  </h3>
                  <p className="text-muted-foreground">{item.deskripsi}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {galeri.length === 0 && !loading && (
          <div className="text-center py-12">
            <Camera className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">Belum ada foto di galeri</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
