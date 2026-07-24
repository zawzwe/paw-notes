"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSpecies, setNewSpecies] = useState<Animal>("cat");
  const [loading, setLoading] = useState(true);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const supabase = createClient();
    supabase
      .from("pets")
      .select("id, name, species, avatar")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setPets(data);
          if (data.length > 0 && !selectedPetId) {
            onSelectPet(data[0]);
          }
        }
        setLoading(false);
      });
  }, [userId]);

  const handleAddPet = async () => {
    if (!newName.trim() || newName.length > 10 || !userId) return;
    const supabase = createClient();
    const avatar = newSpecies === "cat" ? "🐱" : "🐶";
    const { data, error } = await supabase
      .from("pets")
      .insert({ user_id: userId, name: newName.trim(), species: newSpecies, avatar })
      .select("id, name, species, avatar")
      .single();

    if (!error && data) {
      setPets([...pets, data]);
      onSelectPet(data);
      setNewName("");
      setShowAdd(false);
    }
  };

  if (loading) return null;
  if (!userId) return null;

  const handleDelete = async (petId: string) => {
    const supabase = createClient();
    await supabase.from("pets").delete().eq("id", petId);
    const updated = pets.filter((p) => p.id !== petId);
    setPets(updated);
    if (selectedPetId === petId && updated.length > 0) {
      onSelectPet(updated[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground text-center">{t("pet.hint")}</p>
      {/* Pet avatar row */}
      <div className="flex items-center justify-center gap-2">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onSelectPet(pet)}
            onDoubleClick={() => {
              if (confirm(t("pet.deleteConfirm", { name: pet.name }))) {
                handleDelete(pet.id);
              }
            }}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
              selectedPetId === pet.id
                ? "bg-amber-100 dark:bg-amber-900/30 scale-105"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <span className="text-2xl">{pet.avatar || (pet.species === "cat" ? "🐱" : "🐶")}</span>
            <span className="text-[11px] font-medium truncate max-w-[60px]">
              {pet.name}
            </span>
          </button>
        ))}

        {/* Add button */}
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex flex-col items-center justify-center gap-1 w-14 h-16 rounded-xl border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="flex items-center gap-2 justify-center">
          <select
            value={newSpecies}
            onChange={(e) => setNewSpecies(e.target.value as Animal)}
            className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
          >
            <option value="cat">🐱</option>
            <option value="dog">🐶</option>
          </select>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value.slice(0, 10))}
            placeholder={t("pet.namePlaceholder")}
            maxLength={10}
            className="h-8 w-24 rounded-lg border border-input bg-background px-2 text-xs"
          />
          <button
            onClick={handleAddPet}
            disabled={!newName.trim()}
            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50"
          >
            {t("common.save")}
          </button>
        </div>
      )}

      {/* Hint */}
      <p className="text-[10px] text-muted-foreground/50 text-center">
        {t("pet.deleteHint")}
      </p>
    </div>
  );
}
