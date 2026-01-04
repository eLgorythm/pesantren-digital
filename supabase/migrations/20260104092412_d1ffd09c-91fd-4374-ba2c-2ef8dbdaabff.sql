-- Create adminq table for pesantren admin accounts
CREATE TABLE public.adminq (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama_admin VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.adminq ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated admins to view their own data
CREATE POLICY "Admins can view own data"
ON public.adminq
FOR SELECT
USING (true);

-- Create pesantren_profile table for pesantren information
CREATE TABLE public.pesantren_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL DEFAULT 'Pondok Pesantren Al-Hikmah',
  sejarah TEXT DEFAULT 'Pondok Pesantren Al-Hikmah didirikan pada tahun 1985 oleh KH. Ahmad Dahlan dengan tujuan membentuk generasi muda yang beriman, berakhlak mulia, dan berwawasan luas.',
  visi TEXT DEFAULT 'Menjadi lembaga pendidikan Islam yang unggul dalam mencetak generasi Qurani yang berakhlakul karimah.',
  misi TEXT[] DEFAULT ARRAY['Menyelenggarakan pendidikan Islam yang berkualitas', 'Membina akhlak mulia dan karakter Islami', 'Mengembangkan potensi santri secara holistik', 'Mempersiapkan santri menjadi pemimpin umat'],
  alamat TEXT DEFAULT 'Jl. Pesantren No. 123, Desa Sukamaju, Kecamatan Cibinong, Kabupaten Bogor, Jawa Barat 16912',
  whatsapp VARCHAR(20) DEFAULT '+62812345678',
  email VARCHAR(255) DEFAULT 'info@alhikmah.sch.id',
  maps_embed TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d106.83302!3d-6.5967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzUnNDguMCJTIDEwNsKwNDknNTguOSJF!5e0!3m2!1sen!2sid!4v1234567890',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.pesantren_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pesantren profile"
ON public.pesantren_profile FOR SELECT USING (true);

-- Create kegiatan table for activities
CREATE TABLE public.kegiatan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  jenis VARCHAR(50) NOT NULL CHECK (jenis IN ('harian', 'mingguan', 'tahunan')),
  waktu VARCHAR(100),
  gambar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view kegiatan"
ON public.kegiatan FOR SELECT USING (true);

-- Create galeri table for gallery images
CREATE TABLE public.galeri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  gambar_url TEXT NOT NULL,
  kategori VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view galeri"
ON public.galeri FOR SELECT USING (true);

-- Insert default pesantren profile
INSERT INTO public.pesantren_profile (id) VALUES (gen_random_uuid());

-- Insert sample kegiatan
INSERT INTO public.kegiatan (judul, deskripsi, jenis, waktu) VALUES
('Sholat Tahajud Berjamaah', 'Para santri bangun untuk melaksanakan sholat tahajud bersama setiap malam', 'harian', '03:00 - 04:00'),
('Pengajian Kitab Kuning', 'Kajian kitab-kitab klasik seperti Fathul Qarib dan Safinatun Najah', 'harian', '07:00 - 09:00'),
('Tahfidz Al-Quran', 'Program hafalan Al-Quran dengan metode talaqqi', 'harian', '05:00 - 06:30'),
('Muhadharah', 'Latihan pidato dan khutbah untuk mengasah kemampuan public speaking santri', 'mingguan', 'Jumat, 20:00'),
('Khataman Al-Quran', 'Perayaan khataman Al-Quran bagi santri yang telah menyelesaikan hafalan', 'tahunan', 'Setiap Ramadhan'),
('Haul Pendiri', 'Peringatan wafatnya pendiri pesantren dengan doa bersama dan pengajian akbar', 'tahunan', '15 Muharram');

-- Insert sample galeri
INSERT INTO public.galeri (judul, deskripsi, gambar_url, kategori) VALUES
('Kegiatan Mengaji', 'Santri sedang mengaji Al-Quran di masjid', '/placeholder.svg', 'Pembelajaran'),
('Sholat Berjamaah', 'Sholat berjamaah di masjid pesantren', '/placeholder.svg', 'Ibadah'),
('Haflah Akhirussanah', 'Acara wisuda santri akhir tahun', '/placeholder.svg', 'Acara');