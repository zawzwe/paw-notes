"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil } from "lucide-react";
import { PetProfile } from "@/components/pet/pet-profile";
import type { Animal } from "./animal-selector";

interface Pet {
  id: string;
  name: string;
  species: "cat" | "dog";
  avatar: string | null;
}

interface PetSelectorProps {
  userId: string | undefined;
  selectedPetId: string | null;
  onSelectPet: (pet: Pet) => void;
}

export function PetSelector({ userId, selectedPetId, onSelectPet }: PetSelectorProps) {
  const t = useTranslations();
  const [pets, setPets] = useState<Pet[]>([]);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const supabase = createClient();
    supabase.from("pets").select("id, name, species, avatar").eq("user_id", userId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setPets(data);
          if (data.length > 0 && !selectedPetId) onSelectPet(data[0]);
        }
        setLoading(false);
      });
  }, [userId]);

  if (loading) return null;
  if (!userId) return null;

  const handleDelete = async (petId: string) => {
    const supabase = createClient();
    await supabase.from("pets").delete().eq("id", petId);
    const updated = pets.filter((p) => p.id !== petId);
    setPets(updated);
    if (selectedPetId === petId && updated.length > 0) onSelectPet(updated[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground text-center">{t("pet.hint")}</p>

      <div className="flex items-center justify-center gap-2">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onSelectPet(pet)}
            onDoubleClick={() => { if (confirm(t("pet.deleteConfirm", { name: pet.name }))) handleDelete(pet.id); }}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
              selectedPetId === pet.id ? "bg-amber-100 dark:bg-amber-900/30 scale-105" : "opacity-60 hover:opacity-100"
            }`}
          >
            <span className="text-2xl">{pet.avatar || (pet.species === "cat" ? "🐱" : "🐶")}</span>
            <span className="text-[11px] font-medium truncate max-w-[60px]">{pet.name}</span>
            <span
              onClick={(e) => { e.stopPropagation(); setEditingPetId(pet.id); }}
              className="text-[8px] text-muted-foreground/40 hover:text-muted-foreground cursor-pointer"
            >
              <Pencil className="w-2.5 h-2.5" />
            </span>
          </button>
        ))}

        <button
          onClick={async () => {
            const supabase = createClient();
            const { data } = await supabase.from("pets").insert({
              user_id: userId, name: "新宠物", species: "cat", avatar: "🐱"
            }).select("id, name, species, avatar").single();
            if (data) {
              setPets([...pets, data]);
              setEditingPetId(data.id);
            }
          }}
          className="flex flex-col items-center justify-center gap-1 w-14 h-16 rounded-xl border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground/50 text-center">{t("pet.edit")}</p>

      {editingPetId && (
        <PetProfile petId={editingPetId} onClose={() => setEditingPetId(null)}
          onChange={() => {
            const supabase = createClient();
            supabase.from("pets").select("id, name, species, avatar").eq("user_id", userId).order("created_at", { ascending: true }).then(({ data }) => {
              if (data) { setPets(data); if (data.length === 0) onSelectPet(null as never); }
            });
          }}
        />
      )}
    </div>
  );
}
