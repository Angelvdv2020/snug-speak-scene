import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setError(error.message);
      else setMessage("Ссылка для сброса пароля отправлена на почту");
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/");
    } else {
      if (username.trim().length < 2) {
        setError("Имя пользователя минимум 2 символа");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: username.trim() },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) setError(error.message);
      else setMessage("Проверьте почту для подтверждения регистрации");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-300">
      <div className="w-full max-w-[400px]">
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <h1 className="font-heading text-[24px] font-bold text-foreground mb-6 text-center">
            {mode === "login" ? "Вход" : mode === "register" ? "Регистрация" : "Восстановление пароля"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-[13px] text-muted-foreground mb-1 block">Имя пользователя</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" maxLength={30} />
              </div>
            )}

            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required maxLength={255} />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="text-[13px] text-muted-foreground mb-1 block">Пароль</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
            )}

            {error && <p className="text-destructive text-[13px]">{error}</p>}
            {message && <p className="text-accent text-[13px]">{message}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Загрузка..."
                : mode === "login"
                ? "Войти"
                : mode === "register"
                ? "Зарегистрироваться"
                : "Отправить ссылку"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-1">
            {mode === "login" && (
              <>
                <button onClick={() => { setMode("forgot"); setError(""); setMessage(""); }} className="text-[13px] text-link hover:underline block mx-auto">
                  Забыли пароль?
                </button>
                <button onClick={() => { setMode("register"); setError(""); setMessage(""); }} className="text-[13px] text-link hover:underline block mx-auto">
                  Нет аккаунта? Зарегистрироваться
                </button>
              </>
            )}
            {mode === "register" && (
              <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="text-[13px] text-link hover:underline">
                Уже есть аккаунт? Войти
              </button>
            )}
            {mode === "forgot" && (
              <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="text-[13px] text-link hover:underline">
                Вернуться ко входу
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
