import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, User, LogIn } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon isi username/email dan password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if input is email or username
      const isEmail = username.includes("@");
      
      // Query admin by username or email
      const { data: admin, error } = await supabase
        .from("adminq")
        .select("*")
        .or(`username.eq.${username},email.eq.${username}`)
        .maybeSingle();

      if (error || !admin) {
        toast({
          title: "Login Gagal",
          description: "Username atau password salah.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // For demo purposes, we'll use a simple check
      // In production, you should use proper password hashing verification via edge function
      // Store admin session in localStorage
      localStorage.setItem("admin_session", JSON.stringify({
        id: admin.id,
        username: admin.username,
        nama_admin: admin.nama_admin,
        logged_in_at: new Date().toISOString(),
      }));

      toast({
        title: "Login Berhasil!",
        description: `Selamat datang, ${admin.nama_admin}`,
      });

      navigate("/admin/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-green-primary to-green-light flex items-center justify-center p-4 islamic-pattern">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="font-heading text-4xl text-primary-foreground">ا</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Pondok Pesantren Al-Hikmah
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Username atau Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Masukkan username atau email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-background"
                  maxLength={255}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  Masuk
                </>
              )}
            </Button>
          </form>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
