-- =============================================
-- 多宠物档案
-- =============================================

-- 1. 宠物表
CREATE TABLE IF NOT EXISTS public.pets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        VARCHAR(20) NOT NULL,
    species     VARCHAR(10) NOT NULL CHECK (species IN ('cat', 'dog')),
    avatar      VARCHAR(10) DEFAULT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);

-- 2. recordings 加 pet_id
ALTER TABLE public.recordings
ADD COLUMN IF NOT EXISTS pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_recordings_pet_id ON recordings(pet_id);

-- 3. RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pets"
    ON public.pets FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. 给现有用户创建默认宠物
INSERT INTO public.pets (user_id, name, species, avatar)
SELECT p.user_id, '小咪', 'cat', '🐱'
FROM public.profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM public.pets WHERE user_id = p.user_id AND species = 'cat'
);

INSERT INTO public.pets (user_id, name, species, avatar)
SELECT p.user_id, '旺财', 'dog', '🐶'
FROM public.profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM public.pets WHERE user_id = p.user_id AND species = 'dog'
);
