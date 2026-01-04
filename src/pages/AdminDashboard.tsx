import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Home,
  Users,
  Calendar,
  Image,
  Phone,
  Save,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminSession {
  id: number;
  username: string;
  nama_admin: string;
  logged_in_at: string;
}

interface Profile {
  id: string;
  nama: string;
  sejarah: string;
  visi: string;
  misi: string[];
  alamat: string;
  whatsapp: string;
  email: string;
}

interface Kegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  jenis: string;
  waktu: string;
}

interface Galeri {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  kategori: string;
}

const AdminDashboard = () => {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [galeri, setGaleri] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states for new items
  const [newKegiatan, setNewKegiatan] = useState({
    judul: "",
    deskripsi: "",
    jenis: "harian",
    waktu: "",
  });
  const [newGaleri, setNewGaleri] = useState({
    judul: "",
    deskripsi: "",
    gambar_url: "",
    kategori: "",
  });
  const [kegiatanDialogOpen, setKegiatanDialogOpen] = useState(false);
  const [galeriDialogOpen, setGaleriDialogOpen] = useState(false);

  useEffect(() => {
    // Check admin session
    const session = localStorage.getItem("admin_session");
    if (!session) {
      navigate("/adminq");
      return;
    }

    try {
      const adminData = JSON.parse(session);
      setAdmin(adminData);
      fetchData();
    } catch {
      navigate("/adminq");
    }
  }, [navigate]);

  const fetchData = async () => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from("pesantren_profile")
      .select("*")
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
    }

    // Fetch kegiatan
    const { data: kegiatanData } = await supabase
      .from("kegiatan")
      .select("*")
      .order("created_at");

    if (kegiatanData) {
      setKegiatan(kegiatanData);
    }

    // Fetch galeri
    const { data: galeriData } = await supabase
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false });

    if (galeriData) {
      setGaleri(galeriData);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem.",
    });
    navigate("/adminq");
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("pesantren_profile")
      .update({
        nama: profile.nama,
        sejarah: profile.sejarah,
        visi: profile.visi,
        misi: profile.misi,
        alamat: profile.alamat,
        whatsapp: profile.whatsapp,
        email: profile.email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil!",
        description: "Profil pesantren berhasil diperbarui.",
      });
    }

    setSaving(false);
  };

  const addKegiatan = async () => {
    if (!newKegiatan.judul || !newKegiatan.jenis) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon isi judul dan jenis kegiatan.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("kegiatan")
      .insert([newKegiatan])
      .select()
      .single();

    if (error) {
      toast({
        title: "Gagal Menambah",
        description: "Terjadi kesalahan saat menambah kegiatan.",
        variant: "destructive",
      });
    } else {
      setKegiatan([...kegiatan, data]);
      setNewKegiatan({ judul: "", deskripsi: "", jenis: "harian", waktu: "" });
      setKegiatanDialogOpen(false);
      toast({
        title: "Berhasil!",
        description: "Kegiatan baru berhasil ditambahkan.",
      });
    }
  };

  const deleteKegiatan = async (id: string) => {
    const { error } = await supabase.from("kegiatan").delete().eq("id", id);

    if (!error) {
      setKegiatan(kegiatan.filter((k) => k.id !== id));
      toast({
        title: "Berhasil!",
        description: "Kegiatan berhasil dihapus.",
      });
    }
  };

  const addGaleri = async () => {
    if (!newGaleri.judul || !newGaleri.gambar_url) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon isi judul dan URL gambar.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("galeri")
      .insert([newGaleri])
      .select()
      .single();

    if (error) {
      toast({
        title: "Gagal Menambah",
        description: "Terjadi kesalahan saat menambah galeri.",
        variant: "destructive",
      });
    } else {
      setGaleri([data, ...galeri]);
      setNewGaleri({ judul: "", deskripsi: "", gambar_url: "", kategori: "" });
      setGaleriDialogOpen(false);
      toast({
        title: "Berhasil!",
        description: "Foto galeri berhasil ditambahkan.",
      });
    }
  };

  const deleteGaleri = async (id: string) => {
    const { error } = await supabase.from("galeri").delete().eq("id", id);

    if (!error) {
      setGaleri(galeri.filter((g) => g.id !== id));
      toast({
        title: "Berhasil!",
        description: "Foto berhasil dihapus.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading text-xl">ا</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">
                Selamat datang, {admin?.nama_admin}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <Home size={16} />
              Lihat Website
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profil" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-card p-1 rounded-xl shadow-md">
            <TabsTrigger value="profil" className="rounded-lg">
              <Users size={16} className="mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="kegiatan" className="rounded-lg">
              <Calendar size={16} className="mr-2" />
              Kegiatan
            </TabsTrigger>
            <TabsTrigger value="galeri" className="rounded-lg">
              <Image size={16} className="mr-2" />
              Galeri
            </TabsTrigger>
            <TabsTrigger value="kontak" className="rounded-lg">
              <Phone size={16} className="mr-2" />
              Kontak
            </TabsTrigger>
          </TabsList>

          {/* Profil Tab */}
          <TabsContent value="profil">
            <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Kelola Profil Pesantren
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">Nama Pesantren</label>
                <Input
                  value={profile?.nama || ""}
                  onChange={(e) =>
                    setProfile(profile ? { ...profile, nama: e.target.value } : null)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sejarah</label>
                <Textarea
                  value={profile?.sejarah || ""}
                  onChange={(e) =>
                    setProfile(profile ? { ...profile, sejarah: e.target.value } : null)
                  }
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Visi</label>
                <Textarea
                  value={profile?.visi || ""}
                  onChange={(e) =>
                    setProfile(profile ? { ...profile, visi: e.target.value } : null)
                  }
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Misi (satu per baris)
                </label>
                <Textarea
                  value={profile?.misi?.join("\n") || ""}
                  onChange={(e) =>
                    setProfile(
                      profile
                        ? { ...profile, misi: e.target.value.split("\n").filter(Boolean) }
                        : null
                    )
                  }
                  rows={5}
                />
              </div>

              <Button onClick={saveProfile} disabled={saving}>
                <Save size={16} />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </TabsContent>

          {/* Kegiatan Tab */}
          <TabsContent value="kegiatan">
            <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Kelola Kegiatan
                </h2>
                <Dialog open={kegiatanDialogOpen} onOpenChange={setKegiatanDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={16} />
                      Tambah Kegiatan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Judul</label>
                        <Input
                          value={newKegiatan.judul}
                          onChange={(e) =>
                            setNewKegiatan({ ...newKegiatan, judul: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Deskripsi</label>
                        <Textarea
                          value={newKegiatan.deskripsi}
                          onChange={(e) =>
                            setNewKegiatan({ ...newKegiatan, deskripsi: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Jenis</label>
                        <Select
                          value={newKegiatan.jenis}
                          onValueChange={(value) =>
                            setNewKegiatan({ ...newKegiatan, jenis: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="harian">Harian</SelectItem>
                            <SelectItem value="mingguan">Mingguan</SelectItem>
                            <SelectItem value="tahunan">Tahunan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Waktu</label>
                        <Input
                          value={newKegiatan.waktu}
                          onChange={(e) =>
                            setNewKegiatan({ ...newKegiatan, waktu: e.target.value })
                          }
                          placeholder="Contoh: 07:00 - 09:00"
                        />
                      </div>
                      <Button onClick={addKegiatan} className="w-full">
                        Tambah Kegiatan
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {kegiatan.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">{k.judul}</h4>
                      <p className="text-sm text-muted-foreground">
                        {k.jenis} • {k.waktu}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteKegiatan(k.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Galeri Tab */}
          <TabsContent value="galeri">
            <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Kelola Galeri
                </h2>
                <Dialog open={galeriDialogOpen} onOpenChange={setGaleriDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={16} />
                      Tambah Foto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Foto Galeri</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Judul</label>
                        <Input
                          value={newGaleri.judul}
                          onChange={(e) =>
                            setNewGaleri({ ...newGaleri, judul: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Deskripsi</label>
                        <Textarea
                          value={newGaleri.deskripsi}
                          onChange={(e) =>
                            setNewGaleri({ ...newGaleri, deskripsi: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">URL Gambar</label>
                        <Input
                          value={newGaleri.gambar_url}
                          onChange={(e) =>
                            setNewGaleri({ ...newGaleri, gambar_url: e.target.value })
                          }
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Kategori</label>
                        <Input
                          value={newGaleri.kategori}
                          onChange={(e) =>
                            setNewGaleri({ ...newGaleri, kategori: e.target.value })
                          }
                          placeholder="Contoh: Pembelajaran, Ibadah, Acara"
                        />
                      </div>
                      <Button onClick={addGaleri} className="w-full">
                        Tambah Foto
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galeri.map((g) => (
                  <div key={g.id} className="relative group">
                    <img
                      src={g.gambar_url || "/placeholder.svg"}
                      alt={g.judul}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGaleri(g.id)}
                      >
                        <Trash2 size={14} />
                        Hapus
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                      {g.judul}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Kontak Tab */}
          <TabsContent value="kontak">
            <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Kelola Kontak
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">Alamat</label>
                <Textarea
                  value={profile?.alamat || ""}
                  onChange={(e) =>
                    setProfile(profile ? { ...profile, alamat: e.target.value } : null)
                  }
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp</label>
                <Input
                  value={profile?.whatsapp || ""}
                  onChange={(e) =>
                    setProfile(profile ? { ...profile, whatsapp: e.target.value } : null)
                  }
                  placeholder="+62..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={profile?.email || ""}
                  onChange={(e) =>
                    setProfile(profile ? { ...profile, email: e.target.value } : null)
                  }
                />
              </div>

              <Button onClick={saveProfile} disabled={saving}>
                <Save size={16} />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
