"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Camera, Trash2 } from "lucide-react";
import type { Animal } from "@/components/recording/animal-selector";

interface PetData {
  id: string;
  name: string;
  species: Animal;
  avatar: string | null;
  photo_url: string | null;
  birth_date: string | null;
  breed: string | null;
  personality_tags: string[] | null;
  gotcha_date: string | null;
}

interface PetProfileProps {
  petId: string;
  onClose: () => void;
  onChange?: () => void;
}

export function PetProfile({ petId, onClose, onChange }: PetProfileProps) {
  const t = useTranslations();
  const [pet, setPet] = useState<PetData | null>(null);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birth, setBirth] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("pets").select("*").eq("id", petId).single().then(({ data }) => {
      if (data) {
        setPet(data);
        setName(data.name || "");
        setBreed(data.breed || "");
        setBirth(data.birth_date || "");
        setGotcha(data.gotcha_date || "");
        setTags((data.personality_tags || []).join("、"));
      }
    });
  }, [petId]);

  const handleSave = async () => {
    if (!pet) return;
    setSaving(true);
    const supabase = createClient();
    const tagsArr = tags.split(/[,，、\s]+/).filter(Boolean).slice(0, 5);
    await supabase.from("pets").update({
      name: name.trim(),
      species: pet.species,
      breed: breed.trim() || null,
      birth_date: birth || null,
      gotcha_date: gotcha || null,
      personality_tags: tagsArr.length > 0 ? tagsArr : null,
    }).eq("id", petId);
    setSaving(false);
    onChange?.();
    onClose();
  };

  const handleDelete = async () => {
    if (!pet) return;
    if (!confirm(t("pet.deleteConfirm", { name: name || pet.name }))) return;
    await createClient().from("pets").delete().eq("id", petId);
    onChange?.();
    onClose();
  };

  if (!pet) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-2xl border border-muted-foreground/20 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("petProfile.title")}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>

        {/* Avatar with photo upload */}
        <div className="flex justify-center">
          <label className="relative cursor-pointer group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center text-4xl overflow-hidden">
              {pet?.photo_url ? (
                <img src={pet.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{pet?.avatar || (pet?.species === "cat" ? "🐱" : "🐶")}</span>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f || f.size > 2 * 1024 * 1024) return;
                setUploading(true);
                const supabase = createClient();
                const path = `pets/${petId}/${Date.now()}.jpg`;
                const { error: upErr } = await supabase.storage.from("pets").upload(path, f, { upsert: true, contentType: "image/jpeg" });
                if (!upErr) {
                  const { data: urlData } = supabase.storage.from("pets").getPublicUrl(path);
                  if (urlData?.publicUrl) {
                    await supabase.from("pets").update({ photo_url: urlData.publicUrl }).eq("id", petId);
                    setPet({ ...pet, photo_url: urlData.publicUrl });
                  }
                }
                setUploading(false);
              }}
            />
          </label>
        </div>

        {/* Species */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{t("animal.select")}</span>
          <select value={pet?.species || "cat"} onChange={(e) => { const s = e.target.value as Animal; if (pet) setPet({ ...pet, species: s }); }} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
            <option value="cat">🐱 {t("animal.cat")}</option>
            <option value="dog">🐶 {t("animal.dog")}</option>
          </select>
        </label>

        {/* Name */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{t("petProfile.name")}</span>
          <input value={name} onChange={(e) => setName(e.target.value.slice(0, 20))} maxLength={20} className="h-10 rounded-lg border border-input bg-background px-3 text-sm" />
        </label>

        {/* Breed */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{t("petProfile.breed")}</span>
          <input value={breed} onChange={(e) => setBreed(e.target.value.slice(0, 50))} placeholder={t("petProfile.breedHint")} className="h-10 rounded-lg border border-input bg-background px-3 text-sm" />
        </label>

        {/* Birthday */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{t("petProfile.birth")}</span>
          <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm" />
        </label>

        {/* Gotcha date */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{t("petProfile.gotcha")}</span>
          <input type="date" value={gotcha} onChange={(e) => setGotcha(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm" />
        </label>

        {/* Personality tags */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{t("petProfile.tags")}</span>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t("petProfile.tagsHint")} className="h-10 rounded-lg border border-input bg-background px-3 text-sm" />
        </label>

        {/* Save & Delete */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium text-sm transition-colors"
          >
            {t("common.save")}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
