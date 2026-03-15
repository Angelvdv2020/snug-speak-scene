import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ForumHeader from "@/components/ForumHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

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
        .update({ username, bio })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-profile"] }),
  });

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <div className="max-w-[820px] mx-auto px-4 py-4">
        <div className="bg-card rounded-lg p-6">
          <h1 className="font-heading text-[24px] font-bold text-foreground mb-6">Мой профиль</h1>

          <div className="space-y-4 max-w-[400px]">
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Email</label>
              <Input value={user.email || ""} disabled />
            </div>
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Имя пользователя</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">О себе</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Расскажите о себе..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}>
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
