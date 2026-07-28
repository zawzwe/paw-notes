-- PawNote fields: title + note for saved journal entries
ALTER TABLE public.recordings
ADD COLUMN IF NOT EXISTS title VARCHAR(100),
ADD COLUMN IF NOT EXISTS note TEXT;
