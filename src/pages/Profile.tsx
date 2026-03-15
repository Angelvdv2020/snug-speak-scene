import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ForumHeader from "@/components/ForumHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio || "");
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ username: username.trim(), bio: bio.trim() })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-profile"] }),
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Максимальный размер файла — 2MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
    queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    setUploading(false);
  };

  if (loading || !user) return null;

  const avatarUrl = profile?.avatar_url;

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <div className="max-w-[820px] mx-auto px-4 py-4">
        <div className="bg-card rounded-lg p-6">
          <h1 className="font-heading text-[24px] font-bold text-foreground mb-6">Мой профиль</h1>

          <div className="space-y-4 max-w-[400px]">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[18px] font-bold text-muted-foreground">
                      {profile?.username?.slice(0, 2).toUpperCase() || "??"}
                    </span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  <Camera className="w-3 h-3" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              {uploading && <span className="text-[13px] text-muted-foreground">Загрузка...</span>}
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Email</label>
              <Input value={user.email || ""} disabled />
            </div>
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Имя пользователя</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={30} />
            </div>
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">О себе</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Расскажите о себе..." maxLength={500} />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending || !username.trim()}>
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => { signOut(); navigate("/"); }}>
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
