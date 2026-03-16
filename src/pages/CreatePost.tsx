import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ForumHeader from "@/components/ForumHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import { useEffect } from "react";

const hubs = ["Общее", "Вопросы", "Новости", "Творчество", "Обсуждения"];

const CreatePost = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [hub, setHub] = useState(hubs[0]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Максимальный размер файла — 5 МБ");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const createPost = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let imageUrl: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const filePath = `${user!.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("post-media")
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("post-media")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      const preview = content.slice(0, 200);
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title,
          hub,
          preview,
          content,
          user_id: user!.id,
          published: true,
          image_url: imageUrl,
        } as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => navigate(`/post/${data.id}`),
    onError: (e) => {
      setError(e.message);
      setUploading(false);
    },
  });

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <div className="max-w-[820px] mx-auto px-4 py-4">
        <div className="bg-card rounded-lg p-6">
          <h1 className="font-heading text-[24px] font-bold text-foreground mb-6">
            Новая тема
          </h1>

          <div className="space-y-4">
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Заголовок</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="О чём хотите поговорить?"
                maxLength={200}
              />
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Раздел</label>
              <select
                value={hub}
                onChange={(e) => setHub(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {hubs.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Сообщение</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Напишите что-нибудь..."
                className="min-h-[150px]"
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Изображение (необязательно)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Превью"
                    className="max-h-[200px] rounded-lg border border-border object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-[13px]"
                >
                  <ImagePlus className="w-5 h-5" />
                  Добавить изображение
                </button>
              )}
            </div>

            {error && <p className="text-destructive text-[13px]">{error}</p>}

            <Button
              onClick={() => createPost.mutate()}
              disabled={!title || !content || createPost.isPending || uploading}
            >
              {createPost.isPending ? "Публикация..." : "Создать тему"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
