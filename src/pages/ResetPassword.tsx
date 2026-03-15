import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a recovery session
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    if (password.length < 6) {
      setError("Минимум 6 символов");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else {
      setMessage("Пароль обновлён!");
      setTimeout(() => navigate("/"), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-[400px]">
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <h1 className="font-heading text-[24px] font-bold text-foreground mb-6 text-center">
            Новый пароль
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Новый пароль</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Повторите пароль</label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
            </div>
            {error && <p className="text-destructive text-[13px]">{error}</p>}
            {message && <p className="text-accent text-[13px]">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить пароль"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
